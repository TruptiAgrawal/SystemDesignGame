# Frontend Product Specification: System Design Game

This document outlines the frontend architecture, user journey, and technical requirements for the System Design Game MVP.

---

## 1. Page-Wise Application Flow

### **Page 1: Landing (The Hook)**
*   **Purpose:** Introduce the concept ("Scale or Fail") and convert visitors into players.
*   **Visuals:** Minimalist hero section with a terminal-style background and a "Design systems that survive real traffic" headline.
*   **UI Components:**
    *   `HeroSection`: Main value proposition.
    *   `PrimaryCTA`: "Start First Mission" button leading to the Gallery.
    *   `QuickTutorial`: A 3-step visual guide (Drag -> Connect -> Simulate).

### **Page 2: Mission Gallery (The Selection)**
*   **Purpose:** Allow players to choose a specific system design challenge.
*   **Visuals:** A grid of cards with difficulty levels and performance targets.
*   **UI Components:**
    *   `MissionCard`: Displays Title (e.g., "URL Shortener"), Difficulty (1-5 stars), and Traffic Profile (e.g., "High Read/Write").
    *   `ConstraintBadge`: Visual indicators for Budget ($), Latency (ms), and Error Rate (%) targets.
    *   `ProgressTracker`: Shows which missions the user has already "Aced."

### **Page 3: The Architect (Design Canvas)**
*   **Purpose:** The core gameplay area where users build their architecture.
*   **Visuals:** A large, gridded canvas with a sidebar of infrastructure components.
*   **UI Components:**
    *   **React-Flow Canvas:** The primary workspace for dragging nodes and drawing "Traffic Edges."
    *   `ComponentPalette`: Sidebar containing "LB," "API Server," "Redis," "SQL DB," etc.
    *   `InspectorPanel`: Context-aware side panel to tune node properties (e.g., "Instances: 4", "Cache Size: 10GB").
    *   `ValidationHUD`: Real-time warnings (e.g., "DB not connected to any server").
    *   `DeployButton`: Finalizes the design and triggers the Simulation.

### **Page 4: The War Room (Live Simulation)**
*   **Purpose:** Provide real-time feedback on the performance of the designed system.
*   **Visuals:** The canvas remains, but "Traffic Pulses" animate along edges. Nodes glow/change color based on load.
*   **UI Components:**
    *   `RealTimeDashboard`: Line charts for **RPS**, **Latency**, and **Error Rate**.
    *   `HeatMapOverlay`: Visual representation of node health (Green = Healthy, Yellow = Saturated, Red = Failing).
    *   `ChaosLog`: A scrolling feed of real-time events (e.g., "⚠️ Traffic spike: +300% from US-East").
    *   `ActiveBudgetTicker`: Live counter of the infrastructure cost over time.

### **Page 5: Post-Mortem (Results & Learning)**
*   **Purpose:** Summarize performance and teach system design principles.
*   **Visuals:** A "Report Card" style interface with actionable insights.
*   **UI Components:**
    *   `ScoreBreakdown`: Circular charts for Reliability, Performance, and Budget Efficiency.
    *   `InsightCard`: Specific feedback (e.g., "Your DB hit 100% CPU. A Read-Replica would have solved this.").
    *   `ActionButtons`: "Retry Design" (keeps current nodes) or "Next Mission."

---

## 2. Frontend Technical Architecture

### **State Management (Zustand)**
We use a centralized `useSystemStore` to manage:
*   `nodes`: Current React Flow nodes and their properties.
*   `edges`: Connections between nodes.
*   `activeMission`: Metadata for the selected challenge.
*   `liveMetrics`: Real-time data during simulation.

### **Simulation Engine (Client-Side)**
The "War Room" phase uses a `useSimulation` hook that:
1.  **Traverses the Graph:** Calculates the "Capacity" of each path from Users to Data.
2.  **Calculates Metrics:** Applies mathematical models (Queueing Theory) to determine Latency and Error Rates based on incoming RPS vs. Node Capacity.
3.  **Drives Animations:** Updates the CSS/SVG state of nodes and edges to reflect stress levels.
4.  **Performance Strategy (Web Workers):** To maintain 60FPS while calculating complex metrics for dozens of nodes, the engine offloads heavy math to a Web Worker, ensuring the UI thread remains responsive for React Flow animations.
5.  **Complexity Management (Adaptive Fidelity):** Starts with linear capacity scaling for introductory levels and introduces non-linear latency curves (exponential stress) for advanced missions to teach "diminishing returns" in scaling.

### **Visual Effects (CSS / Framer Motion)**
*   **Traffic Pulses:** SVG `stroke-dasharray` animations to visualize flow.
*   **Node Heat:** CSS `box-shadow` and `filter: drop-shadow` to represent load intensity.
*   **Transitions:** Framer Motion for seamless switching between "Architect" and "War Room" modes.

---

## 3. Frontend Tech Stack Analysis

### **Core Framework: React (TypeScript)**
*   **Why:** React's component-based architecture is perfect for managing the modular nature of infrastructure nodes (LB, Server, DB).
*   **Role of TypeScript:** Crucial for defining the complex data structures of the **System Graph**. It ensures that a "Load Balancer" node always has the correct properties (e.g., `algorithm`, `targetNodes`) before the simulation starts, preventing runtime crashes.

### **Canvas Engine: React Flow**
*   **Why:** Building a draggable, zoomable, and connectable canvas from scratch is a massive undertaking. React Flow is the industry standard for node-based UIs.
*   **Key Features for this Project:**
    *   **Custom Nodes:** We can create high-fidelity React components for each infrastructure type.
    *   **Handles:** Built-in logic for connecting output ports to input ports.
    *   **Viewport Management:** Handles panning and zooming naturally for large architectures.

### **State Management: Zustand**
*   **Why:** Unlike Redux, Zustand is lightweight and has a very small boilerplate. It is exceptionally fast at handling frequent state updates (like real-time metric changes during simulation).
*   **Project Impact:** It will act as the "Source of Truth" for the entire system graph, allowing the **InspectorPanel** and the **SystemCanvas** to stay perfectly in sync without complex prop-drilling.

### **Animation & Physics: Framer Motion**
*   **Why:** To make the game feel "alive."
*   **Project Impact:** 
    *   **Layout Transitions:** Smoothly morphing from the "Architect" view to the "War Room" dashboard.
    *   **Component Interaction:** Subtle hover and click animations for infrastructure nodes.
    *   **Traffic Visualization:** Animating the "pulses" along the edges to represent data flow intensity.

### **Data Visualization: Recharts**
*   **Why:** To render the live performance metrics (Latency, RPS, Error Rate) in the "War Room."
*   **Project Impact:** Provides out-of-the-box responsive line and area charts that can handle real-time data streams efficiently.

### **Styling: CSS Modules (Vanilla CSS)**
*   **Why:** High performance and zero-runtime overhead. 
*   **Project Impact:** Ensures the UI stays snappy even when there are dozens of animated nodes on the canvas. It allows for precise control over the "Cyberpunk/Terminal" aesthetic.
