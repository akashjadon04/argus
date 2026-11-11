import React from "react";

export function SupportChatWidget() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <a
        href="https://www.linkedin.com/in/akashjadon"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-full bg-slate-900 border border-slate-700 px-4 py-2 text-xs font-medium text-slate-200 shadow-xl hover:bg-slate-800 transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Developed by Akash Jadon</span>
      </a>
    </div>
  );
}
