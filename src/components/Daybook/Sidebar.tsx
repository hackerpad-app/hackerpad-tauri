import React, { useState, useEffect } from "react";

import Note from "./../../types/Note";
import SessionTimer from "./Pomodoro";

import { CiSettings } from "react-icons/ci";
import { PiBrainThin } from "react-icons/pi";
import { PiCalendarCheckThin } from "react-icons/pi";

interface SidebarProps {
  searchResults: Note[];
  allNotes: Note[];
  setCurrentNote: React.Dispatch<React.SetStateAction<Note>>;
}

interface NoteListProps {
  searchResults: Note[];
  allNotes: Note[];
  setCurrentNote: React.Dispatch<React.SetStateAction<Note>>;
}

interface NoteItemProps {
  note: Note;
  setCurrentNote: React.Dispatch<React.SetStateAction<Note>>;
}

interface PadsPanelProps {
  isVisible: boolean;
}

const NoteItem = ({ note, setCurrentNote }: NoteItemProps) => {
  return (
    <div
      className="cursor-pointer p-2 flex flex-row w-full bg-transparent border border-transparent hover:border-bright-green transition-colors duration-100 justify-between items-center rounded-lg"
      onClick={() => setCurrentNote(note)}
    >
      <div className="p-2">
        <div className="text-sm font-bold">{note.headline}</div>
        <div className="text-sm">
          {note.content.split(" ").slice(0, 4).join(" ") + "..."}
        </div>
      </div>
      <div className="text-xs text-center p-2 text-white opacity-25  self-start  flex-shrink-0">
        {new Date(note.created_at).toLocaleDateString()}
      </div>
    </div>
  );
};

function NoteList({ searchResults, allNotes, setCurrentNote }: NoteListProps) {
  return (
    <div
      style={{
        borderColor: "rgba(22, 163, 74, 0.5)",
        borderWidth: "2px",
        borderStyle: "solid",
      }}
      className="h-4/5 bg-transparent rounded-lg"
    >
      <div className="flex-none w-full h-full items-cente bg-transparent hover:border-dark-green">
        {(searchResults?.length > 0
          ? searchResults
          : allNotes.length > 0
          ? allNotes.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
          : []
        ).map((note: Note, index) => (
          <NoteItem key={index} note={note} setCurrentNote={setCurrentNote} />
        ))}
      </div>
    </div>
  );
}

const PadsPanel = ({ isVisible }: PadsPanelProps) => {
  return (
    <div
      style={{
        transition: "opacity 0.5s, visibility 0.1s",
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? "visible" : "hidden",
        background:
          "linear-gradient(180deg,rgba(41, 71, 42, 0.9) 40%, rgba(41, 71, 42, 0.1) 100%)",
      }}
      className=" relative h-screen bg-bright-green opacity-50 flex flex-col justify-between items-center py-10 p-5"
    >
      <div style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.2s" }}>
        <div className="py-4" style={{ fontSize: "30px" }}>
          <PiCalendarCheckThin />
        </div>
        <div className="py-4" style={{ fontSize: "30px" }}>
          <PiBrainThin />
        </div>
      </div>
      <div className="py-4" style={{ fontSize: "30px" }}>
        <CiSettings />
      </div>
    </div>
  );
};

export default function Sidebar({
  searchResults,
  allNotes,
  setCurrentNote,
}: SidebarProps) {
  const [showPadsPanel, setPadsPanel] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPadsPanel(e.clientX < 25);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative h-screen bg-dark-green">
      <div className="absolute top-0 left-0  h-full flex justify-start items-start">
        <PadsPanel isVisible={showPadsPanel} />
      </div>
      <div className="w-full h-screen flex flex-col bg-dark-green p-5 mt-10">
        <NoteList
          searchResults={searchResults}
          allNotes={allNotes}
          setCurrentNote={setCurrentNote}
        />
        <SessionTimer />
      </div>
    </div>
  );
}
