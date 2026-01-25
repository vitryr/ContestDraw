#!/bin/bash

# ContestDraw Backup Script
# Usage: ./scripts/backup.sh [environment]
# Example: ./scripts/backup.sh production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
AWS_REGION=${AWS_REGION:-eu-west-1}
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_BUCKET="contestdraw-${ENVIRONMENT}-backups"

echo -e "${GREEN}ContestDraw Backup Script${NC}"
echo "Environment: ${ENVIRONMENT}"
echo "Timestamp: ${TIMESTAMP}"
echo "-----------------------------------"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|production)$ ]]; then
    echo -e "${RED}Error: Invalid environment. Use dev, staging, or production.${NC}"
    exit 1
fi

# Create S3 backup bucket if it doesn't exist
create_backup_bucket() {
    if ! aws s3 ls "s3://${BACKUP_BUCKET}" --region ${AWS_REGION} 2>&1 | grep -q 'NoSuchBucket'; then
        echo -e "${YELLOW}Backup bucket already exists${NC}"
    else
        echo -e "${YELLOW}Creating backup bucket...${NC}"
        aws s3 mb s3://${BACKUP_BUCKET} --region ${AWS_REGION}

        # Enable versioning
        aws s3api put-bucket-versioning \
            --bucket ${BACKUP_BUCKET} \
            --versioning-configuration Status=Enabled \
            --region ${AWS_REGION}

        # Enable encryption
        aws s3api put-bucket-encryption \
            --bucket ${BACKUP_BUCKET} \
            --server-side-encryption-configuration '{
                "Rules": [{
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": "AES256"
                    }
                }]
            }' \
            --region ${AWS_REGION}

        echo -e "${GREEN}Backup bucket created${NC}"
    fi
}

# Backup RDS Database
backup_database() {
    echo -e "${YELLOW}Creating RDS snapshot...${NC}"

    SNAPSHOT_ID="contestdraw-${ENVIRONMENT}-${TIMESTAMP}"
    DB_INSTANCE="contestdraw-${ENVIRONMENT}"

    aws rds create-db-snapshot \
        --db-instance-identifier ${DB_INSTANCE} \
        --db-snapshot-identifier ${SNAPSHOT_ID} \
        --region ${AWS_REGION}

    echo "Waiting for snapshot to complete..."
    aws rds wait db-snapshot-completed \
        --db-snapshot-identifier ${SNAPSHOT_ID} \
        --region ${AWS_REGION}

    echo -e "${GREEN}Database snapshot created: ${SNAPSHOT_ID}${NC}"

    # Export snapshot details
    aws rds describe-db-snapshots \
        --db-snapshot-identifier ${SNAPSHOT_ID} \
        --region ${AWS_REGION} \
        > /tmp/${SNAPSHOT_ID}.json

    # Upload metadata to S3
    aws s3 cp /tmp/${SNAPSHOT_ID}.json \
        s3://${BACKUP_BUCKET}/database/${TIMESTAMP}/ \
        --region ${AWS_REGION}
}

# Backup S3 Media Files
backup_media() {
    echo -e "${YELLOW}Backing up media files...${NC}"

    MEDIA_BUCKET="contestdraw-${ENVIRONMENT}-media"

    # Sync media bucket to backup bucket
    aws s3 sync s3://${MEDIA_BUCKET} s3://${BACKUP_BUCKET}/media/${TIMESTAMP}/ \
        --region ${AWS_REGION}

    echo -e "${GREEN}Media files backed up${NC}"
}

# Backup Application Configuration
backup_config() {
    echo -e "${YELLOW}Backing up configuration...${NC}"

    # Export environment variables from Secrets Manager
    secrets=$(aws secretsmanager list-secrets \
        --filters Key=name,Values=contestdraw-${ENVIRONMENT} \
        --query 'SecretList[*].Name' \
        --output text \
        --region ${AWS_REGION})

    mkdir -p /tmp/config-backup

    for secret in $secrets; do
        aws secretsmanager get-secret-value \
            --secret-id ${secret} \
            --query SecretString \
            --output text \
            --region ${AWS_REGION} > /tmp/config-backup/${secret}.txt
    done

    # Create tarball
    tar -czf /tmp/config-${TIMESTAMP}.tar.gz -C /tmp/config-backup .

    # Upload to S3
    aws s3 cp /tmp/config-${TIMESTAMP}.tar.gz \
        s3://${BACKUP_BUCKET}/config/${TIMESTAMP}/ \
        --region ${AWS_REGION}

    # Cleanup
    rm -rf /tmp/config-backup /tmp/config-${TIMESTAMP}.tar.gz

    echo -e "${GREEN}Configuration backed up${NC}"
}

