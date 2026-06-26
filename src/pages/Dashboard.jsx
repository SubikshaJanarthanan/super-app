import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import WeatherWidget from "../components/WeatherWidget";
import NewsWidget    from "../components/NewsWidget";
import TimerWidget   from "../components/TimerWidget";
import NotesWidget   from "../components/NotesWidget";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const user       = useStore((s) => s.user);
  const categories = useStore((s) => s.categories);
  const resetStore = useStore((s) => s.resetStore);
  const navigate   = useNavigate();

  const handleLogout = () => {
    resetStore();
    navigate("/");
  };

  return (
    <div className={styles.page}>
      {/* ── Top Nav ── */}
      <header className={styles.nav}>
        <div className={styles.navBrand}>⚡ Super App</div>
        <nav className={styles.navLinks}>
          <button onClick={() => navigate("/dashboard")} className={styles.navActive}>Dashboard</button>
          <button onClick={() => navigate("/movies")}>Movies</button>
          <button onClick={handleLogout} className={styles.logout}>Logout</button>
        </nav>
      </header>

      <main className={styles.grid}>
        {/* ── User Profile ── */}
        <section className={`${styles.card} ${styles.profile}`}>
          <div className={styles.avatar}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className={styles.profileInfo}>
            <h2>{user?.name}</h2>
            <p className={styles.meta}>@{user?.username}</p>
            <p className={styles.meta}>{user?.email}</p>
            <p className={styles.meta}>📱 {user?.mobile}</p>
          </div>
          <div className={styles.chips}>
            {categories.map((c) => (
              <span key={c} className={styles.chip}>{c}</span>
            ))}
          </div>
        </section>

        {/* ── Weather ── */}
        <section className={`${styles.card} ${styles.weather}`}>
          <WeatherWidget />
        </section>

        {/* ── News ── */}
        <section className={`${styles.card} ${styles.news}`}>
          <NewsWidget />
        </section>

        {/* ── Timer ── */}
        <section className={`${styles.card} ${styles.timer}`}>
          <TimerWidget />
        </section>

        {/* ── Notes ── */}
        <section className={`${styles.card} ${styles.notes}`}>
          <NotesWidget />
        </section>
      </main>
    </div>
  );
}