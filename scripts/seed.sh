#!/bin/bash

# ContestDraw Database Seeding Script
# Usage: ./scripts/seed.sh [environment]
# Example: ./scripts/seed.sh dev

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-dev}
AWS_REGION=${AWS_REGION:-eu-west-1}

echo -e "${GREEN}ContestDraw Seeding Script${NC}"
echo "Environment: ${ENVIRONMENT}"
echo "-----------------------------------"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging)$ ]]; then
    echo -e "${RED}Error: Seeding is only allowed for dev and staging environments.${NC}"
    exit 1
fi

# Warning for staging
if [ "$ENVIRONMENT" = "staging" ]; then
    echo -e "${YELLOW}WARNING: You are about to seed the staging database!${NC}"
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "Seeding cancelled"
        exit 0
    fi
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

# Run seeds
run_seeds() {
    echo -e "${YELLOW}Running database seeds...${NC}"

    cd backend

    # Run seed command
    npm run seed

    cd ..

    echo -e "${GREEN}Database seeded successfully${NC}"
}

# Verify seeding
verify_seeds() {
    echo -e "${YELLOW}Verifying seeded data...${NC}"

    # Connect to database and check row counts
    USERS=$(psql "${DATABASE_URL}" -t -c "SELECT COUNT(*) FROM users;")
    CONTESTS=$(psql "${DATABASE_URL}" -t -c "SELECT COUNT(*) FROM contests;")
    ENTRIES=$(psql "${DATABASE_URL}" -t -c "SELECT COUNT(*) FROM entries;")

    echo "Seeded data counts:"
    echo "  Users: ${USERS}"
    echo "  Contests: ${CONTESTS}"
    echo "  Entries: ${ENTRIES}"

    if [ ${USERS} -gt 0 ] && [ ${CONTESTS} -gt 0 ]; then
        echo -e "${GREEN}Verification passed${NC}"
    else
        echo -e "${RED}Verification failed: No data found${NC}"
        exit 1
    fi
}

# Main seeding process
main() {
    get_db_credentials
    run_seeds
    verify_seeds

    echo -e "${GREEN}Seeding completed successfully!${NC}"

    if [ "$ENVIRONMENT" = "dev" ]; then
        echo ""
        echo "Test credentials:"
        echo "  Admin: admin@contestdraw.com / Admin123!"
        echo "  User: user@contestdraw.com / User123!"
    fi
}

# Trap errors
trap 'echo -e "${RED}Seeding failed!${NC}"; exit 1' ERR

# Run main seeding
main
