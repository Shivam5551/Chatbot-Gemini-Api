import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import parse from "html-react-parser"; 
import { marked } from 'marked';

// Storing data temporarily
let conversations = [];

const App = () => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const formatText = (text) => {
    return marked(text);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const getInput = useCallback(async () => {
    if (input.trim() === "") return;

    setLoading(true);
    const userInput = input;
    setInput("");
    
    conversations.push({
      UserInput: userInput,
      ServerResponse: null, 
    });

    try {
      const response = await axios.post("https://chatbot-gemini-api-jpwo.vercel.app/conversation", { 
        prompt: userInput,
      });
      const printableOutput = formatText(response.data.output || "No response available.");
      
      // Update the last conversation with the actual response
      conversations[conversations.length - 1].ServerResponse = printableOutput;
    } catch (error) {
      console.error("Error fetching data:", error);
      conversations[conversations.length - 1].ServerResponse = "Failed to fetch data.";
    } finally {
      setLoading(false);
    }
  }, [input]);

  const handleInputChange = (e) => {
    setInput(e.target.value); 
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() !== '') {
        getInput();
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setInput((prevInput) => prevInput + '    ');
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-gray-100">

      <header className="bg-slate-800 shadow-md py-4 px-6 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
              <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold">Chatbot</h1>
        </div>
      </header>

      <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="text-3xl md:text-5xl font-bold text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                How can I help you today?
              </span>
            </div>
            <p className="text-gray-400 text-center max-w-md">
              Ask me anything and I'll do my best to assist you.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {conversations.map(({ UserInput, ServerResponse }, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-end">
                  <div className="bg-blue-600 rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%] md:max-w-[60%] shadow-md">
                    <p className="text-white">{UserInput}</p>
                  </div>
                </div>
                
                <div className="flex justify-start">
                  {ServerResponse === null ? (
                    <div className="bg-slate-700 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%] md:max-w-[70%] shadow-md">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-700 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%] md:max-w-[70%] shadow-md">
                      <div className="prose prose-sm prose-invert max-w-none">
                        {parse(ServerResponse)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="bg-slate-800 border-t border-slate-700 p-4">
        <div className="max-w-4xl mx-auto items-center relative">
          <textarea
            ref={inputRef}
            className="w-full p-4 pr-14 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            rows={input.split('\n').length > 3 ? 3 : input.split('\n').length || 1}
          />
          <button
            className={`absolute right-3 bottom-4 p-2.5 rounded-lg ${
              loading || input.trim() === '' 
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700'
            } transition-colors`}
            onClick={getInput}
            disabled={loading || input.trim() === ''}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
