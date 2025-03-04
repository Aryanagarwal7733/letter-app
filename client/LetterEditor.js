import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const LetterEditor = ({ onSave }) => {
  const [content, setContent] = useState("");

  const handleSave = () => {
    onSave(content); // Pass letter content to parent component
  };

  return (
    <div className="editor-container">
      <ReactQuill theme="snow" value={content} onChange={setContent} />
      <button onClick={handleSave} className="save-button">
        Save Letter
      </button>
    </div>
  );
};

export default LetterEditor;
