# ADR-001: Deterministic State Machine for Agent Orchestration

**Status:** Accepted  
**Date:** 2024-05-20  
**Context:** Principal Engineering / VRM Platform  

## Context
We are building the "Virtual Relationship Manager" (VRM), a Generative AI system that interacts directly with business banking customers. The system must coordinate multiple specialized agents (Analyst, Strategist, Banker) to provide financial insights and product offers.

We evaluated two primary patterns for orchestrating these agents:
1. **Autonomous Loops (e.g., AutoGPT, BabyAGI):** Agents autonomously determine their next steps and tools until a goal is met.
2. **Deterministic State Machines (e.g., LangGraph, XState):** A predefined graph where nodes are agents and edges are strict transition rules.

## Decision
We have decided to use **Deterministic State Machines (LangGraph)** for the VRM platform.

## Reasoning

### 1. Safety & Compliance (Primary Driver)
In a regulated banking environment, we cannot allow an AI agent to enter an infinite loop or call tools in an unpredictable order. Autonomous loops are non-deterministic and difficult to audit. A State Graph forces the agent to follow a strict approval chain (e.g., Output -> Trust Layer -> Policy Gate -> User).

### 2. Predictability of "The Trust Layer"
We require a mandatory "Trust Layer" step before any content reaches the user.
- **Autonomous:** The agent *might* decide to call the Trust tool, but it's not guaranteed.
- **State Machine:** The graph edge `Strategist -> Trust Layer` is hardcoded. It is physically impossible for the agent to bypass this step.

### 3. Debugging & Observability
State machines provide a clear trace of execution: `State A -> State B -> State C`. If an error occurs, we know exactly which transition failed. Autonomous loops produce opaque "thought traces" that are harder to debug in production.

## Consequences

### Positive
- **Guaranteed Compliance:** Logic gates (Nexus Policy) are architectural, not prompt-based.
- **Auditability:** Every state transition can be logged to the immutable audit ledger.
- **Latency Control:** We can enforce timeouts on specific nodes (e.g., 2s limit for Sentinel).

### Negative
- **Reduced Creativity:** The agents cannot invent new workflows on the fly to solve novel problems.
- **Higher Maintenance:** The graph structure must be updated manually as new agents are added.

## Implementation Strategy
We will use **LangGraph** (Python) for the backend runtime to define the `StateGraph`. The frontend will mirror this state for UI visualization using `XState` or simple React state management.
