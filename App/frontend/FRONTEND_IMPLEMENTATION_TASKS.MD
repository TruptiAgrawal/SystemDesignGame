# Frontend Implementation Tasks: System Design Game

This document outlines the step-by-step implementation plan for the System Design Game MVP, based on the [FRONTEND.md](./FRONTEND.md) specification.

---

### Phase 1: Foundation & State Architecture
*   **Goal:** Set up the "Source of Truth" and project scaffolding.
*   **Tech:** React (TS), Zustand, CSS Modules.
*   **Tasks:**
    1.  **Project Initialization:** Scaffolding with Vite + TypeScript.
    2.  **Zustand Store (`useSystemStore`):** Define the schema for `nodes` (infrastructure properties), `edges` (traffic flow), and `missionContext` (constraints/targets).
    3.  **Type Definitions:** Create strict interfaces for `InfrastructureNode` (e.g., `NodeProps`, `CapacityMetrics`) to ensure the simulation engine receives predictable data.
    4.  **Routing:** Basic `react-router-dom` setup for Landing, Gallery, and Game views.
    5.  **Persistence Layer:** Integrate `zustand/middleware` (persist) to automatically sync the game state and "Aced" missions to `localStorage`.

### Phase 2: The Architect (Visual Canvas)
*   **Goal:** Enable users to design architectures using a node-based interface.
*   **Tech:** React Flow, CSS Modules.
*   **Tasks:**
    1.  **React Flow Integration:** Configure the canvas with custom edge types and background grids.
    2.  **Custom Infrastructure Nodes:** Create high-fidelity components for:
        *   `Load Balancer`, `API Server`, `SQL/NoSQL DB`, `Redis Cache`, `CDN`.
    3.  **Component Palette:** A draggable sidebar to add new nodes to the canvas.
    4.  **Inspector Panel:** A context-aware drawer that appears when a node is clicked, allowing users to tune properties (e.g., "Vertical Scaling: 4 CPUs").
    5.  **Validation HUD:** Real-time logic to flag "orphaned" nodes or invalid connections (e.g., DB connected directly to User).

### Phase 3: The Simulation Engine (The "Brain")
*   **Goal:** Translate the visual graph into a mathematical model.
*   **Tech:** Web Workers, Vanilla JS/TS logic.
*   **Tasks:**
    1.  **Graph Traversal:** Implement an algorithm to find all valid paths from "User" nodes to "Data" nodes.
    2.  **Capacity Calculation:** Define the `Base Capacity` for each node type (e.g., an API server handles 500 RPS).
    3.  **Web Worker Integration:** Offload the simulation loop to a worker to prevent UI lag. The worker will calculate:
        *   `Saturation %` per node.
        *   `Latency` (Queueing theory: $M/M/1$ or similar models).
        *   `Error Rate` (increases as saturation crosses 80%).
    4.  **RPS Scaling:** Implement logic for traffic "ramps" and random "chaos events" (spikes).

### Phase 4: The War Room (Live Feedback)
*   **Goal:** Provide real-time visual feedback on system performance.
*   **Tech:** Framer Motion, Recharts, SVG Animations.
*   **Tasks:**
    1.  **Traffic Pulses:** Animate "pulses" along React Flow edges where pulse speed/frequency correlates to RPS.
    2.  **Heat Map Overlay:** Use CSS filters (`drop-shadow`) to make nodes glow from Green (healthy) to Red (saturated/failing).
    3.  **Live Dashboard:** Render real-time line charts for **Latency**, **RPS**, and **Error Rate** using Recharts.
    4.  **Chaos Log:** A scrolling terminal-style feed showing events like "Cache hit rate dropping..." or "DB connection pool exhausted."

### Phase 5: Mission Logic & Post-Mortem
*   **Goal:** Define challenges and educational outcomes.
*   **Tech:** JSON Data, Recharts.
*   **Tasks:**
    1.  **Mission Library:** Create a set of JSON missions (e.g., "URL Shortener - Handle 1M reads/sec").
    2.  **Mission Gallery:** A grid-based selection screen with difficulty badges and progress tracking.
    3.  **Post-Mortem Report Card:** A summary view after simulation ends:
        *   **Score Breakdown:** Reliability, Budget, and Performance.
        *   **Actionable Insights:** "Your DB was a bottleneck; consider a Read-Replica."

### Phase 6: Visual Identity & Onboarding
*   **Goal:** Aesthetic polish and user conversion.
*   **Tech:** Framer Motion.
*   **Tasks:**
    1.  **Landing Page:** Terminal-style hero section with a "Scale or Fail" aesthetic.
    2.  **Quick Tutorial:** A 3-step overlay (Drag -> Connect -> Simulate).
    3.  **Layout Transitions:** Smooth morphing transitions when switching between "Architect" and "War Room" modes.
