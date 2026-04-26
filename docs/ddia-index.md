# The Architect's Ledger: DDIA Deep-Dive

Welcome to my journey through **"Designing Data-Intensive Applications"** by Martin Kleppmann. This series documents my technical deep-dives, visualizations, and hands-on implementations as I explore the principles that power the world's most scalable and reliable systems.

---

## Roadmap and Progress

I am reading this book chapter-by-chapter, distilling complex concepts into architectural patterns and practical Go/C++ implementations.

### Part I: Foundations of Data Systems
- [x] Chapter 1: Reliable, Scalable, and Maintainable Applications (Completed)
- [x] Chapter 2: Data Models and Query Languages (Completed)
- [x] **Chapter 3**: Storage and Retrieval (Implementation: [Go-LSM](go-lsm.md))
- [ ] **Chapter 4**: Encoding and Evolution

### Part II: Distributed Data
- [ ] **Chapter 5**: Replication
- [ ] **Chapter 6**: Partitioning
- [ ] **Chapter 7**: Transactions
- [ ] **Chapter 8**: The Trouble with Distributed Systems
- [ ] **Chapter 9**: Consistency and Consensus

### Part III: Derived Data
- [ ] **Chapter 10**: Batch Processing
- [ ] **Chapter 11**: Stream Processing
- [ ] **Chapter 12**: The Future of Data Systems

---

## Implementation Corner

Theory is great, but code is better. Here are the projects I've built (or am building) to solidify these concepts:

| Chapter | Concept | Project / Implementation |
|---------|---------|-------------------------|
| Ch 3 | LSM-Trees | [Go-LSM: A Persistent KV Store](go-lsm.md) |
| Ch 5 | Replication | *Planned: Distributed KV Store* |
| Ch 11 | Stream Processing | *Planned: Real-time Analytics Engine* |

---

## Design Philosophy
Each chapter deep-dive includes:
- **TL;DR**: The "too long; didn't read" essence.
- **Visuals**: Mermaid diagrams of architectures and data flows.
- **The "So What?"**: Why this matters for a Full-Stack Engineer.
- **Interview Essentials**: High-frequency system design questions related to the chapter.
