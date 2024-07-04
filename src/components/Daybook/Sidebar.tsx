import Note from "./../../types/Note";
import SessionTimer from "./Pomodoro";

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

export default function Sidebar({
  searchResults,
  allNotes,
  setCurrentNote,
}: SidebarProps) {
  return (
    <div className="h-screen bg-dark-green flex flex-col justify-center items-center">
      <div className="w-full h-screen flex-col bg-dark-green p-5 mt-10">
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
