import { useEffect, useState } from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Confetti from "react-dom-confetti";

import Menubar from "./Menubar";
import Note from "../../types/Note";

import "./../../App.css";

interface EditorProps {
  currentNote: Note | null;
  changeNote: (headline: string, content: string) => void;
}

export default function Editor({ currentNote, changeNote }: EditorProps) {
  const [confetti, setConfetti] = useState(false);
  const [checkedCount, setCheckedCount] = useState(0);

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
    extensions: [StarterKit, TaskList, TaskItem],
    content: ``,

    onUpdate: () => {
      let newContent = editor?.getHTML();
      if (newContent !== undefined) {
        if (currentNote) {
          changeNote(currentNote.headline, newContent);
          let newCheckedCount = (
            newContent.match(/<input type="checkbox" checked="checked">/g) || []
          ).length;
          if (newCheckedCount > checkedCount) {
            setConfetti(true);
            setTimeout(() => setConfetti(false), 100);
          }
          setCheckedCount(newCheckedCount);
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
    <div className="main-editor">
      {editor ? <Menubar editor={editor} /> : null}
      <div className="border-b border-[rgba(255,255,255,0.146)] mt-8">
        <EditorContent editor={headlineEditor} />
      </div>
      <EditorContent editor={editor} />
      <Confetti active={confetti} />
    </div>
  );
}
