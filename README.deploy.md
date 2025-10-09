# TinyApp Production Deployment Guide

## VPS Deployment Instructions

### Prerequisites

1. **VPS with Docker installed**
   ```bash
   # Install Docker on Ubuntu/Debian
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

2. **Install Docker Compose**
   ```bash
   sudo apt-get update
   sudo apt-get install docker-compose-plugin
   ```

### Initial Setup on VPS

1. **Clone the repository** (or upload files)
   ```bash
   git clone <your-repo-url> tinyapp
   cd tinyapp
   ```

2. **Create production environment file**
   ```bash
   cp .env.example .env
   nano .env
   ```

   Update the session keys with random strings:
   ```bash
   # Generate random keys
   openssl rand -base64 32
   ```

3. **Deploy the application**
   ```bash
   ./deploy.sh
   ```

   Or manually:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

### Configuration Files

- **Dockerfile** - Production-optimized Docker image
- **docker-compose.prod.yml** - Production compose configuration
- **deploy.sh** - Automated deployment script
- **.env** - Environment variables (create from .env.example)

### Production Features

✅ **Security:**
- Non-root user execution
- No new privileges security option
- Read-only root filesystem ready

✅ **Performance:**
- Multi-stage build for smaller image
- Production dependencies only
- Resource limits configured

✅ **Reliability:**
- Health checks
- Automatic restart on failure
- Log rotation (10MB max, 3 files)
- Proper signal handling with dumb-init

✅ **Resource Limits:**
- CPU: 0.5-1.0 cores
- Memory: 256MB-512MB
- Adjust in docker-compose.prod.yml based on your VPS

### Common Commands

```bash
# Start the application
docker-compose -f docker-compose.prod.yml up -d

# Stop the application
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart the application
docker-compose -f docker-compose.prod.yml restart

# View container status
docker-compose -f docker-compose.prod.yml ps

# Update and redeploy
./deploy.sh
```

### Nginx Reverse Proxy (Optional but Recommended)

If you want to serve on port 80/443 with SSL:

1. **Install Nginx**
   ```bash
   sudo apt-get install nginx
   ```

2. **Create Nginx config** (`/etc/nginx/sites-available/tinyapp`)
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
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **Enable the site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/tinyapp /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **Add SSL with Certbot** (free SSL)
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

### Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp  # Only if accessing directly
sudo ufw enable
```

### Monitoring

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' tinyapp-prod

# Monitor resource usage
docker stats tinyapp-prod

# View recent logs
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### Troubleshooting

**Container won't start:**
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check if port is already in use
sudo lsof -i :3000
```

**Health check failing:**
```bash
# Check app is responding
curl http://localhost:3000

# Check container logs
docker logs tinyapp-prod
```

**Out of memory:**
```bash
# Increase memory limits in docker-compose.prod.yml
# Or upgrade your VPS plan
```

### Backup Strategy

The app currently uses in-memory database. For production, you should:

1. Add a persistent database (PostgreSQL, MongoDB, etc.)
2. Set up automated backups
3. Use volumes for data persistence

### Updates

To update the application:

```bash
git pull origin main
./deploy.sh
```

Or manually:
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

---

**Need help?** Check the logs first:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```
