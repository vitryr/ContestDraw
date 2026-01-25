#!/bin/bash

# ContestDraw Deployment Script
# Usage: ./scripts/deploy.sh [environment] [service]
# Example: ./scripts/deploy.sh production backend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-staging}
SERVICE=${2:-all}
AWS_REGION=${AWS_REGION:-eu-west-1}
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo -e "${GREEN}ContestDraw Deployment Script${NC}"
echo "Environment: ${ENVIRONMENT}"
echo "Service: ${SERVICE}"
echo "-----------------------------------"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|production)$ ]]; then
    echo -e "${RED}Error: Invalid environment. Use dev, staging, or production.${NC}"
    exit 1
fi

# Check required tools
command -v aws >/dev/null 2>&1 || { echo -e "${RED}Error: AWS CLI is required but not installed.${NC}"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo -e "${RED}Error: Docker is required but not installed.${NC}"; exit 1; }

# Authenticate with AWS ECR
echo -e "${YELLOW}Authenticating with AWS ECR...${NC}"
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

# Deploy Backend
deploy_backend() {
    echo -e "${YELLOW}Deploying backend...${NC}"

    # Build Docker image
    echo "Building backend Docker image..."
    cd backend
    docker build -t contestdraw-backend:${ENVIRONMENT} .

    # Tag for ECR
    docker tag contestdraw-backend:${ENVIRONMENT} ${ECR_REGISTRY}/contestdraw-backend:${ENVIRONMENT}
    docker tag contestdraw-backend:${ENVIRONMENT} ${ECR_REGISTRY}/contestdraw-backend:latest

    # Push to ECR
    echo "Pushing to ECR..."
    docker push ${ECR_REGISTRY}/contestdraw-backend:${ENVIRONMENT}
    docker push ${ECR_REGISTRY}/contestdraw-backend:latest

    cd ..

    # Update ECS service
    echo "Updating ECS service..."
    aws ecs update-service \
        --cluster contestdraw-${ENVIRONMENT} \
        --service contestdraw-backend-${ENVIRONMENT} \
        --force-new-deployment \
        --region ${AWS_REGION}

    # Wait for deployment to complete
    echo "Waiting for service to stabilize..."
    aws ecs wait services-stable \
        --cluster contestdraw-${ENVIRONMENT} \
        --services contestdraw-backend-${ENVIRONMENT} \
        --region ${AWS_REGION}

    echo -e "${GREEN}Backend deployed successfully!${NC}"
}

