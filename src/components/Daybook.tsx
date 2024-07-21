import useNotes from "../hooks/useNotes";
import Sidebar from "./common/Sidebar";
import Editor from "./common/Editor";

interface DaybookProps {
  pad: string;
  setPad: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Daybook({ pad, setPad }: DaybookProps) {
  const {
    createNote,
    removeNote,
    updateNote,
    setSearchQuery,
    searchResults,
    allNotesDaybook,
    displayedNoteDaybook,
    setDisplayedNoteDaybook,
  } = useNotes(pad);

  return (
    <div className="flex flex-row">
      <div className="flex w-1/5 h-full overflow-hidden">
        <Sidebar
          pad={pad}
          setPad={setPad}
          updateNote={updateNote}
          searchResults={searchResults}
          allNotes={allNotesDaybook}
          setDisplayedNote={setDisplayedNoteDaybook}
          displayedNote={displayedNoteDaybook}
        />
      </div>
      <div className="w-4/5 h-full overflow-y-auto bg-dark-green">
        <Editor
          pad={pad}
          createNote={createNote}
          removeNote={removeNote}
          updateNote={updateNote}
          setSearchQuery={setSearchQuery}
          displayedNote={displayedNoteDaybook}
          setDisplayedNote={setDisplayedNoteDaybook}
        />
      </div>
    </div>
  );
}
