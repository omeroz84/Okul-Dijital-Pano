import React from 'react';
import { Teacher } from '../types';

interface DutyTeachersProps {
  teachers: Teacher[];
}

const DutyTeachers: React.FC<DutyTeachersProps> = ({ teachers }) => {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4 space-y-3">
      {teachers.map((teacher, idx) => (
        <div key={teacher.id} className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 p-3 rounded-2xl border border-white/5 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0">
              {teacher.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm truncate">{teacher.name}</div>
            <div className="text-blue-200/70 text-xs uppercase tracking-wider font-medium">{teacher.role}</div>
          </div>
        </div>
      ))}
      {teachers.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-white/30">
              <p className="text-sm">Veri Girişi Yapılmadı</p>
          </div>
      )}
    </div>
  );
};

export default DutyTeachers;