import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

const diagramDefinition = `
graph TB
  %% Styles
  classDef container fill:#0f172a,stroke:#1e293b,color:#fff
  classDef component fill:#1e293b,stroke:#334155,color:#cbd5e1
  classDef trust fill:#064e3b,stroke:#059669,color:#ecfdf5
  classDef agent fill:#422006,stroke:#eab308,color:#fefce8

  User[Business Customer] --> UI[React Chat UI]
  UI --> Supervisor[Global Supervisor<br/>XState Machine]

  subgraph "Orchestra Secure Enclave (VPC)"
    direction TB

    Supervisor --> Agents

    subgraph Agents [Agent Pool]
      direction TB
      Analyst[Analyst Agent<br/>Python Forecast]:::agent
      Strategist[Strategist Agent<br/>RAG + Vector DB]:::agent
      Banker[Banker Agent<br/>Nexus Policy]:::agent
      Sentinel[Sentinel Agent<br/>Security]:::agent
    end

    Agents --> Trust

    subgraph Trust [Trust & Governance Layer]
      direction TB
      PII[PII Redaction]:::trust
      Reg[Regulatory Check]:::trust
      Policy[Nexus Policy Gate]:::trust
    end

    Trust --> Integration
  end

  subgraph Integration [Integration Layer]
    Legacy[Legacy Adapter<br/>SAP/Oracle]:::component
    ModelGW[Model Gateway<br/>LiteLLM]:::component
  end

  Trust --> ModelGW
  Policy --> Legacy
`;

export const ArchitectureView: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    const renderChart = async () => {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          fontFamily: 'Inter, sans-serif',
          themeVariables: {
            darkMode: true,
            background: '#020617',
            primaryColor: '#eab308',
            secondaryColor: '#10b981',
            tertiaryColor: '#1e293b',
            lineColor: '#64748b',
            fontSize: '14px'
          }
        });
        
        const { svg } = await mermaid.render('mermaid-chart-' + Date.now(), diagramDefinition);
        setSvgContent(svg);
      } catch (error) {
        console.error("Mermaid failed to render", error);
      }
    };

    renderChart();
  }, []);

  return (
    <div className="flex-1 bg-slate-900 p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">System Architecture</h2>
          <p className="text-slate-400">High-level view of the Multi-Agent Orchestra with Trust Layer integration.</p>
        </div>

        {/* Diagram Container */}
        <div className="bg-slate-950 rounded-xl p-8 border border-slate-800 relative overflow-hidden flex justify-center min-h-[400px]">
           {svgContent ? (
             <div 
               ref={chartRef} 
               className="w-full flex justify-center"
               dangerouslySetInnerHTML={{ __html: svgContent }}
             />
           ) : (
             <div className="flex items-center justify-center text-slate-500">
               Loading Architecture Diagram...
             </div>
           )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-slate-800 rounded border border-slate-700">
             <h3 className="text-white font-bold mb-2">Key Design Principles</h3>
             <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
               <li>Deterministic Supervision (XState) to prevent infinite agent loops.</li>
               <li>"Trust Layer" intercepts prompt before it hits the LLM (PII sanitization).</li>
               <li>Nexus Policy Gate ensures no product offers bypass credit checks.</li>
             </ul>
          </div>
          <div className="p-4 bg-slate-800 rounded border border-slate-700">
             <h3 className="text-white font-bold mb-2">Tech Stack</h3>
             <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
               <li><strong>Frontend:</strong> React + Tailwind + Recharts</li>
               <li><strong>Orchestrator:</strong> Python/LangGraph (Mocked here)</li>
               <li><strong>LLM Gateway:</strong> LiteLLM (Bedrock/OpenAI)</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};