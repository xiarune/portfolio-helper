import { useState } from "react";

function App() {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:3001/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Portfolio Helper</h1>
      <p className="subtitle">
        Paste a rough project description and get polished portfolio content
      </p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project... e.g., Built a web app that helps users track their daily habits using React and Firebase..."
          rows={6}
        />
        <button type="submit" disabled={loading || !description.trim()}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="results">
          <section>
            <h2>Summary</h2>
            <p>{result.summary}</p>
          </section>

          <section>
            <h2>Resume Bullet Points</h2>
            <ul>
              {result.bulletPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Portfolio Tags</h2>
            <div className="tags">
              {result.tags.map((tag, i) => (
                <span key={i} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
