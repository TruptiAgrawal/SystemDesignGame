# SystemDesignGame: Architect & Scale

A strategy-simulation game where you design, deploy, and operate scalable backend architectures. Think **SimCity for Backend Engineers.**

## 🚀 The Core Loop
1. **Design:** Use a visual builder to connect Load Balancers, API Clusters, Caches, and Databases.
2. **Operate:** Hit "Run" to launch a live simulation. Watch traffic flow through your nodes in real-time.
3. **Adapt:** Hot-swap components or scale clusters *during* the simulation as traffic spikes or hardware fails.
4. **Analyze:** Use "Deep Trace" to find exactly why a request timed out—was it a DB lock, a full thread pool, or a cache miss?

## 🧠 The Simulation Engine
Unlike traditional simulators that use heavy Docker containers, this game uses a **High-Performance Stochastic Model**:
* **Traffic Patterns:** AI agents generate requests based on Poisson distributions (realistic "bursty" traffic).
* **Queuing Theory:** Latency and throughput are calculated using M/M/1 queue models for extreme performance.
* **Component Physics:** Every block (Redis, Postgres, Kafka) has unique "physics"—connection limits, IOPS constraints, and failure probabilities.

## 📊 The Engineering Triad (Success Metrics)
To win a mission, you must balance three conflicting forces:
* **Latency:** Keep p99 response times under the target (e.g., < 200ms).
* **Availability:** Survive "Chaos Events" (DB outages, celebrity spikes) without dropping requests.
* **Profitability:** Every server costs real-time budget. Over-provisioning leads to bankruptcy; under-provisioning leads to churn.

## 🛣️ Progression (The Missions)
* **Level 1: The Viral Blog** (Intro to Caching)
* **Level 2: Real-time Chat** (WebSockets & State)
* **Level 3: Global E-Commerce** (Read Replicas & Sharding)
* **Level 4: The Video Giant** (CDN & Object Storage)
* **Level 5: The "Everything" App** (Microservices & High Availability)

## 🛠️ Tech Stack
* **Frontend:** React + Canvas/SVG (Visual Architect) + WebSockets (Live Metrics).
* **Backend:** Node.js (Event-driven Simulation Engine).
* **State:** Redis (High-speed simulation snapshots).
