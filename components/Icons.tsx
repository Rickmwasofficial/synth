import React from 'react';

export const SendIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

export const BotIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
        aria-hidden="true"
    >
        <path d="M12 2C6.486 2 2 6.486 2 12v8h2v-8c0-4.411 3.589-8 8-8s8 3.589 8 8v8h2v-8c0-5.514-4.486-10-10-10z"></path>
        <path d="M12 19c-1.657 0-3-1.343-3-3h6c0 1.657-1.343 3-3 3z"></path>
        <path d="M8.5 14c-.827 0-1.5-.673-1.5-1.5S7.673 11 8.5 11s1.5.673 1.5 1.5S9.327 14 8.5 14zM15.5 14c-.827 0-1.5-.673-1.5-1.5S14.673 11 15.5 11s1.5.673 1.5 1.5S16.327 14 15.5 14z"></path>
    </svg>
);

export const SparklesIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20" 
        fill="currentColor" 
        className={className}
        aria-hidden="true"
    >
        <path fillRule="evenodd" d="M5 2.5a.5.5 0 01.5-.5h2.5a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM3.5 3a.5.5 0 000 1h2a.5.5 0 000-1h-2zM2 5.5a.5.5 0 01.5-.5h2.5a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM10.868 2.884c.321.64.321 1.393 0 2.034l-1.348 2.695a1.5 1.5 0 01-2.034 0L6.138 4.918a1.5 1.5 0 010-2.034l1.348-2.695c.321-.64.962-.64 1.282 0l2.1 4.207zM14.5 5.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM3 10.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17 10.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM9.132 17.116c-.321-.64-.321-1.393 0-2.034l1.348-2.695a1.5 1.5 0 012.034 0l1.348 2.695a1.5 1.5 0 010 2.034l-1.348 2.695c-.321.64-.962-.64-1.282 0l-2.1-4.207z" clipRule="evenodd" />
    </svg>
);


export const CopyIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className={className}
        aria-hidden="true"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5 .124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
);

export const CheckIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className={className}
        aria-hidden="true"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);
