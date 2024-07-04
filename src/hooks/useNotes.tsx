import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Note from "./../types/Note";

export default function useNotes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Note[]>([]);

  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note>({
    id: "",
    created_at: "20.08.1998",
    updated_at: "20.08.2024",
    headline: "default-headline",
    content: "default-content",
  });

  useEffect(() => {
    invoke("initialize_db")
      .then((message) => console.log(message))
      .catch((error) => console.error(error));
    fetchNotes(); // Fetch users when the component mounts
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
      console.log("query to search: ", searchQuery);

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
      console.log("fetchedNotes", fetchedNotes);

      const NotesArray = fetchedNotes as Note[]; // Parse the Notes
      setCurrentNote(NotesArray[0]); // Set the first Note on display
      setAllNotes(NotesArray); // Put Notes in a state to display in Sidebar
    } catch (error) {
      console.error(error);
    }
  };

  const addNote = async (headline: string, content: string) => {
    try {
      await invoke("add_note", { headline, content });
      fetchNotes(); // Refresh users after adding
    } catch (error) {
      console.error(error);
    }
  };

  const removeNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    try {
      const message = await invoke("remove_note", { id: currentNote.id });
      console.log("removeNote message: ", message);

      await fetchNotes(); // Refresh Notes after removing
    } catch (error) {
      console.error(error);
    }
  };

  const changeNote = async (headline: string, content: string) => {
    try {
      await invoke("update_note", {
        id: currentNote.id,
        headline,
        content,
      });
      fetchNotes();
    } catch (error) {
      console.error(error);
    }
  };

  return {
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
  };
}