# 🛒 E-commerce Backend API

Professional Node.js + TypeScript + MongoDB backend with Docker deployment for AWS EC2.

## 🚀 Quick Links

- **🐳 Docker Setup:** [DOCKER-SETUP-COMPLETE.md](./DOCKER-SETUP-COMPLETE.md) - Start here!
- **📖 Full Docker Guide:** [README-DOCKER.md](./README-DOCKER.md)
- **⚡ Quick Deploy:** [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)

---

## 📦 Features

- ✅ User authentication (JWT)
- ✅ Product management
- ✅ Shopping cart
- ✅ Order processing
- ✅ MongoDB integration
- ✅ Docker deployment ready
- ✅ AWS EC2 optimized
- ✅ Production-ready security

---

## 🛠️ Tech Stack

- **Runtime:** Node.js 20
- **Language:** TypeScript
- **Framework:** Express 5
- **Database:** MongoDB (Atlas recommended)
- **Auth:** JWT + bcrypt
- **Deployment:** Docker + AWS EC2
- **CI/CD:** GitHub Actions

---

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp env.template .env
# Edit .env with your MongoDB URI and JWT_SECRET

# Run development server
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start
```

### Docker Deployment (Recommended)

```bash
# Option 1: Automated script
./deploy-aws.sh

# Option 2: Using Makefile
make deploy
make logs

# Option 3: Using npm scripts
npm run docker:build
npm run docker:run
npm run docker:logs

