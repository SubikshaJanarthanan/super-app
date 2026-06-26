import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import {
  searchMoviesByGenre,
  fetchMovieDetails,
} from "../services/apiServices";

import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import styles from "./Movies.module.css";

export default function Movies() {
  const categories = useStore((s) => s.categories);
  const navigate = useNavigate();

  const [movieMap, setMovieMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const results = await Promise.allSettled(
          categories.map(async (g) => {
            const movies = await searchMoviesByGenre(g);
            return { genre: g, movies };
          })
        );

        const map = {};

        results.forEach((r) => {
          if (r.status === "fulfilled") {
            map[r.value.genre] = r.value.movies || [];
          } else {
            console.error("❌ Movie API failed:", r.reason);
          }
        });

        setMovieMap(map);
      } catch (err) {
        console.error("❌ Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [categories]);

  const openModal = async (imdbID) => {
    try {
      const details = await fetchMovieDetails(imdbID);

      if (!details || details.Response === "False") {
        alert("Movie details not found");
        return;
      }

      setSelected(details);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Could not load movie details.");
    }
  };

  return (
    <div className={styles.page}>
      {/* NAV */}
      <header className={styles.nav}>
        <div className={styles.navBrand}>⚡ Super App</div>

        <nav className={styles.navLinks}>
          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
          <button className={styles.navActive}>Movies</button>
        </nav>
      </header>

      <main className={styles.main}>
        <h1 className={styles.heading}>🎬 Movie Picks For You</h1>
        <p className={styles.sub}>
          Based on your selected categories
        </p>

        {loading && (
          <p className={styles.state}>Loading movies…</p>
        )}

        {!loading &&
          Object.entries(movieMap).map(([genre, movies]) => {
            const safeMovies = movies || [];

            return (
              <section key={genre} className={styles.section}>
                <h2 className={styles.genreTitle}>
                  <span className={styles.genrePill}>
                    {genre}
                  </span>
                </h2>

                {!safeMovies.length ? (
                  <p className={styles.empty}>
                    No results found for "{genre}".
                  </p>
                ) : (
                  <div className={styles.row}>
                    {safeMovies.map((m) => (
                      <MovieCard
                        key={m.imdbID}
                        movie={m}
                        onClick={() => openModal(m.imdbID)}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
      </main>

      {modalOpen && (
        <MovieModal
          movie={selected}
          onClose={() => {
            setModalOpen(false);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}