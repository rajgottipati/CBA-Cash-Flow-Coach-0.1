
import { LoanApplication, Industry } from '../types';

const BUSINESS_PREFIXES = ['Alpha', 'Nexus', 'Global', 'Prime', 'Elite', 'Green', 'Tech', 'Iron', 'Golden', 'Silver'];
const BUSINESS_SUFFIXES = ['Solutions', 'Logistics', 'Retail', 'Systems', 'Holdings', 'Ventures', 'Labs', 'Group', 'Partners'];
const DESCRIPTIONS = [
  "Requesting capital for inventory expansion during the holiday season.",
  "Seeking funds to upgrade manufacturing equipment and automate assembly lines.",
  "Working capital required to hire 3 new senior developers for upcoming project.",
  "Refinancing existing high-interest debt to improve monthly cash flow.",
  "Opening a new storefront in the downtown district to capture foot traffic.",
  "Investment in new marketing campaign to target enterprise clients.",
  "Urgent need for cash flow due to delayed payments from a major client.",
  "Expansion into international markets, specifically Southeast Asia."
];

export const generateMockApplication = (): LoanApplication => {
  const industry = Object.values(Industry)[Math.floor(Math.random() * Object.values(Industry).length)];
  const name = `${BUSINESS_PREFIXES[Math.floor(Math.random() * BUSINESS_PREFIXES.length)]} ${BUSINESS_SUFFIXES[Math.floor(Math.random() * BUSINESS_SUFFIXES.length)]}`;
  
  // Weighted random for credit score to be somewhat realistic
  const creditScore = Math.floor(Math.random() * (850 - 450) + 450);
  
  return {
    id: `LN-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
    businessName: name,
    applicantName: "John Doe", 
    revenue: Math.floor(Math.random() * (5000000 - 30000) + 30000),
    requestedAmount: Math.floor(Math.random() * (100000 - 5000) + 5000),
    creditScore,
    industry,
    description: DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)],
    applicationDate: new Date().toISOString(),
  };
};
