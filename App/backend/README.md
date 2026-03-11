# Backend: SystemDesignGame

High-performance backend API for the System Design Game, handling real-time simulation orchestration, mission management, and user state persistence.

---

## Architecture Overview

```
Frontend (React + React Flow)
       │
       │ REST API + WebSocket
       ▼
Backend API (Fastify)
       │
 ┌─────┼──────────────┐
 ▼     ▼              ▼
Simulation Engine   Redis      Supabase
(Worker Threads)    Cache      Auth + DB
```

---

## Tech Stack

### Core Framework
- **Node.js** (v18+)
- **TypeScript** (strict mode)
- **Fastify** (high-performance HTTP server)

### Real-Time Communication
- **Socket.IO** (live simulation metrics streaming)

### Background Processing
- **BullMQ** (job queue for simulation orchestration)
- **Worker Threads** (CPU-intensive simulation calculations)

### Data Layer
- **Redis** (session state, simulation cache, job queues)
- **Supabase** (authentication, user profiles, mission progress, leaderboards)

---

## Project Structure

```
backend/
│
├── src/
│   ├── config/
│   │   ├── env.ts                 # Environment variable validation
│   │   ├── redis.ts               # Redis connection setup
│   │   └── supabase.ts            # Supabase client initialization
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.schema.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   └── users.service.ts
│   │   │
│   │   ├── missions/
│   │   │   ├── missions.controller.ts
│   │   │   ├── missions.service.ts
│   │   │   └── missions.data.ts   # Mission definitions
│   │   │
│   │   └── simulation/
│   │       ├── simulation.controller.ts
│   │       ├── simulation.service.ts
│   │       └── simulation.schema.ts
│   │
│   ├── realtime/
│   │   ├── socket.ts              # Socket.IO server setup
│   │   └── metrics.stream.ts      # Real-time metrics broadcasting
│   │
│   ├── simulation/
│   │   ├── engine.ts              # Core simulation orchestrator
│   │   ├── traffic.generator.ts   # Poisson traffic model
│   │   ├── queue.model.ts         # M/M/1 queueing theory
│   │   ├── chaos.engine.ts        # Random failure injection
│   │   └── graph.traversal.ts     # Architecture graph analysis
│   │
│   ├── utils/
│   │   ├── logger.ts              # Pino logger
│   │   └── helpers.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts     # JWT validation
│   │   └── error.handler.ts
│   │
│   ├── types/
│   │   ├── simulation.types.ts
│   │   └── mission.types.ts
│   │
│   ├── routes.ts                  # API route registration
│   ├── app.ts                     # Fastify app setup
│   └── server.ts                  # Entry point
│
├── workers/
│   └── simulation.worker.ts       # Background simulation processor
│
├── docker/
│   └── docker-compose.yml         # Redis + local dev setup
│
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/register          # Create new user account
POST   /api/auth/login             # Login with email/password
POST   /api/auth/logout            # Invalidate session
GET    /api/auth/me                # Get current user
```

### Missions
```
GET    /api/missions               # List all missions
GET    /api/missions/:id           # Get mission details
POST   /api/missions/:id/submit    # Submit architecture solution
GET    /api/missions/:id/leaderboard  # Top scores for mission
```

### Simulation
```
POST   /api/simulation/start       # Start new simulation
POST   /api/simulation/:id/stop    # Stop running simulation
GET    /api/simulation/:id/status  # Get simulation state
GET    /api/simulation/:id/metrics # Retrieve final metrics
```

### User Profile
```
GET    /api/users/profile          # Get user profile
PATCH  /api/users/profile          # Update profile
GET    /api/users/progress         # Mission completion stats
```

---

## WebSocket Events

### Client → Server
```javascript
socket.emit('simulation:subscribe', { simulationId: 'uuid' })
socket.emit('simulation:unsubscribe', { simulationId: 'uuid' })
```

### Server → Client
```javascript
socket.on('metrics:update', (data) => {
  // { rps, latency, errorRate, nodeSaturation, timestamp }
})

socket.on('chaos:event', (event) => {
  // { type: 'db_outage', nodeId: 'db-1', timestamp }
})

socket.on('simulation:complete', (results) => {
  // { score, insights, breakdown }
})
```

