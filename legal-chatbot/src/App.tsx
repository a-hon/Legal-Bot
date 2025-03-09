import { useState } from "react";
import { Loader } from "lucide-react"; // Icon for loading state
import './App.css'; // Import the new CSS file

function LegalChatbot() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:8000/api/ask-legal-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data.answer);
      } else {
        setResponse("Error: Unable to get a response.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error: Unable to communicate with backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="chatbot-card">
        <h1 className="title">Legal Yes/No Chatbot</h1>
        <p className="description">Ask a legal question and get a yes/no response.</p>
        
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a legal question..."
            className="input"
            required
          />
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? <Loader className="loader" /> : "Ask"}
          </button>
        </form>

        {response && (
          <div className="response-container">
            <p className="response-title">Response:</p>
            <p className="response-text">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LegalChatbot;
