# Deployment Guide

## Deploy to Vercel (Recommended)

Vercel is the recommended platform for deploying this Next.js application.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/client-management-system)

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? (select your account)
   - Link to existing project? `N`
   - What's your project's name? `client-management-system`
   - In which directory is your code located? `./`
   - Want to override the settings? `N`

5. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Environment Variables on Vercel

In the Vercel dashboard, add these environment variables:

```
DATABASE_URL=file:./prisma/dev.db
NODE_ENV=production
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
```

### Automatic Deployments

Once set up, Vercel will automatically deploy:
- **Production**: When you push to the main branch
- **Preview**: For every pull request

## Deploy to Other Platforms

### Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Environment variables: Same as Vercel

### Railway

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables

### Self-Hosted (VPS/Cloud)

1. **Clone the repository**
   ```bash
   git clone your-repo-url
   cd client-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Build the application**
   ```bash
   npm run build
   ```

5. **Start with PM2** (recommended for production)
   ```bash
   npm install -g pm2
   pm2 start npm --name "client-management" -- start
   pm2 save
   pm2 startup
   ```

6. **Set up Nginx reverse proxy** (optional)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and run**
   ```bash
   docker build -t client-management-system .
   docker run -p 3000:3000 client-management-system
   ```

## Post-Deployment

### 1. Initialize Database
After deployment, seed the database with sample data:
```bash
npm run seed
```

### 2. Test the Application
- Visit your deployed URL
- Try creating a new client
- Test all features
- Check analytics dashboard

### 3. Monitor Performance
- Check Vercel Analytics
- Monitor API response times
- Review error logs

### 4. Set Up Custom Domain (Optional)
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Troubleshooting

### Build Failures
- Check Node.js version (should be 18+)
- Verify all dependencies are installed
- Check environment variables are set

### Database Issues
- Ensure DATABASE_URL is correctly set
- Run `prisma generate` manually if needed
- Check file permissions for SQLite database

### Performance Issues
- Enable caching in Vercel
- Optimize images
- Review database queries
- Consider upgrading to PostgreSQL for production

## Security Checklist

- [ ] Change default credentials
- [ ] Set up authentication (if needed)
- [ ] Configure CORS properly
- [ ] Set up HTTPS (automatic with Vercel)
- [ ] Regular backups of database
- [ ] Monitor for security vulnerabilities
- [ ] Keep dependencies updated

## Backup Strategy

### Database Backup
```bash
# Backup SQLite database
cp prisma/dev.db prisma/backup-$(date +%Y%m%d).db

# Upload to cloud storage (AWS S3, Google Cloud, etc.)
```

### Automated Backups
Set up a cron job or use Vercel's scheduled functions:
```javascript
// api/cron/backup.ts
export default async function handler(req, res) {
  // Backup logic here
  res.status(200).json({ message: 'Backup completed' })
}
```

## Scaling Considerations

For high traffic, consider:
1. **Database**: Migrate to PostgreSQL or MySQL
2. **Caching**: Implement Redis for session management
3. **CDN**: Use Vercel's edge network
4. **Load Balancing**: Deploy multiple instances
5. **Database Replication**: Set up read replicas

## Support

For deployment issues:
- Check Vercel documentation: https://vercel.com/docs
- Review Next.js deployment guide: https://nextjs.org/docs/deployment
- Contact support or open an issue in the repository
