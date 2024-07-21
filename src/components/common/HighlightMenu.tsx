import React, { useState } from "react";
import { BubbleMenu } from "@tiptap/react";
import { invoke } from "@tauri-apps/api/tauri";
import Note from "./../../types/Note";

interface HighlightMenuProps {
  editor: any; // Replace 'any' with the correct type from your editor library
}

const HighlightMenu: React.FC<HighlightMenuProps> = ({ editor }) => {
  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const performSearch = async (query: string) => {
    const searchedNotes = await invoke("search_notes", {
      search: query,
      pad: "issues",
      search_by_headline: true,
    });
    setSearchResults(searchedNotes as Note[]);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleHeadlineClick = async (note: Note) => {
    if (!editor.state.selection.empty) {
      const highlightedText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to,
        ""
      );

      let newContent = `${note.content.trimEnd()}<br>${highlightedText}`;

      try {
        await invoke("update_note", {
          id: note.id,
          headline: note.headline,
          content: newContent,
        });
        console.log("Issue updated successfully");
      } catch (error) {
        console.error("Error updating issue:", error);
      }
    } else {
      console.log("No text is highlighted.");
    }

    editor.commands.blur();
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <BubbleMenu
      editor={editor}
      className="transform -translate-x-8 translate-y-11 absolute rounded-lg p-2 bg-gray-800 bg-opacity-90 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-opacity-95"
    >
      <div className="flex flex-col">
        <div className="flex items-center">
          <button
            onClick={toggleSearch}
            className="text-gray-300 hover:text-white px-2 py-1 rounded transition duration-300 ease-in-out hover:bg-gray-700"
          >
            Issues
          </button>
          {isSearchOpen && (
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="ml-2 px-2 py-0.5 text-sm rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-gray-500 placeholder-gray-400 w-24"
            />
          )}
        </div>
        {isSearchOpen && searchQuery && (
          <div className="mt-2">
            <ul className="space-y-1">
              {searchResults.slice(0, 5).map((note) => (
                <li key={note.id}>
                  <button
                    className="w-full text-left px-2 py-0.5 rounded-md transition duration-300 ease-in-out text-gray-300 hover:bg-gray-700 hover:text-white text-sm truncate"
                    onClick={() => handleHeadlineClick(note)}
                  >
                    {note.headline}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </BubbleMenu>
  );
};

export default HighlightMenu;
