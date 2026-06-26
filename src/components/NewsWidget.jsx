import { useEffect, useState, useRef } from "react";
import { fetchTopHeadlines } from "../services/apiServices";
import newsStyles from "./../widgets/NewsWidget.module.css";

export function NewsWidget() {
  const [articles, setArticles] = useState([]);
  const [idx,      setIdx]      = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchTopHeadlines()
      .then((arts) => setArticles(arts.filter((a) => a.urlToImage)))
      .catch(() => setError("Could not load news."))
      .finally(() => setLoading(false));
  }, []);

  // Auto-rotate every 2 s
  useEffect(() => {
    if (!articles.length) return;
    intervalRef.current = setInterval(
      () => setIdx((i) => (i + 1) % articles.length),
      2000
    );
    return () => clearInterval(intervalRef.current);
  }, [articles]);

  if (loading) return <div className={newsStyles.widget}><p className={newsStyles.state}>Loading news…</p></div>;
  if (error)   return <div className={newsStyles.widget}><p className={newsStyles.error}>{error}</p></div>;
  if (!articles.length) return <div className={newsStyles.widget}><p>No articles found.</p></div>;

  const a = articles[idx];
  return (
    <div className={newsStyles.widget}>
      <div className={newsStyles.header}>
        <h3 className={newsStyles.title}>📰 News</h3>
        <span className={newsStyles.counter}>{idx + 1} / {articles.length}</span>
      </div>

      {a.urlToImage && (
        <img src={a.urlToImage} alt="" className={newsStyles.img} />
      )}
      <p className={newsStyles.headline}>{a.title}</p>
      <p className={newsStyles.desc}>{a.description}</p>
      <p className={newsStyles.source}>{a.source?.name}</p>

      <div className={newsStyles.dots}>
        {articles.slice(0, 8).map((_, i) => (
          <span
            key={i}
            className={i === idx % 8 ? newsStyles.dotActive : newsStyles.dot}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default NewsWidget;

