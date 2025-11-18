export type NoteType = "text" | "task" | "event";

export type Subtask = {
  id: string;
  title: string;
  done: boolean;
};

export type Note = {
  id: string;
  type: NoteType;

  title: string;
  description: string;

  subtasks?: Subtask[];
  date?: string;
};
