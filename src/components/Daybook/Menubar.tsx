import { Editor } from "@tiptap/react";

interface IMenubarProp {
  editor: Editor;
}

export default function Menubar({ editor }: IMenubarProp) {
  const getFocus = () => editor.chain().focus();
  const isActive = (type: string, options?: any) => {
    return editor.isActive(type, options ?? {}) ? "is-active" : "";
  };

  const menus = [
    [
      {
        icon: "bold",
        onClick: () => getFocus().toggleBold().run(),
        isActive: isActive("bold"),
      },
      {
        icon: "italic",
        onClick: () => getFocus().toggleItalic().run(),
        isActive: isActive("italic"),
      },
      {
        icon: "strikethrough",
        onClick: () => getFocus().toggleStrike().run(),
        isActive: isActive("strike"),
      },
      {
        icon: "code-line",
        onClick: () => getFocus().toggleCode().run(),
        isActive: isActive("code"),
      },
      {
        icon: "h-1",
        onClick: () => getFocus().toggleHeading({ level: 1 }).run(),
        isActive: isActive("h-1"),
      },
      {
        icon: "h-2",
        onClick: () => getFocus().toggleHeading({ level: 2 }).run(),
        isActive: isActive("h-2"),
      },
      {
        icon: "list-unordered",
        onClick: () => getFocus().toggleBulletList().run(),
        isActive: isActive("list-unordered"),
      },
      {
        icon: "list-ordered",
        onClick: () => getFocus().toggleOrderedList().run(),
        isActive: isActive("list-ordered"),
      },
      {
        icon: "code-box-line",
        onClick: () => getFocus().toggleCodeBlock().run(),
        isActive: isActive("code-box-line"),
      },
      {
        icon: "list-check",
        onClick: () => getFocus().toggleTaskList().run(),
        isActive: isActive("task-item"),
      },
    ],
  ];

  return (
    <div className="flex gap-2 p-5 fixed z-10">
      {menus.map((group, groupIndex) => {
        return (
          <div className="group-item" key={groupIndex}>
            {group.map((item, itemIndex) => {
              return (
                <button
                  className="menu-item"
                  onClick={item.onClick}
                  key={itemIndex}
                >
                  <i className={`ri-${item.icon} ${item.isActive}`}></i>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
