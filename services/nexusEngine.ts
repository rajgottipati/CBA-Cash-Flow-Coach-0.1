
import { AppConfig, LoanApplication, EngineResult, PolicyResult, RiskResult, GenAIResult, DecisionStatus, Industry } from '../types';

// Engine 1: Policy Engine (Deterministic)
const runPolicyEngine = (app: LoanApplication, config: AppConfig): PolicyResult => {
  const reasons: string[] = [];
  const checklist: { rule: string; passed: boolean }[] = [];
  
  // Rule 1: Revenue
  const revPass = app.revenue >= 50000;
  checklist.push({ rule: "Min Revenue > $50k", passed: revPass });
  if (!revPass) reasons.push("Annual Revenue below minimum threshold ($50k)");
  
  // Rule 2: Credit Score
  const scorePass = app.creditScore >= config.minCreditScore;
  checklist.push({ rule: `Credit Score > ${config.minCreditScore}`, passed: scorePass });
  if (!scorePass) reasons.push(`Credit Score (${app.creditScore}) below policy minimum`);
  
  // Rule 3: Industry
  let indPass = true;
  if (config.strictIndustryChecking && app.industry === Industry.GAMBLING) {
    indPass = false;
    reasons.push("Industry 'Gambling' is restricted");
  }
  checklist.push({ rule: "Restricted Industry Check", passed: indPass });

  return {
    passed: reasons.length === 0,
    reasons,
    checklist
  };
};

// Engine 2: AWS Sagemaker Risk Model (Predictive - Mocked)
const runRiskEngine = (app: LoanApplication): RiskResult => {
  // Mock logic: Lower credit score = higher risk generally
  const baseProb = (850 - app.creditScore) / 850; 
  const noise = (Math.random() * 0.2) - 0.1;
  let prob = Math.max(0, Math.min(1, baseProb + noise));
  
  // Adjust for "good" industries
  if (app.industry === Industry.TECH || app.industry === Industry.MANUFACTURING) {
    prob -= 0.1;
  }
  
  prob = Math.max(0, prob);

  let level: 'Low' | 'Medium' | 'High' = 'Medium';
  if (prob < 0.2) level = 'Low';
  else if (prob > 0.6) level = 'High';

  // Mock SHAP values (features contributing to the score)
  const shapValues = [
    { feature: 'Credit History', impact: (app.creditScore > 700 ? -0.25 : 0.3) },
    { feature: 'Revenue Stability', impact: (app.revenue > 200000 ? -0.15 : 0.05) },
    { feature: 'Sector Risk', impact: (['Retail', 'Hospitality'].includes(app.industry) ? 0.1 : -0.05) },
    { feature: 'Debt Ratio', impact: Math.random() * 0.2 - 0.1 },
  ].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  return {
    score: Math.floor((1 - prob) * 100),
    probabilityOfDefault: parseFloat(prob.toFixed(3)),
    level,
    shapValues
  };
};

// Engine 3: Anthropic Claude 3.5 (Bedrock) Analyzer (GenAI - Mocked)
const runGenAIEngine = (app: LoanApplication): GenAIResult => {
  const keywords = app.description.toLowerCase();
  const flags: string[] = [];
  
  if (keywords.includes('debt') || keywords.includes('refinance')) {
    flags.push("Refinancing existing debt");
  }
  if (keywords.includes('urgent')) {
    flags.push("Urgency detected - potential cash flow distress");
  }
  if (keywords.includes('gamble') || keywords.includes('casino')) {
     flags.push("High risk keyword detected in description");
  }

  const sentiment = flags.length > 0 ? 'Neutral' : 'Positive';
  
  // Generate a mock reasoning string
  let reasoning = "";
  if (sentiment === 'Positive') {
      reasoning = "Applicant demonstrates clear growth intent (expansion/assets) with no linguistic markers of financial distress.";
  } else {
      reasoning = `Detected caution markers related to: ${flags.join(', ')}. Context suggests defensive capital usage.`;
  }

  return {
    summary: `Applicant ${app.businessName} (${app.industry}) seeks $${app.requestedAmount.toLocaleString()} for: "${app.description}".`,
    flags,
    sentiment,
    reasoning
  };
};

// Orchestrator
export const evaluateLoan = (app: LoanApplication, config: AppConfig): EngineResult => {
  const policy = runPolicyEngine(app, config);
  const risk = runRiskEngine(app);
  const genAi = runGenAIEngine(app);

  let finalStatus = DecisionStatus.HITL_REVIEW;

  if (!policy.passed) {
    // Scenario 1: Policy Fail -> HITL_REVIEW (Was AUTO_DECLINE)
    // We want the Banker to see the failure and decide manually.
    finalStatus = DecisionStatus.HITL_REVIEW;
  } else if (risk.level === 'Low' && genAi.flags.length === 0 && app.requestedAmount <= config.maxLoanAmount) {
    // Scenario 2: Policy PASS + Risk LOW + GenAI CLEAN -> Auto Approve
    finalStatus = DecisionStatus.AUTO_APPROVE;
  } else {
    // Scenario 3: Policy PASS but Risk HIGH/MEDIUM or GenAI Flags -> HITL
    finalStatus = DecisionStatus.HITL_REVIEW;
  }

  return {
    applicationId: app.id,
    policy,
    risk,
    genAi,
    finalStatus,
    timestamp: new Date().toISOString()
  };
};
