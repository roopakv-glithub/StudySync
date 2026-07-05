export interface UserProfile {
  email: string;
  nickname: string;
  fullName: string;
}

export interface StudyStat {
  active: number;
  done: number;
  total: number;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  dueDate: string; // ISO date string (YYYY-MM-DD)
  completed: boolean;
  priority: "Low" | "Medium" | "High";
  description?: string;
  dueText?: string;
}

export interface ChatMessage {
  sender: "user" | "jarvis";
  text: string;
  timestamp: string;
}
