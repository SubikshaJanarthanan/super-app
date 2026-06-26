import { useStore } from "../store/useStore";
import notesStyles from "../widgets/NotesWidget.module.css";

export function NotesWidget() {
  const notes    = useStore((s) => s.notes);
  const setNotes = useStore((s) => s.setNotes);

  return (
    <div className={notesStyles.widget}>
      <div className={notesStyles.header}>
        <h3 className={notesStyles.title}>📝 Notes</h3>
        <button className={notesStyles.clear} onClick={() => setNotes("")}>Clear</button>
      </div>
      <textarea
        className={notesStyles.area}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Jot something down… it's saved automatically."
        spellCheck
      />
      <p className={notesStyles.saved}>
        {notes.length > 0 ? `✓ Saved · ${notes.length} chars` : "Nothing saved yet."}
      </p>
    </div>
  );
}

export default NotesWidget;