
import React, { useState, useEffect } from 'react';
import { AppContext, SimulationState, INITIAL_STATE, Message, AgentType, AgentStatus, TrustStep, AgentResponseData } from './types';
import { simulationEngine } from './services/simulationEngine';
import { runOrchestration } from './services/mockOrchestrator';
import { TrustPanel } from './components/TrustPanel';
import { AgentOrchestrator } from './components/AgentOrchestrator';
import { PersonalWealthView } from './components/PersonalWealthView';
import { BusinessCashflowView } from './components/BusinessCashflowView';
import { ArchitectureView } from './components/ArchitectureView';
import { ChatInterface } from './components/ChatInterface';
import { AgentSidebar } from './components/AgentSidebar';
import { NexusGovernanceView } from './components/NexusGovernanceView';
import { Building2, User, Settings, Network, Bot, ShieldAlert } from 'lucide-react';

export default function App() {
  const [context, setContext] = useState<AppContext>('PERSONAL');
  const [simState, setSimState] = useState<SimulationState>(INITIAL_STATE);

  // Red Team / Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentStates, setAgentStates] = useState<Record<AgentType, AgentStatus>>({
    sentinel: 'idle', analyst: 'idle', strategist: 'idle', banker: 'idle'
  });

  useEffect(() => {
    // Subscribe to the simulation engine updates for Personal/Business Dashboard modes
    const unsubscribe = simulationEngine.subscribe((node, log, text, uiUpdate) => {
      setSimState(prev => {
        const next = { ...prev };
        next.activeNode = node;
        next.isRunning = node !== 'OUTPUT';
        
        if (log) next.trustLog = [...prev.trustLog, log];
        if (text) next.conversation = [...prev.conversation, { role: 'assistant', content: text }];
        if (uiUpdate) next.uiState = { ...prev.uiState, ...uiUpdate };
        
        return next;
      });
    });
    return unsubscribe;
  }, []);

  const handleContextChange = (ctx: AppContext) => {
    setContext(ctx);
    setSimState(INITIAL_STATE);
    // Reset Chat State
    if (ctx === 'COACH') {
        setMessages([]);
        setSimState(prev => ({ ...prev, trustLog: [] }));
    }
  };

  const handleRun = () => {
    setSimState(prev => ({ ...prev, isRunning: true }));
    if (context === 'PERSONAL') {
      simulationEngine.runPersonalScenario();
    } else if (context === 'BUSINESS') {
      simulationEngine.runBusinessScenario();
    }
  };

  const handleExecute = () => {
    simulationEngine.executeProposal();
  };

  // Handler for Red Team Chat
  const handleSendMessage = (text: string, scenario: 'standard' | 'redteam_injection' | 'redteam_pii' | 'ineligible') => {
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, newUserMsg]);
    setIsProcessing(true);

    // Reset Agent States
    setAgentStates({ sentinel: 'idle', analyst: 'idle', strategist: 'idle', banker: 'idle' });

    runOrchestration(
      text,
      scenario,
      (agent, status) => setAgentStates(prev => ({ ...prev, [agent]: status })),
      (steps) => {
          // Convert TrustSteps to TrustEvents for the shared panel
          const newEvents = steps.map(s => ({
              id: s.id,
              timestamp: Date.now(),
              category: s.id === 'pii' ? 'PII' : s.id === 'nexus' ? 'NEXUS' : 'SYSTEM',
              message: `${s.label}: ${s.status.toUpperCase()}`,
              status: s.status === 'success' ? 'PASS' : s.status === 'error' ? 'FAIL' : 'INFO',
              metadata: s.jsonPayload
          } as any));
          
          setSimState(prev => ({
              ...prev,
              trustLog: newEvents // Replace log for chat mode to match step state
          }));
      },
      (data: AgentResponseData) => {
        const newAssistantMsg: Message = { 
            id: (Date.now() + 1).toString(), 
            role: 'assistant', 
            content: data.text,
            data: data
        };
        setMessages(prev => [...prev, newAssistantMsg]);
      },
      () => setIsProcessing(false)
    );
  };

  // Theme Determination
  const isDark = context === 'BUSINESS' || context === 'COACH' || context === 'ARCHITECTURE' || context === 'GOVERNANCE';

  return (
    <div className={`flex h-screen w-full font-sans overflow-hidden transition-colors duration-500
      ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}
    `}>
      
      {/* 1. Sidebar Navigation */}
      <div className={`w-20 flex flex-col items-center py-6 gap-6 border-r z-20 transition-colors duration-500 shrink-0
        ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}
      `}>
         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl mb-4 shadow-lg
            ${context === 'BUSINESS' ? 'bg-cba-yellow text-black' : 
              context === 'COACH' ? 'bg-indigo-500 text-white' : 
              context === 'ARCHITECTURE' ? 'bg-blue-500 text-white' :
              context === 'GOVERNANCE' ? 'bg-amber-500 text-slate-900' :
              'bg-emerald-500 text-white'}
         `}>
           {context === 'BUSINESS' ? 'B' : context === 'COACH' ? 'C' : context === 'ARCHITECTURE' ? 'A' : context === 'GOVERNANCE' ? 'G' : 'P'}
         </div>

         <div className="flex flex-col gap-3 w-full px-2">
            <NavButton 
                active={context === 'PERSONAL'} 
                onClick={() => handleContextChange('PERSONAL')} 
                icon={User} 
                label="Personal"
                theme="light"
            />
            <NavButton 
                active={context === 'BUSINESS'} 
                onClick={() => handleContextChange('BUSINESS')} 
                icon={Building2} 
                label="Business"
                theme="dark"
            />
            <div className="h-px bg-slate-700/50 w-full my-1"></div>
            <NavButton 
                active={context === 'COACH'} 
                onClick={() => handleContextChange('COACH')} 
                icon={Bot} 
                label="Coach"
                theme="dark"
            />
            <NavButton 
                active={context === 'GOVERNANCE'} 
                onClick={() => handleContextChange('GOVERNANCE')} 
                icon={ShieldAlert} 
                label="Nexus"
                theme="dark"
            />
            <NavButton 
                active={context === 'ARCHITECTURE'} 
                onClick={() => handleContextChange('ARCHITECTURE')} 
                icon={Network} 
                label="Arch"
                theme="dark"
            />
         </div>

         <div className="mt-auto flex flex-col gap-4 text-slate-400">
           <Settings size={20} />
         </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Top Bar - Hide in Governance View as it has internal headers */}
        {context !== 'GOVERNANCE' && (
          <header className={`h-16 flex items-center justify-between px-6 border-b transition-colors duration-500 shrink-0
             ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'}
          `}>
             <div className="flex items-center gap-3 w-64">
               <h2 className="font-semibold text-lg whitespace-nowrap">
                 {context === 'PERSONAL' && 'CommSec Pocket'}
                 {context === 'BUSINESS' && 'DailyIQ Cash Flow'}
                 {context === 'COACH' && 'CBA Virtual Relationship Manager'}
                 {context === 'ARCHITECTURE' && 'System Architecture'}
               </h2>
             </div>
             
             {/* Orchestrator Mini-View in Header */}
             <div className="flex-1 max-w-2xl mx-4 hidden md:block">
                <AgentOrchestrator activeNode={simState.activeNode} context={context} />
             </div>

             <div className="flex items-center gap-4 w-32 justify-end">
                {context !== 'ARCHITECTURE' && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border
                      ${isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}
                    `}>
                      <div className={`w-2 h-2 rounded-full ${simState.isRunning || isProcessing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
                      {(simState.isRunning || isProcessing) ? 'THINKING' : 'READY'}
                    </div>
                )}
             </div>
          </header>
        )}

        <main className="flex-1 flex overflow-hidden relative">
          
          {/* View Router */}
          {context === 'PERSONAL' && <PersonalWealthView state={simState} onAction={handleRun} onExecute={handleExecute} />}
          {context === 'BUSINESS' && <BusinessCashflowView state={simState} onAction={handleRun} onExecute={handleExecute} />}
          {context === 'GOVERNANCE' && <NexusGovernanceView />}
          {context === 'ARCHITECTURE' && <ArchitectureView />}
          
          {context === 'COACH' && (
              <div className="flex flex-1 h-full">
                  <AgentSidebar agentStates={agentStates} />
                  <ChatInterface 
                    messages={messages} 
                    isProcessing={isProcessing} 
                    onSendMessage={handleSendMessage} 
                  />
              </div>
          )}

          {/* 3. Trust Panel (The Glass Box) - Always visible except in Architecture & Governance view */}
          {(context !== 'ARCHITECTURE' && context !== 'GOVERNANCE') && (
             <TrustPanel logs={simState.trustLog} />
          )}
        </main>

      </div>
    </div>
  );
}

// Helper Component for Sidebar Buttons
const NavButton = ({ active, onClick, icon: Icon, label, theme }: any) => {
    const isDarkTheme = theme === 'dark';
    
    let baseClass = "p-3 rounded-xl transition-all flex flex-col items-center gap-1 w-full";
    let activeClass = "";
    let inactiveClass = "";

    if (active) {
        if (label === 'Personal') activeClass = "bg-white shadow-md text-emerald-600";
        else if (label === 'Business') activeClass = "bg-slate-800 text-cba-yellow";
        else if (label === 'Coach') activeClass = "bg-indigo-900/20 text-indigo-400 border border-indigo-900/50";
        else if (label === 'Arch') activeClass = "bg-blue-900/20 text-blue-400 border border-blue-900/50";
        else if (label === 'Nexus') activeClass = "bg-amber-900/20 text-amber-500 border border-amber-900/50";
    } else {
        inactiveClass = "text-slate-500 hover:bg-slate-800 hover:text-slate-300";
        if (!isDarkTheme) inactiveClass = "text-slate-400 hover:bg-slate-100 hover:text-slate-600";
    }

    return (
        <button onClick={onClick} className={`${baseClass} ${active ? activeClass : inactiveClass}`}>
            <Icon size={20} />
            <span className="text-[9px] font-medium">{label}</span>
        </button>
    );
};
