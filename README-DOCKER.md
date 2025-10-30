# 🐳 Docker Deployment Guide

Complete guide for deploying the E-commerce Backend to AWS EC2 using Docker.

## 📋 Prerequisites

- Docker installed on your EC2 instance
- Node.js 20+ (for local development)
- MongoDB Atlas account (recommended) or local MongoDB
- AWS EC2 instance with:
  - Ubuntu 22.04 or Amazon Linux 2
  - Minimum 1GB RAM (t2.micro or better)
  - Port 3001 open in Security Group

---

## 🚀 Quick Start

### Option 1: Using Deployment Script (Recommended)

```bash
# 1. Copy .env.example to .env and configure
cp .env.example .env
nano .env  # Edit with your values

# 2. Make script executable
chmod +x deploy-aws.sh

# 3. Run deployment
./deploy-aws.sh
```

### Option 2: Manual Docker Commands

```bash
# 1. Build the image
docker build -t ecommerce-backend:latest .

# 2. Run the container
docker run -d \
  --name ecommerce-backend \
  --restart unless-stopped \
  -p 3001:3001 \
  --env-file .env \
  ecommerce-backend:latest

# 3. Check logs
docker logs -f ecommerce-backend
```

### Option 3: Using Docker Compose

```bash
# Start all services (backend + MongoDB)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🔧 AWS EC2 Setup

### 1. Launch EC2 Instance

```bash
# Instance type: t2.micro (free tier) or t2.small
# AMI: Ubuntu Server 22.04 LTS
# Security Group: Open ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 3001 (API)
```

### 2. Connect to EC2

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 3. Install Docker

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Enable Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Verify installation
docker --version
```

### 4. Clone Repository

```bash
# Install git if needed
sudo apt install git -y

# Clone your repository
git clone https://github.com/yourusername/e-commerce-backend.git
cd e-commerce-backend
```

### 5. Configure Environment

```bash
# Create .env file
cp .env.example .env
nano .env

# Add your production values:
# - MongoDB Atlas URI
# - Strong JWT_SECRET (use: openssl rand -base64 32)
# - Set NODE_ENV=production
```

### 6. Deploy

```bash
chmod +x deploy-aws.sh
./deploy-aws.sh
```

---

## 📊 Container Management

### View Logs
```bash
# Follow logs in real-time
docker logs -f ecommerce-backend

# View last 100 lines
docker logs --tail 100 ecommerce-backend
```

### Check Status
```bash
# Container status
docker ps

# Health check
curl http://localhost:3001/health

# Container stats (CPU, Memory)
docker stats ecommerce-backend
```

### Restart Container
```bash
docker restart ecommerce-backend
```

### Update Deployment
```bash
# Pull latest code
git pull origin main

# Redeploy
./deploy-aws.sh
```

### Stop & Remove
```bash
# Stop container
docker stop ecommerce-backend

# Remove container
docker rm ecommerce-backend

# Remove image
docker rmi ecommerce-backend:latest
```

---

## 🔐 Production Security Checklist

- [ ] Use MongoDB Atlas with IP whitelist
- [ ] Generate strong JWT_SECRET (min 32 chars)
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS with SSL certificate
- [ ] Configure proper CORS origins
- [ ] Set up AWS Security Groups correctly
- [ ] Enable CloudWatch logging
- [ ] Regular security updates: `sudo apt update && sudo apt upgrade`
- [ ] Use AWS IAM roles instead of access keys
- [ ] Enable AWS GuardDuty for threat detection

---

## 🌐 Setting Up HTTPS (Optional but Recommended)

### Using Nginx Reverse Proxy + Let's Encrypt

```bash
# 1. Install Nginx
sudo apt install nginx -y

# 2. Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# 3. Configure Nginx
sudo nano /etc/nginx/sites-available/ecommerce-backend

# Add this configuration:
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
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

# 4. Enable site
sudo ln -s /etc/nginx/sites-available/ecommerce-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 5. Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com
```

---

## 🔍 Monitoring & Logs

### Real-time Monitoring
```bash
# CPU, Memory, Network usage
docker stats ecommerce-backend

# System resources
htop  # Install: sudo apt install htop
```

### Log Management
```bash
# View logs with timestamps
docker logs -f --timestamps ecommerce-backend

# Save logs to file
docker logs ecommerce-backend > app-logs.txt

# Rotate logs (prevents disk fill)
docker run -d \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  ecommerce-backend:latest
```

---

## 🐛 Troubleshooting

### Container Won't Start
```bash
# Check logs
docker logs ecommerce-backend

# Check if port is already in use
sudo lsof -i :3001

# Check environment variables
docker exec ecommerce-backend env
```

### MongoDB Connection Issues
```bash
# Verify MongoDB URI in .env
# Check MongoDB Atlas IP whitelist (0.0.0.0/0 for testing)
# Verify network connectivity
docker exec ecommerce-backend ping -c 3 google.com
```

### Out of Memory
```bash
# Check memory usage
free -h

# Limit container memory
docker run -d --memory="512m" ecommerce-backend:latest
```

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :3001

# Kill process
sudo kill -9 <PID>
```

---

## 📈 Performance Optimization

### 1. Enable Docker BuildKit
```bash
export DOCKER_BUILDKIT=1
```

### 2. Use Multi-stage Build (Already implemented)
- Reduces final image size by ~60%
- Faster deployments

### 3. Configure Node.js Memory
```bash
docker run -d \
  -e NODE_OPTIONS="--max-old-space-size=512" \
  ecommerce-backend:latest
```

### 4. Enable Swap (for low-memory instances)
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 🔄 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS EC2

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/e-commerce-backend
            git pull origin main
            ./deploy-aws.sh
```

---

## 📞 Support

For issues or questions:
- Check logs: `docker logs -f ecommerce-backend`
- Test health: `curl http://localhost:3001/health`
- Review environment: `docker exec ecommerce-backend env`

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [AWS EC2 Guide](https://docs.aws.amazon.com/ec2/)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

