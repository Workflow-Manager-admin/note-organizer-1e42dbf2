import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";
import "./App.css";
import "./components/Sidebar.css";
import "./components/NoteEditor.css";

// Theme color variables for palette
const THEME_COLORS = {
  "--primary": "#3498db",
  "--secondary": "#2ecc71",
  "--accent": "#e67e22",
  "--bg-primary": "#fff",
  "--bg-secondary": "#f8f9fa",
  "--text-primary": "#222",
  "--text-secondary": "#7c868e",
};

function applyThemeVars() {
  for (const [key, val] of Object.entries(THEME_COLORS)) {
    document.documentElement.style.setProperty(key, val);
  }
}

// Loads and saves notes to localStorage
const NOTES_KEY = "note-organizer-notes-v1";

/**
 * Retrieves notes from localStorage or returns an empty array.
 */
function loadNotes() {
  try {
    const stored = window.localStorage.getItem(NOTES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Stores notes array to localStorage.
 * @param {Array} notes
 */
function saveNotes(notes) {
  window.localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

/**
 * Generates a short random string for IDs.
 */
function generateId() {
  return Math.random().toString(36).slice(2, 12) + Date.now();
}

/**
 * The main app component for the notes organizer.
 */
// PUBLIC_INTERFACE
function App() {
  // App-wide notes state
  const [notes, setNotes] = useState([]);
  // id of the currently selected note
  const [activeId, setActiveId] = useState(null);

  // newNoteDraft is the draft content while creating a new note
  const [newNoteDraft, setNewNoteDraft] = useState({ title: "", content: "" });
  // editDraft is the draft for edit
  const [editDraft, setEditDraft] = useState(null);

  // Load notes from localStorage on mount
  useEffect(() => {
    applyThemeVars();
    const ns = loadNotes();
    setNotes(Array.isArray(ns) ? ns : []);
    if (ns.length) setActiveId(ns[0].id);
  }, []);

  // Save notes on any update
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  // Select a note by ID
  // PUBLIC_INTERFACE
  const handleSelectNote = useCallback(
    (id) => {
      setActiveId(id);
      setEditDraft(null);
      setNewNoteDraft({ title: "", content: "" });
    },
    [setActiveId]
  );

  // Create a new note (sets draft)
  // PUBLIC_INTERFACE
  const handleNewNote = useCallback(() => {
    setActiveId(null);
    setEditDraft({ title: "", content: "" });
    setNewNoteDraft({ title: "", content: "" });
  }, []);

  // Handle change in note editor (for both new/edit)
  // PUBLIC_INTERFACE
  const handleDraftChange = (draft) => {
    if (activeId === null) {
      setNewNoteDraft(draft);
    } else {
      setEditDraft(draft);
    }
  };

  // Save new note
  // PUBLIC_INTERFACE
  const handleSaveNew = () => {
    if (!newNoteDraft.title.trim() && !newNoteDraft.content.trim()) return;
    const newNote = {
      ...newNoteDraft,
      id: generateId(),
      created: Date.now(),
      updated: Date.now(),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    setActiveId(newNote.id);
    setNewNoteDraft({ title: "", content: "" });
    setEditDraft(null);
  };

  // Delete note (new or existing)
  // PUBLIC_INTERFACE
  const handleDeleteNote = () => {
    if (activeId === null) {
      setNewNoteDraft({ title: "", content: "" });
      setEditDraft(null);
      return;
    }
    const updated = notes.filter((n) => n.id !== activeId);
    setNotes(updated);
    setActiveId(updated.length ? updated[0].id : null);
    setEditDraft(null);
    setNewNoteDraft({ title: "", content: "" });
  };

  // Start editing an existing note
  // PUBLIC_INTERFACE
  useEffect(() => {
    if (activeId !== null) {
      const n = notes.find((x) => x.id === activeId);
      if (n && !editDraft) setEditDraft(n);
    }
  }, [activeId, notes]); // eslint-disable-line

  // Save edited note
  // PUBLIC_INTERFACE
  const handleSaveEdit = () => {
    if (!editDraft) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeId
          ? { ...n, title: editDraft.title, content: editDraft.content, updated: Date.now() }
          : n
      )
    );
    setEditDraft(null);
  };

  // Determine which note to show and if it's new
  let showNote = null;
  let isNew = false;
  if (activeId === null && (newNoteDraft.title || newNoteDraft.content)) {
    showNote = { ...newNoteDraft };
    isNew = true;
  } else if (activeId !== null) {
    showNote = editDraft
      ? { ...editDraft }
      : notes.find((n) => n.id === activeId);
    isNew = false;
  }

  return (
    <div className="NotesAppRoot">
      <header className="NotesHeader">
        <h1>
          <span role="img" aria-label="notes">📝</span> Notes Organizer
        </h1>
      </header>
      <div className="NotesBody">
        <Sidebar
          notes={notes}
          activeId={activeId}
          onSelect={handleSelectNote}
          onNew={handleNewNote}
        />
        <main className="NotesMain">
          <NoteEditor
            note={showNote}
            onChange={handleDraftChange}
            onSave={isNew ? handleSaveNew : handleSaveEdit}
            onDelete={handleDeleteNote}
            isNew={isNew}
          />
        </main>
      </div>
      <footer className="NotesFooter">
        <span>
          Lightweight Notes Organizer &copy; {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
}

export default App;
