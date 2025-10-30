# 🚀 Quick Deployment Guide - AWS EC2 + Docker

## 📝 Summary

This guide walks you through deploying your E-commerce Backend to AWS EC2 using Docker in **5 simple steps**.

---

## ⚡ Quick Deploy (5 Steps)

### Step 1: Prepare Your EC2 Instance

```bash
# SSH into your EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
exit
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Step 2: Clone Your Repository

```bash
# Install git
sudo apt install git -y

# Clone repository
git clone https://github.com/yourusername/e-commerce-backend.git
cd e-commerce-backend
```

### Step 3: Configure Environment

```bash
# Create .env file from template
cp env.template .env

# Edit with your production values
nano .env
```

**Required values in `.env`:**
```bash
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-min-32-chars
ALLOWED_ORIGINS=https://yourdomain.com
```

**Generate a secure JWT_SECRET:**
```bash
openssl rand -base64 32
```

### Step 4: Deploy Using Script

```bash
# Make script executable
chmod +x deploy-aws.sh

# Run deployment
./deploy-aws.sh
```

### Step 5: Verify Deployment

```bash
# Check container is running
docker ps

# Test health endpoint
curl http://localhost:3001/health

# View logs
docker logs -f ecommerce-backend
```

**Expected output:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

---

## 🔧 Alternative Methods

### Method A: Using npm Scripts

```bash
# Build image
npm run docker:build

# Run container
npm run docker:run

# View logs
npm run docker:logs
```

### Method B: Using Makefile

```bash
# See all commands
make help

# Full deployment
make deploy

# View logs
make logs

# Check health
make health
```

### Method C: Using Docker Compose (with local MongoDB)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🔐 AWS Security Group Configuration

Open these ports in your EC2 Security Group:

| Port | Service | Source |
|------|---------|--------|
| 22   | SSH     | Your IP |
| 80   | HTTP    | 0.0.0.0/0 |
| 443  | HTTPS   | 0.0.0.0/0 |
| 3001 | API     | 0.0.0.0/0 (or specific IPs) |

**To configure:**
1. Go to EC2 Dashboard → Security Groups
2. Select your instance's security group
3. Click "Edit inbound rules"
4. Add the rules above

---

## 📊 Essential Commands

```bash
# View logs
docker logs -f ecommerce-backend

# Check status
docker ps
docker stats ecommerce-backend

# Restart
docker restart ecommerce-backend

# Stop
docker stop ecommerce-backend

# Update and redeploy
git pull origin main
./deploy-aws.sh

# Access container shell
docker exec -it ecommerce-backend sh
```

---

## 🔧 MongoDB Atlas Setup

1. **Go to** [MongoDB Atlas](https://cloud.mongodb.com)
2. **Create a cluster** (Free tier is fine)
3. **Create database user:**
   - Database Access → Add New User
   - Set username and password
   - Give "Read and write to any database" permission
4. **Whitelist IP:**
   - Network Access → Add IP Address
   - Add your EC2 IP or `0.0.0.0/0` (for testing)
5. **Get connection string:**
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your password
   - Add database name: `.../ecommerce?retryWrites=true&w=majority`

---

## 🌐 Setting Up Domain & HTTPS

### Option 1: Direct EC2 IP
```bash
# Your API will be at:
http://your-ec2-ip:3001
```

### Option 2: Using Domain + Nginx + SSL

```bash
# Install Nginx
sudo apt install nginx certbot python3-certbot-nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/api

# Add this configuration:
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Now your API is available at:
https://api.yourdomain.com
```

---

## 🐛 Troubleshooting

### Container won't start?
```bash
# Check logs for errors
docker logs ecommerce-backend

# Check if port is in use
sudo lsof -i :3001
```

### MongoDB connection failed?
- ✅ Check MONGODB_URI in `.env`
- ✅ Verify MongoDB Atlas IP whitelist
- ✅ Confirm username/password are correct
- ✅ Check if password has special characters (URL encode them)

### Port already in use?
```bash
# Find and kill process
sudo lsof -i :3001
sudo kill -9 <PID>

# Or use different port
docker run -p 3002:3001 ecommerce-backend:latest
```

### Out of memory?
```bash
# Check memory
free -h

# Add swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## 📈 Performance Tips

1. **Use t2.small or better** for production (t2.micro may run out of memory)
2. **Enable swap** on instances with < 2GB RAM
3. **Use MongoDB Atlas** (better than self-hosted)
4. **Set up CloudWatch** for monitoring
5. **Use AWS ELB** for load balancing if needed
6. **Enable gzip** in Nginx for faster responses

---

## 🔄 Updating Your App

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip
cd e-commerce-backend

# Pull latest code
git pull origin main

# Redeploy
./deploy-aws.sh

# Verify
curl http://localhost:3001/health
```

---

## 📞 Need Help?

Check the comprehensive guide: [README-DOCKER.md](./README-DOCKER.md)

**Quick tests:**
- Health check: `curl http://localhost:3001/health`
- Container logs: `docker logs -f ecommerce-backend`
- Container status: `docker ps`
- System resources: `docker stats ecommerce-backend`

