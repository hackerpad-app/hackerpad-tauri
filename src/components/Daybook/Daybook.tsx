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
    <div className="flex w-full h-full">
      <Sidebar
        searchResults={searchResults}
        allNotes={allNotes}
        setCurrentNote={setCurrentNote}
      />
      <Editor currentNote={currentNote} changeNote={changeNote} />
    </div>
  );
}
