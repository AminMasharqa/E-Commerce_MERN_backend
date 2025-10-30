#!/bin/bash

# =============================================================================
# AWS EC2 Deployment Script
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="ecommerce-backend"
DOCKER_IMAGE="${APP_NAME}:latest"
CONTAINER_NAME="${APP_NAME}"
HOST_PORT=3001
CONTAINER_PORT=3001

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}AWS EC2 Docker Deployment Script${NC}"
echo -e "${GREEN}========================================${NC}\n"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo -e "${YELLOW}Please create a .env file based on .env.example${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Stopping existing container (if any)...${NC}"
docker stop ${CONTAINER_NAME} 2>/dev/null || true
docker rm ${CONTAINER_NAME} 2>/dev/null || true

echo -e "${GREEN}✓ Cleaned up existing container${NC}\n"

echo -e "${YELLOW}Step 2: Building Docker image...${NC}"
docker build -t ${DOCKER_IMAGE} .

echo -e "${GREEN}✓ Docker image built successfully${NC}\n"

echo -e "${YELLOW}Step 3: Running container...${NC}"
docker run -d \
  --name ${CONTAINER_NAME} \
  --restart unless-stopped \
  -p ${HOST_PORT}:${CONTAINER_PORT} \
  --env-file .env \
  --health-cmd='node -e "require('\''http'\'').get('\''http://localhost:3001/health'\'', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"' \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  --health-start-period=40s \
  ${DOCKER_IMAGE}

echo -e "${GREEN}✓ Container started successfully${NC}\n"

echo -e "${YELLOW}Step 4: Waiting for health check...${NC}"
sleep 5

# Check container status
if docker ps | grep -q ${CONTAINER_NAME}; then
    echo -e "${GREEN}✓ Container is running!${NC}\n"
    
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Deployment Successful!${NC}"
    echo -e "${GREEN}========================================${NC}\n"
    
    echo -e "Container Name: ${GREEN}${CONTAINER_NAME}${NC}"
    echo -e "Port: ${GREEN}${HOST_PORT}${NC}"
    echo -e "Health Check: ${GREEN}http://localhost:${HOST_PORT}/health${NC}\n"
    
    echo -e "${YELLOW}Useful commands:${NC}"
    echo -e "  View logs:      ${GREEN}docker logs -f ${CONTAINER_NAME}${NC}"
    echo -e "  Stop container: ${GREEN}docker stop ${CONTAINER_NAME}${NC}"
    echo -e "  Start container:${GREEN}docker start ${CONTAINER_NAME}${NC}"
    echo -e "  Remove container:${GREEN}docker rm -f ${CONTAINER_NAME}${NC}"
    echo -e "  Container stats:${GREEN}docker stats ${CONTAINER_NAME}${NC}"
else
    echo -e "${RED}✗ Container failed to start!${NC}"
    echo -e "${YELLOW}Showing logs:${NC}\n"
    docker logs ${CONTAINER_NAME}
    exit 1
fi

