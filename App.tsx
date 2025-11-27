import React, { useState, useEffect } from 'react';
import { AgentSidebar } from './components/AgentSidebar';
import { TrustPanel } from './components/TrustPanel';
import { ChatInterface } from './components/ChatInterface';
import { ArchitectureView } from './components/ArchitectureView';
import { AgentType, AgentStatus, Message, TrustStep } from './types';
import { runOrchestration } from './services/mockOrchestrator';
import { MessageSquare, Layers } from 'lucide-react';

const INITIAL_AGENT_STATES: Record<AgentType, AgentStatus> = {
  analyst: 'idle',
  strategist: 'idle',
  banker: 'idle',
  sentinel: 'idle'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'arch'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [agentStates, setAgentStates] = useState(INITIAL_AGENT_STATES);
  const [trustSteps, setTrustSteps] = useState<TrustStep[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = (text: string, scenario: any) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);
    setTrustSteps([]); // Clear previous trust steps
    setAgentStates(INITIAL_AGENT_STATES);

    // Run the orchestration simulation
    runOrchestration(
      text,
      scenario,
      (agent, status) => {
        setAgentStates(prev => ({ ...prev, [agent]: status }));
      },
      (steps) => {
        setTrustSteps(steps);
      },
      (data) => {
        const botMsg: Message = {
          id: Date.now().toString() + Math.random(),
          role: 'assistant',
          content: data.text,
          data: data,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, botMsg]);
      },
      () => {
        setIsProcessing(false);
      }
    );
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-hidden">
      
      {/* 1. Left Sidebar: Navigation & Agents */}
      <div className="flex flex-col h-full border-r border-slate-800">
         {/* Simple Nav Rail */}
         <div className="w-16 bg-slate-900 flex flex-col items-center py-6 gap-6 border-b border-slate-800 flex-none h-full z-10">
            <div className="w-8 h-8 bg-cba-yellow rounded-lg flex items-center justify-center text-black font-bold mb-4">
              O
            </div>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`p-3 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-slate-800 text-cba-yellow' : 'text-slate-500 hover:text-slate-300'}`}
              title="Chat Interface"
            >
              <MessageSquare size={20} />
            </button>
            <button 
              onClick={() => setActiveTab('arch')}
              className={`p-3 rounded-xl transition-all ${activeTab === 'arch' ? 'bg-slate-800 text-cba-yellow' : 'text-slate-500 hover:text-slate-300'}`}
              title="Architecture"
            >
              <Layers size={20} />
            </button>
         </div>
      </div>

      {/* Agents Panel (Only show in Chat mode) */}
      {activeTab === 'chat' && <AgentSidebar agentStates={agentStates} />}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        
        {/* Header */}
        <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-wide">Cash Flow Coach</span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-700">PROTOTYPE v0.1</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-900/10 px-2 py-1 rounded border border-emerald-900/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              System Operational
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        {activeTab === 'chat' ? (
          <div className="flex flex-1 overflow-hidden">
            <ChatInterface 
              messages={messages} 
              isProcessing={isProcessing} 
              onSendMessage={handleSendMessage} 
            />
            {/* Right Sidebar: Trust Layer */}
            <TrustPanel steps={trustSteps} />
          </div>
        ) : (
          <ArchitectureView />
        )}
      </div>
    </div>
  );
}