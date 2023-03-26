import * as React from "react";
import { useRef, useState } from "react";
import * as ReactDOM from "react-dom";
import "./app.css";

const HBASE = 60;

function App() {
  const inputRef = useRef(null);
  const ulRef = useRef(null);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(0);

  let list;
  if (results && results.length > 0) {
    list = (
      <ul
        ref={ulRef}
        className="rows"
        style={{
          maxHeight: HBASE*results.length+'px',
        }}
      >
        {results.map((t) => (
          <li key={t.key} className="row">
            <span>{t.value}</span>
          </li>
        ))}
      </ul>
    );
  }

  const handleInputChange = async (event) => {
    const val = event.target.value;
    let results = [];
    if(val) {
      results = await window.electronAPI.hello(val);
    }
    // console.log(results);
    setResults(results);
    window.electronAPI.setRowsNum(results.length);
  };

  return (
    <>
      <div id="box">
        <input
          name="input"
          type="text"
          id="input"
          autoFocus={true}
          spellCheck={false}
          onChange={handleInputChange}
        />
        <div className="drag-area"></div>
      </div>
      {list}
    </>
  );
}

ReactDOM.render(<App />, document.body);
