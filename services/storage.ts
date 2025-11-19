
import { AppData, Announcement, Teacher, Student, WeatherState, SlidePhoto, AiContent, ThemeType } from '../types';

const STORAGE_KEY = 'school_board_data_v2';

const DEFAULT_DATA: AppData = {
  schoolName: 'ATATÜRK ANADOLU LİSESİ',
  announcements: [
    { id: '1', title: 'Hoşgeldiniz', content: 'Yeni eğitim öğretim yılında tüm öğrencilerimize başarılar dileriz.', priority: 'high' },
    { id: '2', title: 'Sınav Takvimi', content: '1. Dönem 2. Yazılı sınav tarihleri web sitemizde yayınlanmıştır.', priority: 'normal' }
  ],
  teachers: [
    { id: '1', name: 'Ahmet Yılmaz', role: 'Zemin Kat' },
    { id: '2', name: 'Ayşe Demir', role: '1. Kat' },
    { id: '3', name: 'Mehmet Öz', role: 'Bahçe' }
  ],
  dutyStudents: [
    { id: '1', name: 'Can Yıldız', class: '11-A', role: 'Danışma' },
    { id: '2', name: 'Elif Kaya', class: '10-B', role: 'Müdür Yrd.' }
  ],
  weather: {
    condition: 'Güneşli',
    temp: 24,
    city: 'İstanbul',
    district: 'Kadıköy'
  },
  photos: [
    { id: '1', url: 'https://picsum.photos/1920/1080?random=1', caption: 'Okul Bahçemiz' },
    { id: '2', url: 'https://picsum.photos/1920/1080?random=2', caption: 'Kütüphane Etkinliği' },
    { id: '3', url: 'https://picsum.photos/1920/1080?random=3', caption: 'Spor Salonu' }
  ],
  aiContent: {
    title: 'Günün Sözü',
    content: 'Bilgi, paylaşıldıkça çoğalan tek hazinedir.',
    type: 'quote'
  },
  theme: 'slate'
};

export const getStoredData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_DATA;
  try {
    const parsed = JSON.parse(stored);
    // Migration check for older data versions
    if (!parsed.dutyStudents) parsed.dutyStudents = DEFAULT_DATA.dutyStudents;
    if (!parsed.weather.district) parsed.weather.district = '';
    if (!parsed.theme) parsed.theme = 'slate';
    if (!parsed.schoolName) parsed.schoolName = DEFAULT_DATA.schoolName;
    return parsed;
  } catch (e) {
    console.error("Failed to parse stored data", e);
    return DEFAULT_DATA;
  }
};

export const saveStoredData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Specific updaters
export const updateSchoolName = (name: string) => {
  const data = getStoredData();
  data.schoolName = name;
  saveStoredData(data);
};

export const updateAnnouncements = (announcements: Announcement[]) => {
  const data = getStoredData();
  data.announcements = announcements;
  saveStoredData(data);
};

export const updateTeachers = (teachers: Teacher[]) => {
  const data = getStoredData();
  data.teachers = teachers;
  saveStoredData(data);
};

export const updateDutyStudents = (students: Student[]) => {
  const data = getStoredData();
  data.dutyStudents = students;
  saveStoredData(data);
};

export const updateWeather = (weather: WeatherState) => {
  const data = getStoredData();
  data.weather = weather;
  saveStoredData(data);
};

export const updatePhotos = (photos: SlidePhoto[]) => {
  const data = getStoredData();
  data.photos = photos;
  saveStoredData(data);
};

export const updateAiContent = (aiContent: AiContent) => {
  const data = getStoredData();
  data.aiContent = aiContent;
  saveStoredData(data);
};

export const updateTheme = (theme: ThemeType) => {
  const data = getStoredData();
  data.theme = theme;
  saveStoredData(data);
};
