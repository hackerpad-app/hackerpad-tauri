import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

import Note from "./../types/Note";

export default function useNotes() {
  const [allNotesDaybook, setAllNotesDaybook] = useState<Note[]>([]);
  const [allNotesIssues, setAllNotesIssues] = useState<Note[]>([]);

  const [displayedNoteIssues, setDisplayedNoteIssues] = useState<Note | null>(
    null
  );
  const [displayedNoteDaybook, setDisplayedNoteDaybook] = useState<Note | null>(
    null
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Note[]>([]);

  useEffect(() => {
    invoke("initialize_db_notes")
      .then((message) => console.log(message))
      .catch((error) => console.error(error));
    fetchNotes("daybook");
    fetchNotes("issues");
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

  const setDefaultNote = (pad: string) => ({
    id: "temp-id",
    headline: "👋 🌎 ",
    content: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pad,
  });

  const handleNotesArray = (pad: string, NotesArray: Note[]) => {
    const setNote =
      pad === "daybook" ? setDisplayedNoteDaybook : setDisplayedNoteIssues;
    const setAllNotes =
      pad === "daybook" ? setAllNotesDaybook : setAllNotesIssues;

    console.log("handling notes with ", pad);
    if (NotesArray.length > 0) {
      setNote(NotesArray[0]);
    } else {
      setNote(setDefaultNote(pad));
    }
    setAllNotes(NotesArray);
  };

  const fetchNotes = async (pad: string) => {
    try {
      const fetchedNotes = await invoke("get_notes", { pad });
      const NotesArray = fetchedNotes as Note[];
      console.log("Fetched Notes: ", NotesArray);

      handleNotesArray(pad, NotesArray);
    } catch (error) {
      console.error(`Failed to fetch notes for ${pad}:`, error);
    }
  };

  const createNote = async (pad: string) => {
    try {
      await invoke("create_note", { pad: pad });
      await fetchNotes(pad);
    } catch (error) {
      console.error(error);
    }
  };

  const removeNote = async (pad: string) => {
    try {
      let displayed = null; // Declare `displayed` outside the if-else blocks

      if (pad == "daybook") {
        displayed = displayedNoteDaybook;
      } else if (pad == "issues") {
        displayed = displayedNoteIssues;
      }

      if (displayed === null) return;

      const message = await invoke("remove_note", { id: displayed.id });
      console.log(message);
      await fetchNotes(pad); // Refresh Notes after removing a note
    } catch (error) {
      console.error(error);
    }
  };

  const updateNote = async (pad: string, headline: string, content: string) => {
    try {
      const displayedNote =
        pad === "issues" ? displayedNoteIssues : displayedNoteDaybook;

      if (displayedNote === null) return;

      await invoke("update_note", {
        id: displayedNote.id,
        headline,
        content,
      });
      await fetchNotes(pad);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    createNote,
    removeNote,
    updateNote,
    setSearchQuery,
    searchResults,
    allNotesDaybook,
    allNotesIssues,
    displayedNoteDaybook,
    displayedNoteIssues,
    setDisplayedNoteDaybook,
    setDisplayedNoteIssues,
  };
}
