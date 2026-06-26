import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import styles from "./Categories.module.css";

const GENRES = [
  { id: "action",   label: "Action",   emoji: "💥", bg: "#ff4757" },
  { id: "comedy",   label: "Comedy",   emoji: "😂", bg: "#ffa502" },
  { id: "drama",    label: "Drama",    emoji: "🎭", bg: "#a29bfe" },
  { id: "music",    label: "Music",    emoji: "🎵", bg: "#00b894" },
  { id: "sports",   label: "Sports",   emoji: "⚽", bg: "#0984e3" },
  { id: "thriller", label: "Thriller", emoji: "😱", bg: "#2d3436" },
  { id: "fantasy",  label: "Fantasy",  emoji: "🧙", bg: "#6c5ce7" },
  { id: "romance",  label: "Romance",  emoji: "💕", bg: "#fd79a8" },
];

const MIN = 3;

export default function Categories() {
  const setCategories = useStore((s) => s.setCategories);
  const navigate      = useNavigate();
  const [selected, setSelected] = useState([]);

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const handleContinue = () => {
    if (selected.length < MIN) return;
    setCategories(selected);
    navigate("/dashboard");
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>What do you love? 🎬</h1>
        <p>
          Pick at least <strong>{MIN} categories</strong> to personalise your dashboard.{" "}
          <span className={styles.count}>
            {selected.length} / {GENRES.length} selected
          </span>
        </p>
      </div>

      <div className={styles.grid}>
        {GENRES.map(({ id, label, emoji, bg }) => {
          const active = selected.includes(id);
          return (
            <button
              key={id}
              className={`${styles.card} ${active ? styles.active : ""}`}
              style={{ "--card-color": bg }}
              onClick={() => toggle(id)}
              aria-pressed={active}
            >
              <span className={styles.emoji}>{emoji}</span>
              <span className={styles.label}>{label}</span>
              {active && <span className={styles.check}>✓</span>}
            </button>
          );
        })}
      </div>

      <div className={styles.footer}>
        {selected.length < MIN && (
          <p className={styles.hint}>
            Select {MIN - selected.length} more to continue
          </p>
        )}
        <button
          className={styles.continueBtn}
          disabled={selected.length < MIN}
          onClick={handleContinue}
        >
          Continue to Dashboard →
        </button>
      </div>
    </div>
  );
}