import React from 'react';
import { SendIcon } from './Icons';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, handleSend, isLoading }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as any); // Type assertion to satisfy form event
    }
  };

  return (
    <form
      onSubmit={handleSend}
      className="p-3 sm:p-4 bg-[#0D1117]/80 backdrop-blur-sm border-t border-gray-800 flex items-center gap-3"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isLoading ? "Synth AI is thinking..." : "Send a message..."}
        disabled={isLoading}
        className="flex-1 w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-500 disabled:opacity-50 transition-all"
        autoFocus
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="bg-violet-600 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0D1117] focus:ring-violet-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors shrink-0"
        aria-label="Send message"
      >
        <SendIcon className="w-6 h-6" />
      </button>
    </form>
  );
};

export default ChatInput;