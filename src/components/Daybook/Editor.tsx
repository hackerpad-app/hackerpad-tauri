import { useEffect } from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import Note from "../../types/Note";

import "./../../App.css";

interface EditorProps {
  displayedNote: Note | null;
  updateNote: (headline: string, content: string) => void;
  createNote: (headline: string, content: string) => void;
  removeNote: () => Promise<void>;
}

interface ToolsProps {
  createNote: (headline: string, content: string) => void;
  removeNote: () => Promise<void>;
}

const Tools = ({ removeNote, createNote }: ToolsProps) => {
  const handleCreateNote = () => {
    createNote("", "");
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
  updateNote,
  createNote,
  removeNote,
}: EditorProps) {
  const headlineEditor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: () => {
      let newHeadline = headlineEditor?.getHTML();
      if (newHeadline !== undefined && displayedNote) {
        let cleanedHeadline = newHeadline.replace(/<[^>]*>/g, "");
        updateNote(cleanedHeadline, displayedNote.content);
      }
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: ``,
    onUpdate: () => {
      let newContent = editor?.getHTML();
      if (newContent !== undefined && displayedNote) {
        updateNote(displayedNote.headline, newContent);
      }
    },
  });

  useEffect(() => {
    if (displayedNote) {
      let wrappedHeadline = `<h1>${displayedNote.headline}</h1>`;
      headlineEditor?.commands.setContent(wrappedHeadline);
      editor?.commands.setContent(displayedNote.content);
    }
  }, [headlineEditor, editor, displayedNote]);

  return (
    <div className="bg-dark-green relative h-screen w-full">
      <div className="relative h-2/30 ">
        <Tools createNote={createNote} removeNote={removeNote} />
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
