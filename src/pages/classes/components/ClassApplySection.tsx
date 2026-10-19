import { useState, type FormEvent } from 'react';
import { mockClasses, type ClassItem } from '@/mocks/classes';

interface ClassApplySectionProps {
  cls: ClassItem;
  onClose: () => void;
  onChangeCls?: (cls: ClassItem) => void;
}

export default function ClassApplySection({ cls, onClose, onChangeCls }: ClassApplySectionProps) {
  // 같은 수업명의 모든 시간대
  const sameNameClasses = mockClasses.filter((c) => c.name === cls.name);

  // 선택된 시간대 (처음엔 현재 cls)
  const [selectedTimeId, setSelectedTimeId] = useState<number>(cls.id);
  const selectedCls = sameNameClasses.find((c) => c.id === selectedTimeId) ?? cls;

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showClassPicker, setShowClassPicker] = useState(false);

  // 다른 수업으로 변경 (수업명 자체를 바꿈)
  const otherClasses = mockClasses.filter(
    (c) =>
      c.name !== cls.name &&
      c.spotsLeft > 0 &&
      mockClasses.findIndex((x) => x.name === c.name && x.spotsLeft > 0) === mockClasses.indexOf(c)
  );

  const handleChangeClass = (next: ClassItem) => {
    setShowClassPicker(false);
    onChangeCls?.(next);
  };

  const handleSelectTime = (id: number) => {
    const target = sameNameClasses.find((c) => c.id === id);
    if (!target || target.spotsLeft === 0) return;
    setSelectedTimeId(id);
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

  if (submitted) {
    return (
      <div className="mt-10 border-t border-stone-100 pt-10">
        <div className="max-w-lg mx-auto text-center py-12">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto mb-4">
            <i className="ri-check-line text-3xl"></i>
          </div>
          <h3 className="text-xl font-bold text-stone-800 mb-2">수강신청이 완료되었습니다!</h3>
          <p className="text-sm text-stone-500 mb-6">
            담당자 확인 후 연락드리겠습니다.<br />
            문의: 02-1234-5678
          </p>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center bg-stone-900 text-white hover:bg-stone-700 transition-colors cursor-pointer whitespace-nowrap rounded-md"
            style={{ height: '50px', paddingLeft: '22px', paddingRight: '22px', fontSize: '16px', fontWeight: 500 }}
          >
            다른 강의 신청하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 border-t border-stone-100 pt-10" id="apply-section">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-stone-900">
            <span className="text-stone-900">{cls.name}</span> 수강신청
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            원하는 시간대를 선택한 후 정보를 입력해주세요
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 cursor-pointer transition-colors"
        >
          <i className="ri-close-line text-lg"></i>
        </button>
      </div>

      {/* 수업 요약 배지 */}
      <div className="bg-stone-50 rounded-xl p-4 mb-8 flex flex-wrap gap-4 text-sm border border-stone-100">
        <div className="flex items-center gap-2 text-stone-600">
          <i className="ri-repeat-line text-stone-400"></i>
          <span>기간: <strong className="text-stone-800">{selectedCls.duration}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-stone-600">
          <i className="ri-money-dollar-circle-line text-stone-400"></i>
          <span>수강료: <strong className="text-stone-800">{selectedCls.price.toLocaleString()}원</strong></span>
        </div>
        <div className="flex items-center gap-2 text-stone-600">
          <i className="ri-award-line text-stone-400"></i>
          <span>레벨: <strong className="text-stone-800">{selectedCls.level}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-stone-600">
          <i className="ri-user-line text-stone-400"></i>
          <span>강사: <strong className="text-stone-800">{selectedCls.instructor}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1단계: 시간대 선택 */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-stone-800">
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
                  className={`w-full text-left rounded-2xl border-2 p-4 transition-all cursor-pointer ${
                    isFull
                      ? 'border-stone-100 bg-stone-50 opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'border-stone-900 bg-stone-50'
                      : 'border-stone-100 bg-white hover:border-stone-400 hover:bg-stone-50/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-sm font-bold ${isSelected ? 'text-stone-900' : 'text-stone-800'}`}>
                          {c.days}요일
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          isFull
                            ? 'bg-stone-100 text-stone-400'
                            : c.spotsLeft <= 2
                            ? 'bg-rose-100 text-rose-600'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {isFull ? '마감' : `잔여 ${c.spotsLeft}자리`}
                        </span>
                      </div>
                      <p className="text-sm text-stone-600">
                        <i className="ri-time-line mr-1 text-stone-400"></i>
                        {c.timeAm} – {c.timePm}
                      </p>
                      <p className="text-xs text-stone-400 mt-1">
                        <i className="ri-calendar-line mr-1"></i>
                        개강 {c.startDate} · {c.room}
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
            <p className="text-xs text-stone-400 text-center py-2">
              현재 운영 중인 시간대입니다
            </p>
          )}
        </div>

        {/* 2단계: 수업 정보 */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-stone-800">
            <span className="inline-flex items-center justify-center w-5 h-5 bg-stone-900 text-white rounded-full text-[11px] mr-2">2</span>
            수업 정보
          </h3>

          <div className="bg-stone-50 rounded-2xl p-5 space-y-3 text-sm text-stone-600">
            <div className="flex items-start gap-3">
              <i className="ri-book-open-line text-stone-400 mt-0.5 flex-shrink-0"></i>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-700 mb-0.5">수업명</p>
                <p className="font-medium text-stone-800">{selectedCls.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="ri-user-line text-stone-400 mt-0.5 flex-shrink-0"></i>
              <div>
                <p className="font-semibold text-stone-700 mb-0.5">강사</p>
                <p>{selectedCls.instructor}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="ri-calendar-line text-stone-400 mt-0.5 flex-shrink-0"></i>
              <div>
                <p className="font-semibold text-stone-700 mb-0.5">수업 일정</p>
                <p>{selectedCls.days}요일 {selectedCls.timeAm} – {selectedCls.timePm}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="ri-map-pin-line text-stone-400 mt-0.5 flex-shrink-0"></i>
              <div>
                <p className="font-semibold text-stone-700 mb-0.5">개강일</p>
                <p>{selectedCls.startDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="ri-door-open-line text-stone-400 mt-0.5 flex-shrink-0"></i>
              <div>
                <p className="font-semibold text-stone-700 mb-0.5">강의실</p>
                <p>{selectedCls.room}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="ri-award-line text-stone-400 mt-0.5 flex-shrink-0"></i>
              <div>
                <p className="font-semibold text-stone-700 mb-0.5">레벨</p>
                <p>{selectedCls.level}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowClassPicker((v) => !v)}
              className="w-full mt-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-stone-300 text-stone-500 text-xs font-medium hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <i className="ri-swap-line text-sm"></i>
              {showClassPicker ? '수업 변경 닫기' : '다른 수업으로 변경'}
            </button>
          </div>

          {showClassPicker && (
            <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
              <div className="px-4 py-3 bg-stone-50 border-b border-stone-100">
                <p className="text-xs font-semibold text-stone-600">수업 변경</p>
                <p className="text-xs text-stone-400 mt-0.5">클릭하면 즉시 변경됩니다</p>
              </div>
              <div className="divide-y divide-stone-50 max-h-64 overflow-y-auto">
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
                        <p className="text-sm font-medium text-stone-800 group-hover:text-stone-900 transition-colors truncate">{c.name}</p>
                        <p className="text-xs text-stone-400 mt-0.5">{c.days}요일 {c.timeAm}–{c.timePm} · {c.instructor}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <span className={`text-xs ${c.spotsLeft <= 2 ? 'text-rose-500' : 'text-stone-400'}`}>
                          {c.spotsLeft}자리
                        </span>
                        <i className="ri-arrow-right-s-line text-stone-300 group-hover:text-stone-600 transition-colors"></i>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="bg-stone-50 rounded-xl p-4 space-y-2 border border-stone-100">
            <p className="font-semibold text-stone-700 text-xs">안내사항</p>
            <ul className="space-y-1.5 text-xs text-stone-500">
              <li className="flex items-start gap-1.5"><i className="ri-check-line text-stone-400 mt-0.5 flex-shrink-0"></i>재료 일체 제공</li>
              <li className="flex items-start gap-1.5"><i className="ri-check-line text-stone-400 mt-0.5 flex-shrink-0"></i>최대 8명 소규모 수업</li>
              <li className="flex items-start gap-1.5"><i className="ri-check-line text-stone-400 mt-0.5 flex-shrink-0"></i>결석 시 보강 제공</li>
              <li className="flex items-start gap-1.5"><i className="ri-check-line text-stone-400 mt-0.5 flex-shrink-0"></i>TKCA 공인 과정</li>
            </ul>
          </div>
        </div>

        {/* 3단계: 정보 입력 */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-stone-800">
            <span className="inline-flex items-center justify-center w-5 h-5 bg-stone-900 text-white rounded-full text-[11px] mr-2">3</span>
            정보 입력
          </h3>
          <form
            data-readdy-form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-5 space-y-4 border border-stone-100"
          >
            {/* 선택된 시간대 요약 */}
            <div className="bg-stone-50 rounded-xl p-3 text-sm border border-stone-100">
              <div className="flex items-center gap-2 text-stone-700 font-medium">
                <i className="ri-time-line text-stone-400"></i>
                <span>{selectedCls.days}요일 {selectedCls.timeAm} – {selectedCls.timePm}</span>
              </div>
              <p className="text-xs text-stone-500 mt-1 ml-5">
                {selectedCls.startDate} 개강 · {selectedCls.room}
              </p>
            </div>

            {error && (
              <p className="text-xs text-rose-500 bg-rose-50 px-3 py-2 rounded-lg">{error}</p>
            )}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">이름 *</label>
              <input
                name="name"
                type="text"
                required
                placeholder="홍길동"
                className="w-full px-3 py-2.5 bg-stone-50 rounded-lg text-sm focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">연락처 *</label>
              <input
                name="phone"
                type="tel"
                required
                placeholder="010-0000-0000"
                className="w-full px-3 py-2.5 bg-stone-50 rounded-lg text-sm focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">이메일</label>
              <input
                name="email"
                type="email"
                placeholder="example@email.com"
                className="w-full px-3 py-2.5 bg-stone-50 rounded-lg text-sm focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">뜨개질 경험</label>
              <select
                name="experience"
                className="w-full px-3 py-2.5 bg-stone-50 rounded-lg text-sm focus:outline-none transition-colors cursor-pointer"
              >
                <option value="없음">없음 (완전 처음)</option>
                <option value="초보">초보 (6개월 미만)</option>
                <option value="중급">중급 (6개월~2년)</option>
                <option value="고급">고급 (2년 이상)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">문의사항</label>
              <textarea
                name="message"
                rows={3}
                maxLength={500}
                placeholder="궁금한 점이 있으시면 남겨주세요."
                className="w-full px-3 py-2.5 bg-stone-50 rounded-lg text-sm focus:outline-none transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-700 text-white rounded-md text-[14px] font-medium transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
            >
              {loading ? '신청 중...' : '수강신청 완료'}
            </button>
            <p className="text-xs text-stone-400 text-center">
              담당자 확인 후 연락드립니다
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
