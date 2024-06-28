import React, { useState, useEffect } from "react";

import { invoke } from "@tauri-apps/api/tauri";

import { formatCreatedAt } from "./helpers/utils";
import Modal from "./components/Modal.tsx";
//import ModalChange from "./components/ModalChange.tsx";

import "./App.css";

interface Note {
  id: string;
  created_at: string;
  updated_at: string;
  headline: string;
  content: string;
}

function App() {
  const [Notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note>({
    id: "",
    created_at: "20.08.1998",
    updated_at: "20.08.2024",
    headline: "default-headline",
    content: "default-content",
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    invoke("initialize_db")
      .then((message) => console.log(message))
      .catch((error) => console.error(error));
    fetchNotes(); // Fetch users when the component mounts
  }, []);

  const fetchNotes = async () => {
    try {
      const fetchedNotes = await invoke("get_notes"); // Get Notes from the database
      console.log("fetchedNotes", fetchedNotes);

      const NotesArray = fetchedNotes as Note[]; // Parse the Notes
      setCurrentNote(NotesArray[0]); // Set the first Note on display
      setNotes(NotesArray); // Put Notes in a state to display in Sidebar
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalClose = (headline: string, content: string) => {
    addNote(headline, content);
    setShowModal(false);
  };

  const addNote = async (headline: string, content: string) => {
    try {
      const message = await invoke("add_note", { headline, content });
      console.log("addNote message: ", message);

      fetchNotes(); // Refresh users after adding
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    try {
      const message = await invoke("remove_note", { id: currentNote.id });
      console.log("removeNote message: ", message);

      await fetchNotes(); // Refresh Notes after removing
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    try {
      const message = await invoke("update_note", {
        id: currentNote.id,
        headline: currentNote.headline,
        content: currentNote.content,
      });
      console.log("update_Note message: ", message);

      await fetchNotes(); // Refresh Notes after updating
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="main-container flex h-screen w-full bg-[#27c32c]">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <Modal
            show={showModal}
            handleClose={() => setShowModal(false)}
            onClose={handleModalClose}
          />
        </div>
      )}
      <div className="sidebar w-1/4 h-screen bg-[#2e0f0f] flex flex-col justify-center items-center border-2 border-[#2e0c0c]">
        <div className="w-full h-4/5 flex flex-col bg-black">
          <div className="w-full h-16 flex flex-row bg-blue-100">
            <div className="w-1/3 h-full bg-red-500 text-xs">
              <form>
                <button type="button" onClick={() => setShowModal(true)}>
                  Add
                </button>
              </form>
            </div>
            <div className="w-1/3 h-full bg-red-400 text-xs">
              <form onSubmit={handleChange}>
                <button type="submit">Change</button>
              </form>
            </div>
            <div className="w-1/3 h-full bg-red-300 text-xs">
              <form onSubmit={handleRemove}>
                <button type="submit">Remove</button>
              </form>
            </div>
          </div>
          <div className="w-full h-7 bg-slate-500">search</div>
          <div className="flex-none w-full h-full pt-4 items-center">
            {Notes.length > 0
              ? Notes.sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                ).map((Note: Note, index) => (
                  <div
                    key={index}
                    className="cursor-pointer flex flex-col w-full bg-transparent hover:bg-red-500 transition-colors duration-300 justify-between items-center rounded-lg"
                    onClick={() => setCurrentNote(Note)}
                  >
                    <div className="text-lg font-bold text-center">
                      {Note.headline}
                    </div>
                    <div className="text-sm text-centre">
                      {Note.content.split(" ").slice(0, 4).join(" ") + "..."}
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
      <div className="display w-1/2 h-screen flex flex-row bg-[#5e3737] items-center border-2 border-[#aa4747]">
        <div className="flex w-full">
          <div className="w-3/4 h-10 bg-slate-400">{currentNote?.headline}</div>
          <div className="w-1/4 h-10 bg-slate-500">
            {formatCreatedAt(currentNote?.created_at)}
          </div>
        </div>
        <div className="w-full h-4/5 bg-black">{currentNote?.content}</div>
      </div>
    </div>
  );
}

export default App;
