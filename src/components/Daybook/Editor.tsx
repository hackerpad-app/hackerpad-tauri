import { useEffect } from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import Note from "../../types/Note";

import "./../../App.css";

interface EditorProps {
  currentNote: Note | null;
  changeNote: (headline: string, content: string) => void;
  addNote: (headline: string, content: string) => void;
  removeNote: () => void;
}

interface ToolsProps {
  removeNote: () => void;
  addNote: (headline: string, content: string) => void;
}

const Tools = ({ removeNote, addNote }: ToolsProps) => {
  const handleAddNote = () => {
    addNote("", "");
  };

  return (
    <div className="flex justify-between p-2">
      <div className="flex">
        <button onClick={removeNote} className="mr-2">
          Delete
        </button>
        <button onClick={handleAddNote}>Add</button>
      </div>
      <div>
        <input type="text" placeholder="Search" className="border rounded" />
      </div>
    </div>
  );
};

export default function Editor({
  currentNote,
  changeNote,
  addNote,
  removeNote,
}: EditorProps) {
  const headlineEditor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: () => {
      let newHeadline = headlineEditor?.getHTML();
      if (newHeadline !== undefined && currentNote) {
        let cleanedHeadline = newHeadline.replace(/<[^>]*>/g, "");
        changeNote(cleanedHeadline, currentNote.content);
      }
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: ``,
    onUpdate: () => {
      let newContent = editor?.getHTML();
      if (newContent !== undefined && currentNote) {
        changeNote(currentNote.headline, newContent);
      }
    },
  });

  useEffect(() => {
    if (currentNote) {
      let wrappedHeadline = `<h1>${currentNote.headline}</h1>`;
      headlineEditor?.commands.setContent(wrappedHeadline);
      editor?.commands.setContent(currentNote.content);
    }
  }, [headlineEditor, editor, currentNote]);

  return (
    <div className="bg-dark-green relative h-screen w-full">
      <div className="relative h-2/30 ">
        <Tools addNote={addNote} removeNote={removeNote} />
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
