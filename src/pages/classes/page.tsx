import { useState } from 'react';
import KnotNavbar from '@/pages/home/components/KnotNavbar';
import KnotFooter from '@/pages/home/components/KnotFooter';
import ClassTable from './components/ClassTable';
import ClassApplyModal from './components/ClassApplyModal';
import type { ClassItem } from '@/mocks/classes';

export default function ClassesPage() {
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

  const handleApply = (cls: ClassItem) => {
    setSelectedClass(cls);
  };

  const handleClose = () => {
    setSelectedClass(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <KnotNavbar />

      <div className="pt-16">
        {/* 헤더 배너 */}
        <div className="bg-stone-200 py-16 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 w-full h-full object-cover bg-linear-to-b from-5% to-indigo-700"></div>
            <img
              src="https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/fbe22223-07cc-4fb4-bd14-60d9592b3abe_31.png?v=4f5db1bb0fab14cfcf559e018981ee06"
              alt=""
              className="w-full h-full object-cover object-top opacity-100"
            />
          </div>
          <div className="relative z-10">
            <p className="text-white/40 text-[11px] tracking-widest uppercase mb-3">2026 상반기</p>
            <h1 className="text-white mb-3" style={{ fontSize: '32px', fontWeight: 600 }}>강의 시간표</h1>
            <p className="text-white/50 max-w-md mx-auto leading-relaxed" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)' }}>
              원하는 강의를 선택하고 수강신청 버튼을 눌러주세요.<br />
              담당자 확인 후 연락드립니다.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-[100px]">
          {/* 특징 배지 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: 'ri-user-line', label: '소규모 수업', desc: '최대 8명' },
              { icon: 'ri-tools-line', label: '재료 제공', desc: '수업 재료 일체' },
              { icon: 'ri-award-line', label: '자격증 과정', desc: 'TKCA 공인' },
              { icon: 'ri-refresh-line', label: '보강 제공', desc: '결석 시 보강' },
            ].map((item) => (
              <div key={item.label} className="bg-stone-50 rounded-xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-200 text-stone-600 flex-shrink-0">
                  <i className={`${item.icon} text-base`}></i>
                </div>
                <div>
                  <p className="text-stone-700 mb-0.5" style={{ fontSize: '14px', fontWeight: 600 }}>{item.label}</p>
                  <p className="text-stone-400" style={{ fontSize: '13px' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 강의 시간표 타이틀 */}
          <div className="mb-8">
            <h2 className="text-stone-900" style={{ fontSize: '32px', fontWeight: 600 }}>강의 시간표</h2>
          </div>

          <ClassTable onApply={handleApply} />
        </div>
      </div>

      <KnotFooter />

      <ClassApplyModal cls={selectedClass} onClose={handleClose} />
    </div>
  );
}
