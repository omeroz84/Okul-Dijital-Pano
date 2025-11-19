import React from 'react';
import { Student } from '../types';
import { GraduationCap } from 'lucide-react';

interface DutyStudentsProps {
  students: Student[];
}

const DutyStudents: React.FC<DutyStudentsProps> = ({ students }) => {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4 space-y-3">
      {students.map((student) => (
        <div key={student.id} className="flex items-center gap-4 bg-white/5 hover:bg-green-500/10 p-3 rounded-2xl border border-white/5 border-l-4 border-l-green-500 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center text-green-400 shrink-0">
              <GraduationCap size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm truncate">{student.name}</div>
            <div className="flex items-center gap-2 mt-0.5">
                 <span className="text-[10px] font-black bg-white/10 px-1.5 py-0.5 rounded text-white/70">{student.class}</span>
                 <span className="text-green-200/70 text-xs uppercase tracking-wider font-medium truncate">{student.role}</span>
            </div>
          </div>
        </div>
      ))}
      {students.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-white/30">
              <p className="text-sm">Veri Girişi Yapılmadı</p>
          </div>
      )}
    </div>
  );
};

export default DutyStudents;