# The Kernel Chronicles: OSTEP Deep-Dive

Welcome to my journey through **"Operating Systems: Three Easy Pieces"** (OSTEP) by Remzi H. Arpaci-Dusseau and Andrea C. Arpaci-Dusseau. This series documents my exploration of the fundamental abstractions—Virtualization, Concurrency, and Persistence—that form the bedrock of modern computing.

---

## Roadmap and Progress

I am studying this book to understand how hardware and software collaborate to manage resources, provide isolation, and ensure data integrity.

### Introduction
- [x] **Chapter 2**: Introduction to Operating Systems

### Part I: Virtualization
- [ ] **Chapter 4**: The Abstraction: The Process
- [ ] **Chapter 5**: Interlude: Process API
- [ ] **Chapter 6**: Mechanism: Limited Direct Execution
- [ ] **Chapter 7**: Scheduling: Introduction
- [ ] **Chapter 8**: Scheduling: The Multi-Level Feedback Queue
- [ ] **Chapter 9**: Scheduling: Proportional Share
- [ ] **Chapter 10**: Multiprocessor Scheduling (Advanced)
- [ ] **Chapter 13**: The Abstraction: Address Spaces
- [ ] **Chapter 14**: Interlude: Memory API
- [ ] **Chapter 15**: Mechanism: Address Translation
- [ ] **Chapter 16**: Segmentation
- [ ] **Chapter 17**: Free-Space Management
- [ ] **Chapter 18**: Paging: Introduction
- [ ] **Chapter 19**: Paging: Faster Translations (TLBs)
- [ ] **Chapter 20**: Paging: Smaller Tables
- [ ] **Chapter 21**: Beyond Physical Memory: Mechanisms
- [ ] **Chapter 22**: Beyond Physical Memory: Policies

### Part II: Concurrency
- [ ] **Chapter 26**: Concurrency: An Introduction
- [ ] **Chapter 27**: Interlude: Thread API
- [ ] **Chapter 28**: Locks
- [ ] **Chapter 29**: Lock-based Data Structures
- [ ] **Chapter 30**: Condition Variables
- [ ] **Chapter 31**: Semaphores
- [ ] **Chapter 32**: Common Concurrency Bugs
- [ ] **Chapter 33**: Event-based Concurrency (Advanced)

### Part III: Persistence
- [ ] **Chapter 36**: I/O Devices
- [ ] **Chapter 37**: Hard Disk Drives
- [ ] **Chapter 38**: Redundant Arrays of Inexpensive Disks (RAID)
- [ ] **Chapter 39**: Interlude: Files and Directories
- [ ] **Chapter 40**: File System Implementation
- [ ] **Chapter 41**: Locality and The Fast File System
- [ ] **Chapter 42**: Crash Consistency: FSCK and Journaling
- [ ] **Chapter 43**: Log-structured File Systems

---

## Implementation Corner

Theory is solidified through code. Here are the "Pieces" I'm building along the way:

| Chapter | Concept | Project / Implementation |
|---------|---------|-------------------------|
| Ch 5 | Process API | *Planned: Minimal Shell* |
| Ch 28 | Locking | *Planned: User-level Mutex* |
| Ch 40 | File Systems | *Planned: Toy File System* |

---

## Design Philosophy
Each chapter deep-dive includes:
- **The Crux**: The fundamental problem the OS is trying to solve.
- **Visuals**: Mermaid diagrams of context switches, memory layouts, and scheduling.
- **The "So What?"**: Why these low-level details matter for application performance.
- **C-Level Insights**: Snippets of kernel-style C code and system calls.
