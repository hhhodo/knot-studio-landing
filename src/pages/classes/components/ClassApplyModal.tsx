import { useState, useEffect, type FormEvent } from 'react';
import { mockClasses, type ClassItem } from '@/mocks/classes';

interface ClassApplyModalProps {
  cls: ClassItem | null;
  onClose: () => void;
}

export default function ClassApplyModal({ cls, onClose }: ClassApplyModalProps) {
  // cls가 null이면 아예 렌더링 안 함
  if (!cls) return null;

  return <ClassApplyModalInner cls={cls} onClose={onClose} />;
}

interface InnerProps {
  cls: ClassItem;
  onClose: () => void;
}

function ClassApplyModalInner({ cls, onClose }: InnerProps) {
  const [currentCls, setCurrentCls] = useState<ClassItem>(cls);
  const [selectedTimeId, setSelectedTimeId] = useState<number>(cls.id);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showClassPicker, setShowClassPicker] = useState(false);

  // 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const sameNameClasses = mockClasses.filter((c) => c.name === currentCls.name);
  const selectedCls = sameNameClasses.find((c) => c.id === selectedTimeId) ?? currentCls;

  const otherClasses = mockClasses.filter(
    (c) =>
      c.name !== currentCls.name &&
      c.spotsLeft > 0 &&
      mockClasses.findIndex((x) => x.name === c.name && x.spotsLeft > 0) === mockClasses.indexOf(c)
  );

  const handleSelectTime = (id: number) => {
    const target = sameNameClasses.find((c) => c.id === id);
    if (!target || target.spotsLeft === 0) return;
    setSelectedTimeId(id);
  };

  const handleChangeClass = (next: ClassItem) => {
    setCurrentCls(next);
    setSelectedTimeId(next.id);
    setShowClassPicker(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const form = e.currentTarget;
    const data = new URLSearchParams();
    const formData = new FormData(form);
    formData.forEach((value, key) => { data.append(key, value.toString()); });
    data.append('class_name', selectedCls.name);
    data.append('class_start_date', selectedCls.startDate);
    data.append('class_days', `${selectedCls.days}요일`);
    data.append('class_time', `${selectedCls.timeAm}–${selectedCls.timePm}`);
    data.append('class_room', selectedCls.room);
    data.append('class_price', `${selectedCls.price.toLocaleString()}원`);
    try {
      await fetch('https://readdy.ai/api/form/d7gns72gm6d735ptouj0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const levelColors: Record<string, string> = {
    입문: 'bg-green-100 text-green-700',
    중급: 'bg-stone-200 text-stone-700',
    고급: 'bg-rose-100 text-rose-700',
    자격증: 'bg-stone-100 text-stone-700',
  };

  return (
    <>
      {/* 오버레이 — 클릭 시 닫힘 */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 스크롤 컨테이너 */}
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        onClick={handleOverlayClick}
      >
        <div className="min-h-full flex items-start justify-center p-4 pt-10 pb-10">
          {/* 모달 본체 — 클릭 이벤트 버블링 차단 */}
          <div
            className="relative bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="bg-stone-900 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-white font-bold text-lg">{currentCls.name}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColors[currentCls.level] || 'bg-stone-100 text-stone-600'}`}>
                      {currentCls.level}
                    </span>
                  </div>
                  <p className="text-white/50 text-sm">시간대를 선택하고 정보를 입력해주세요</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white cursor-pointer transition-colors flex-shrink-0"
                >
                  <i className="ri-close-line text-lg"></i>
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {[
                  { icon: 'ri-repeat-line', text: selectedCls.duration },
                  { icon: 'ri-money-dollar-circle-line', text: `${selectedCls.price.toLocaleString()}원` },
                  { icon: 'ri-user-line', text: selectedCls.instructor },
                  { icon: 'ri-door-open-line', text: selectedCls.room },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-xs text-white/80">
                    <i className={`${item.icon} text-white/50`}></i>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* 완료 상태 */}
            {submitted ? (
              <div className="p-10 text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto mb-4">
                  <i className="ri-check-line text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">수강신청이 완료되었습니다!</h3>
                <p className="text-sm text-stone-500 mb-5">
                  담당자 확인 후 1~2일 내 연락드리겠습니다.
                </p>

                {/* 안내 카드 */}
                <div className="bg-stone-50 rounded-xl p-4 mb-6 text-left space-y-3 border border-stone-100 max-w-sm mx-auto">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-200 text-stone-600 flex-shrink-0 mt-0.5">
                      <i className="ri-mail-line text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-stone-700 mb-0.5">이메일 확인</p>
                      <p className="text-xs text-stone-500">입력하신 이메일로 신청 확인 메일이 발송됩니다. 스팸함도 확인해주세요.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-200 text-stone-600 flex-shrink-0 mt-0.5">
                      <i className="ri-phone-line text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-stone-700 mb-0.5">문자 · 전화 안내</p>
                      <p className="text-xs text-stone-500">입력하신 연락처로 수강 확정 안내를 드립니다.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-200 text-stone-600 flex-shrink-0 mt-0.5">
                      <i className="ri-question-line text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-stone-700 mb-0.5">문의</p>
                      <p className="text-xs text-stone-500">02-1234-5678 · 평일 10:00 – 18:00</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-stone-900 text-white rounded-full text-sm font-medium cursor-pointer hover:bg-stone-700 transition-colors whitespace-nowrap"
                >
                  닫기
                </button>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 1단계: 시간대 선택 */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-stone-800">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-stone-900 text-white rounded-full text-[11px] mr-2">1</span>
                      시간대 선택
                    </h3>
                    <div className="space-y-3">
                      {sameNameClasses.map((c) => {
                        const isSelected = selectedTimeId === c.id;
                        const isFull = c.spotsLeft === 0;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            disabled={isFull}
                            onClick={() => handleSelectTime(c.id)}
                            className={`w-full text-left rounded-xl border-2 p-3.5 transition-all cursor-pointer ${
                              isFull
                                ? 'border-stone-100 bg-stone-50 opacity-50 cursor-not-allowed'
                                : isSelected
                                ? 'border-stone-900 bg-stone-50'
                                : 'border-stone-100 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-sm font-bold ${isSelected ? 'text-stone-900' : 'text-stone-800'}`}>
                                    {c.days}요일
                                  </span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    isFull ? 'bg-stone-100 text-stone-400' : c.spotsLeft <= 2 ? 'bg-rose-100 text-rose-600' : 'bg-green-100 text-green-700'
                                  }`}>
                                    {isFull ? '마감' : `잔여 ${c.spotsLeft}자리`}
                                  </span>
                                </div>
                                <p className="text-xs text-stone-600">
                                  <i className="ri-time-line mr-1 text-stone-400"></i>
                                  {c.timeAm} – {c.timePm}
                                </p>
                                <p className="text-xs text-stone-400 mt-1">
                                  <i className="ri-calendar-line mr-1"></i>
                                  {c.startDate} · {c.room}
                                </p>
                              </div>
                              <div className={`w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5 ${
                                isSelected ? 'bg-stone-900 text-white' : 'border-2 border-stone-200'
                              }`}>
                                {isSelected && <i className="ri-check-line text-xs"></i>}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {sameNameClasses.length === 1 && (
                      <p className="text-xs text-stone-400 text-center py-1">현재 운영 중인 시간대입니다</p>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowClassPicker((v) => !v)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-stone-300 text-stone-500 text-xs font-medium hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      <i className="ri-swap-line text-sm"></i>
                      {showClassPicker ? '수업 변경 닫기' : '다른 수업으로 변경'}
                    </button>
                    {showClassPicker && (
                      <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
                        <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-100">
                          <p className="text-xs font-semibold text-stone-600">수업 변경</p>
                        </div>
                        <div className="divide-y divide-stone-50 max-h-48 overflow-y-auto">
                          {otherClasses.length === 0 ? (
                            <p className="px-4 py-4 text-xs text-stone-400 text-center">변경 가능한 수업이 없습니다</p>
                          ) : (
                            otherClasses.map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => handleChangeClass(c)}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors cursor-pointer text-left group"
                              >
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-stone-800 truncate">{c.name}</p>
                                  <p className="text-xs text-stone-400 mt-0.5">{c.days}요일 {c.timeAm}–{c.timePm} · {c.instructor}</p>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                                  <span className={`text-xs ${c.spotsLeft <= 2 ? 'text-rose-500' : 'text-stone-400'}`}>{c.spotsLeft}자리</span>
                                  <i className="ri-arrow-right-s-line text-stone-300 group-hover:text-stone-600 transition-colors"></i>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2단계: 수업 정보 */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-stone-800">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-stone-900 text-white rounded-full text-[11px] mr-2">2</span>
                      수업 정보
                    </h3>
                    <div className="bg-stone-50 rounded-xl p-4 space-y-3 text-sm text-stone-600 border border-stone-100">
                      {[
                        { icon: 'ri-book-open-line', label: '수업명', value: selectedCls.name },
                        { icon: 'ri-user-line', label: '강사', value: selectedCls.instructor },
                        { icon: 'ri-calendar-line', label: '수업 일정', value: `${selectedCls.days}요일 ${selectedCls.timeAm} – ${selectedCls.timePm}` },
                        { icon: 'ri-map-pin-line', label: '개강일', value: selectedCls.startDate },
                        { icon: 'ri-door-open-line', label: '강의실', value: selectedCls.room },
                        { icon: 'ri-award-line', label: '레벨', value: selectedCls.level },
                      ].map((item) => (
                        <div key={item.label} className="flex items-start gap-2.5">
                          <i className={`${item.icon} text-stone-400 mt-0.5 flex-shrink-0`}></i>
                          <div>
                            <p className="text-xs font-semibold text-stone-500 mb-0.5">{item.label}</p>
                            <p className="text-sm text-stone-800 font-medium">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                      <p className="text-xs font-semibold text-stone-600 mb-2">안내사항</p>
                      <ul className="space-y-1.5 text-xs text-stone-500">
                        {['재료 일체 제공', '최대 8명 소규모 수업', '결석 시 보강 제공', 'TKCA 공인 과정'].map((t) => (
                          <li key={t} className="flex items-start gap-1.5">
                            <i className="ri-check-line text-stone-400 mt-0.5 flex-shrink-0"></i>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 3단계: 정보 입력 */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-stone-800">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-stone-900 text-white rounded-full text-[11px] mr-2">3</span>
                      정보 입력
                    </h3>
                    <form
                      data-readdy-form
                      onSubmit={handleSubmit}
                      className="bg-white rounded-xl p-4 space-y-3.5 border border-stone-100"
                    >
                      <div className="bg-stone-50 rounded-lg p-3 text-xs text-stone-600 border border-stone-100">
                        <div className="flex items-center gap-2 font-medium text-stone-700">
                          <i className="ri-time-line text-stone-400"></i>
                          {selectedCls.days}요일 {selectedCls.timeAm} – {selectedCls.timePm}
                        </div>
                        <p className="text-stone-400 mt-1 ml-5">{selectedCls.startDate} 개강 · {selectedCls.room}</p>
                      </div>
                      {error && <p className="text-xs text-rose-500 bg-rose-50 px-3 py-2 rounded-lg">{error}</p>}
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1.5">이름 *</label>
                        <input name="name" type="text" required placeholder="홍길동" className="w-full px-3 py-2.5 bg-stone-50 rounded-lg text-sm focus:outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1.5">연락처 *</label>
                        <input name="phone" type="tel" required placeholder="010-0000-0000" className="w-full px-3 py-2.5 bg-stone-50 rounded-lg text-sm focus:outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1.5">이메일</label>
                        <input name="email" type="email" placeholder="example@email.com" className="w-full px-3 py-2.5 bg-stone-50 rounded-lg text-sm focus:outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1.5">뜨개질 경험</label>
                        <select name="experience" className="w-full px-3 py-2.5 bg-stone-50 rounded-lg text-sm focus:outline-none transition-colors cursor-pointer">
                          <option value="없음">없음 (완전 처음)</option>
                          <option value="초보">초보 (6개월 미만)</option>
                          <option value="중급">중급 (6개월~2년)</option>
                          <option value="고급">고급 (2년 이상)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1.5">문의사항</label>
                        <textarea name="message" rows={3} maxLength={500} placeholder="궁금한 점이 있으시면 남겨주세요." className="w-full px-3 py-2.5 bg-stone-50 rounded-lg text-sm focus:outline-none transition-colors resize-none" />
                      </div>
                      <button type="submit" disabled={loading} className="w-full py-3 bg-stone-900 hover:bg-stone-700 text-white rounded-full text-sm font-medium transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap">
                        {loading ? '신청 중...' : '수강신청 완료'}
                      </button>
                      <p className="text-xs text-stone-400 text-center">담당자 확인 후 연락드립니다</p>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
