import React from "react";
import LetterEditor from "./LetterEditor";

const Dashboard = () => {
  const handleSaveLetter = async (letterContent) => {
    console.log("Saving letter:", letterContent);
    // TODO: Integrate Google Drive API here
  };

  return (
    <div>
      <h2>Write Your Letter</h2>
      <LetterEditor onSave={handleSaveLetter} />
    </div>
  );
};
const handleSaveLetter = async (letterContent) => {
    try {
      const response = await fetch("http://localhost:5000/api/letters/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: letterContent, title: "My Letter" }),
      });
  
      const data = await response.json();
      if (data.success) {
        alert("Letter saved to Google Drive!");
      } else {
        alert("Failed to save letter");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
export default Dashboard;
