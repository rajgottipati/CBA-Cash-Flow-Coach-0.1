/**
 * DESIGN ARTIFACT: LangGraph Orchestration Definition
 * ---------------------------------------------------
 * This file represents the blueprint for the Python-based backend orchestration.
 * It demonstrates how we structure the deterministic state machine using LangGraph
 * to ensure auditability and prevent infinite agent loops in a banking context.
 */

export type AgentState = {
  messages: Array<{ role: string; content: string }>;
  context: {
    customerId: string;
    financialData?: any;
    riskScore?: number;
    sessionId: string;
  };
  nextStep: string;
  errors: string[];
};

// Definition of the Graph Nodes (Agents & Tools)
export const GRAPH_NODES = {
  SENTINEL: 'sentinel_guard',
  ANALYST: 'financial_analyst',
  STRATEGIST: 'strategic_advisor',
  TRUST_LAYER: 'regulatory_interceptor',
  BANKER: 'product_policy_engine',
  END: '__end__'
} as const;

/**
 * The StateGraph Workflow Definition
 * This mirrors the actual Python implementation using langgraph.graph.StateGraph
 */
export const workflowDefinition = {
  name: "CBA_CashFlow_Coach_Orchestrator",
  type: "StateGraph",
  
  // 1. Define the Nodes
  nodes: [
    {
      id: GRAPH_NODES.SENTINEL,
      description: "Input sanitization, PII redaction, and prompt injection detection.",
      model: "llama-guard-3",
      timeout: "2s"
    },
    {
      id: GRAPH_NODES.ANALYST,
      description: "Deterministic Python forecasting (Prophet/Pandas). No LLM hallucination allowed on math.",
      runtime: "python:3.11"
    },
    {
      id: GRAPH_NODES.STRATEGIST,
      description: "RAG retrieval from VectorDB for industry benchmarks.",
      model: "gpt-4o"
    },
    {
      id: GRAPH_NODES.TRUST_LAYER,
      description: "ASIC RG 244 Compliance Check. Modifies 'advice' to 'information'.",
      type: "Interceptor"
    },
    {
      id: GRAPH_NODES.BANKER,
      description: "Nexus Policy Gate. Checks credit eligibility before product offer.",
      integration: "Legacy_SAP_Adapter"
    }
  ],

  // 2. Define the Edges (Control Flow)
  edges: [
    // Entry Point -> Sentinel
    { from: "__start__", to: GRAPH_NODES.SENTINEL },
    
    // Sentinel Conditional Routing
    { 
      from: GRAPH_NODES.SENTINEL, 
      to: GRAPH_NODES.ANALYST, 
      condition: (state: AgentState) => state.errors.length === 0 
    },
    { 
      from: GRAPH_NODES.SENTINEL, 
      to: GRAPH_NODES.END, 
      condition: (state: AgentState) => state.errors.length > 0 
    },

    // Linear Flow: Analyst -> Strategist -> Trust Layer
    { from: GRAPH_NODES.ANALYST, to: GRAPH_NODES.STRATEGIST },
    { from: GRAPH_NODES.STRATEGIST, to: GRAPH_NODES.TRUST_LAYER },

    // Trust Layer -> Banker
    { from: GRAPH_NODES.TRUST_LAYER, to: GRAPH_NODES.BANKER },

    // Banker -> End
    { from: GRAPH_NODES.BANKER, to: GRAPH_NODES.END }
  ]
};

// Pseudo-code for the Compiler (Python side)
/*
const app = new StateGraph(AgentState)
  .addNode(GRAPH_NODES.SENTINEL, runSentinel)
  .addNode(GRAPH_NODES.ANALYST, runAnalyst)
  .addNode(GRAPH_NODES.STRATEGIST, runStrategist)
  .addNode(GRAPH_NODES.TRUST_LAYER, runTrustCheck)
  .addNode(GRAPH_NODES.BANKER, runBanker)
  .addEdge(START, GRAPH_NODES.SENTINEL)
  .addConditionalEdges(GRAPH_NODES.SENTINEL, routeSafety)
  .addEdge(GRAPH_NODES.ANALYST, GRAPH_NODES.STRATEGIST)
  .addEdge(GRAPH_NODES.STRATEGIST, GRAPH_NODES.TRUST_LAYER)
  .addEdge(GRAPH_NODES.TRUST_LAYER, GRAPH_NODES.BANKER)
  .addEdge(GRAPH_NODES.BANKER, END)
  .compile();
*/
