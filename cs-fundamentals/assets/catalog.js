window.CS_FUNDAMENTALS_TOPICS = [
  {
    slug: "cpu-architecture",
    title: "CPU Architecture",
    shortTitle: "CPU",
    category: "hardware",
    categoryLabel: "Hardware",
    description:
      "Fetch-decode-execute, pipelining, out-of-order execution, branch prediction, caches (MESI), SIMD, speculative execution.",
  },
  {
    slug: "memory-hierarchy",
    title: "Memory Hierarchy & RAM",
    shortTitle: "Memory",
    category: "hardware",
    categoryLabel: "Hardware",
    description:
      "Latency numbers every engineer must know, DRAM, virtual memory, TLB, page faults, mmap, CoW, allocators, garbage collection.",
  },
  {
    slug: "storage-io",
    title: "Storage & I/O",
    shortTitle: "Storage",
    category: "hardware",
    categoryLabel: "Hardware",
    description:
      "HDD vs SSD internals, NVMe, RAID, filesystems, WAL, durability guarantees, and fsync trade-offs.",
  },
  {
    slug: "processes",
    title: "Processes",
    shortTitle: "Processes",
    category: "os",
    categoryLabel: "OS",
    description:
      "PCB, process states, fork/exec, CoW, memory layout, CFS scheduler, context switching, and IPC.",
  },
  {
    slug: "threads-concurrency",
    title: "Threads & Concurrency",
    shortTitle: "Threads",
    category: "os",
    categoryLabel: "OS",
    description:
      "Threads vs processes, synchronization primitives, deadlock, livelock, event loops, async I/O, and concurrency models.",
  },
  {
    slug: "kernel-syscalls",
    title: "Kernel & System Calls",
    shortTitle: "Kernel",
    category: "os",
    categoryLabel: "OS",
    description:
      "Kernel vs user space, syscall mechanics, Linux subsystems, namespaces, and cgroups.",
  },
  {
    slug: "linux-internals",
    title: "Linux Internals",
    shortTitle: "Linux",
    category: "os",
    categoryLabel: "OS",
    description:
      "Boot process, systemd, proc/sys, debugging tools, permissions, and kernel security primitives.",
  },
  {
    slug: "encoding-serialization",
    title: "Encoding & Serialization",
    shortTitle: "Encoding",
    category: "os",
    categoryLabel: "OS",
    description:
      "UTF-8, IEEE 754, Base64, protobuf vs JSON vs Avro, compression, and schema evolution.",
  },
  {
    slug: "networking-layers",
    title: "Network Models & Layers",
    shortTitle: "Layers",
    category: "network",
    categoryLabel: "Networking",
    description:
      "OSI, TCP/IP, encapsulation, Ethernet, ARP, VLANs, IPv4/IPv6, ICMP, BGP, and OSPF.",
  },
  {
    slug: "tcp-deep-dive",
    title: "TCP Deep Dive",
    shortTitle: "TCP",
    category: "network",
    categoryLabel: "Networking",
    description:
      "Handshake, state machine, congestion control, sliding windows, Nagle, TIME_WAIT, and QUIC motivation.",
  },
  {
    slug: "dns",
    title: "DNS",
    shortTitle: "DNS",
    category: "network",
    categoryLabel: "Networking",
    description:
      "Resolution flow, record types, DNSSEC, DoH/DoT, amplification, split-horizon, and service discovery.",
  },
  {
    slug: "http-protocol",
    title: "HTTP & Web Protocols",
    shortTitle: "HTTP",
    category: "network",
    categoryLabel: "Networking",
    description:
      "HTTP/1.1 to 3, status codes, caching, WebSockets, SSE, gRPC, and transport trade-offs.",
  },
  {
    slug: "browser-internals",
    title: "Browser Internals",
    shortTitle: "Browser",
    category: "web",
    categoryLabel: "Web",
    description:
      "Rendering pipeline, V8 internals, event loop, task queues, service workers, and Core Web Vitals.",
  },
  {
    slug: "web-security",
    title: "Web Security",
    shortTitle: "Web Sec",
    category: "web",
    categoryLabel: "Web",
    description:
      "SOP, CORS, XSS, CSRF, CSP, cookies, clickjacking, SSRF, and common browser attack surfaces.",
  },
  {
    slug: "symmetric-encryption",
    title: "Symmetric Encryption",
    shortTitle: "Crypto",
    category: "security",
    categoryLabel: "Security",
    description:
      "AES-GCM, ChaCha20-Poly1305, hashing, HMAC, KDFs, digital signatures, and applied crypto trade-offs.",
  },
  {
    slug: "tls-https",
    title: "TLS & HTTPS",
    shortTitle: "TLS",
    category: "security",
    categoryLabel: "Security",
    description:
      "TLS 1.2 vs 1.3, certificate chains, PFS, cipher suites, mTLS, and ACME automation.",
  },
  {
    slug: "authentication",
    title: "Authentication & Authorization",
    shortTitle: "Auth",
    category: "security",
    categoryLabel: "Security",
    description:
      "JWT pitfalls, OAuth 2.0, PKCE, OIDC, SAML, WebAuthn, RBAC, and ABAC.",
  },
  {
    slug: "data-structures-linear",
    title: "Arrays, Lists, Stacks & Queues",
    shortTitle: "Linear DS",
    category: "ds",
    categoryLabel: "Data Structures",
    description:
      "Contiguous vs linked layouts, ring buffers, amortized resizing, and queue/stack trade-offs.",
  },
  {
    slug: "hash-tables",
    title: "Hash Tables",
    shortTitle: "Hash Tables",
    category: "ds",
    categoryLabel: "Data Structures",
    description:
      "Hash functions, collisions, probing strategies, load factor, consistent hashing, and runtime behavior.",
  },
  {
    slug: "trees-data-structures",
    title: "Trees",
    shortTitle: "Trees",
    category: "ds",
    categoryLabel: "Data Structures",
    description:
      "BST, AVL, red-black, B+ trees, heaps, tries, segment trees, and Fenwick trees.",
  },
  {
    slug: "sorting-algorithms",
    title: "Sorting Algorithms",
    shortTitle: "Sorting",
    category: "algo",
    categoryLabel: "Algorithms",
    description:
      "Comparison sorts, stable vs unstable, quicksort, mergesort, heapsort, radix, and Timsort.",
  },
  {
    slug: "graph-algorithms",
    title: "Graph Algorithms",
    shortTitle: "Graphs",
    category: "algo",
    categoryLabel: "Algorithms",
    description:
      "Traversal, shortest paths, spanning trees, SCCs, topological sort, and max flow.",
  },
  {
    slug: "dynamic-programming",
    title: "Dynamic Programming",
    shortTitle: "DP",
    category: "algo",
    categoryLabel: "Algorithms",
    description:
      "Optimal substructure, memoization, tabulation, state design, transition functions, and trade-offs vs greedy.",
  },
  {
    slug: "nosql-databases",
    title: "NoSQL Databases",
    shortTitle: "NoSQL",
    category: "db",
    categoryLabel: "Databases",
    description:
      "Document, key-value, column-family, graph, time-series databases, CAP, and PACELC trade-offs.",
  },
  {
    slug: "database-internals",
    title: "Database Internals",
    shortTitle: "DB Internals",
    category: "db",
    categoryLabel: "Databases",
    description:
      "B-tree vs LSM, WAL, MVCC, buffer pools, query planning, and connection pooling.",
  },
  {
    slug: "caching-strategies",
    title: "Caching Strategies",
    shortTitle: "Caching",
    category: "infra",
    categoryLabel: "Infrastructure",
    description:
      "Cache-aside, write-through, write-behind, eviction policies, stampedes, hot keys, and Redis/CDN design.",
  },
  {
    slug: "message-queues",
    title: "Message Queues & Events",
    shortTitle: "Queues",
    category: "infra",
    categoryLabel: "Infrastructure",
    description:
      "Kafka, RabbitMQ, SQS/SNS, delivery semantics, sagas, event sourcing, and CQRS patterns.",
  },
  {
    slug: "distributed-systems",
    title: "Distributed Systems",
    shortTitle: "Distributed",
    category: "infra",
    categoryLabel: "Infrastructure",
    description:
      "Consensus, clocks, consistency, replication, partitions, 2PC, sagas, and failure models.",
  },
  {
    slug: "docker-containers",
    title: "Docker & Containers",
    shortTitle: "Containers",
    category: "infra",
    categoryLabel: "Infrastructure",
    description:
      "Namespaces, cgroups, overlay filesystems, image construction, runtime isolation, and container networking.",
  },
  {
    slug: "kubernetes",
    title: "Kubernetes",
    shortTitle: "K8s",
    category: "infra",
    categoryLabel: "Infrastructure",
    description:
      "Control plane, workloads, services, networking, autoscaling, scheduling, and deployment strategies.",
  },
  {
    slug: "cloud-computing",
    title: "Cloud Fundamentals",
    shortTitle: "Cloud",
    category: "cloud",
    categoryLabel: "Cloud",
    description:
      "IaaS, PaaS, FaaS, VPCs, IAM, compute, storage, databases, and cost optimization.",
  },
  {
    slug: "cicd-devops",
    title: "CI/CD & DevOps",
    shortTitle: "CI/CD",
    category: "cloud",
    categoryLabel: "Cloud",
    description:
      "Git internals, CI pipelines, deployment strategies, Terraform, GitOps, and immutable infrastructure.",
  },
  {
    slug: "performance-engineering",
    title: "Performance Engineering",
    shortTitle: "Perf",
    category: "perf",
    categoryLabel: "Performance",
    description:
      "Latency percentiles, flame graphs, load testing, throughput limits, N+1 queries, and pooling.",
  },
  {
    slug: "observability",
    title: "Observability",
    shortTitle: "Obs",
    category: "perf",
    categoryLabel: "Performance",
    description:
      "Logs, metrics, traces, Prometheus, Grafana, OpenTelemetry, SLOs, and burn-rate alerting.",
  },
  {
    slug: "system-design",
    title: "System Design",
    shortTitle: "System Design",
    category: "arch",
    categoryLabel: "Architecture",
    description:
      "Requirements, trade-offs, HA, scalability, API design, rate limiting, and resilience patterns.",
  },
  {
    slug: "software-architecture",
    title: "Software Architecture",
    shortTitle: "Software Arch",
    category: "arch",
    categoryLabel: "Architecture",
    description:
      "Monoliths vs microservices, event-driven systems, clean architecture, DDD, and design principles.",
  },
];

window.CS_FUNDAMENTALS_CATEGORY_LABELS = {
  hardware: "Hardware",
  os: "OS",
  network: "Networking",
  web: "Web",
  security: "Security",
  ds: "Data Structures",
  algo: "Algorithms",
  db: "Databases",
  infra: "Infrastructure",
  cloud: "Cloud",
  perf: "Performance",
  arch: "Architecture",
};
