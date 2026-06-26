import { useEffect } from "react";
import styles from "./MovieModal.module.css";

export function MovieModal({ movie, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!movie) return null;

  const {
    Poster, Title, Year, Genre, imdbRating,
    Runtime, Plot, Actors, Director, Language,
  } = movie;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>✕</button>

        <div className={styles.body}>
          <img
            src={Poster !== "N/A" ? Poster : "/placeholder.png"}
            alt={Title}
            className={styles.poster}
          />
          <div className={styles.info}>
            <h2 className={styles.movieTitle}>{Title}</h2>
            <div className={styles.badges}>
              <span className={styles.badge}>{Year}</span>
              <span className={styles.badge}>{Runtime}</span>
              <span className={`${styles.badge} ${styles.rating}`}>⭐ {imdbRating}</span>
            </div>
            <p className={styles.genre}>{Genre}</p>
            <p className={styles.plot}>{Plot}</p>
            <div className={styles.meta}>
              <MetaRow label="Director" value={Director} />
              <MetaRow label="Cast"     value={Actors}   />
              <MetaRow label="Language" value={Language} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const MetaRow = ({ label, value }) => (
  <div style={{ marginBottom: "0.5rem" }}>
    <span style={{ fontWeight: 700, color: "#555", fontSize: "0.8rem", textTransform: "uppercase" }}>
      {label}:{" "}
    </span>
    <span style={{ color: "#333", fontSize: "0.88rem" }}>{value}</span>
  </div>
);

export default MovieModal;

