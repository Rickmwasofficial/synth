
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage as ChatMessageType, BotMessageData, Step } from './types';
import ChatInput from './components/ChatInput';
import { Analytics } from "@vercel/analytics/react"
import { ChatMessage } from './components/ChatMessage';
import { BotIcon, SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
    };
    
    const botMessageId = `bot-${Date.now()}`;
    const botPlaceholderMessage: ChatMessageType = {
        id: botMessageId,
        role: 'bot',
        content: { steps: [], toolsUsed: [] }
    };

    setMessages(prev => [...prev, userMessage, botPlaceholderMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`https://synthapi.rickmwasofficial.me/invoke?content=${encodeURIComponent(currentInput)}`, {
        method: 'POST',
        headers: {
          'Accept': 'text/event-stream',
        },
      });

      if (!response.ok || !response.body) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      const processedSteps = new Set<string>();

      const updateMessage = (stepName: string, payload: any) => {
        const stepKey = `${stepName}-${JSON.stringify(payload)}`;
        if (processedSteps.has(stepKey)) {
          return; // Avoid processing duplicate steps
        }
        processedSteps.add(stepKey);

        setMessages(prevMessages => 
          prevMessages.map(msg => {
            if (msg.id === botMessageId) {
              const currentContent = msg.content as BotMessageData;
              
              if (stepName === 'final_answer') {
                console.log('✅ Final answer received:', payload.answer);
                return { 
                  ...msg, 
                  content: {
                    ...currentContent,
                    finalAnswer: payload.answer,
                    toolsUsed: payload.tools_used || currentContent.toolsUsed || [],
                  }
                };
              } else { // Intermediate step
                console.log(`🔄 Step received: ${stepName}`);
                const newStep: Step = { step_name: stepName, payload: payload };
                
                const existingTools = currentContent.toolsUsed || [];
                let updatedTools = [...existingTools];

                if (!stepName.includes('_') && !existingTools.includes(stepName)) {
                  updatedTools.push(stepName);
                  console.log('🔧 Tool detected and added:', stepName);
                }
                
                return { 
                  ...msg, 
                  content: {
                    ...currentContent,
                    steps: [...currentContent.steps, newStep],
                    toolsUsed: updatedTools,
                  }
                };
              }
            }
            return msg;
          })
        );
      };

      console.log('🚀 Starting stream processing...');
      while (true) {
        const { done, value } = await reader.read();
        
        if (value) {
          buffer += decoder.decode(value, { stream: true });
        }

        let stepEndIndex;
        // Process all complete <step>...</step> blocks in the buffer
        while ((stepEndIndex = buffer.indexOf('</step>')) !== -1) {
          const stepStartIndex = buffer.indexOf('<step>');
          
          if (stepStartIndex === -1 || stepStartIndex > stepEndIndex) {
            console.warn('Malformed buffer, found </step> without preceding <step>. Discarding part of buffer.');
            buffer = buffer.substring(stepEndIndex + 7);
            continue;
          }

          const stepString = buffer.substring(stepStartIndex, stepEndIndex + 7);
          
          // Remove the processed step from the buffer
          buffer = buffer.substring(stepEndIndex + 7);
          
          const stepMatch = stepString.match(/<step><step_name>(.*?)<\/step_name>(.*?)<\/step>/s);

          if (stepMatch) {
            const stepName = stepMatch[1].trim();
            const jsonString = stepMatch[2].trim();
            
            try {
              const payload = JSON.parse(jsonString);
              updateMessage(stepName, payload);
            } catch (err) {
              console.error('❌ Failed to parse JSON for step:', stepName, jsonString, err);
            }
          } else {
             console.log('⚠️ No step pattern match in:', stepString);
          }
        }

        if (done) {
          console.log('🏁 Stream finished');
          // Process any remaining data in the buffer. This is likely the final, potentially unterminated, step.
          if (buffer.trim().length > 0) {
            console.log('Processing final, remaining buffer content:', buffer);
            const finalStepMatch = buffer.match(/<step><step_name>(.*?)<\/step_name>(.*)/s);

            if (finalStepMatch) {
              const stepName = finalStepMatch[1].trim();
              // Clean up the JSON string, removing any stray trailing tags
              const jsonString = finalStepMatch[2].trim().replace(/<\/step>\s*$/, '').trim();

              if (jsonString) {
                try {
                  const payload = JSON.parse(jsonString);
                  updateMessage(stepName, payload);
                } catch (err) {
                  console.error('❌ Failed to parse JSON from the final buffer content:', { stepName, jsonString, err });
                }
              }
            } else {
              console.warn('Could not parse final buffer content as a step:', buffer);
            }
          }
          break; // Exit the while(true) loop
        }
      }
    } catch (error) {
      console.error('💥 Fetch error:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId 
        ? {...msg, content: { steps: [], finalAnswer: `An error occurred: ${error instanceof Error ? error.message : String(error)}` } }
        : msg
      ));
    } finally {
      setIsLoading(false);
      console.log("✨ Request processing completed");
    }
  }, [input, isLoading]);

  return (
    <div className="flex justify-center w-full h-screen bg-[#0D1117] text-gray-300 font-sans">
      <div className="flex flex-col h-full w-full max-w-4xl lg:border-x lg:border-gray-800">
        <header className="p-4 border-b border-gray-800 bg-[#0D1117]/80 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-center gap-2">
            <SparklesIcon className="w-6 h-6 text-violet-400" />
            <h1 className="text-xl font-bold text-gray-50 tracking-wide">Synth AI</h1>
        </header>
        
        <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 mb-8 flex items-center justify-center bg-gradient-to-br from-violet-900 via-[#0D1117] to-[#0D1117] rounded-full shadow-[0_0_30px_rgba(124,58,237,0.5)]">
                    <BotIcon className="w-20 h-20 sm:w-24 sm:h-24 text-violet-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">Your Intelligent Chat Companion</h2>
                  <p className="text-base sm:text-lg mt-3 text-gray-400 max-w-md">Instant answers, friendly conversation, and personalized assistance are just a tap away.</p>
              </div>
          )}
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </main>

        <div className="w-full">
          <ChatInput 
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              isLoading={isLoading}
          />
        </div>
      </div>
      <Analytics />
    </div>
  );
};

export default App;
