import { useState, useEffect } from 'react';
import { BookingCalendar } from '@/components/feature/BookingCalendar';

interface OnedayBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  programTitle: string;
}

export default function OnedayBookingModal({ isOpen, onClose, programTitle }: OnedayBookingModalProps) {
  const [selectedProgram, setSelectedProgram] = useState(programTitle);

  useEffect(() => {
    setSelectedProgram(programTitle);
  }, [programTitle]);

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ESC close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const timeslotsApi = async () => {
    const res = await fetch(
      'https://readdy.ai/api/public/calendar/timeslots/bdcd8a41-b885-4724-bbbc-20c1820250ba.06ece5021dad506e50c1c15896669da8476c8482d9a51c317e3810d569f5eaf3'
    );
    if (!res.ok) throw new Error('Failed to fetch timeslots');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  };

  const appointmentsApi = async (data: {
    customer_name: string;
    customer_phone: string;
    start_time: string;
    end_time: string;
    notes: string;
  }) => {
    const notes = selectedProgram
      ? `${data.notes ? data.notes + '\n\n' : ''}[Program: ${selectedProgram}]`
      : data.notes;

    const res = await fetch(
      'https://readdy.ai/api/public/calendar/appointments/bdcd8a41-b885-4724-bbbc-20c1820250ba.06ece5021dad506e50c1c15896669da8476c8482d9a51c317e3810d569f5eaf3',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: data.customer_name,
          customer_phone: data.customer_phone,
          start_time: data.start_time,
          end_time: data.end_time,
          notes,
        }),
      }
    );
    if (!res.ok) throw new Error('Failed to create appointment');
    return res.json();
  };

  const bookingTexts = {
    monthNames: '1월,2월,3월,4월,5월,6월,7월,8월,9월,10월,11월,12월',
    dayNames: '일,월,화,수,목,금,토',
    step1Label: '날짜',
    step2Label: '시간',
    step3Label: '확인',
    step0Title: '날짜를 선택해주세요',
    step1Title: '시간을 선택해주세요',
    step2Title: '예약 정보를 확인해주세요',
    dateLabel: '날짜',
    timeLabel: '시간',
    reviewTitle: '예약 정보',
    legendSelected: '선택됨',
    legendAvailable: '예약 가능',
    selectedDateLabel: '선택한 날짜',
    continueToTime: '시간 선택으로 이동',
    backToDate: '날짜 변경',
    backToTime: '뒤로',
    noSlots: '해당 날짜에 예약 가능한 시간이 없습니다.',
    modifyTime: '시간 변경',
    formTitle: '예약자 정보',
    nameLabel: '이름',
    phoneLabel: '연락처',
    notesLabel: '요청사항',
    namePlaceholder: '홍길동',
    phonePlaceholder: '010-0000-0000',
    notesPlaceholder: '알레르기, 특이사항 등',
    submitBtn: '예약 신청',
    submitting: '예약 신청 중...',
    successTitle: '예약 신청 완료!',
    successMessage: '담당자 확인 후 1~2일 내 연락드리겠습니다.',
    newBooking: '새 예약 신청',
    errorRequired: '필수 정보를 입력해주세요.',
    errorSubmit: '예약 신청에 실패했습니다. 다시 시도해주세요.',
    loading: '로딩 중...',
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Scroll container */}
      <div className="fixed inset-0 z-50 overflow-y-auto" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="min-h-full flex items-start justify-center p-4 pt-10 pb-10">
          {/* Modal body */}
          <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-stone-900 px-6 py-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-white font-bold text-lg">{selectedProgram}</h2>
                <p className="text-white/50 text-sm mt-1">날짜와 시간을 선택 후 예약 정보를 입력해주세요</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white cursor-pointer transition-colors flex-shrink-0"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            {/* Calendar content */}
            <div className="p-6">
              <BookingCalendar
                timeslotsApi={timeslotsApi}
                appointmentsApi={appointmentsApi}
                texts={bookingTexts}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}