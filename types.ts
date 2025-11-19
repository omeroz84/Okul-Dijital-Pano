
export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'normal' | 'high';
}

export interface Teacher {
  id: string;
  name: string;
  role: string; // e.g., "Kat 1", "Bahçe"
  imageUrl?: string;
}

export interface Student {
  id: string;
  name: string;
  class: string; // e.g. "11-A"
  role: string; // e.g. "Danışma", "Müdür Yardımcısı Odası"
}

export interface WeatherState {
  condition: string; // Sunny, Cloudy, etc.
  temp: number;
  city: string;
  district: string;
}

export interface SlidePhoto {
  id: string;
  url: string;
  caption?: string;
}

export interface AiContent {
  title: string;
  content: string;
  type: 'quote' | 'fact' | 'info';
}

export type ThemeType = 'slate' | 'blue' | 'red' | 'green' | 'black';

export interface AppData {
  schoolName: string;
  announcements: Announcement[];
  teachers: Teacher[];
  dutyStudents: Student[];
  weather: WeatherState;
  photos: SlidePhoto[];
  aiContent: AiContent | null;
  theme: ThemeType;
}
