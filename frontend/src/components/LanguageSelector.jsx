import React from "react";
import { ChevronDown } from "lucide-react";

export default function LanguageSelector({ language, setLanguage, hasCpp }) {
  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-1.5 text-sm font-mono appearance-none pr-8 focus:outline-none focus:border-neon-purple cursor-pointer"
      >
        <option value="python">🐍 Python</option>
        <option value="javascript">🟨 JavaScript</option>
        {hasCpp && <option value="cpp">⚡ C++</option>}
      </select>
      <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  );
}
