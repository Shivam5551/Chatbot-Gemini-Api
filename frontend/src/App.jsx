import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import parse from "html-react-parser"; 

// Storing data temporarily (not in a database for now)
let conversations = [];

const App = () => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const formatText = (text) => {
    return text
      .replace(/(\*\*\*\*)(.*?)\1/g, '<h3>$2</h3>')
      .replace(/(\*\*\*)(.*?)\1/g, '<h2>$2</h2>')
      .replace(/(\*\*)(.*?)\1/g, '<h1>$2</h1>')
      .replace(/(\*)(.*?)\1/g, '<p>$2</p>');
  };

  const getInput = useCallback(async () => {
    if (input.trim() === "") return;

    setLoading(true);
    try {
      const response = await axios.post("https://chatbot-gemini-api-jpwo.vercel.app/conversation", { 
        prompt: input,
      });
      const printableOutput = formatText(response.data.output || "No response available.");
      conversations.push({
        UserInput: input,
        ServerResponse: printableOutput,
      });
      setInput(""); 
    } catch (error) {
      console.error("Error fetching data:", error);
      conversations.push({
        UserInput: input,
        ServerResponse: "Failed to fetch data.",
      });
    } finally {
      setLoading(false);
    }
  }, [input]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && input.trim() !== '') {
        e.preventDefault();
        getInput();
      } else if (e.key.length === 1 || e.key === 'Tab') {
        const key = e.key === 'Tab' ? '    ' : e.key;
        setInput((prevInput) => prevInput + key);
      } else if (e.key === 'Backspace' && input.length > 0) {
        setInput((prevInput) => prevInput.slice(0, -1));
      }
      e.preventDefault();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [input, getInput]);

  useEffect(() => {
    if (inputRef.current) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(inputRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      inputRef.current.focus();
    }
  }, [input]);

  return (
    <div className="w-screen h-screen overflow-y-auto overflow-x-hidden bg-slate-900/95 grid grid-rows-12">

<div className="row-span-10 p-12 overflow-x-hidden overflow-y-auto h-full w-full">
  {conversations.length === 0 ? (
    <div className="flex justify-center whitespace-pre items-center h-full text-2xl sm:text-7xl font-extrabold"><h1 className="text-yellow-500">How </h1><h1 className="text-purple-400">can I help you?</h1></div>
  ) : (
    conversations.map(({ UserInput, ServerResponse }, index) => (
      <div key={index} className="mb-4">
        <div className="flex justify-end w-full overflow-x-clip h-fit mb-2 text-white">
          <div className="rounded-2xl w-fit max-w-[50%]  break-all h-fit bg-gray-500 p-2">
            <strong className="whitespace-pre">User: </strong> {UserInput}
          </div>
        </div>
        <div className="bg-gray-700 whitespace-pre text-wrap overflow-x-auto p-2 h-fit rounded-3xl text-white mt-2">
          <strong>Response:</strong> {parse(ServerResponse)}
        </div>
      </div>
    ))
  )}
</div>


      <div className="flex items-end relative row-span-2 justify-center mb-4">
        <div className="flex items-center w-full md:w-3/4 h-fit rounded-3xl m-1 sm:m-4 mb-1 sm:mb-3 bg-zinc-700">
          <div
            ref={inputRef}
            className="col-span-11 break-all text-sm sm:text-lg whitespace-pre relative text-wrap w-full overflow-x-hidden overflow-y-auto h-fit max-h-24 line-clamp-2 items-center rounded-2xl m-0 p-2 md:p-4 flex text-white caret-white"
            contentEditable
            suppressContentEditableWarning={true}
            role="textbox"
          >
            {input === '' ? "Search Anything" : input}
          </div>
          <div className="flex justify-end pr-1 pl-1 sm:pl-2 sm:pr-2">
            <button
              className={`col-span-1 flex justify-center items-center mx-0 my-2 p-2 text-sm ${
                loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-white hover:text-blue-600 hover:font-semibold'
              } text-white rounded-full h-7 md:h-14 w-7 md:w-14`}
              onClick={getInput}
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
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
    </div>
  );
};

export default App;
