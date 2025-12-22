
export interface NotificationSettings {
  emailAlerts: boolean;
  appAlerts: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  token?: string;
  notificationSettings?: NotificationSettings;
  createdAt?: string;
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Project {
  _id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  priority: TaskPriority;
  progress: number;
  ownerId: string;
  teamId?: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  deadline?: string;
  status: TaskStatus;
  priority: TaskPriority;
  userId: string;
  teamId?: string;
  projectId?: string;
  createdAt: string;
}

export interface Team {
  _id: string;
  name: string;
  ownerId: string;
  members: User[];
  createdAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  taskId?: string;
  type: 'deadline' | 'invite' | 'system';
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: string;
  teamId?: string;
}

// Browser Speech Recognition Types
export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}