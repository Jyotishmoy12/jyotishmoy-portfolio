# Go-Torrent

**Golang** | Feb 2026

A BitTorrent v1.0 engine built from scratch to maximize download throughput and handle network volatility.

### Torrent Download Flow

```mermaid
graph TD
    A[User Starts Download] --> B[TorrentFile.Open]
    B --> C[Compute InfoHash]
    C --> D[Tracker.BuildTrackerURL]
    D --> E[Tracker.GetPeers]
    E --> F[Peer Pool Initialization]
    
    F --> G1[Worker Goroutine 1]
    F --> G2[Worker Goroutine 2]
    F --> GN[Worker Goroutine N]
    
    G1 --> H[Handshake Validation]
    G2 --> H
    GN --> H
    
    H --> I[Request Pipeline<br>Depth=5]
    I --> J[Receive 16KB Blocks]
    J --> K[Piece Assembly<br>256KB]
    K --> L{SHA-1 Verification}
    
    L -- Valid --> M[Send to ResultQueue]
    L -- Invalid --> N[Re-queue Piece Index]
    
    N -.-> F
    
    M --> O[Final File Assembly]
```

### Key Highlights
- **Engineered Request Pipelining**: Configured a depth of 5 to overcome network RTT and maximize download throughput.
- **Stateless Workers**: Designed workers with automatic piece re-queuing on connection reset or SHA-1 hash mismatch.
- **Race-Free Concurrency**: Used goroutines and thread-safe channels for zero-race peer management.
- **Binary Protocol Handling**: Managed Big-Endian communication with peers smoothly.

### Bencode Parsing
- Implemented a reflection-based Bencode parser using Go struct tags to map binary keys to Go types in a single pass.

### Worker Pool Architecture
- Built a non-blocking worker pool to solve the "slow peer problem" where slow connections bottleneck the entire download.

## Interactive System Flow
<div class="flow-visualizer-container" data-nodes='["Magnet Link", "HTTP/UDP Tracker", "Peer Swarm Swarm", "Disk Buffer"]'>
    <div class="flow-nodes">
        <div class="flow-packet"></div>
    </div>
    <div class="flow-controls">
        <button class="md-button md-button--primary flow-btn trace-btn">Trace Request</button>
        <button class="md-button flow-btn reset-btn">Reset</button>
    </div>
</div>
