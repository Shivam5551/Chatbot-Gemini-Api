import { useEffect, useState, useRef } from "react";

const App = () => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.length === 1 || e.key === 'Tab' || e.key === 'Enter') { 
        var key = e.key === 'Tab' ? '    ' : e.key === 'Enter' ? '\n' : e.key;
        console.log(e.key, input)
        setInput((prevInput) => prevInput + key);
      } else if (e.key === 'Backspace' && input.length > 0) {
        setInput((prevInput) => prevInput.slice(0, -1));
      }
      e.preventDefault();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [input]); 

  useEffect(() => {
    if (inputRef.current) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(inputRef.current);
      range.collapse(false); // Collapse to the end of the text
      selection.removeAllRanges();
      selection.addRange(range);

      inputRef.current.focus();
    }
  }, [input]); 

  return (
    <div className="w-screen h-screen overflow-y-scroll overflow-x-hidden bg-slate-900/95 flex flex-col justify-between">
      <div className="w-fit bg-slate-700"></div>
      <div className="flex items-center justify-center mb-4">
        <div className="grid grid-cols-12 items-center w-3/4 h-fit rounded-3xl mb-3 bg-zinc-700">
          <div
            ref={inputRef}
            className="col-span-10 whitespace-pre md:col-span-11 relative text-wrap w-full overflow-hidden h-fit line-clamp-2 items-center rounded-2xl m-0 p-2 md:p-4 flex text-white caret-white"
            contentEditable
            suppressContentEditableWarning={true}
            role="textbox"
          >
            {input === '' ? "Search Anything" : input}
          </div>
          <button className="col-span-2 md:col-span-1 m-2 py-4 text-sm bg-blue-500 text-white rounded-2xl">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default App;
