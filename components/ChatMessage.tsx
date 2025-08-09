import React from 'react';
import { ChatMessage as ChatMessageType, BotMessageData, Step } from '../types';
import { BotIcon } from './Icons';
import { CodeBlock } from './CodeBlock';

const StepDisplay: React.FC<{ step: Step }> = ({ step }) => {
  return (
    <div className="text-xs p-3 bg-gray-800/70 rounded-lg mt-1 font-mono">
      <span className="font-semibold text-violet-400">{step.step_name}</span>
      <pre className="whitespace-pre-wrap break-words text-gray-400 mt-1.5 text-[11px] leading-relaxed">{JSON.stringify(step.payload, null, 2)}</pre>
    </div>
  );
};

const ThinkingIndicator: React.FC = () => (
  <div className="flex items-center space-x-2">
    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
  </div>
);

const renderContent = (text: string) => {
  if (!text) return null;

  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    const codeBlockMatch = part.match(/```(\w*)\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      const language = codeBlockMatch[1] || 'text';
      const code = codeBlockMatch[2].trim();
      return <CodeBlock key={index} language={language} code={code} />;
    } else {
      const lines = part.split('\n').filter(line => line.trim() !== '');
      return lines.map((line, lineIndex) => {
        let processedLine = line;
        processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-100">$1</strong>');
        processedLine = processedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
        processedLine = processedLine.replace(/`(.*?)`/g, '<code class="bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
        processedLine = processedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-violet-400 hover:text-violet-300 underline">$1</a>');
        
        if (line.startsWith('# ')) {
          return <h1 key={`${index}-${lineIndex}`} className="text-2xl font-bold mt-4 mb-2 first:mt-0 text-gray-100" dangerouslySetInnerHTML={{ __html: processedLine.slice(2) }}></h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={`${index}-${lineIndex}`} className="text-xl font-bold mt-3 mb-2 first:mt-0 text-gray-100" dangerouslySetInnerHTML={{ __html: processedLine.slice(3) }}></h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={`${index}-${lineIndex}`} className="text-lg font-bold mt-2 mb-1 first:mt-0 text-gray-100" dangerouslySetInnerHTML={{ __html: processedLine.slice(4) }}></h3>;
        }

        return <p key={`${index}-${lineIndex}`} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: processedLine }} />;
      });
    }
  }).flat();
};


export const ChatMessage: React.FC<{ message: ChatMessageType }> = ({ message }) => {
  const isUser = message.role === 'user';
  const botMessageData = !isUser ? (message.content as BotMessageData) : null;

  if (isUser) {
    return (
      <div className="flex justify-end group">
        <div className="bg-violet-600 text-white p-3 px-4 rounded-2xl rounded-br-none max-w-lg shadow-md">
          <p className="whitespace-pre-wrap break-words">{message.content as string}</p>
        </div>
      </div>
    );
  }

  // Bot message
  return (
    <div className="flex items-start gap-3 sm:gap-4 group">
      <div className="w-10 h-10 flex-shrink-0 bg-gray-800 rounded-full flex items-center justify-center mt-1 shadow-md">
           <BotIcon className="w-6 h-6 text-violet-400" />
      </div>
      <div className="bg-[#161B22] text-gray-300 p-4 rounded-2xl rounded-bl-none max-w-2xl w-full shadow-md border border-gray-800">
        <div className="prose prose-sm max-w-none leading-relaxed prose-invert prose-p:text-gray-300">
          {botMessageData && typeof botMessageData.finalAnswer === 'string' ? (
            <div className="text-base">
              {renderContent(botMessageData.finalAnswer)}
            </div>
          ) : (
            <ThinkingIndicator />
          )}
        </div>
        
        {/* Show steps and tools while thinking */}
        {botMessageData && typeof botMessageData.finalAnswer !== 'string' && (botMessageData.toolsUsed?.length > 0 || botMessageData.steps.length > 0) && (
          <div className="mt-4 space-y-4">
            {botMessageData.toolsUsed && botMessageData.toolsUsed.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase text-gray-600 mb-2 tracking-wider">Tools Used</h4>
                <div className="flex flex-wrap gap-2">
                  {botMessageData.toolsUsed.map((tool, index) => (
                    <span key={index} className="px-2 py-1 bg-violet-600 text-violet-50 text-xs font-medium rounded-md">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {botMessageData.steps.length > 0 && (
              <details className="text-sm" open>
                <summary className="cursor-pointer font-medium text-gray-500 hover:text-gray-200 transition-colors">
                  Thinking Steps ({botMessageData.steps.length})
                </summary>
                <div className="mt-2 space-y-2 border-l-2 border-gray-700 pl-4">
                  {botMessageData.steps.map((step, index) => (
                    <StepDisplay key={index} step={step} />
                  ))}
                </div>
              </details>
            )}
          </div>
        )}

        {/* Show tools and steps after final answer */}
        {botMessageData && typeof botMessageData.finalAnswer === 'string' && (botMessageData.toolsUsed?.length > 0 || botMessageData.steps.length > 0) && (
          <div className="mt-4 border-t border-gray-700 pt-3">
            {botMessageData.steps.length > 0 && (
              <details className="text-sm mb-4">
                <summary className="cursor-pointer font-medium text-gray-500 hover:text-gray-200 transition-colors">
                  View Steps ({botMessageData.steps.length})
                </summary>
                <div className="mt-2 space-y-2 border-l-2 border-gray-700 pl-4">
                  {botMessageData.steps.map((step, index) => (
                    <StepDisplay key={index} step={step} />
                  ))}
                </div>
              </details>
            )}
            
            {botMessageData.toolsUsed && botMessageData.toolsUsed.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase text-gray-600 mb-2 tracking-wider">Tools Used</h4>
                <div className="flex flex-wrap gap-2">
                  {botMessageData.toolsUsed.map((tool, index) => (
                    <span key={index} className="px-2 py-1 bg-violet-600 text-violet-50 text-xs font-medium rounded-md">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};