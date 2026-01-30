# Cleack DevOps Documentation

## Overview

Complete DevOps infrastructure for Cleack with Docker, CI/CD pipelines, AWS infrastructure, and deployment automation.

## Table of Contents

1. [Local Development](#local-development)
2. [Docker](#docker)
3. [CI/CD Pipelines](#cicd-pipelines)
4. [AWS Infrastructure](#aws-infrastructure)
5. [Deployment](#deployment)
6. [Monitoring](#monitoring)
7. [Backup & Recovery](#backup--recovery)
8. [Security](#security)

## Local Development

### Prerequisites

- Docker and Docker Compose
- Node.js 18+
- AWS CLI (for cloud deployments)
- Terraform (for infrastructure)

### Quick Start

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Services:**
- Backend API: http://localhost:3000
- Frontend: http://localhost:3001
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- PgAdmin: http://localhost:5050

## Docker

### Backend Dockerfile

Multi-stage build for optimal image size:
- **Builder stage**: Compiles TypeScript
- **Production stage**: Runs with minimal dependencies
- **Security**: Non-root user, health checks

### Frontend Dockerfile

Multi-stage build with Nginx:
- **Builder stage**: Builds React app
- **Production stage**: Serves with Nginx
- **Features**: Gzip compression, security headers, caching

### Docker Compose

**Development** (`docker-compose.yml`):
- Hot reload enabled
- Development databases
- PgAdmin for database management

**Production** (`docker-compose.prod.yml`):
- Optimized for production
- Auto-scaling support
- Resource limits

## CI/CD Pipelines

### CI Pipeline (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop`
- Pull requests

**Jobs:**
1. **Lint & Format** - ESLint, Prettier
2. **Type Check** - TypeScript validation
3. **Unit Tests** - Backend and frontend tests
4. **Integration Tests** - End-to-end API tests
5. **Security Audit** - npm audit, Snyk
6. **Build** - Docker image builds

### Backend CD Pipeline (`.github/workflows/cd-backend.yml`)

**Features:**
- Build and push to AWS ECR
- Run database migrations
- Blue/Green deployment to ECS
- Automated rollback on failure
- Health checks and smoke tests

### Frontend CD Pipeline (`.github/workflows/cd-frontend.yml`)

**Features:**
- Build React app with environment variables
- Deploy to S3
- CloudFront cache invalidation
- Automated rollback with S3 versioning
- Smoke tests

### Mobile Build Pipeline (`.github/workflows/mobile-build.yml`)

**Features:**
- Build iOS and Android apps
- Deploy to TestFlight and Play Console
- Automated code signing

## AWS Infrastructure

### Terraform Configuration

**Main Components:**
- VPC with public/private subnets
- RDS PostgreSQL (Multi-AZ for production)
- ElastiCache Redis
- ECS Fargate cluster
- Application Load Balancer
- S3 buckets for media and frontend
- CloudFront CDN
- Route53 DNS

**Files:**
- `config/aws/main.tf` - Core infrastructure
- `config/aws/ecs.tf` - ECS and container configs
- `config/aws/s3-cloudfront.tf` - Storage and CDN
- `config/aws/monitoring.tf` - CloudWatch alarms
- `config/aws/waf.tf` - Web Application Firewall

### Infrastructure Setup

```bash
# Initialize Terraform
cd config/aws
terraform init

# Plan deployment
terraform plan -var-file=production/terraform.tfvars

# Apply infrastructure
terraform apply -var-file=production/terraform.tfvars
```

### Environment Configurations

- **Dev** (`config/aws/dev/terraform.tfvars`)
  - Small instance sizes
  - Single AZ
  - 7-day backups

- **Staging** (`config/aws/staging/terraform.tfvars`)
  - Medium instance sizes
  - Single AZ
  - 7-day backups

- **Production** (`config/aws/production/terraform.tfvars`)
  - Large instance sizes
  - Multi-AZ
  - 30-day backups
  - Auto-scaling

## Deployment

### Automated Deployment

GitHub Actions automatically deploy on push to `main`:
1. CI pipeline runs tests
2. Docker images built and pushed to ECR
3. Database migrations executed
4. ECS service updated with new images
5. CloudFront cache invalidated
6. Health checks performed

### Manual Deployment

```bash
# Deploy backend to staging
./scripts/deploy.sh staging backend

# Deploy frontend to production
./scripts/deploy.sh production frontend

# Deploy all services
./scripts/deploy.sh production all
```

### Database Migrations

```bash
# Run migrations
./scripts/migrate.sh production up

# Check migration status
./scripts/migrate.sh production status

# Rollback migration (use with caution)
./scripts/migrate.sh production down

# Create new migration
./scripts/migrate.sh dev create add-new-table
```

### Database Seeding

```bash
# Seed development database
./scripts/seed.sh dev

# Seed staging database
./scripts/seed.sh staging

# Note: Production seeding is disabled for safety
```

## Monitoring

### CloudWatch Dashboard

Access at: AWS Console → CloudWatch → Dashboards

**Metrics:**
- ECS CPU and memory utilization
- RDS database performance
- Load balancer response times
- Redis cache performance

### Alarms

**Critical Alarms:**
- ECS CPU > 80%
- ECS Memory > 80%
- RDS CPU > 80%
- RDS Storage < 10 GB
- ALB 5XX errors > 10
- ALB response time > 1s
- Application errors > 10

**Notification:**
- SNS topic sends emails to alert email
- Configure in `config/aws/monitoring.tf`

### Logs

**CloudWatch Log Groups:**
- `/ecs/cleack-{env}-backend` - Application logs
- `/aws/waf/cleack-{env}` - WAF logs

**Access logs:**
```bash
# View recent logs
aws logs tail /ecs/cleack-production-backend --follow

# Search logs
aws logs filter-log-events \
  --log-group-name /ecs/cleack-production-backend \
  --filter-pattern "ERROR"
```

## Backup & Recovery

### Automated Backups

```bash
# Run full backup
./scripts/backup.sh production

# Backup creates:
# - RDS snapshot
# - S3 media files backup
# - Configuration export
# - ECS task definitions
# - Frontend build
```

**Backup Schedule:**
- RDS automated backups: Daily at 3:00 AM UTC
- S3 versioning: Enabled
- Backup retention: 30 days

### Recovery

**Database Recovery:**
```bash
# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier cleack-production-restored \
  --db-snapshot-identifier cleack-production-YYYYMMDD-HHMMSS

# Point-in-time recovery
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier cleack-production \
  --target-db-instance-identifier cleack-production-restored \
  --restore-time 2024-01-15T12:00:00Z
```

**Application Recovery:**
```bash
# Rollback deployment
./scripts/deploy.sh production backend
# (Script automatically rolls back on failure)

# Manual rollback
aws ecs update-service \
  --cluster cleack-production \
  --service cleack-backend-production \
  --task-definition cleack-backend-production:PREVIOUS_REVISION
```

## Security

### Security Features

**Network Security:**
- VPC with private subnets for databases
- Security groups restrict traffic
- WAF protects against common attacks
- DDoS protection with AWS Shield

**Data Security:**
- RDS encryption at rest
- S3 bucket encryption
- Secrets Manager for credentials
- TLS/SSL for all traffic

**Application Security:**
- Non-root Docker containers
- Security headers (HSTS, CSP, etc.)
- Rate limiting
- CORS configuration
- Regular security audits (Snyk)

### Security Best Practices

1. **Never commit secrets**
   - Use `.env` files (gitignored)
   - Use AWS Secrets Manager
   - Rotate credentials regularly

2. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

3. **Review security groups**
   - Minimize open ports
   - Use least privilege principle

4. **Enable MFA**
   - AWS Console access
   - GitHub account

5. **Monitor security events**
   - CloudWatch alarms
   - AWS GuardDuty
   - VPC Flow Logs

### SSL/TLS Certificates

**Automatic renewal with ACM:**
- Certificates managed by AWS Certificate Manager
- Auto-renewal before expiration
- CloudFront and ALB integration

## Cost Optimization

### Production Costs (Estimated)

- **ECS Fargate**: $50-100/month
- **RDS**: $150-300/month
- **ElastiCache**: $30-50/month
- **S3**: $20-50/month
- **CloudFront**: $10-30/month
- **Data Transfer**: $20-100/month

**Total**: ~$300-600/month

### Cost Savings Tips

1. **Use reserved instances** (RDS, ElastiCache)
2. **S3 lifecycle policies** (transition to Glacier)
3. **CloudFront caching** (reduce origin requests)
4. **Auto-scaling** (scale down during off-peak)
5. **Spot instances** (for non-critical workloads)

## Troubleshooting

### Common Issues

**ECS tasks failing to start:**
```bash
# Check task logs
aws ecs describe-tasks \
  --cluster cleack-production \
  --tasks TASK_ID

# Check CloudWatch logs
aws logs tail /ecs/cleack-production-backend --follow
```

**Database connection issues:**
```bash
# Check security groups
aws ec2 describe-security-groups \
  --group-ids sg-xxxxx

# Test connectivity
psql $DATABASE_URL -c "SELECT 1;"
```

**Deployment failures:**
```bash
# Check ECS service events
aws ecs describe-services \
  --cluster cleack-production \
  --services cleack-backend-production

# Rollback deployment
./scripts/deploy.sh production backend
```

## Support

- **Documentation**: This file
- **AWS Support**: AWS Console → Support Center
- **Infrastructure Issues**: Create GitHub issue
- **On-call**: See team Slack channel

---

**Last Updated**: 2024-01-15
**Version**: 1.0.0
