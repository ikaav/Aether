# Repository Tour

## 🎯 What This Repository Does

**Aether** is an AI-powered development system that generates a complete habit-tracking application using 21 specialized agents. This repository contains the orchestration system that transforms a detailed product specification into a fully functional privacy-first habit tracker.

**Key responsibilities:**
- Orchestrate 21 specialized AI agents to generate application code
- Convert product specifications into prioritized requirements and milestones
- Generate backend services, mobile apps, database schemas, and deployment configurations
- Produce a complete habit-tracking application focused on privacy, sleep protection, and non-gambling reward mechanics

---

## 🏗️ Architecture Overview

### System Context
```
[Product Specification] → [Agent Orchestration System] → [Generated Aether Application]
                                    ↓
                            [Development Artifacts]
```

### Key Components
- **PM Agent** - Converts specifications to prioritized requirements and milestones
- **Architecture Agent** - Creates system design, technology choices, and scaffolding plans
- **Backend Agent** - Generates Node.js/TypeScript API services with session management
- **Frontend Agent** - Creates React Native mobile application with timer and habit management
- **Database Agent** - Produces PostgreSQL migrations and optimized schemas
- **Session Engine Agent** - Implements core habit session state machine and reward logic
- **UI Design Agent** - Creates design tokens, component specifications, and accessibility guidelines
- **Testing Agents** - Generate comprehensive test suites for all components
- **Deployment Agents** - Handle CI/CD pipelines and infrastructure as code

### Data Flow
1. **Specification Input** - `spec.txt` defines complete Aether application requirements (1000+ lines)
2. **Agent Orchestration** - `agent.toml` coordinates execution of 21 specialized agents
3. **Requirements Generation** - PM agent creates prioritized features → `artifacts/pm.json`
4. **Architecture Planning** - Architecture agent creates system design and scaffolding
5. **Code Generation** - Specialized agents generate application code → `workspace/` directory
6. **Integration & Deployment** - Testing and deployment agents handle final assembly

---

## 📁 Project Structure [Partial Directory Tree]

```
aether/
├── agent.toml                 # Main orchestration config (imports all 21 agents)
├── spec.txt                   # Complete technical specification (1000+ lines)
├── agents/                    # Individual agent configurations
│   ├── pm.toml               # Product management agent
│   ├── arch.toml             # Architecture design agent
│   ├── backend.toml          # Backend code generation
│   ├── frontend.toml         # React Native app generation
│   ├── db.toml               # Database schema generation
│   ├── session-engine.toml   # Core session logic
│   ├── ui-design.toml        # Design system generation
│   ├── tests.toml            # Test suite generation
│   ├── ci.toml               # CI/CD pipeline generation
│   ├── deploy.toml           # Infrastructure deployment
│   └── [16 more agents]      # Specialized agents for different aspects
├── artifacts/                # Generated development artifacts
│   └── pm.json              # Product management output (features, milestones)
└── workspace/                # Target directory for generated application code
```

### Key Files to Know

| File | Purpose | When You'd Touch It |
|------|---------|---------------------|
| `spec.txt` | Complete Aether application specification | Defining new features or changing requirements |
| `agent.toml` | Main orchestration configuration | Adding new agents or changing execution order |
| `agents/pm.toml` | Product management agent config | Modifying requirement generation logic |
| `agents/arch.toml` | Architecture agent configuration | Changing technology stack or system design |
| `agents/backend.toml` | Backend generation configuration | Customizing API generation or server logic |
| `agents/frontend.toml` | Frontend generation configuration | Modifying mobile app generation |
| `artifacts/pm.json` | Generated product requirements | Reviewing current feature priorities |

---

## 🔧 Technology Stack

### Development System Stack
- **Orchestration:** TOML configuration files with agent imports
- **AI Models:** GPT-5 for high-complexity agents, GPT-4 for simpler tasks
- **Tools:** Filesystem access, Git integration, Shell execution
- **Output Formats:** JSON artifacts, Git patches, Complete file generation

### Generated Application Stack (Aether)
- **Backend:** Node.js + TypeScript + Express + TypeORM
- **Database:** PostgreSQL with Redis for caching and queues
- **Mobile:** React Native + TypeScript for cross-platform
- **iOS Native:** SwiftUI with Core Data and CloudKit integration
- **Android Native:** Kotlin with Room database and WorkManager
- **Desktop Helper:** Electron (optional privacy-preserving window monitoring)
- **Cloud:** AWS/GCP with serverless functions for batch processing
- **API:** REST with GraphQL consideration for complex queries

### Key Libraries (Generated Application)
- **Authentication** - OAuth2 + JWT with refresh token flow
- **State Management** - Session state machine with offline sync
- **Privacy** - End-to-end encryption with local-first proof system
- **Notifications** - Respectful nudging with heat-based algorithms
- **Analytics** - Privacy-preserving telemetry with user consent

---

## 🔄 Agent Execution Workflows

### Full Application Generation
1. **Specification Review** - Analyze `spec.txt` for complete requirements
2. **Product Planning** - PM agent generates features and milestones
3. **Architecture Design** - Architecture agent creates system design and tech stack
4. **Code Generation** - Backend, frontend, database agents generate application code
5. **Integration** - Testing agents create comprehensive test suites
6. **Deployment** - CI/CD agents generate deployment pipelines

**Agent path:** `spec.txt` → `pm` → `arch` → `backend|frontend|db` → `tests` → `ci|deploy`

### Incremental Feature Development
1. **Specification Update** - Modify `spec.txt` with new requirements
2. **Requirement Analysis** - Re-run PM agent to update priorities
3. **Selective Generation** - Run specific agents for affected components
4. **Integration Testing** - Update test suites for new functionality

**Agent path:** `spec.txt` → `pm` → `[specific agents]` → `tests`

### Architecture Changes
1. **Technology Updates** - Modify architecture agent configuration
2. **Cascade Generation** - Re-run all dependent agents
3. **Migration Planning** - Generate migration scripts and deployment updates
4. **Validation** - Comprehensive testing of architectural changes

**Agent path:** `arch` → `backend|frontend|db|session-engine` → `tests|ci|deploy`

---

## 🎯 Generated Application Overview (Aether)

The generated Aether application is a privacy-first habit tracker with unique characteristics:

### Core Principles
- **Privacy First** - Local processing by default, optional cloud sync with encryption
- **Sleep Protection** - Hard constraints preventing late-night usage abuse
- **Non-Gambling Rewards** - Predictable token system without randomization
- **Gentle Recovery** - Focus on restart speed rather than streak preservation
- **Cognitive Load Reduction** - Maximum 3 active habits, passive inference

### Key Features
- **Session Timer** - Floor/target/stretch phases with adaptive adjustments
- **Token Rewards** - Deterministic unlocks for cosmetics and content
- **Multi-Device Sync** - Conflict resolution for overlapping sessions
- **Proof System** - Optional verification with local-only photo hashing
- **Heat-Based Nudging** - Context-aware gentle reminders

### Target Metrics
- Median open-to-start time < 20 seconds
- Floor completion rate > 70% after 4 weeks
- Restart latency ≤ 1 day after missed sessions
- Nighttime salvage rate < 5% of completions

---

*Updated at: 2025-01-27 UTC*