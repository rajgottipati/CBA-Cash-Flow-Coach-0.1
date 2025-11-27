import { AgentType, AgentResponseData, TrustStep, ForecastPoint } from '../types';

// Mock Data Generators
const generateForecast = (): { points: ForecastPoint[], shortfall: number } => {
  const points = [
    { date: "2025-12-01", balance: 45000 },
    { date: "2025-12-08", balance: 38000 },
    { date: "2025-12-15", balance: -2000 },
    { date: "2025-12-22", balance: 15000 }
  ];
  return { points, shortfall: 2000 };
};

export const runOrchestration = (
  input: string, 
  scenario: 'standard' | 'redteam_injection' | 'redteam_pii' | 'ineligible',
  onAgentUpdate: (agent: AgentType, status: 'thinking' | 'idle' | 'active' | 'blocked') => void,
  onTrustUpdate: (steps: TrustStep[]) => void,
  onMessage: (data: AgentResponseData) => void,
  onComplete: () => void
) => {
  let trustSteps: TrustStep[] = [];
  
  const addTrustStep = (step: TrustStep) => {
    trustSteps = [...trustSteps, step];
    onTrustUpdate(trustSteps);
  };

  const updateTrustStep = (id: string, status: 'success' | 'error' | 'warning', details?: string, jsonPayload?: any) => {
    trustSteps = trustSteps.map(s => s.id === id ? { ...s, status, details, jsonPayload } : s);
    onTrustUpdate(trustSteps);
  };

  // 1. INPUT SANITIZATION
  addTrustStep({ id: 'pii', label: 'PII Redaction & Masking', status: 'processing', details: 'Scanning input stream...' });
  
  setTimeout(() => {
    if (scenario === 'redteam_pii') {
      updateTrustStep('pii', 'error', 'BLOCKED: Attempt to access sensitive ID', { risk_score: 0.98, entity: 'TFN' });
      onAgentUpdate('sentinel', 'blocked');
      onMessage({
        agent: 'sentinel',
        text: "I cannot fulfill this request. Accessing specific Tax File Numbers or Customer IDs is restricted by the Data Privacy Policy (DPP-2024).",
        isError: true
      });
      onComplete();
      return;
    }

    updateTrustStep('pii', 'success', 'Input Sanitized', { 
      original: input, 
      masked: input.replace(/\d{3}/g, '***') 
    });

    // 2. SENTINEL CHECK
    addTrustStep({ id: 'sentinel', label: 'Sentinel Guardrails', status: 'processing' });
    onAgentUpdate('sentinel', 'thinking');

    setTimeout(() => {
      if (scenario === 'redteam_injection') {
        updateTrustStep('sentinel', 'error', 'PROMPT INJECTION DETECTED', { threat_type: 'jailbreak', confidence: 0.99 });
        onAgentUpdate('sentinel', 'blocked');
        onMessage({
          agent: 'sentinel',
          text: "🛡️ Security Alert: The request was blocked by the Sentinel Agent due to a suspected prompt injection attack pattern.",
          isError: true
        });
        onComplete();
        return;
      }

      updateTrustStep('sentinel', 'success', 'Policy Check Passed');
      onAgentUpdate('sentinel', 'idle');

      // 3. ANALYST AGENT
      onAgentUpdate('analyst', 'thinking');
      addTrustStep({ id: 'analyst', label: 'Analyst Model (Python)', status: 'processing' });

      setTimeout(() => {
        const { points, shortfall } = generateForecast();
        updateTrustStep('analyst', 'success', 'Forecast Generated', { model: 'Prophet-v2', confidence: 0.92 });
        onAgentUpdate('analyst', 'active');
        
        onMessage({
          agent: 'analyst',
          text: `I've analyzed your transaction patterns. I'm detecting a projected shortfall of $${shortfall.toLocaleString()} on Dec 15th due to the overlap of payroll and supplier payments.`,
          forecast: {
            next_30_days: points,
            shortfall_date: "2025-12-15",
            shortfall_amount: shortfall
          }
        });

        // 4. STRATEGIST
        setTimeout(() => {
          onAgentUpdate('analyst', 'idle');
          onAgentUpdate('strategist', 'thinking');
          addTrustStep({ id: 'strategist', label: 'Strategist (RAG)', status: 'processing' });

          setTimeout(() => {
            updateTrustStep('strategist', 'success', 'Context Retrieved', { source: 'Industry Benchmarks: Retail (Sydney)' });
            onAgentUpdate('strategist', 'active');
            
            onMessage({
              agent: 'strategist',
              text: "Comparing this to similar retail businesses in Sydney, your supplier payment terms (Net 15) are tighter than the industry average (Net 30). This is creating artificial pressure on your cash cycle.",
              confidence: 0.85
            });

            // 5. BANKER & NEXUS GATE
            setTimeout(() => {
              onAgentUpdate('strategist', 'idle');
              onAgentUpdate('banker', 'thinking');
              addTrustStep({ id: 'nexus', label: 'Nexus Policy Gate', status: 'processing', details: 'Checking eligibility...' });

              setTimeout(() => {
                const isEligible = scenario !== 'ineligible';
                
                if (isEligible) {
                  updateTrustStep('nexus', 'success', 'ELIGIBLE', { 
                    credit_score: 720, 
                    threshold: 600,
                    revenue_check: 'PASS',
                    time_in_business: '3 years'
                  });
                  onAgentUpdate('banker', 'active');
                  onMessage({
                    agent: 'banker',
                    text: "Given your strong repayment history and revenue stability, you are pre-approved for a Business Overdraft to cover this gap.",
                    offer: {
                      product: "Business Overdraft",
                      limit: 10000,
                      rate: "8.5% p.a."
                    },
                    nexus_check: { status: 'PASS' }
                  });
                } else {
                   updateTrustStep('nexus', 'warning', 'INELIGIBLE', { 
                    credit_score: 580, 
                    threshold: 600,
                    reason: 'Credit Score below policy threshold'
                  });
                  onAgentUpdate('banker', 'active');
                  onMessage({
                    agent: 'banker',
                    text: "Based on current policy settings, an overdraft isn't available right now. However, I can recommend three cash flow preservation strategies to manage the upcoming shortfall.",
                    nexus_check: { status: 'FAIL', reason: 'Credit Score < Threshold' }
                  });
                }
                
                setTimeout(() => {
                  onAgentUpdate('banker', 'idle');
                  onComplete();
                }, 1000);

              }, 1500);
            }, 1500);
          }, 1500);
        }, 1500);
      }, 1500);
    }, 1000);
  }, 800);
};