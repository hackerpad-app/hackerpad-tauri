import { PiNotePencilLight } from "react-icons/pi";
import { AiOutlineDelete } from "react-icons/ai";

import Note from "../../types/Note";

interface ToolsProps {
  pad: string;
  createNote: (pad: string) => Promise<void>;
  removeNote: (pad: string) => Promise<void>;
  updateNote: (pad: string, headline: string, content: string) => Promise<void>;
  displayedNote: Note | null;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const Tools = ({
  pad,
  removeNote,
  createNote,
  updateNote,
  displayedNote,
  setSearchQuery,
}: ToolsProps) => {
  const handleCreateNote = async () => {
    try {
      await createNote(pad);
      if (displayedNote) {
        await updateNote(pad, displayedNote.headline, displayedNote.content);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex justify-between">
      <div className="flex ml-2">
        <button onClick={handleCreateNote} className="mr-3 bg-transparent">
          <div className="py-4 text-bright-green" style={{ fontSize: "2rem" }}>
            <PiNotePencilLight />
          </div>
        </button>
        <button onClick={() => removeNote(pad)} className="bg-transparent">
          <div className="py-4 text-bright-green" style={{ fontSize: "2rem" }}>
            <AiOutlineDelete />
          </div>
        </button>
      </div>
      <div className="py-4 w-1/4">
        <input
          type="text"
          placeholder="Search"
          className="border rounded text- h-8 p-2 w-full bg-transparent"
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default Tools;
