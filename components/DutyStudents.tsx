import React from 'react';
import { Student } from '../types';
import { User, GraduationCap } from 'lucide-react';

interface DutyStudentsProps {
  students: Student[];
}

const DutyStudents: React.FC<DutyStudentsProps> = ({ students }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 h-full flex flex-col border border-white/10 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
        <span className="bg-green-500 w-2 h-6 rounded-full block"></span>
        Nöbetçi Öğrenciler
      </h2>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {students.map((student) => (
          <div key={student.id} className="flex items-center bg-green-900/30 p-2 rounded-xl border border-green-500/20">
            <div className="mr-3 bg-green-500/20 p-2 rounded-full">
                <GraduationCap className="w-6 h-6 text-green-300" />
            </div>
            <div>
              <div className="text-white font-semibold text-md">{student.name}</div>
              <div className="flex items-center gap-2 text-xs">
                 <span className="text-green-200 bg-green-800/50 px-1.5 py-0.5 rounded">{student.class}</span>
                 <span className="text-gray-300">{student.role}</span>
              </div>
            </div>
          </div>
        ))}
        {students.length === 0 && (
            <div className="text-white/50 italic text-sm">Öğrenci bilgisi girilmedi.</div>
        )}
      </div>
    </div>
  );
};

export default DutyStudents;