# La Kbira Deployment Guide

**Version:** 1.0  
**Last Updated:** October 2024  
**Author:** Manus AI

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Database Configuration](#database-configuration)
4. [Security Configuration](#security-configuration)
5. [Deployment Process](#deployment-process)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying to production, verify the following:

### Code Quality
- [ ] All TypeScript errors resolved (`pnpm tsc --noEmit`)
- [ ] All tests passing (`pnpm test`)
- [ ] Code review completed
- [ ] No console.log statements in production code
- [ ] All dependencies up to date

### Security
- [ ] Default admin credentials changed
- [ ] All environment variables configured
- [ ] Database credentials secured
- [ ] API keys stored in secure vault
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled

### Database
- [ ] Database migrations applied
- [ ] Database backups configured
- [ ] Connection pooling configured
- [ ] Query optimization completed
- [ ] Indexes created for frequently accessed columns

### Infrastructure
- [ ] Server resources allocated
- [ ] Load balancer configured
- [ ] CDN configured for static assets
- [ ] Email service configured
- [ ] Logging configured
- [ ] Monitoring configured

### Documentation
- [ ] Admin guide completed
- [ ] API documentation completed
- [ ] Deployment runbook created
- [ ] Incident response plan created
- [ ] Disaster recovery plan created

---

## Environment Setup

### Required Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Application
NODE_ENV=production
VITE_APP_TITLE="La Kbira"
VITE_APP_ID="lakbira-dash"
VITE_APP_LOGO="https://cdn.lakbira.ae/logo.png"

# Database
DATABASE_URL="postgresql://user:password@host:5432/lakbira_prod"
DATABASE_SSL=true

# Authentication
JWT_SECRET="your-secure-random-secret-key-min-32-chars"
OAUTH_SERVER_URL="https://oauth.lakbira.ae"

# API Keys
OPENAI_API_KEY="sk-..."
BUILT_IN_FORGE_API_KEY="your-forge-api-key"
BUILT_IN_FORGE_API_URL="https://api.manus.im"

# Email Service
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASSWORD="SG.your-sendgrid-api-key"
SMTP_FROM="noreply@lakbira.ae"

# Storage (S3)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET="lakbira-prod"

# Monitoring
SENTRY_DSN="https://your-sentry-dsn"
DATADOG_API_KEY="your-datadog-api-key"

# Analytics
VITE_ANALYTICS_WEBSITE_ID="your-analytics-id"
VITE_ANALYTICS_ENDPOINT="https://analytics.lakbira.ae"

# Owner Information
OWNER_NAME="La Kbira"
OWNER_OPEN_ID="owner-id"
```

### Environment Variable Security

**Important Security Practices:**

1. **Never commit `.env.production` to version control**
2. **Use a secrets management system** (AWS Secrets Manager, HashiCorp Vault, etc.)
3. **Rotate secrets regularly** (at least quarterly)
4. **Use strong, random values** for all secrets
5. **Audit access** to environment variables
6. **Use different secrets** for each environment (dev, staging, prod)

---

## Database Configuration

### PostgreSQL Setup

#### 1. Create Database

```sql
CREATE DATABASE lakbira_prod
  ENCODING 'UTF8'
  LC_COLLATE 'en_US.UTF-8'
  LC_CTYPE 'en_US.UTF-8';

CREATE USER lakbira_user WITH PASSWORD 'secure-password-here';
GRANT ALL PRIVILEGES ON DATABASE lakbira_prod TO lakbira_user;
```

#### 2. Configure Connection Pooling

Use PgBouncer for connection pooling:

```ini
[databases]
lakbira_prod = host=localhost port=5432 dbname=lakbira_prod user=lakbira_user password=secure-password

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
min_pool_size = 10
reserve_pool_size = 5
```

#### 3. Apply Migrations

```bash
# Run database migrations
pnpm db:push

# Verify migrations
pnpm db:check
```

#### 4. Create Backups

```bash
# Automated daily backups
0 2 * * * pg_dump -U lakbira_user lakbira_prod | gzip > /backups/lakbira_$(date +\%Y\%m\%d).sql.gz

# Backup retention: Keep 30 days of backups
find /backups -name "lakbira_*.sql.gz" -mtime +30 -delete
```

### Database Optimization

```sql
-- Create indexes for frequently accessed columns
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Analyze query performance
ANALYZE;

-- Enable query logging for slow queries
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();
```

---

## Security Configuration

### HTTPS/TLS Setup

```nginx
# Nginx configuration
server {
  listen 443 ssl http2;
  server_name api.lakbira.ae;

  # SSL certificates
  ssl_certificate /etc/letsencrypt/live/api.lakbira.ae/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/api.lakbira.ae/privkey.pem;

  # SSL configuration
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;
  ssl_session_cache shared:SSL:10m;
  ssl_session_timeout 10m;

  # HSTS header
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}

# Redirect HTTP to HTTPS
server {
  listen 80;
  server_name api.lakbira.ae;
  return 301 https://$server_name$request_uri;
}
```

### CORS Configuration

```typescript
// server/middleware/cors.ts
const corsOptions = {
  origin: [
    'https://lakbira.ae',
    'https://www.lakbira.ae',
    'https://admin.lakbira.ae'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
};
```

### Rate Limiting

```typescript
// server/middleware/rateLimit.ts
import { RateLimiter } from './validation';

const limiter = new RateLimiter(100, 60000); // 100 requests per minute

app.use((req, res, next) => {
  const key = req.ip || 'unknown';
  if (limiter.isLimited(key)) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  next();
});
```

### Security Headers

```typescript
// server/middleware/securityHeaders.ts
app.use((req, res, next) => {
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );

  // X-Frame-Options
  res.setHeader('X-Frame-Options', 'DENY');

  // X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // X-XSS-Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer-Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  next();
});
```

---

## Deployment Process

### Using Docker

#### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build application
COPY . .
RUN pnpm build

# Expose port
EXPOSE 3000

# Start application
CMD ["pnpm", "start"]
```

#### 2. Build and Push Image

```bash
# Build image
docker build -t lakbira-dash:1.0.0 .

# Tag for registry
docker tag lakbira-dash:1.0.0 registry.lakbira.ae/lakbira-dash:1.0.0

# Push to registry
docker push registry.lakbira.ae/lakbira-dash:1.0.0
```

#### 3. Deploy with Docker Compose

```yaml
version: '3.8'

services:
  app:
    image: registry.lakbira.ae/lakbira-dash:1.0.0
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=lakbira_prod
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Using Kubernetes

#### 1. Create Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lakbira-dash
spec:
  replicas: 3
  selector:
    matchLabels:
      app: lakbira-dash
  template:
    metadata:
      labels:
        app: lakbira-dash
    spec:
      containers:
      - name: app
        image: registry.lakbira.ae/lakbira-dash:1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: lakbira-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
```

#### 2. Create Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: lakbira-dash-service
spec:
  selector:
    app: lakbira-dash
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

---

## Post-Deployment Verification

### Health Checks

```bash
# Check application health
curl -f https://api.lakbira.ae/health || exit 1

# Check database connectivity
curl -f https://api.lakbira.ae/api/admin/stats || exit 1

# Check API endpoints
curl -f https://api.lakbira.ae/api/products || exit 1
```

### Smoke Tests

```bash
# Run smoke tests
pnpm test:smoke

# Test critical user flows
# 1. User registration
# 2. Product browsing
# 3. Order creation
# 4. Admin login
# 5. Order approval
```

### Performance Testing

```bash
# Load testing with k6
k6 run load-test.js

# Check response times
# Target: < 200ms for 95th percentile
# Target: < 500ms for 99th percentile
```

---

## Monitoring & Maintenance

### Application Monitoring

```typescript
// server/monitoring.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

// Capture errors
app.use(Sentry.Handlers.errorHandler());
```

### Log Aggregation

```bash
# Send logs to centralized logging
# Using ELK Stack or similar

# Log format
{
  "timestamp": "2024-10-15T15:00:00Z",
  "level": "info",
  "service": "lakbira-dash",
  "message": "Order created",
  "orderId": "ord_001",
  "userId": "cust_001"
}
```

### Metrics Collection

```typescript
// server/metrics.ts
import { register, Counter, Histogram } from 'prom-client';

const requestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'path', 'status']
});

const requestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'path']
});
```

### Alerting Rules

```yaml
# Prometheus alerting rules
groups:
- name: lakbira-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
    for: 5m
    annotations:
      summary: "High error rate detected"

  - alert: DatabaseDown
    expr: up{job="postgres"} == 0
    for: 1m
    annotations:
      summary: "Database is down"

  - alert: HighLatency
    expr: histogram_quantile(0.95, http_request_duration_seconds) > 0.5
    for: 5m
    annotations:
      summary: "High request latency detected"
```

---

## Rollback Procedures

### Rollback to Previous Version

```bash
# 1. Identify previous working version
git log --oneline | head -10

# 2. Checkout previous version
git checkout <commit-hash>

# 3. Rebuild and redeploy
docker build -t lakbira-dash:rollback .
docker push registry.lakbira.ae/lakbira-dash:rollback

# 4. Update deployment
kubectl set image deployment/lakbira-dash \
  app=registry.lakbira.ae/lakbira-dash:rollback

# 5. Verify rollback
kubectl rollout status deployment/lakbira-dash
```

### Database Rollback

```bash
# 1. Stop application
docker-compose down

# 2. Restore from backup
gunzip < /backups/lakbira_20241014.sql.gz | psql -U lakbira_user lakbira_prod

# 3. Verify data
psql -U lakbira_user lakbira_prod -c "SELECT COUNT(*) FROM orders;"

# 4. Restart application
docker-compose up -d
```

---

## Troubleshooting

### Common Deployment Issues

#### Issue: Database Connection Fails

**Symptoms:** Application crashes with database connection error

**Solution:**
1. Verify DATABASE_URL is correct
2. Check database is running: `psql -c "SELECT 1"`
3. Verify credentials: `psql -U lakbira_user -d lakbira_prod`
4. Check firewall rules
5. Check connection pooling limits

#### Issue: High Memory Usage

**Symptoms:** Application memory usage increases over time

**Solution:**
1. Check for memory leaks: `node --inspect app.js`
2. Increase Node.js heap size: `NODE_OPTIONS="--max-old-space-size=1024"`
3. Restart application periodically
4. Review database query performance

#### Issue: Slow API Responses

**Symptoms:** API endpoints respond slowly

**Solution:**
1. Check database query performance: `EXPLAIN ANALYZE`
2. Add missing database indexes
3. Enable caching: Redis, Memcached
4. Check server resources (CPU, memory)
5. Review application logs for bottlenecks

---

## Support & Contact

For deployment support:

- **Email:** devops@lakbira.ae
- **Slack:** #deployment-support
- **Documentation:** https://docs.lakbira.ae/deployment

---

**Document Version:** 1.0  
**Last Updated:** October 2024  
**Next Review:** January 2025

