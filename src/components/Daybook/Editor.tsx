import { useEffect } from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import Note from "../../types/Note";

import "./../../App.css";

interface EditorProps {
  currentNote: Note | null;
  changeNote: (headline: string, content: string) => void;
}

export default function Editor({ currentNote, changeNote }: EditorProps) {
  // const [confetti, setConfetti] = useState(false);
  // const [checkedCount, setCheckedCount] = useState(0);

  const headlineEditor = useEditor({
    extensions: [StarterKit],
    content: "",

    onUpdate: () => {
      let newHeadline = headlineEditor?.getHTML();
      if (newHeadline !== undefined) {
        if (currentNote) {
          let cleanedHeadline = newHeadline.replace(/<[^>]*>/g, "");
          changeNote(cleanedHeadline, currentNote.content);
        }
      }
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: ``,

    onUpdate: () => {
      let newContent = editor?.getHTML();
      if (newContent !== undefined) {
        if (currentNote) {
          changeNote(currentNote.headline, newContent);
        }
      }
    },
  });

  useEffect(() => {
    if (currentNote) {
      let wrappedHeadline = `<h1>${currentNote.headline}</h1>`;

      headlineEditor?.commands.setContent(wrappedHeadline);
      editor?.commands.setContent(currentNote.content);
    } else {
      headlineEditor?.commands.setContent("", false, {
        preserveWhitespace: "full",
      });
      editor?.commands.setContent("", false, { preserveWhitespace: "full" });
    }
  }, [currentNote, headlineEditor, editor]);

  return (
    <div className="bg-dark-green relative h-screen w-full">
      <div className="relative h-2/30 ">Kurde</div>
      <div className="relative h-1/10 border border-green-300">
        <EditorContent editor={headlineEditor} />
      </div>
      <div className="relative h-full border border-white overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
