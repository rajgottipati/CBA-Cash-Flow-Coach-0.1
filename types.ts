export type AgentType = 'analyst' | 'strategist' | 'banker' | 'sentinel';
export type AgentStatus = 'idle' | 'thinking' | 'active' | 'error' | 'blocked';

export interface ForecastPoint {
  date: string;
  balance: number;
}

export interface AgentResponseData {
  agent: AgentType;
  text: string;
  confidence?: number;
  forecast?: {
    next_30_days: ForecastPoint[];
    shortfall_date?: string;
    shortfall_amount?: number;
  };
  offer?: {
    product: string;
    limit: number;
    rate: string;
  };
  nexus_check?: {
    status: 'PASS' | 'FAIL';
    reason?: string;
  };
  isError?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  data?: AgentResponseData;
  timestamp: number;
}

export interface TrustStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'success' | 'warning' | 'error';
  details?: string;
  jsonPayload?: any;
}

export interface OrchestrationState {
  isProcessing: boolean;
  activeAgent: AgentType | null;
  trustSteps: TrustStep[];
}