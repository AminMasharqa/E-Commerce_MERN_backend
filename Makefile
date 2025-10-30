# =============================================================================
# Makefile for E-commerce Backend - Docker Operations
# =============================================================================

.PHONY: help build run stop logs restart clean deploy compose-up compose-down health

# Variables
IMAGE_NAME = ecommerce-backend
CONTAINER_NAME = ecommerce-backend
PORT = 3001

# Default target
help:
	@echo "╔════════════════════════════════════════════════════════════╗"
	@echo "║         E-commerce Backend - Docker Commands              ║"
	@echo "╚════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "🐳 Docker Commands:"
	@echo "  make build          - Build Docker image"
	@echo "  make run            - Run container"
	@echo "  make stop           - Stop and remove container"
	@echo "  make logs           - View container logs"
	@echo "  make restart        - Restart container"
	@echo "  make clean          - Remove container and image"
	@echo "  make deploy         - Full deployment (build + run)"
	@echo ""
	@echo "🔧 Docker Compose Commands:"
	@echo "  make compose-up     - Start all services"
	@echo "  make compose-down   - Stop all services"
	@echo "  make compose-logs   - View all logs"
	@echo ""
	@echo "🏥 Health & Status:"
	@echo "  make health         - Check health status"
	@echo "  make status         - Show container status"
	@echo ""
	@echo "📦 Development:"
	@echo "  make dev            - Run in development mode"
	@echo "  make test-build     - Test TypeScript build"
	@echo ""

# Build Docker image
build:
	@echo "🔨 Building Docker image..."
	docker build -t $(IMAGE_NAME):latest .
	@echo "✅ Build complete!"

# Run container
run:
	@echo "🚀 Starting container..."
	@docker stop $(CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(CONTAINER_NAME) 2>/dev/null || true
	docker run -d \
		--name $(CONTAINER_NAME) \
		--restart unless-stopped \
		-p $(PORT):$(PORT) \
		--env-file .env \
		$(IMAGE_NAME):latest
	@echo "✅ Container started!"
	@echo "📍 API: http://localhost:$(PORT)"
	@echo "🏥 Health: http://localhost:$(PORT)/health"

# Stop container
stop:
	@echo "🛑 Stopping container..."
	@docker stop $(CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(CONTAINER_NAME) 2>/dev/null || true
	@echo "✅ Container stopped!"

# View logs
logs:
	@echo "📋 Viewing logs (Ctrl+C to exit)..."
	docker logs -f $(CONTAINER_NAME)

# Restart container
restart: stop run

# Clean up
clean:
	@echo "🧹 Cleaning up..."
	@docker stop $(CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(CONTAINER_NAME) 2>/dev/null || true
	@docker rmi $(IMAGE_NAME):latest 2>/dev/null || true
	@echo "✅ Cleanup complete!"

# Full deployment
deploy:
	@echo "🚀 Starting full deployment..."
	@make build
	@make run
	@sleep 3
	@make health
	@echo "✅ Deployment complete!"

# Docker Compose up
compose-up:
	@echo "🐳 Starting services with Docker Compose..."
	docker-compose up -d
	@echo "✅ Services started!"

# Docker Compose down
compose-down:
	@echo "🛑 Stopping services..."
	docker-compose down
	@echo "✅ Services stopped!"

# Docker Compose logs
compose-logs:
	@echo "📋 Viewing logs (Ctrl+C to exit)..."
	docker-compose logs -f

# Health check
health:
	@echo "🏥 Checking health status..."
	@curl -s http://localhost:$(PORT)/health | jq '.' || curl http://localhost:$(PORT)/health

# Container status
status:
	@echo "📊 Container Status:"
	@docker ps -a | grep $(CONTAINER_NAME) || echo "Container not found"
	@echo ""
	@echo "📈 Resource Usage:"
	@docker stats --no-stream $(CONTAINER_NAME) 2>/dev/null || echo "Container not running"

# Development mode
dev:
	@echo "💻 Starting development server..."
	npm run dev

# Test TypeScript build
test-build:
	@echo "🧪 Testing TypeScript build..."
	npm run build
	@echo "✅ Build successful!"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	npm install
	@echo "✅ Dependencies installed!"

# Check environment
check-env:
	@echo "🔍 Checking environment configuration..."
	@if [ ! -f .env ]; then \
		echo "❌ .env file not found!"; \
		echo "📝 Create one using: cp env.template .env"; \
		exit 1; \
	else \
		echo "✅ .env file exists"; \
	fi

