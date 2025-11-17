export type NoteType = "text" | "task" | "event";

export type Subtask = {
  id: string;
  title: string;
  done: boolean;
};

export type Note = {
  id: string;
  type: NoteType;

  content?: string;

  title?: string;
  subtasks?: Subtask[];

  date?: string;
};
