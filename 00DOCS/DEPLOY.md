# Deploy checklist

## Database

1. Run migration or full schema on RDS: `database/migrations/001_block0_tenant_rls.sql` or `schema.sql` for new DB.

## Backend (Lambda)

```bash
cd backend
npm install
npm run package
# ensure lambda.zip exists at backend/lambda.zip for Terraform, or:
npm run deploy
```

## Frontend

```bash
cd frontend
npm install
npm run build
npm run deploy   # aws s3 sync to mlpos-frontend
```

## Terraform

```bash
cd infra
terraform plan
terraform apply
```

Invalidate CloudFront if needed after frontend upload.
