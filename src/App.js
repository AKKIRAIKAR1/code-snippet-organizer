import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [snippets, setSnippets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [filterLang, setFilterLang] = useState("");
  const [editIndex, setEditIndex] = useState(null);




  // useEffects 
  useEffect(() => {
    const savedSnippets = localStorage.getItem("snippets");
    if (savedSnippets) {
      setSnippets(JSON.parse(savedSnippets));
    }
  }, []);


  useEffect(() => {
      localStorage.setItem("snippets", JSON.stringify(snippets));
  }, [snippets]);






  // Function to save a new snippet
  function saveSnippet() {
      if (title.trim() === "" || description.trim() === "" || language === "" || text.trim() === "" ) return;

      const newSnippet = {
        title,
        description,
        language,
        code: text,
      };

      if (editIndex === null) {
          setSnippets([...snippets, newSnippet]);
      } else {
          const updated = [...snippets];
          updated[editIndex] = newSnippet;
          setSnippets(updated);
          setEditIndex(null);
      }

      setTitle("");
      setDescription("");
      setLanguage("");
      setText("");
    }

  // Function to delete a snippet
  function deleteSnippet(index) {
    const newSnippets = snippets.filter((_, i) => i !== index);
    setSnippets(newSnippets);
  }

  return (
    <div className="app">
      <h2>Code Snippet Organizer</h2>

      <div className="form-section">
        {/* Title */}
        <input
          type="text"
          placeholder="Snippet title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br/>

        {/* Code Block */}
        <textarea
          placeholder="Write your code here"
          rows="6"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <br />
        {/* Description */}
        <textarea
          placeholder="Description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br />

        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="">Select language</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="React">React</option>
          <option value="CSS">CSS</option>
        </select>

        <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)}>
          <option value="">All Languages</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="React">React</option>
          <option value="CSS">CSS</option>
        </select>



        <br />
        <button onClick={saveSnippet}>
          {editIndex === null ? "Save Snippet" : "Update Snippet"}
        </button>
    </div>

    <div className="list-section">
      {/* Update the Snippet */}
      <h4>Saved Snippets:</h4>  

      {snippets
        .filter(
          (item) => filterLang === "" || item.language === filterLang
        )
      .map((item, index) => (
        <div key={index} className="snippet">
          <h4>{item.title}</h4>
          <small>{item.language}</small>
          <p>{item.description}</p>
          <pre>{item.code}</pre>
          <button onClick={() => 
            {
              setTitle(item.title);
              setDescription(item.description);
              setLanguage(item.language);
              setText(item.code);
              setEditIndex(index);
            }}>
              Edit
          </button>

          <button onClick={() => deleteSnippet(index)}>Delete</button>
        </div>
      ))}
      </div>
    </div>
  );
}

export default App;