# Backup ECS Task Definitions
backup_ecs() {
    echo -e "${YELLOW}Backing up ECS task definitions...${NC}"

    # Get latest task definition
    TASK_DEF=$(aws ecs describe-task-definition \
        --task-definition contestdraw-backend-${ENVIRONMENT} \
        --query 'taskDefinition' \
        --region ${AWS_REGION})

    echo "${TASK_DEF}" > /tmp/task-definition-${TIMESTAMP}.json

    # Upload to S3
    aws s3 cp /tmp/task-definition-${TIMESTAMP}.json \
        s3://${BACKUP_BUCKET}/ecs/${TIMESTAMP}/ \
        --region ${AWS_REGION}

    rm /tmp/task-definition-${TIMESTAMP}.json

    echo -e "${GREEN}ECS task definitions backed up${NC}"
}

# Backup Frontend Build
backup_frontend() {
    echo -e "${YELLOW}Backing up frontend build...${NC}"

    FRONTEND_BUCKET="contestdraw-${ENVIRONMENT}-frontend"

    # Sync frontend bucket to backup bucket
    aws s3 sync s3://${FRONTEND_BUCKET} s3://${BACKUP_BUCKET}/frontend/${TIMESTAMP}/ \
        --region ${AWS_REGION}

    echo -e "${GREEN}Frontend build backed up${NC}"
}

# Cleanup old backups
cleanup_old_backups() {
    echo -e "${YELLOW}Cleaning up old backups...${NC}"

    # Keep last 30 days of backups
    CUTOFF_DATE=$(date -d '30 days ago' +%Y%m%d)

    # Delete old RDS snapshots
    old_snapshots=$(aws rds describe-db-snapshots \
        --db-instance-identifier contestdraw-${ENVIRONMENT} \
        --query "DBSnapshots[?SnapshotCreateTime<'${CUTOFF_DATE}'].DBSnapshotIdentifier" \
        --output text \
        --region ${AWS_REGION})

    for snapshot in $old_snapshots; do
        echo "Deleting old snapshot: ${snapshot}"
        aws rds delete-db-snapshot \
            --db-snapshot-identifier ${snapshot} \
            --region ${AWS_REGION}
    done

    # S3 lifecycle policy handles S3 cleanup
    echo -e "${GREEN}Old backups cleaned up${NC}"
}

# Generate backup report
generate_report() {
    echo -e "${YELLOW}Generating backup report...${NC}"

    cat > /tmp/backup-report-${TIMESTAMP}.txt <<EOF
ContestDraw Backup Report
=========================
Environment: ${ENVIRONMENT}
Timestamp: ${TIMESTAMP}
Region: ${AWS_REGION}

Backup Components:
- Database: RDS Snapshot
- Media Files: S3 Sync
- Configuration: Secrets Manager Export
- ECS Task Definitions: JSON Export
- Frontend Build: S3 Sync

Backup Location: s3://${BACKUP_BUCKET}

Status: SUCCESS
EOF

    # Upload report
    aws s3 cp /tmp/backup-report-${TIMESTAMP}.txt \
        s3://${BACKUP_BUCKET}/reports/ \
        --region ${AWS_REGION}

    # Send email notification (optional)
    if [ ! -z "${NOTIFICATION_EMAIL}" ]; then
        aws ses send-email \
            --from "backups@contestdraw.com" \
            --to "${NOTIFICATION_EMAIL}" \
            --subject "ContestDraw ${ENVIRONMENT} Backup Completed - ${TIMESTAMP}" \
            --text file:///tmp/backup-report-${TIMESTAMP}.txt \
            --region ${AWS_REGION}
    fi

    cat /tmp/backup-report-${TIMESTAMP}.txt
    rm /tmp/backup-report-${TIMESTAMP}.txt
}

# Main backup process
main() {
    create_backup_bucket
    backup_database
    backup_media
    backup_config
    backup_ecs
    backup_frontend
    cleanup_old_backups
    generate_report

    echo -e "${GREEN}Backup completed successfully!${NC}"
}

# Trap errors
trap 'echo -e "${RED}Backup failed!${NC}"; exit 1' ERR

# Run main backup
main
