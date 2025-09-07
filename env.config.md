# Environment Configuration

This application requires the following environment variables to be set in a `.env` file:

## Required Environment Variables

```bash
# Application Configuration
NODE_ENV=development
PORT=3001

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Security Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Optional Environment Variables

```bash
# Password Hashing Configuration
BCRYPT_SALT_ROUNDS=10

# JWT Token Expiration (default values if not set)
JWT_EXPIRES_IN=7d

# CORS Origins (if needed later)
CORS_ORIGIN=http://localhost:3000

# Rate Limiting (if implemented later)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Session Configuration (if needed later)
SESSION_SECRET=your-session-secret-change-this-in-production
```

## Setup Instructions

1. Create a `.env` file in the root directory
2. Copy the required environment variables above
3. Replace the placeholder values with your actual configuration
4. Make sure to use a strong, unique JWT_SECRET in production

## Security Notes

- Never commit the `.env` file to version control
- Use different secrets for development and production
- Rotate secrets regularly in production
- Use environment-specific values for each deployment environment
