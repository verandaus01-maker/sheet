# Setup Guide

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database

The project uses Prisma with SQLite. To initialize:

```bash
npx prisma generate
npx prisma db push
```

**Note**: If you encounter network issues downloading Prisma engines, you may need to:

1. Use a different network environment
2. Pre-download Prisma engines manually
3. Or use this environment variable:
```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma db push
```

### 3. (Optional) Seed Sample Data
```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Database Management

### View Database (Prisma Studio)
```bash
npm run db:studio
```

This opens a visual database browser at [http://localhost:5555](http://localhost:5555)

### Reset Database
```bash
rm prisma/dev.db
npx prisma db push
```

### Backup Database
```bash
cp prisma/dev.db prisma/dev.db.backup
```

## Troubleshooting

### Issue: Prisma engines won't download
**Solution**:
- Ensure you have internet access
- Try using a VPN or different network
- Check firewall settings
- Use environment variable: `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1`

### Issue: Port 3000 already in use
**Solution**:
```bash
npm run dev -- -p 3001
```

### Issue: Database locked
**Solution**:
- Close Prisma Studio if running
- Restart the dev server
- Check for other processes accessing the database

## Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Create a `.env` file:
```
DATABASE_URL="file:./prod.db"
NODE_ENV=production
```

## Adding Sample Data Manually

You can add sample clients through the UI, or use Prisma Studio:

1. Run `npm run db:studio`
2. Click on "Client" table
3. Click "Add record"
4. Fill in the fields
5. Save

## System Requirements

- Node.js 18 or higher
- npm or yarn
- 100MB free disk space
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Next Steps

1. Add your first client through the dashboard
2. Create tasks and log activities
3. Use the daily log feature
4. Explore the analytics dashboard
5. Export data as needed
