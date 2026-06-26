import { Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import Register   from "../pages/Register";
import Categories from "../pages/Categories";
import Dashboard  from "../pages/Dashboard";
import Movies     from "../pages/Movies";

// ── Guard: blocks route unless predicate passes ──────────────────────────────
const Guard = ({ check, fallback, children }) =>
  check ? children : <Navigate to={fallback} replace />;

export default function AppRoutes() {
  const user       = useStore((s) => s.user);
  const categories = useStore((s) => s.categories);

  const hasUser = Boolean(user);
  const hasCats = categories.length >= 3;

  return (
    <Routes>
      <Route path="/" element={<Register />} />

      <Route
        path="/categories"
        element={
          <Guard check={hasUser} fallback="/">
            <Categories />
          </Guard>
        }
      />

      <Route
        path="/dashboard"
        element={
          <Guard check={hasUser && hasCats} fallback={hasUser ? "/categories" : "/"}>
            <Dashboard />
          </Guard>
        }
      />

      <Route
        path="/movies"
        element={
          <Guard check={hasUser && hasCats} fallback={hasUser ? "/categories" : "/"}>
            <Movies />
          </Guard>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}