
import { NoteList } from './NoteList';

export type State = {
  noteLists: NoteList[];
  selectedNoteList: NoteList | null;
  selectNoteList: (NoteList: NoteList | null) => void;
  getNoteLists: () => void;
  createNoteList: (name: string) => void;
  deleteNoteList: (listId: number) => void;
  renameNoteList: (newName: string) => void; 
  createNoteItem: () => void;
  deleteNoteItem: (noteId: number) => void;
};