---

## Simulation Engine

### Traffic Generation
Uses **Poisson distribution** to model realistic bursty traffic:

```typescript
λ = baseRPS * (1 + spikeMultiplier * Math.random())
```

### Latency Calculation
Based on **M/M/1 queueing theory**:

```
L = 1 / (μ - λ)

Where:
  λ = arrival rate (RPS)
  μ = service rate (node capacity)
```

### Component Models

**Load Balancer**
- Connection limit: 10,000
- Routing latency: 2-5ms
- Algorithms: Round Robin, Least Connections

**API Server**
- Base capacity: 500 RPS
- CPU saturation threshold: 80%
- Latency increases exponentially above 80%

**Redis Cache**
- Hit rate: 70-95% (configurable)
- Latency: 1-3ms
- Eviction policy: LRU

**Supabase (Database)**
- Query latency: 10-50ms
- IOPS limit: 3000
- Connection pool: 100
- Lock probability increases with concurrent writes

---

## Environment Variables

Create a `.env` file:

```bash
# Server
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173

# Redis
REDIS_URL=redis://localhost:6379

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key

# JWT (if not using Supabase Auth exclusively)
JWT_SECRET=your_jwt_secret

# Simulation
MAX_SIMULATION_DURATION=300000  # 5 minutes in ms
WORKER_THREADS=4
```

---

## Local Development

### Prerequisites
- Node.js 18+
- Docker (for Redis)
- Supabase account

### Setup

1. **Clone and install dependencies**
```bash
cd backend
npm install
```

2. **Start Redis**
```bash
docker-compose -f docker/docker-compose.yml up -d
```

3. **Configure Supabase**
- Create a project at [supabase.com](https://supabase.com)
- Run database migrations (see `supabase/migrations/`)
- Copy credentials to `.env`

4. **Run development server**
```bash
npm run dev
```

Server starts at `http://localhost:5000`

---

## Database Schema (Supabase)

### Tables

**users**
```sql
id          uuid PRIMARY KEY
email       text UNIQUE NOT NULL
username    text UNIQUE
created_at  timestamp
```

**mission_attempts**
```sql
id              uuid PRIMARY KEY
user_id         uuid REFERENCES users(id)
mission_id      text NOT NULL
architecture    jsonb NOT NULL
score           integer
latency_p99     float
availability    float
cost            float
completed_at    timestamp
```

**leaderboards**
```sql
mission_id      text NOT NULL
user_id         uuid REFERENCES users(id)
score           integer NOT NULL
rank            integer
updated_at      timestamp
```

---

## Performance Considerations

### Simulation Offloading
Heavy simulations run in **Worker Threads** to prevent blocking the main event loop.

### Redis Caching Strategy
- Active simulation state: TTL 10 minutes
- Mission definitions: TTL 1 hour
- User sessions: TTL 24 hours

### WebSocket Optimization
Metrics broadcast at **100ms intervals** (10 FPS) to balance real-time feel with network efficiency.

---

## Testing

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# Load testing
npm run test:load
```

---

## Deployment

### Docker Build
```bash
docker build -t systemdesigngame-backend .
docker run -p 5000:5000 --env-file .env systemdesigngame-backend
```

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure Redis persistence (AOF/RDB)
- [ ] Enable Supabase RLS policies
- [ ] Set up monitoring (Datadog, New Relic)
- [ ] Configure rate limiting
- [ ] Enable CORS for production domain
- [ ] Set up SSL/TLS termination

---

## Future Enhancements

- **Distributed Simulation**: Scale simulation workers across multiple machines
- **Replay System**: Store and replay simulation traces
- **AI Advisor**: ML-based architecture recommendations
- **Multiplayer**: Real-time collaborative architecture design
- **Advanced Chaos**: Network partitions, cascading failures

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License

---

## Support

For issues or questions:
- Open a GitHub issue
- Join our Discord community
- Email: support@systemdesigngame.dev
