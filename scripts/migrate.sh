#!/bin/bash

# ContestDraw Database Migration Script
# Usage: ./scripts/migrate.sh [environment] [action]
# Example: ./scripts/migrate.sh production up

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-dev}
ACTION=${2:-up}
AWS_REGION=${AWS_REGION:-eu-west-1}

echo -e "${GREEN}ContestDraw Migration Script${NC}"
echo "Environment: ${ENVIRONMENT}"
echo "Action: ${ACTION}"
echo "-----------------------------------"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|production)$ ]]; then
    echo -e "${RED}Error: Invalid environment. Use dev, staging, or production.${NC}"
    exit 1
fi

# Validate action
if [[ ! "$ACTION" =~ ^(up|down|status|create)$ ]]; then
    echo -e "${RED}Error: Invalid action. Use up, down, status, or create.${NC}"
    exit 1
fi

# Get database credentials
get_db_credentials() {
    echo -e "${YELLOW}Retrieving database credentials...${NC}"

    if [ "$ENVIRONMENT" = "dev" ]; then
        # Local development
        export DATABASE_URL="postgresql://postgres:dev_password_123@localhost:5432/contestdraw"
    else
        # AWS RDS
        DB_ENDPOINT=$(aws rds describe-db-instances \
            --db-instance-identifier contestdraw-${ENVIRONMENT} \
            --query 'DBInstances[0].Endpoint.Address' \
            --output text \
            --region ${AWS_REGION})

        DB_PASSWORD=$(aws secretsmanager get-secret-value \
            --secret-id contestdraw-${ENVIRONMENT}-db-password \
            --query SecretString \
            --output text \
            --region ${AWS_REGION})

        export DATABASE_URL="postgresql://contestdraw_admin:${DB_PASSWORD}@${DB_ENDPOINT}:5432/contestdraw"
    fi
}

# Run migrations
run_migrations() {
    echo -e "${YELLOW}Running migrations...${NC}"

    cd backend

    case "$ACTION" in
        up)
            npm run migrate:up
            echo -e "${GREEN}Migrations applied successfully${NC}"
            ;;
        down)
            echo -e "${RED}WARNING: This will rollback the last migration!${NC}"
            read -p "Are you sure? (yes/no): " confirm
            if [ "$confirm" = "yes" ]; then
                npm run migrate:down
                echo -e "${GREEN}Migration rolled back${NC}"
            else
                echo "Migration rollback cancelled"
            fi
            ;;
        status)
            npm run migrate:status
            ;;
        create)
            if [ -z "$3" ]; then
                echo -e "${RED}Error: Migration name required${NC}"
                echo "Usage: ./scripts/migrate.sh ${ENVIRONMENT} create <migration-name>"
                exit 1
            fi
            npm run migrate:create -- $3
            echo -e "${GREEN}Migration file created${NC}"
            ;;
    esac

    cd ..
}

# Create backup before migration (production only)
create_backup() {
    if [ "$ENVIRONMENT" = "production" ] && [ "$ACTION" = "up" ]; then
        echo -e "${YELLOW}Creating backup before migration...${NC}"

        TIMESTAMP=$(date +%Y%m%d-%H%M%S)
        SNAPSHOT_ID="contestdraw-${ENVIRONMENT}-pre-migration-${TIMESTAMP}"

        aws rds create-db-snapshot \
            --db-instance-identifier contestdraw-${ENVIRONMENT} \
            --db-snapshot-identifier ${SNAPSHOT_ID} \
            --region ${AWS_REGION}

        echo -e "${GREEN}Backup created: ${SNAPSHOT_ID}${NC}"
    fi
}

# Verify migration
verify_migration() {
    echo -e "${YELLOW}Verifying migration...${NC}"

    # Run a simple query to check database connectivity
    if psql "${DATABASE_URL}" -c "SELECT 1;" > /dev/null 2>&1; then
        echo -e "${GREEN}Database connection verified${NC}"
    else
        echo -e "${RED}Database connection failed${NC}"
        exit 1
    fi

    # Check migration status
    cd backend
    npm run migrate:status
    cd ..
}

# Main migration process
main() {
    get_db_credentials
    create_backup
    run_migrations
    verify_migration

    echo -e "${GREEN}Migration completed successfully!${NC}"
}

# Trap errors
trap 'echo -e "${RED}Migration failed!${NC}"; exit 1' ERR

# Run main migration
main "$@"
