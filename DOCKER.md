# TinyApp Docker Configuration

This project includes complete Docker configurations for both development and production environments.

## Quick Start

### Development
```bash
docker-compose -f docker-compose.dev.yml up
```
Access at: http://localhost:3000

### Production
```bash
./deploy.sh
```
Or manually:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

## File Structure

```
tinyapp/
├── Dockerfile                  # Production Dockerfile
├── Dockerfile.dev              # Development Dockerfile
├── docker-compose.dev.yml      # Development compose config
├── docker-compose.prod.yml     # Production compose config
├── .dockerignore               # Files to exclude from build
├── .env.example                # Environment variables template
├── deploy.sh                   # Production deployment script
└── README.deploy.md            # Detailed deployment guide
```

## Development vs Production

### Development (docker-compose.dev.yml)
- **Hot-reloading** with nodemon
- **Volume mounting** for live code updates
- **Larger image** with all build tools
- **Debug-friendly** logging
- Port: 3000

### Production (docker-compose.prod.yml)
- **Optimized image** (multi-stage build)
- **Security hardened** (non-root user)
- **Health checks** enabled
- **Resource limits** configured
- **Log rotation** enabled
- **Auto-restart** on failure
- Port: 3000

## Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Update with production values:
- `SESSION_KEY_1` - Random session secret
- `SESSION_KEY_2` - Random session secret

Generate random secrets:
```bash
openssl rand -base64 32
```

## Docker Commands Reference

### Development Commands

```bash
# Start dev environment
docker-compose -f docker-compose.dev.yml up

# Start in background
docker-compose -f docker-compose.dev.yml up -d

# Rebuild and start
docker-compose -f docker-compose.dev.yml up --build

# Stop
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Production Commands

```bash
# Deploy with script
./deploy.sh

# Manual deployment
docker-compose -f docker-compose.prod.yml up -d --build

# Stop
docker-compose -f docker-compose.prod.yml down

# Restart
docker-compose -f docker-compose.prod.yml restart

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check status
docker-compose -f docker-compose.prod.yml ps

# Check health
docker inspect --format='{{.State.Health.Status}}' tinyapp-prod
```

## VPS Deployment

See **README.deploy.md** for complete VPS deployment instructions including:
- Docker installation
- Nginx reverse proxy setup
- SSL certificate configuration
- Firewall setup
- Monitoring and troubleshooting

## Security Features (Production)

- ✅ Non-root user execution
- ✅ No new privileges
- ✅ Resource limits (CPU/Memory)
- ✅ Health checks
- ✅ Log rotation
- ✅ Proper signal handling
- ✅ Production-only dependencies

## Resource Configuration

Default limits (adjust in docker-compose.prod.yml):
- **CPU:** 0.5-1.0 cores
- **Memory:** 256MB-512MB

For higher traffic:
```yaml
limits:
  cpus: '2.0'
  memory: 1G
```

## Troubleshooting

### Port already in use
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill the process or change port in docker-compose
```

### Container won't start
```bash
# View logs
docker-compose -f docker-compose.prod.yml logs

# Check container details
docker inspect tinyapp-prod
```

### Out of memory
```bash
# Check memory usage
docker stats tinyapp-prod

# Increase limits in docker-compose.prod.yml
```

## Next Steps for Production

1. **Add a database** - Currently using in-memory storage
2. **Set up CI/CD** - Automate deployments
3. **Add monitoring** - Prometheus, Grafana, etc.
4. **Configure backups** - Database and user data
5. **Set up SSL** - Use Nginx + Certbot
6. **Add logging service** - ELK stack or similar

## Notes

- Development uses nodemon for hot-reloading
- Production uses plain Node.js for performance
- Both configurations build bcrypt from source (required for Alpine)
- Health checks ensure container is responding
- Logs are automatically rotated to prevent disk fill

---

For detailed production deployment instructions, see **README.deploy.md**
