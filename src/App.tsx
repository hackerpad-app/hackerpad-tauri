import React, { useState, useEffect, ChangeEvent } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Modal from "./components/Modal.tsx";
import "./App.css";

interface Note {
  id: string;
  created_at: string;
  updated_at: string;
  headline: string;
  content: string;
}

function App() {
  // const [users, setUsers] = useState<User[]>([]);
  // const [currentUser, setCurrentUser] = useState<User>({ id: "", name: "" });

  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
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

  const fetchNotes = async () => {
    try {
      const fetchedNotes = await invoke("get_notes"); // Get notes from the database
      console.log("fetchedNotes", fetchedNotes);

      const notesArray = fetchedNotes as Note[]; // Parse the notes
      // console.log("Parsed notes", notesArray);

      setCurrentNote(notesArray[0]); // Set the first note as the current note
      setNotes(notesArray); // Put notes in a state to display in Sidebar
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalClose = (headline: string, content: string) => {
    addNote(headline, content);
    setShowModal(false); // Close the Modal
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

  const showAddModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowModal(true);
  };

  const handleRemove = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    try {
      const message = await invoke("remove_note", { id: currentNote.id });
      console.log("removeNote message: ", message);

      await fetchNotes(); // Refresh notes after removing
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
            <div className="w-1/2 h-full bg-red-500 text-xs">
              <form>
                <button type="button" onClick={showAddModal}>
                  Add new note
                </button>
              </form>
            </div>
            <div className="w-1/2 h-full bg-red-200 text-xs">
              <form onSubmit={handleRemove}>
                <button type="submit">Remove this note</button>
              </form>
            </div>
          </div>
          <div className="w-full h-7 bg-slate-500">search</div>
          <div className="w-full flex-grow bg-red-500">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="w-full h-10 bg-slate-400 flex flex-row items-center"
                >
                  <div className="w-3/4 h-full">{note.headline}</div>
                  <div className="w-1/4 h-full">{note.content}</div>
                </div>
              ))
            ) : (
              <div className="text-center">No notes</div>
            )}
          </div>
        </div>
      </div>
      <div className="display w-1/2 h-screen flex flex-row bg-[#5e3737] items-center border-2 border-[#aa4747]">
        <div className="flex w-full">
          <div className="w-3/4 h-10 bg-slate-400">{currentNote?.headline}</div>
          <div className="w-1/4 h-10 bg-slate-500">
            {currentNote?.created_at}
          </div>
        </div>
        <div className="w-full h-4/5 bg-black">{currentNote?.content}</div>
      </div>
    </div>
  );
}

export default App;

// useEffect(() => {
//   invoke("initialize_db")
//     .then((message) => console.log(message))
//     .catch((error) => console.error(error));
//   fetchUsers(); // Fetch users when the component mounts
// }, []);

// const addUser = async (name: string) => {
//   try {
//     const message = await invoke("add_user", { name });
//     console.log("addUser", message);
//     fetchUsers(); // Refresh users after adding
//   } catch (error) {
//     console.error(error);
//   }
// };

// const removeUser = async (id: string) => {
//   try {
//     const message = await invoke("remove_user", { id });
//     console.log("removeUser", message);
//     fetchUsers(); // Refresh users after removing
//   } catch (error) {
//     console.error(error);
//   }
// };

// const fetchUsers = async () => {
//   try {
//     const fetchedUsers = await invoke("get_users");
//     console.log("fetchedUsers", fetchedUsers);
//     const usersArray = fetchedUsers as User[];
//     console.log("Parsed Users", usersArray);
//     setUsers(usersArray);
//   } catch (error) {
//     console.error(error);
//   }
// };

// const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//   const { name, value } = e.target;
//   setCurrentUser((prevUser) => ({
//     ...prevUser,
//     [name]: value,
//   }));
// };

// const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   await addUser(currentUser.name);
//   setCurrentUser({ id: "", name: "" }); // Reset form
// };
