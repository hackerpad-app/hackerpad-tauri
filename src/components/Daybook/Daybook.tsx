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
    <div className="flex flex-row h-full">
      <div className="flex w-1/5 h-full overflow-hidden">
        <Sidebar
          searchResults={searchResults}
          allNotes={allNotes}
          setCurrentNote={setCurrentNote}
        />
      </div>
      <div className="flex w-4/5 overflow-y-auto bg-dark-green">
        <Editor
          currentNote={currentNote}
          changeNote={changeNote}
          addNote={addNote}
          removeNote={removeNote}
        />
      </div>
    </div>
  );
}
