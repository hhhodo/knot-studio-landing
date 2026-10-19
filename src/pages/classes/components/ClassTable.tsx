import { useState } from 'react';
import { mockClasses, classCategories, type ClassItem } from '@/mocks/classes';

interface ClassTableProps {
  onApply: (cls: ClassItem) => void;
}

export default function ClassTable({ onApply }: ClassTableProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? mockClasses
    : mockClasses.filter((c) => c.category === activeCategory);

  const levelColors: Record<string, string> = {
    입문: 'bg-green-100 text-green-700',
    중급: 'bg-stone-200 text-stone-700',
    고급: 'bg-rose-100 text-rose-700',
    자격증: 'bg-stone-100 text-stone-700',
  };

  return (
    <div>
      {/* KnotServices 스타일 필터 탭 */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {classCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`transition-colors cursor-pointer whitespace-nowrap rounded-md ${
              activeCategory === cat.id
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 hover:bg-stone-200'
            }`}
            style={{
              height: '40px',
              paddingLeft: '18px',
              paddingRight: '18px',
              fontSize: '14px',
              fontWeight: 500,
              color: activeCategory === cat.id ? '#fff' : '#3a3a3a',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl bg-stone-50/50">
        <table className="w-full" style={{ fontSize: '14px' }}>
          <thead>
            <tr className="bg-stone-100">
              <th className="text-left px-4 py-3.5 text-stone-600 whitespace-nowrap" style={{ fontWeight: 600 }}>수업명</th>
              <th className="text-left px-4 py-3.5 text-stone-600 whitespace-nowrap" style={{ fontWeight: 600 }}>강사</th>
              <th className="text-left px-4 py-3.5 text-stone-600 whitespace-nowrap" style={{ fontWeight: 600 }}>개강일</th>
              <th className="text-left px-4 py-3.5 text-stone-600 whitespace-nowrap" style={{ fontWeight: 600 }}>수업기간</th>
              <th className="text-left px-4 py-3.5 text-stone-600 whitespace-nowrap" style={{ fontWeight: 600 }}>요일</th>
              <th className="text-left px-4 py-3.5 text-stone-600 whitespace-nowrap" style={{ fontWeight: 600 }}>수업시간</th>
              <th className="text-left px-4 py-3.5 text-stone-600 whitespace-nowrap" style={{ fontWeight: 600 }}>강의실</th>
              <th className="text-left px-4 py-3.5 text-stone-600 whitespace-nowrap" style={{ fontWeight: 600 }}>수강료</th>
              <th className="text-left px-4 py-3.5 text-stone-600 whitespace-nowrap" style={{ fontWeight: 600 }}>잔여</th>
              <th className="px-4 py-3.5"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cls, idx) => {
              const isSelected = false;
              return (
                <tr
                  key={cls.id}
                  className={`transition-colors ${
                    idx % 2 === 0
                      ? 'bg-white hover:bg-stone-50'
                      : 'bg-stone-50/30 hover:bg-stone-50'
                  }`}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="whitespace-nowrap text-stone-800" style={{ fontWeight: 500 }}>{cls.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${levelColors[cls.level] || 'bg-stone-100 text-stone-600'}`}>
                        {cls.level}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-stone-600 whitespace-nowrap">{cls.instructor}</td>
                  <td className="px-4 py-4 text-stone-600 whitespace-nowrap">{cls.startDate}</td>
                  <td className="px-4 py-4 text-stone-600 whitespace-nowrap">{cls.duration}</td>
                  <td className="px-4 py-4 text-stone-600 whitespace-nowrap">{cls.days}</td>
                  <td className="px-4 py-4 text-stone-600 whitespace-nowrap">
                    {cls.timeAm} – {cls.timePm}
                  </td>
                  <td className="px-4 py-4 text-stone-600 whitespace-nowrap">{cls.room}</td>
                  <td className="px-4 py-4 text-stone-800 whitespace-nowrap" style={{ fontWeight: 500 }}>
                    {cls.price.toLocaleString()}원
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`font-medium ${cls.spotsLeft <= 1 ? 'text-rose-600' : 'text-stone-600'}`} style={{ fontSize: '14px' }}>
                      {cls.spotsLeft === 0 ? '마감' : `${cls.spotsLeft}자리`}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => onApply(cls)}
                      disabled={cls.spotsLeft === 0}
                      className={`transition-all whitespace-nowrap cursor-pointer rounded-md ${
                        cls.spotsLeft === 0
                          ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          : isSelected
                          ? 'bg-stone-700 text-white'
                          : 'bg-stone-900 text-white hover:bg-stone-700'
                      }`}
                      style={{ height: '36px', paddingLeft: '14px', paddingRight: '14px', fontSize: '13px', fontWeight: 500 }}
                    >
                      {cls.spotsLeft === 0 ? '마감' : '수강신청'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-stone-400 mt-4" style={{ fontSize: '13px' }}>
        * 수업은 1회 2시간, 격주 수업은 1회 3시간 진행됩니다. 문의사항은 카카오톡 또는 전화로 연락해주세요.
      </p>
    </div>
  );
}
