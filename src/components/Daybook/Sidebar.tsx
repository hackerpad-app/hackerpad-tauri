import React, { useState, useEffect } from "react";

import Note from "./../../types/Note";
import SessionTimer from "./Pomodoro";

import { CiSettings } from "react-icons/ci";
import { PiBrainThin } from "react-icons/pi";
import { PiCalendarCheckThin } from "react-icons/pi";
import { PiBugBeetleThin } from "react-icons/pi";

interface SidebarProps {
  searchResults: Note[];
  allNotes: Note[];
  setDisplayedNote: React.Dispatch<React.SetStateAction<Note | null>>;
  displayedNote: Note | null;
  updateNote: (headline: string, content: string) => Promise<void>;
}

interface NoteListProps {
  searchResults: Note[];
  allNotes: Note[];
  updateNote: (headline: string, content: string) => Promise<void>;
  displayedNote: Note | null;
  setDisplayedNote: React.Dispatch<React.SetStateAction<Note | null>>;
}

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  updateNote: (headline: string, content: string) => Promise<void>;
  displayedNote: Note | null;
  setDisplayedNote: React.Dispatch<React.SetStateAction<Note | null>>;
  handleSelectNote: (note: Note) => void; // Add this line
}

interface PadsPanelProps {
  isVisible: boolean;
}

const NoteItem = ({
  note,
  updateNote,
  displayedNote,
  handleSelectNote,
  setDisplayedNote,
  isSelected,
}: NoteItemProps) => {
  const handleClick = async () => {
    if (displayedNote && displayedNote.id !== note.id) {
      await updateNote(displayedNote.headline, displayedNote.content);
    }
    handleSelectNote(note); // Call this instead of setDisplayedNote
    setDisplayedNote(note);
  };

  return (
    <div
      className={`cursor-pointer p-2 flex flex-row bg-transparent border ${
        isSelected ? "border-bright-green" : "border-transparent"
      } hover:border-bright-green transition-colors duration-100 justify-between items-center rounded-lg`}
      onClick={handleClick}
    >
      <div className="p-2">
        <div className="text-sm font-bold">
          {note.headline.length > 15
            ? note.headline.substring(0, 15).replace(/<[^>]*>/g, "") + "..."
            : note.headline.replace(/<[^>]*>/g, "")}
        </div>
        <div className="text-sm">
          {note.content.length > 15
            ? note.content.substring(0, 15).replace(/<[^>]*>/g, "") + "..."
            : note.content.replace(/<[^>]*>/g, "")}
        </div>
      </div>
      <div className="text-xs text-center p-2 text-white opacity-25  self-start  flex-shrink-0">
        {new Date(note.created_at).toLocaleDateString()}
      </div>
    </div>
  );
};

function NoteList({
  searchResults,
  allNotes,
  setDisplayedNote,
  updateNote,
  displayedNote,
}: NoteListProps) {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const handleSelectNote = (note: Note) => {
    setSelectedNoteId(note.id);
    setDisplayedNote(note);
  };

  return (
    <div
      style={{
        borderColor: "rgba(22, 163, 74, 0.5)",
        borderWidth: "2px",
        borderStyle: "solid",
        zIndex: 0,
      }}
      className="h-4/5 bg-transparent rounded-lg"
    >
      <div className="flex-none  h-full items-cente bg-transparent hover:border-dark-green">
        {(searchResults?.length > 0
          ? searchResults
          : allNotes.length > 0
          ? allNotes.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
          : []
        ).map((note: Note) => (
          <NoteItem
            key={note.id}
            note={note}
            isSelected={note.id === selectedNoteId}
            updateNote={updateNote}
            displayedNote={displayedNote}
            setDisplayedNote={setDisplayedNote}
            handleSelectNote={handleSelectNote} // Pass this function
          />
        ))}
      </div>
    </div>
  );
}

const PadsPanel = ({
  isVisible,
  onMouseEnter,
  onMouseLeave,
}: PadsPanelProps & { onMouseEnter: () => void; onMouseLeave: () => void }) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        transition: "opacity 0.5s, visibility 0.1s",
        opacity: isVisible ? 1 : 0,
        zIndex: isVisible ? 10 : -1,
        visibility: isVisible ? "visible" : "hidden",
        background:
          "linear-gradient(180deg,rgba(41, 71, 42, 0.9) 40%, rgba(41, 71, 42, 0.1) 100%)",
        pointerEvents: isVisible ? "auto" : "none", // Disable pointer events when not visible
      }}
      className=" relative h-screen bg-bright-green opacity-50 flex flex-col justify-between items-center py-10 p-5"
    >
      <div style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.2s" }}>
        <div className="py-4" style={{ fontSize: "30px" }}>
          <PiCalendarCheckThin />
        </div>
        <div className="py-4" style={{ fontSize: "30px" }}>
          <PiBugBeetleThin />
        </div>
        <div className="py-4" style={{ fontSize: "30px" }}>
          <PiBrainThin />
        </div>
        <div className="py-4" style={{ fontSize: "30px" }}>
          <CiSettings />
        </div>
      </div>
    </div>
  );
};

export default function Sidebar({
  searchResults,
  allNotes,
  updateNote,
  displayedNote,
  setDisplayedNote,
}: SidebarProps) {
  const [showPadsPanel, setPadsPanel] = useState(false);
  const [isMouseOverPanel, setIsMouseOverPanel] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPadsPanel(e.clientX < 1 || isMouseOverPanel);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMouseOverPanel]); // Add isMouseOverPanel as a dependency

  return (
    <div className="relative w-screen h-screen bg-dark-green">
      <div className="absolute top-0 left-0  h-full flex justify-start items-start">
        <PadsPanel
          isVisible={showPadsPanel}
          onMouseEnter={() => setIsMouseOverPanel(true)}
          onMouseLeave={() => setIsMouseOverPanel(false)}
        />{" "}
      </div>
      <div className="h-screen flex flex-col bg-dark-green p-5 mt-10">
        <NoteList
          searchResults={searchResults}
          allNotes={allNotes}
          updateNote={updateNote}
          displayedNote={displayedNote}
          setDisplayedNote={setDisplayedNote}
        />
        <SessionTimer />
      </div>
    </div>
  );
}
