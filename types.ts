
export type AppContext = 'BUSINESS' | 'PERSONAL' | 'COACH' | 'ARCHITECTURE' | 'GOVERNANCE';

export type AgentNode = 'START' | 'SENTINEL' | 'ANALYST' | 'STRATEGIST' | 'BANKER' | 'NEXUS' | 'OUTPUT';

export interface TrustEvent {
  id: string;
  timestamp: number;
  category: 'PII' | 'REGULATORY' | 'NEXUS' | 'SYSTEM';
  message: string;
  status: 'PASS' | 'FAIL' | 'WARN' | 'INFO';
  metadata?: any;
}

export interface SimulationState {
  activeNode: AgentNode;
  isRunning: boolean;
  trustLog: TrustEvent[];
  conversation: { role: 'user' | 'assistant'; content: string }[];
  uiState: {
    showProposal: boolean;
    proposalType?: 'ETF_MOVE' | 'OVERDRAFT';
    executionStatus?: 'IDLE' | 'PROCESSING' | 'SUCCESS';
  };
}

export const INITIAL_STATE: SimulationState = {
  activeNode: 'START',
  isRunning: false,
  trustLog: [],
  conversation: [],
  uiState: { showProposal: false, executionStatus: 'IDLE' }
};

// --- Added types for Chat/MockOrchestrator support ---

export type AgentType = 'sentinel' | 'analyst' | 'strategist' | 'banker';

export type AgentStatus = 'idle' | 'thinking' | 'active' | 'blocked' | 'error';

export interface ForecastPoint {
  date: string;
  balance: number;
}

export interface TrustStep {
  id: string;
  label: string;
  status: 'processing' | 'success' | 'error' | 'warning';
  details?: string;
  jsonPayload?: any;
}

export interface AgentResponseData {
  agent: AgentType;
  text: string;
  isError?: boolean;
  confidence?: number;
  forecast?: {
    next_30_days: ForecastPoint[];
    shortfall_date: string;
    shortfall_amount: number;
  };
  offer?: {
    product: string;
    limit: number;
    rate: string;
  };
  nexus_check?: {
    status: string;
    reason?: string;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  data?: AgentResponseData;
}

// --- NEXUS GOVERNANCE TYPES (Integrated) ---

export interface AppConfig {
  minCreditScore: number;
  maxLoanAmount: number;
  aiConfidenceThreshold: number;
  strictIndustryChecking: boolean;
}

export enum Industry {
  RETAIL = 'Retail',
  TECH = 'Technology',
  MANUFACTURING = 'Manufacturing',
  HOSPITALITY = 'Hospitality',
  GAMBLING = 'Gambling',
  CONSTRUCTION = 'Construction',
  LOGISTICS = 'Logistics',
}

export interface LoanApplication {
  id: string;
  businessName: string;
  applicantName: string;
  revenue: number;
  requestedAmount: number;
  creditScore: number;
  industry: Industry;
  description: string;
  applicationDate: string;
}

export enum DecisionStatus {
  AUTO_APPROVE = 'AUTO_APPROVE',
  AUTO_DECLINE = 'AUTO_DECLINE',
  HITL_REVIEW = 'HITL_REVIEW',
}

export interface PolicyResult {
  passed: boolean;
  reasons: string[];
  checklist: { rule: string; passed: boolean }[];
}

export interface RiskResult {
  score: number; // 0-100
  probabilityOfDefault: number; // 0-1.0
  level: 'Low' | 'Medium' | 'High';
  shapValues: { feature: string; impact: number }[];
}

export interface GenAIResult {
  summary: string;
  flags: string[];
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  reasoning: string;
}

export interface EngineResult {
  applicationId: string;
  policy: PolicyResult;
  risk: RiskResult;
  genAi: GenAIResult;
  finalStatus: DecisionStatus;
  timestamp: string;
}

export interface AuditRecord extends EngineResult {
  application: LoanApplication;
  humanOverride?: {
    originalStatus: DecisionStatus;
    finalDecision: 'APPROVED' | 'DECLINED';
    justification: string;
    timestamp: string;
  };
  feedbackLoop?: {
    triggered: boolean;
    type: 'MODEL_RETRAINING' | 'POLICY_ADJUSTMENT';
  };
}