# Deploy Frontend
deploy_frontend() {
    echo -e "${YELLOW}Deploying frontend...${NC}"

    # Set environment variables
    if [ "$ENVIRONMENT" = "production" ]; then
        export REACT_APP_API_URL=https://api.contestdraw.com
        export REACT_APP_WS_URL=wss://api.contestdraw.com
    elif [ "$ENVIRONMENT" = "staging" ]; then
        export REACT_APP_API_URL=https://api-staging.contestdraw.com
        export REACT_APP_WS_URL=wss://api-staging.contestdraw.com
    else
        export REACT_APP_API_URL=https://api-dev.contestdraw.com
        export REACT_APP_WS_URL=wss://api-dev.contestdraw.com
    fi

    # Build React app
    echo "Building React app..."
    cd frontend-web
    npm ci
    npm run build

    # Get S3 bucket name
    S3_BUCKET="contestdraw-${ENVIRONMENT}-frontend"
    CLOUDFRONT_ID=$(aws cloudfront list-distributions \
        --query "DistributionList.Items[?Comment=='ContestDraw ${ENVIRONMENT} frontend'].Id" \
        --output text \
        --region ${AWS_REGION})

    # Sync to S3
    echo "Syncing to S3..."
    aws s3 sync build/ s3://${S3_BUCKET} \
        --delete \
        --cache-control "public, max-age=31536000, immutable" \
        --exclude "*.html" \
        --exclude "service-worker.js" \
        --region ${AWS_REGION}

    # Upload HTML and service worker with no-cache
    aws s3 sync build/ s3://${S3_BUCKET} \
        --exclude "*" \
        --include "*.html" \
        --include "service-worker.js" \
        --cache-control "no-cache, no-store, must-revalidate" \
        --region ${AWS_REGION}

    # Invalidate CloudFront cache
    echo "Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id ${CLOUDFRONT_ID} \
        --paths "/*" \
        --region ${AWS_REGION}

    cd ..

    echo -e "${GREEN}Frontend deployed successfully!${NC}"
}

# Run database migrations
run_migrations() {
    echo -e "${YELLOW}Running database migrations...${NC}"

    # Get RDS endpoint
    DB_ENDPOINT=$(aws rds describe-db-instances \
        --db-instance-identifier contestdraw-${ENVIRONMENT} \
        --query 'DBInstances[0].Endpoint.Address' \
        --output text \
        --region ${AWS_REGION})

    # Get database password from Secrets Manager
    DB_PASSWORD=$(aws secretsmanager get-secret-value \
        --secret-id contestdraw-${ENVIRONMENT}-db-password \
        --query SecretString \
        --output text \
        --region ${AWS_REGION})

    # Run migrations via ECS task
    echo "Running migrations..."
    TASK_ARN=$(aws ecs run-task \
        --cluster contestdraw-${ENVIRONMENT} \
        --task-definition contestdraw-backend-${ENVIRONMENT} \
        --overrides "{\"containerOverrides\":[{\"name\":\"backend\",\"command\":[\"npm\",\"run\",\"migrate\"]}]}" \
        --query 'tasks[0].taskArn' \
        --output text \
        --region ${AWS_REGION})

    # Wait for task to complete
    aws ecs wait tasks-stopped \
        --cluster contestdraw-${ENVIRONMENT} \
        --tasks ${TASK_ARN} \
        --region ${AWS_REGION}

    echo -e "${GREEN}Migrations completed successfully!${NC}"
}

# Health check
health_check() {
    echo -e "${YELLOW}Running health checks...${NC}"

    if [ "$ENVIRONMENT" = "production" ]; then
        BACKEND_URL="https://api.contestdraw.com"
        FRONTEND_URL="https://contestdraw.com"
    elif [ "$ENVIRONMENT" = "staging" ]; then
        BACKEND_URL="https://api-staging.contestdraw.com"
        FRONTEND_URL="https://staging.contestdraw.com"
    else
        BACKEND_URL="https://api-dev.contestdraw.com"
        FRONTEND_URL="https://dev.contestdraw.com"
    fi

    # Check backend health
    BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" ${BACKEND_URL}/health)
    if [ "$BACKEND_STATUS" = "200" ]; then
        echo -e "${GREEN}✓ Backend health check passed${NC}"
    else
        echo -e "${RED}✗ Backend health check failed (HTTP ${BACKEND_STATUS})${NC}"
        exit 1
    fi

    # Check frontend
    FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" ${FRONTEND_URL})
    if [ "$FRONTEND_STATUS" = "200" ]; then
        echo -e "${GREEN}✓ Frontend health check passed${NC}"
    else
        echo -e "${RED}✗ Frontend health check failed (HTTP ${FRONTEND_STATUS})${NC}"
        exit 1
    fi
}

# Rollback function
rollback() {
    echo -e "${YELLOW}Rolling back deployment...${NC}"

    if [ "$SERVICE" = "backend" ] || [ "$SERVICE" = "all" ]; then
        echo "Rolling back backend..."
        # Get previous task definition
        PREV_TASK=$(aws ecs describe-services \
            --cluster contestdraw-${ENVIRONMENT} \
            --services contestdraw-backend-${ENVIRONMENT} \
            --query 'services[0].deployments[1].taskDefinition' \
            --output text \
            --region ${AWS_REGION})

        # Rollback to previous version
        aws ecs update-service \
            --cluster contestdraw-${ENVIRONMENT} \
            --service contestdraw-backend-${ENVIRONMENT} \
            --task-definition ${PREV_TASK} \
            --force-new-deployment \
            --region ${AWS_REGION}
    fi

    echo -e "${GREEN}Rollback completed${NC}"
}

# Main deployment logic
main() {
    # Run migrations for backend deployments
    if [ "$SERVICE" = "backend" ] || [ "$SERVICE" = "all" ]; then
        run_migrations
    fi

    # Deploy services
    case "$SERVICE" in
        backend)
            deploy_backend
            ;;
        frontend)
            deploy_frontend
            ;;
        all)
            deploy_backend
            deploy_frontend
            ;;
        *)
            echo -e "${RED}Error: Invalid service. Use backend, frontend, or all.${NC}"
            exit 1
            ;;
    esac

    # Run health checks
    sleep 30
    health_check

    echo -e "${GREEN}Deployment completed successfully!${NC}"
}

# Trap errors and rollback
trap 'echo -e "${RED}Deployment failed!${NC}"; rollback' ERR

# Run main deployment
main
