import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Note from "./../types/Note";

export default function useNotes() {
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [displayedNote, setDisplayedNote] = useState<Note | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Note[]>([]);

  useEffect(() => {
    invoke("initialize_db")
      .then((message) => console.log(message))
      .catch((error) => console.error(error));
    fetchNotes();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      searchNotes(searchQuery);
    } else {
      setSearchResults([]); // Clear search results when query is deleted
    }
  }, [searchQuery]);

  const searchNotes = async (query: string) => {
    try {
      console.log("Searching notes with query: ", searchQuery);

      const searchedNotes = await invoke("search_notes", { search: query });
      const NotesArray = searchedNotes as Note[];
      setSearchResults(NotesArray);
    } catch (error) {
      console.error("Failed to search notes:", error);
    }
  };

  const fetchNotes = async () => {
    try {
      const fetchedNotes = await invoke("get_notes"); // Get Notes from the database

      const NotesArray = fetchedNotes as Note[]; // Parse the Notes
      console.log("Fetched Notes: ", NotesArray);

      if (NotesArray.length > 0) {
        setDisplayedNote(NotesArray[0]);
      } else {
        setDisplayedNote({
          id: "temp-id",
          headline: "Welcome to hackerpad :)",
          content: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      setAllNotes(NotesArray);
    } catch (error) {
      console.error(error);
    }
  };

  const createNote = async () => {
    try {
      await invoke("create_note");
      await fetchNotes();
    } catch (error) {
      console.error(error);
    }
  };

  const removeNote = async () => {
    try {
      if (displayedNote === null) return;

      const message = await invoke("remove_note", { id: displayedNote.id });
      console.log(message);
      await fetchNotes(); // Refresh Notes after removing a note
    } catch (error) {
      console.error(error);
    }
  };

  const updateNote = async (headline: string, content: string) => {
    try {
      if (displayedNote === null) return;

      await invoke("update_note", {
        id: displayedNote.id,
        headline,
        content,
      });
      await fetchNotes();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    createNote,
    removeNote,
    updateNote,
    setSearchQuery,
    setDisplayedNote,
    searchResults,
    allNotes,
    displayedNote,
  };
}
