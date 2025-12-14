import { useState, useEffect } from "react";
import "./App.css";
import { supabase } from "./supabaseClient";


function App() {
  const [text, setText] = useState("");
  const [snippets, setSnippets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [filterLang, setFilterLang] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
  fetchSnippets();
  }, []);


  // Function to save a new snippet
  async function saveSnippet() {
    if (
      title.trim() === "" ||
      description.trim() === "" ||
      language === "" ||
      text.trim() === ""
    ) return;

    const snippetData = {
      title,
      description,
      language,
      code: text,
    };

    let error;

    if (editId === null) {
      ({ error } = await supabase
        .from("snippets")
        .insert([snippetData]));
    } else {
      ({ error } = await supabase
        .from("snippets")
        .update(snippetData)
        .eq("id", editId));
    }

    if (error) {
      console.log(error);
      return;
    }

    setEditId(null);
    setTitle("");
    setDescription("");
    setLanguage("");
    setText("");

    fetchSnippets(); // reload from DB
  }



  // Function to delete a snippet
  async function deleteSnippet(id) {
    const { error } = await supabase
      .from("snippets")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    fetchSnippets(); // reload from DB
  }

  async function fetchSnippets() {
    const { data, error } = await supabase
      .from("snippets")
      .select("*")
      .order("id", { ascending: false });

    if (error) console.log(error);
    else setSnippets(data);
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
          {editId === null ? "Save Snippet" : "Update Snippet"}
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
              setEditId(item.id);
            }}>
              Edit
          </button>

          <button onClick={() => deleteSnippet(item.id)}>Delete</button>

        </div>
      ))}
      </div>
    </div>
  );
}

export default App;
