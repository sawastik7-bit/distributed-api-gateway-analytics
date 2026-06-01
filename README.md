
# Distributed API Gateway & Analytics Engine

A production-grade API Gateway built with Node.js featuring reverse proxy, Redis rate limiting, JWT authentication, async logging with BullMQ, and a real-time analytics dashboard.

## Architecture

```
Client Request
      ↓
API Gateway (Port 3000)
  → Rate Limiter (Redis)
  → JWT Auth
  → Reverse Proxy
      ↓
Microservices
  → Service A - Users (Port 4001)
  → Service B - Products (Port 4002)
      ↓
Logger → BullMQ Queue → Worker → MongoDB
                                    ↓
                          React Dashboard (Port 5173)
                          via Socket.io (Port 4003)
```

## Features

- Reverse proxy routing to microservices
- Redis rate limiting (10 requests/minute per IP)
- JWT authentication at gateway level
- Async request logging via BullMQ message queue
- Real time analytics dashboard with live charts
- Request metrics: total requests, requests per minute, average response time, error rate

## Tech Stack

**Backend:**
- Node.js, Express.js
- Redis (Memurai on Windows)
- BullMQ (message queue)
- MongoDB with Mongoose
- Socket.io
- JSON Web Tokens

**Frontend:**
- React (Vite)
- Recharts
- Socket.io client

## Project Structure

```
api-gateway/
├── Backend/
│   ├── gateway/          → API Gateway (port 3000)
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── rateLimiter.js
│   │   │   └── logger.js
│   │   └── routes/
│   │       └── proxy.js
│   ├── services/
│   │   ├── service_A/    → Users service (port 4001)
│   │   └── service_B/    → Products service (port 4002)
│   └── worker/           → Log processor + Socket.io
└── Frontend/
    └── Client/           → React dashboard (port 5173)
```

## Getting Started

### Prerequisites
- Node.js 18+
- Redis / Memurai
- MongoDB

### Installation

**Clone the repo:**
```bash
git clone https://github.com/sawastik7-bit/distributed-api-gateway-analytics.git
cd distributed-api-gateway-analytics
```

**Install dependencies:**
```bash
cd Backend/gateway && npm install
cd ../services/service_A && npm install
cd ../services/service_B && npm install
cd ../worker && npm install
cd ../../Frontend/Client && npm install
```

**Set up environment variables:**
```bash
# Backend/gateway/.env
PORT=3000
JWT_SECRET=your_secret_here

# Backend/worker/.env
MONGO_URI=your_mongodb_uri
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Running the Project

Open 5 terminals:

```bash
# Terminal 1
cd Backend/services/service_A && node index.js

# Terminal 2
cd Backend/services/service_B && node index.js

# Terminal 3
cd Backend/gateway && node server.js

# Terminal 4
cd Backend/worker && node index.js

# Terminal 5
cd Frontend/Client && npm run dev
```

### Testing

Generate a JWT token:
```bash
cd Backend/gateway
node generateToken.js
```

Hit the API with Postman:
```
GET  http://localhost:3000/api/users
GET  http://localhost:3000/api/products
Headers: Authorization: Bearer <token>
```

Open dashboard:
```
http://localhost:5173
```

## API Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | /health | Gateway health check | No |
| GET | /api/users | Get all users | Yes |
| GET | /api/users/:id | Get user by id | Yes |
| POST | /api/users | Create user | Yes |
| GET | /api/products | Get all products | Yes |
| GET | /api/products/:id | Get product by id | Yes |
| POST | /api/products | Create product | Yes |

## Rate Limiting

Every IP is limited to **10 requests per minute**.
Exceeding the limit returns:
```json
{
  "success": false,
  "message": "Too many requests",
  "retryAfter": "45 seconds"
}
```