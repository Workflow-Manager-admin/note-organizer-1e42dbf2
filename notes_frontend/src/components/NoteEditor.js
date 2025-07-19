import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./NoteEditor.css";

/**
 * Note editor/viewer component for displaying and editing a single note.
 * @param {Object} note - The currently selected note.
 * @param {Function} onChange - Callback to update title/content (draft only).
 * @param {Function} onSave - Callback to persist changes.
 * @param {Function} onDelete - Callback to delete the note.
 * @param {boolean} isNew - If the note is newly created and not yet saved.
 */
function NoteEditor({ note, onChange, onSave, onDelete, isNew }) {
  const [isEditing, setIsEditing] = useState(isNew);
  const titleRef = useRef();

  useEffect(() => {
    setIsEditing(isNew);
    if (isNew && titleRef.current) titleRef.current.focus();
  }, [isNew, note?.id]);

  if (!note) {
    return (
      <div className="note-editor note-editor-empty">
        <p>Select a note or create one to get started!</p>
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function handleInputChange(e) {
    onChange({ ...note, [e.target.name]: e.target.value });
  }

  function handleSave() {
    setIsEditing(false);
    onSave();
  }

  function handleEdit() {
    setIsEditing(true);
    setTimeout(() => titleRef.current?.focus(), 100);
  }

  function handleDelete() {
    if (window.confirm("Delete this note? This action cannot be undone.")) {
      onDelete();
    }
  }

  return (
    <div className="note-editor">
      <div className="note-editor-header">
        {isEditing ? (
          <input
            ref={titleRef}
            name="title"
            value={note.title}
            onChange={handleInputChange}
            className="note-title-input"
            placeholder="Note title"
            maxLength={100}
            autoFocus
          />
        ) : (
          <h2 className="note-title">{note.title || "(Untitled Note)"}</h2>
        )}
        <div className="note-editor-actions">
          {!isEditing && (
            <button className="editor-btn accent" onClick={handleEdit}>
              Edit
            </button>
          )}
          {(isEditing || isNew) && (
            <button className="editor-btn primary" onClick={handleSave}>
              Save
            </button>
          )}
          <button className="editor-btn secondary" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
      <div className="note-editor-content">
        {isEditing || isNew ? (
          <textarea
            name="content"
            className="note-content-input"
            value={note.content}
            onChange={handleInputChange}
            placeholder="Write your note here..."
            rows={12}
          />
        ) : (
          <div className="note-content">{note.content || <em>(Empty note)</em>}</div>
        )}
      </div>
    </div>
  );
}

NoteEditor.propTypes = {
  note: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isNew: PropTypes.bool,
};

export default NoteEditor;

