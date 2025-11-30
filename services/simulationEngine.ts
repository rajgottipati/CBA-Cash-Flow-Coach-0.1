
import { AgentNode, TrustEvent, AppContext } from '../types';

type Listener = (node: AgentNode, log: TrustEvent | null, text: string | null, uiUpdate: any | null) => void;

class SimulationEngine {
  private listeners: Listener[] = [];

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private emit(node: AgentNode, log: TrustEvent | null, text: string | null, uiUpdate: any | null) {
    this.listeners.forEach(l => l(node, log, text, uiUpdate));
  }

  private wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async runPersonalScenario() {
    // 1. START
    this.emit('START', null, null, { showProposal: false, executionStatus: 'IDLE' });
    await this.wait(500);

    // 2. SENTINEL
    this.emit('SENTINEL', {
      id: Date.now().toString(),
      timestamp: Date.now(),
      category: 'SYSTEM',
      message: 'Sentinel: Scanning input for PII & Jailbreaks...',
      status: 'INFO'
    }, null, null);
    await this.wait(600);
    this.emit('SENTINEL', {
      id: Date.now().toString(),
      timestamp: Date.now(),
      category: 'PII',
      message: 'Sentinel: No PII detected. Content safe.',
      status: 'PASS',
      metadata: { scan_depth: 'deep', threat_detected: false }
    }, null, null);

    // 3. ANALYST
    await this.wait(500);
    this.emit('ANALYST', {
      id: Date.now().toString(),
      timestamp: Date.now(),
      category: 'SYSTEM',
      message: 'Analyst: Aggregating cross-account liquidity...',
      status: 'INFO'
    }, null, null);
    await this.wait(800);
    this.emit('ANALYST', {
      id: Date.now().toString(),
      timestamp: Date.now(),
      category: 'SYSTEM',
      message: 'Analyst: Anomaly detected (Excess Cash).',
      status: 'WARN',
      metadata: { account: 'Everyday Acct', balance: 5000, threshold: 1000 }
    }, "I'm analyzing your recent inflows. I've detected a $5,000 salary bonus sitting in your Transaction Account earning 0.1% interest.", null);
    await this.wait(1500);

    // 4. STRATEGIST
    this.emit('STRATEGIST', {
      id: Date.now().toString(),
      timestamp: Date.now(),
      category: 'SYSTEM',
      message: 'Strategist: Querying VectorDB for investment options...',
      status: 'INFO'
    }, null, null);
    await this.wait(800);
    this.emit('STRATEGIST', {
        id: Date.now().toString(),
        timestamp: Date.now(),
        category: 'SYSTEM',
        message: 'Strategist: RAG Retrieval Complete.',
        status: 'PASS',
        metadata: { source: 'CommSec Pocket PDS', match_score: 0.94 }
    }, "Considering your 'Balanced' risk profile, this cash is effectively losing value against inflation.", null);
    await this.wait(1500);

    // 5. NEXUS
    this.emit('NEXUS', {
      id: Date.now().toString(),
      timestamp: Date.now(),
      category: 'NEXUS',
      message: 'Nexus: Evaluating Risk Profile Compatibility...',
      status: 'INFO'
    }, null, null);
    await this.wait(800);
    this.emit('NEXUS', {
      id: Date.now().toString(),
      timestamp: Date.now(),
      category: 'NEXUS',
      message: 'Nexus: POLICY CHECK PASSED.',
      status: 'PASS',
      metadata: { user_risk: 'Balanced', product_risk: 'Medium', outcome: 'SUITABLE' }
    }, null, null);
    await this.wait(1000);

    // 6. OUTPUT
    this.emit('OUTPUT', {
      id: Date.now().toString(),
      timestamp: Date.now(),
      category: 'REGULATORY',
      message: 'Regulatory: Advice converted to General Information (RG 244).',
      status: 'PASS'
    }, "You could consider moving $4,000 into your CommSec Core ETF. Based on past performance, this could generate an estimated ~$300/yr return vs $4 in your current account.", { showProposal: true, proposalType: 'ETF_MOVE' });
  }

  async runBusinessScenario() {
     // 1. START
     this.emit('START', null, null, { showProposal: false, executionStatus: 'IDLE' });
     await this.wait(500);
 
     // 2. SENTINEL
     this.emit('SENTINEL', {
       id: Date.now().toString(),
       timestamp: Date.now(),
       category: 'PII',
       message: 'Sentinel: Masking TFN pattern in context...',
       status: 'PASS',
       metadata: { masked_fields: ['TFN'] }
     }, null, null);
     await this.wait(800);
 
     // 3. ANALYST
     this.emit('ANALYST', {
       id: Date.now().toString(),
       timestamp: Date.now(),
       category: 'SYSTEM',
       message: 'Analyst: Running Prophet Forecasting Model...',
       status: 'INFO'
     }, null, null);
     await this.wait(1000);
     this.emit('ANALYST', {
         id: Date.now().toString(),
         timestamp: Date.now(),
         category: 'SYSTEM',
         message: 'Analyst: Shortfall Predicted (-$2000).',
         status: 'FAIL',
         metadata: { date: '2025-11-15', cause: 'Tax Bill' }
     }, "I've projected your cash flow. You have a $12,000 tax bill due on the 15th, which will cause a shortfall of -$2,000.", null);
     await this.wait(1500);
 
     // 4. BANKER
     this.emit('BANKER', {
       id: Date.now().toString(),
       timestamp: Date.now(),
       category: 'SYSTEM',
       message: 'Banker: Checking product catalog...',
       status: 'INFO'
     }, "We can bridge this gap without penalty.", null);
     await this.wait(1000);
 
     // 5. NEXUS
     this.emit('NEXUS', {
       id: Date.now().toString(),
       timestamp: Date.now(),
       category: 'NEXUS',
       message: 'Nexus: Checking Credit Eligibility...',
       status: 'INFO'
     }, null, null);
     await this.wait(800);
     this.emit('NEXUS', {
       id: Date.now().toString(),
       timestamp: Date.now(),
       category: 'NEXUS',
       message: 'Nexus: APPROVED. Serviceability Verified.',
       status: 'PASS',
       metadata: { credit_score: 720, min_score: 600, product: 'BizOverdraft' }
     }, null, null);
     await this.wait(1000);
 
     // 6. OUTPUT
     this.emit('OUTPUT', {
       id: Date.now().toString(),
       timestamp: Date.now(),
       category: 'REGULATORY',
       message: 'Regulatory: Offer generated with PDS link.',
       status: 'PASS'
     }, "I have a pre-approved Business Overdraft of $10,000 ready to activate. This will cover the tax bill and keep you cash positive.", { showProposal: true, proposalType: 'OVERDRAFT' });
  }

  async executeProposal() {
    this.emit('OUTPUT', null, null, { executionStatus: 'PROCESSING' });
    
    await this.wait(1500);
    
    this.emit('NEXUS', {
        id: Date.now().toString(),
        timestamp: Date.now(),
        category: 'NEXUS',
        message: 'Nexus: Executing Transaction...',
        status: 'INFO',
        metadata: { auth_method: 'Step-Up', status: 'PENDING' }
    }, null, null);

    await this.wait(1500);

    this.emit('NEXUS', {
        id: Date.now().toString(),
        timestamp: Date.now(),
        category: 'NEXUS',
        message: 'Nexus: Transaction Settled.',
        status: 'PASS',
        metadata: { txn_id: 'TX-9983-22', status: 'CONFIRMED' }
    }, null, { executionStatus: 'SUCCESS' });
  }
}

export const simulationEngine = new SimulationEngine();