# Option 4: Docker Compose (with local MongoDB)
docker-compose up -d
```

---

## 📋 Environment Variables

Create a `.env` file with these variables (use `env.template` as reference):

```bash
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
BCRYPT_SALT_ROUNDS=10
ALLOWED_ORIGINS=https://yourdomain.com
```

**Generate secure JWT_SECRET:**
```bash
openssl rand -base64 32
```

---

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

### User Routes
```bash
POST /user/register       # Register new user
POST /user/login          # Login user
GET  /user/my-orders      # Get user orders (requires JWT)
```

### Product Routes
```bash
GET /product              # Get all products
```

### Cart Routes
```bash
GET    /cart              # Get user cart (requires JWT)
POST   /cart/items        # Add item to cart (requires JWT)
PUT    /cart/items        # Update cart item (requires JWT)
DELETE /cart/items/:id    # Remove item from cart (requires JWT)
DELETE /cart              # Clear cart (requires JWT)
POST   /cart/checkout     # Checkout cart (requires JWT)
```

---

## 🐳 Docker Files Created

### Core Files
- `Dockerfile` - Multi-stage production build
- `docker-compose.yml` - Local development setup
- `.dockerignore` - Optimize image size
- `deploy-aws.sh` - Automated AWS deployment script

### Helper Files
- `Makefile` - Quick commands (make deploy, make logs, etc.)
- `env.template` - Environment variables template
- `.gitignore` - Git ignore rules

### Documentation
- `DOCKER-SETUP-COMPLETE.md` - Complete setup overview
- `README-DOCKER.md` - Full Docker guide
- `DEPLOYMENT-GUIDE.md` - 5-step quick deployment

### CI/CD
- `.github/workflows/deploy.yml` - Auto-deploy on push

---

## 🔧 Available Commands

### Development
```bash
npm run dev              # Start dev server with hot reload
npm run build            # Build TypeScript to JavaScript
npm start               # Run production build
```

### Docker (npm scripts)
```bash
npm run docker:build         # Build Docker image
npm run docker:run           # Run container
npm run docker:stop          # Stop container
npm run docker:logs          # View logs
npm run docker:compose:up    # Start with docker-compose
npm run docker:compose:down  # Stop docker-compose
```

### Makefile Commands
```bash
make help           # Show all commands
make deploy         # Full deployment (build + run)
make build          # Build Docker image
make run            # Run container
make stop           # Stop container
make logs           # View logs
make restart        # Restart container
make clean          # Remove container and image
make health         # Check health status
make compose-up     # Start with docker-compose
make compose-down   # Stop docker-compose
```

---

## 🌐 AWS EC2 Deployment

### Prerequisites
- AWS EC2 instance (t2.small or better)
- Docker installed on EC2
- MongoDB Atlas cluster
- Domain (optional but recommended)

### Deployment Steps

1. **Prepare EC2:**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

2. **Clone and Configure:**
```bash
git clone https://github.com/yourusername/e-commerce-backend.git
cd e-commerce-backend
cp env.template .env
nano .env  # Add your configuration
```

3. **Deploy:**
```bash
chmod +x deploy-aws.sh
./deploy-aws.sh
```

4. **Verify:**
```bash
curl http://localhost:3001/health
docker logs -f ecommerce-backend
```

**Full guide:** [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)

---

## 🔐 Security Features

- ✅ Non-root user in Docker
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Environment variable isolation
- ✅ Input validation
- ✅ Error handling middleware

---

## 📊 Project Structure

```
backend/
├── src/
│   ├── config/         # Database configuration
│   ├── middlewares/    # JWT validation, error handling
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   └── index.ts        # Entry point
├── dist/               # Compiled JavaScript (gitignored)
├── Dockerfile          # Docker production build
├── docker-compose.yml  # Local development
├── deploy-aws.sh       # AWS deployment script
├── Makefile           # Quick commands
└── package.json       # Dependencies
```

---

## 🐛 Troubleshooting

### Container won't start?
```bash
docker logs ecommerce-backend
```

### MongoDB connection fails?
- Check `MONGODB_URI` in `.env`
- Verify MongoDB Atlas IP whitelist
- Confirm credentials are correct

### Port already in use?
```bash
sudo lsof -i :3001
sudo kill -9 <PID>
```

### Out of memory?
```bash
free -h
# Add swap space (see DEPLOYMENT-GUIDE.md)
```

**Full troubleshooting:** [README-DOCKER.md](./README-DOCKER.md#-troubleshooting)

---

## 🔄 CI/CD with GitHub Actions

### Setup

1. Add secrets to GitHub (Settings → Secrets → Actions):
   - `EC2_HOST` - Your EC2 IP
   - `EC2_USER` - Usually `ubuntu`
   - `EC2_SSH_KEY` - Your private SSH key

2. Push to main:
```bash
git push origin main
```

3. Watch deployment in Actions tab

**Now every push auto-deploys to EC2!** 🎉

---

## 📈 Performance Tips

1. Use **t2.small** or better (not t2.micro for production)
2. Enable **swap space** on low-memory instances
3. Use **MongoDB Atlas** (managed service)
4. Set up **Nginx** as reverse proxy with SSL
5. Enable **CloudWatch** for monitoring
6. Consider **AWS ELB** for load balancing

---

## 📚 Documentation

- **Quick Start:** [DOCKER-SETUP-COMPLETE.md](./DOCKER-SETUP-COMPLETE.md)
- **Full Docker Guide:** [README-DOCKER.md](./README-DOCKER.md)
- **Quick Deploy:** [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)
- **Environment Config:** [env.template](./env.template)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

ISC License

---

## 🙏 Support

For deployment issues:
1. Check logs: `docker logs -f ecommerce-backend`
2. Test health: `curl http://localhost:3001/health`
3. Review docs: [README-DOCKER.md](./README-DOCKER.md)

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] MongoDB Atlas cluster created
- [ ] Strong JWT_SECRET generated (32+ chars)
- [ ] `.env` file configured
- [ ] EC2 Security Group configured (ports 22, 80, 443, 3001)
- [ ] Docker installed on EC2
- [ ] Domain configured (optional)
- [ ] SSL certificate setup (optional but recommended)
- [ ] GitHub Actions secrets configured (if using CI/CD)

---

**Ready to deploy?** Check [DOCKER-SETUP-COMPLETE.md](./DOCKER-SETUP-COMPLETE.md) for the complete guide!

🚀 Happy deploying!

