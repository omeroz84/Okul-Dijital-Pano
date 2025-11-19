import React from 'react';
import { Teacher } from '../types';
import { UserCircle } from 'lucide-react';

interface DutyTeachersProps {
  teachers: Teacher[];
}

const DutyTeachers: React.FC<DutyTeachersProps> = ({ teachers }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 h-full flex flex-col border border-white/10 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="bg-blue-500 w-2 h-8 rounded-full block"></span>
        Nöbetçi Öğretmenler
      </h2>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="flex items-center bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="mr-4">
                <UserCircle className="w-10 h-10 text-blue-300" />
            </div>
            <div>
              <div className="text-white font-semibold text-lg">{teacher.name}</div>
              <div className="text-blue-200 text-sm uppercase tracking-wider">{teacher.role}</div>
            </div>
          </div>
        ))}
        {teachers.length === 0 && (
            <div className="text-white/50 italic">Nöbetçi bilgisi girilmedi.</div>
        )}
      </div>
    </div>
  );
};

export default DutyTeachers;