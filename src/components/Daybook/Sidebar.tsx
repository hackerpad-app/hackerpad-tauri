import Note from "./../../types/Note";

interface SidebarProps {
  searchResults: Note[];
  allNotes: Note[];
  setCurrentNote: React.Dispatch<React.SetStateAction<Note>>;
}

export default function Sidebar({
  searchResults,
  allNotes,
  setCurrentNote,
}: SidebarProps) {
  return (
    <div className="main-container flex h-screen w-full bg-[#27c32c]">
      <div className="sidebar w-1/4 h-screen bg-[#2e0f0f] flex flex-col justify-center items-center border-2 border-[#2e0c0c]">
        <div className="w-full h-4/5 flex flex-col bg-black">
          <div className="flex-none w-full h-full pt-4 items-center">
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
              <div
                key={index}
                className="cursor-pointer flex flex-col w-full bg-transparent hover:bg-red-500 transition-colors duration-300 justify-between items-center rounded-lg"
                onClick={() => setCurrentNote(note)}
              >
                <div className="text-lg font-bold text-center">
                  {note.headline}
                </div>
                <div className="text-sm text-centre">
                  {note.content.split(" ").slice(0, 4).join(" ") + "..."}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
