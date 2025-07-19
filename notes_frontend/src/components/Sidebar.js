import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Sidebar.css";

/**
 * Sidebar displaying searchable notes list and new note button.
 * @param {Object[]} notes - List of note objects.
 * @param {string} activeId - ID of currently active note.
 * @param {Function} onSelect - Callback when a note is selected.
 * @param {Function} onNew - Callback to create a new note.
 */
function Sidebar({ notes, activeId, onSelect, onNew }) {
  const [query, setQuery] = useState("");

  // PUBLIC_INTERFACE
  function handleSearch(e) {
    setQuery(e.target.value);
  }

  const filtered = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <input
          className="sidebar-search"
          placeholder="Search notes..."
          value={query}
          onChange={handleSearch}
        />
        <button className="sidebar-new-btn" onClick={onNew} title="New note">
          ＋
        </button>
      </div>
      <ul className="sidebar-list">
        {filtered.length === 0 && (
          <li className="sidebar-empty">No notes found</li>
        )}
        {filtered.map((note) => (
          <li
            key={note.id}
            className={`sidebar-item${activeId === note.id ? " active" : ""}`}
            onClick={() => onSelect(note.id)}
            title={note.title}
            tabIndex={0}
          >
            <div className="sidebar-item-title">{note.title || "(Untitled Note)"}</div>
            <div className="sidebar-item-snippet">
              {note.content.split("\n")[0].slice(0, 30)}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

Sidebar.propTypes = {
  notes: PropTypes.array.isRequired,
  activeId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onNew: PropTypes.func.isRequired,
};

export default Sidebar;

