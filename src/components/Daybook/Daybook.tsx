import useNotes from "./../../hooks/useNotes";
import Sidebar from "./Sidebar";
import Editor from "./Editor";

export default function Daybook() {
  const {
    fetchNotes,
    addNote,
    removeNote,
    changeNote,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    allNotes,
    setAllNotes,
    currentNote,
    setCurrentNote,
  } = useNotes();

  return (
    <div className="flex flex-row  bg-slate-500">
      <div className="flex w-1/5 h-full">
        <Sidebar
          searchResults={searchResults}
          allNotes={allNotes}
          setCurrentNote={setCurrentNote}
        />
      </div>
      <div className="flex w-4/5 h-full">
        <Editor currentNote={currentNote} changeNote={changeNote} />
      </div>
    </div>
  );
}
