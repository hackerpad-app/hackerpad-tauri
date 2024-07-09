import { useEffect } from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import Note from "../../types/Note";

import "./../../App.css";

interface EditorProps {
  displayedNote: Note | null;
  setDisplayedNote: React.Dispatch<React.SetStateAction<Note | null>>;
  createNote: () => Promise<void>;
  removeNote: () => Promise<void>;
  updateNote: (headline: string, content: string) => Promise<void>;
}

interface ToolsProps {
  createNote: () => Promise<void>;
  removeNote: () => Promise<void>;
  updateNote: (headline: string, content: string) => Promise<void>;
  displayedNote: Note | null;
}

const Tools = ({
  removeNote,
  createNote,
  updateNote,
  displayedNote,
}: ToolsProps) => {
  const handleCreateNote = async () => {
    try {
      await createNote();
      if (displayedNote) {
        await updateNote(displayedNote.headline, displayedNote.content);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-between p-2">
      <div className="flex">
        <button onClick={removeNote} className="mr-2">
          Delete
        </button>
        <button onClick={handleCreateNote}>Add</button>
      </div>
      <div>
        <input type="text" placeholder="Search" className="border rounded" />
      </div>
    </div>
  );
};

export default function Editor({
  displayedNote,
  setDisplayedNote,
  createNote,
  removeNote,
  updateNote,
}: EditorProps) {
  const headlineEditor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: () => {
      let newHeadline = headlineEditor?.getHTML();
      if (newHeadline !== undefined && displayedNote) {
        let cleanedHeadline = newHeadline.replace(/<[^>]*>/g, "");
        const newNote = { ...displayedNote, headline: cleanedHeadline };
        setDisplayedNote(newNote);
      }
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: ``,
    onUpdate: () => {
      let newContent = editor?.getHTML();
      if (newContent !== undefined && displayedNote) {
        const newNote = { ...displayedNote, content: newContent };
        setDisplayedNote(newNote);
      }
    },
  });

  useEffect(() => {
    if (displayedNote) {
      let wrappedHeadline = `<h1>${displayedNote.headline}</h1>`;
      headlineEditor?.commands.setContent(wrappedHeadline, false, {
        preserveWhitespace: true,
      });
      editor?.commands.setContent(displayedNote.content, false, {
        preserveWhitespace: true,
      });
    }
  }, [headlineEditor, editor, displayedNote]);

  return (
    <div className="bg-dark-green relative h-screen w-full">
      <div className="relative h-2/30 ">
        <Tools
          createNote={createNote}
          removeNote={removeNote}
          updateNote={updateNote}
          displayedNote={displayedNote}
        />
      </div>
      <div className="relative h-1/10 border border-green-300">
        <EditorContent editor={headlineEditor} />
      </div>
      <div className="relative h-full border border-white overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
