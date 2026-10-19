import { useState, useEffect, useCallback, useRef, useMemo, type FormEvent } from 'react';

export interface Timeslot {
  start_time: string;
  end_time: string;
}

export interface BookingCalendarTexts {
  monthNames: string;
  dayNames: string;
  step1Label: string;
  step2Label: string;
  step3Label: string;
  step0Title: string;
  step1Title: string;
  step2Title: string;
  dateLabel: string;
  timeLabel: string;
  reviewTitle: string;
  legendSelected: string;
  legendAvailable: string;
  selectedDateLabel: string;
  continueToTime: string;
  backToDate: string;
  backToTime: string;
  noSlots: string;
  modifyTime: string;
  formTitle: string;
  nameLabel: string;
  phoneLabel: string;
  notesLabel: string;
  namePlaceholder: string;
  phonePlaceholder: string;
  notesPlaceholder: string;
  submitBtn: string;
  submitting: string;
  successTitle: string;
  successMessage: string;
  newBooking: string;
  errorRequired: string;
  errorSubmit: string;
  loading: string;
}

export interface BookingCalendarProps {
  timeslotsApi: () => Promise<Timeslot[]>;
  appointmentsApi: (data: {
    customer_name: string;
    customer_phone: string;
    start_time: string;
    end_time: string;
    notes: string;
  }) => Promise<unknown>;
  texts: BookingCalendarTexts;
  containerStyle?: React.CSSProperties;
}

export function BookingCalendar({
  timeslotsApi,
  appointmentsApi,
  texts,
  containerStyle,
}: BookingCalendarProps) {
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<Timeslot | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(0);
  const [mounted, setMounted] = useState(false);
  const isInitialLoad = useRef(true);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const monthNames = texts.monthNames.split(',');
  const dayNames = texts.dayNames.split(',');

  const availableDates = useMemo(() => {
    const dates = new Set<string>();
    for (const slot of timeslots) {
      const date = slot.start_time.split(' ')[0];
      dates.add(date);
    }
    return Array.from(dates).sort();
  }, [timeslots]);

  const slotsForDate = useMemo(() => {
    if (!selectedDate) return [];
    return timeslots.filter((s) => s.start_time.split(' ')[0] === selectedDate);
  }, [timeslots, selectedDate]);

  const fetchTimeslots = useCallback(async () => {
    setLoadingSlots(true);
    try {
      const data = await timeslotsApi();
      setTimeslots(Array.isArray(data) ? data : []);
    } catch {
      setTimeslots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [timeslotsApi]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchTimeslots();
  }, [mounted, fetchTimeslots]);

  useEffect(() => {
    if (!mounted || availableDates.length === 0) return;

    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;

    let targetDate = '';
    for (const date of availableDates) {
      if (date >= todayStr) {
        targetDate = date;
        break;
      }
    }
    if (!targetDate) {
      targetDate = availableDates[availableDates.length - 1];
    }

    if (!selectedDate || !availableDates.includes(selectedDate)) {
      setSelectedDate(targetDate);
    }

    const dateToView = selectedDate && availableDates.includes(selectedDate) ? selectedDate : targetDate;
    const parts = dateToView.split('-');
    const targetYear = parseInt(parts[0], 10);
    const targetMonth = parseInt(parts[1], 10) - 1;

    if (isInitialLoad.current) {
      setViewYear(targetYear);
      setViewMonth(targetMonth);
      isInitialLoad.current = false;
    } else {
      const currentMonthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
      const hasAvailableInCurrentMonth = availableDates.some((date) => date.startsWith(currentMonthPrefix));
      if (!hasAvailableInCurrentMonth) {
        setViewYear(targetYear);
        setViewMonth(targetMonth);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, availableDates, selectedDate]);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDate = (date: string) => {
    if (!availableDates.includes(date)) return;
    setSelectedDate(date);
    setSelectedSlot(null);
    setCurrentStep(1);
    setSubmitSuccess(false);
    setSubmitError('');
  };

  const handleSelectSlot = (slot: Timeslot) => {
    setSelectedSlot(slot);
    setCurrentStep(2);
    setSubmitSuccess(false);
    setSubmitError('');
  };

  const handleModifyTime = () => {
    setCurrentStep(1);
    setSelectedSlot(null);
  };

  const handleBackToDate = () => {
    if (currentStep === 1) {
      setCurrentStep(0);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    if (!formData.customer_name.trim() || !formData.customer_phone.trim()) {
      setSubmitError(texts.errorRequired);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      await appointmentsApi({
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        notes: formData.notes || '',
      });

      setSubmitSuccess(true);
      setFormData({ customer_name: '', customer_phone: '', notes: '' });
      setSelectedDate('');
      setSelectedSlot(null);
      await fetchTimeslots();
    } catch {
      setSubmitError(texts.errorSubmit);
    } finally {
      setSubmitting(false);
    }
  };

  const extractTime = (datetime: string) => {
    const parts = datetime.split(' ');
    if (parts.length >= 2) {
      return parts[1].slice(0, 5);
    }
    return datetime;
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  const formatCellDate = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${viewYear}-${m}-${d}`;
  };

  if (!mounted) {
    return (
      <div style={containerStyle} className="p-6">
        <p className="text-sm text-stone-500">{texts.loading}</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {[0, 1, 2].map((step) => (
          <div key={step} className={`flex items-center gap-2 ${step > 0 ? 'ml-2' : ''}`}>
            {step > 0 && <span className="text-stone-300 text-xs">&gt;</span>}
            <span
              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-medium ${
                currentStep === step
                  ? 'bg-stone-900 text-white'
                  : currentStep > step
                  ? 'bg-stone-200 text-stone-600'
                  : 'bg-stone-100 text-stone-400'
              }`}
            >
              {step + 1}
            </span>
            <span
              className={`text-sm font-medium ${
                currentStep === step
                  ? 'text-stone-900'
                  : currentStep > step
                  ? 'text-stone-600'
                  : 'text-stone-400'
              }`}
            >
              {step === 0 && texts.step1Label}
              {step === 1 && texts.step2Label}
              {step === 2 && texts.step3Label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 0: Date Selection */}
      {currentStep === 0 && (
        <div>
          <h3 className="text-base font-semibold text-stone-800 mb-4">{texts.step0Title}</h3>

          <div className="bg-white rounded-2xl p-5 border border-stone-100">
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={prevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 cursor-pointer text-stone-600"
                type="button"
              >
                <i className="ri-arrow-left-s-line text-lg"></i>
              </button>
              <span className="font-semibold text-stone-800">
                {viewYear} {monthNames[viewMonth] || ''}
              </span>
              <button
                onClick={nextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 cursor-pointer text-stone-600"
                type="button"
              >
                <i className="ri-arrow-right-s-line text-lg"></i>
              </button>
            </div>

            <div className="grid grid-cols-7 mb-2">
              {dayNames.map((d, i) => (
                <div key={`${d}-${i}`} className="text-center text-xs font-medium py-1 text-stone-400">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {cells.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} />;
                const dateStr = formatCellDate(day);
                const isAvailable = availableDates.includes(dateStr);
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={day}
                    disabled={!isAvailable}
                    onClick={() => handleSelectDate(dateStr)}
                    type="button"
                    className={`h-10 w-full flex items-center justify-center rounded-full text-sm transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white font-semibold'
                        : isAvailable
                        ? 'text-stone-700 hover:bg-stone-100 font-medium'
                        : 'text-stone-300 cursor-not-allowed'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-stone-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-stone-900"></span>
                <span>{texts.legendSelected}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-stone-200"></span>
                <span>{texts.legendAvailable}</span>
              </div>
            </div>
          </div>

          {selectedDate && (
            <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-100">
              <p className="text-sm text-stone-600">
                <span className="font-medium">{texts.selectedDateLabel}:</span>{' '}
                <span className="text-stone-900 font-semibold">{selectedDate}</span>
              </p>
              <button
                onClick={() => setCurrentStep(1)}
                className="mt-3 inline-flex items-center justify-center bg-stone-900 text-white hover:bg-stone-700 transition-colors cursor-pointer whitespace-nowrap rounded-md px-5 py-2.5 text-sm font-medium"
                type="button"
              >
                {texts.continueToTime}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 1: Time Slot Selection */}
      {currentStep === 1 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-stone-800">{texts.step1Title}</h3>
            <button
              onClick={handleBackToDate}
              className="text-sm text-stone-500 hover:text-stone-800 cursor-pointer flex items-center gap-1"
              type="button"
            >
              <i className="ri-arrow-left-line"></i>
              {texts.backToDate}
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-100">
            <p className="text-sm text-stone-500 mb-4">
              {texts.dateLabel}: <span className="font-semibold text-stone-800">{selectedDate}</span>
            </p>

            {slotsForDate.length === 0 ? (
              <p className="text-sm text-stone-400 py-4 text-center">{texts.noSlots}</p>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {slotsForDate.map((slot, idx) => {
                  const start = extractTime(slot.start_time);
                  const end = extractTime(slot.end_time);
                  const isSelected = selectedSlot?.start_time === slot.start_time;

                  return (
                    <button
                      key={`${slot.start_time}-${idx}`}
                      onClick={() => handleSelectSlot(slot)}
                      type="button"
                      className={`py-3 px-4 rounded-xl text-[13px] font-medium transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <div className="font-semibold">
                        {start} – {end}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Review & Form */}
      {currentStep === 2 && (selectedSlot || submitSuccess) && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-stone-800">{texts.step2Title}</h3>
            <button
              onClick={handleBackToDate}
              className="text-sm text-stone-500 hover:text-stone-800 cursor-pointer flex items-center gap-1"
              type="button"
            >
              <i className="ri-arrow-left-line"></i>
              {texts.backToTime}
            </button>
          </div>

          {/* Review section — read only */}
          {selectedSlot && (
            <div className="bg-stone-50 rounded-xl p-4 mb-5 border border-stone-100">
              <h4 className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-3">
                {texts.reviewTitle}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-500">{texts.dateLabel}</span>
                  <span className="text-sm font-semibold text-stone-800">
                    {selectedSlot.start_time.split(' ')[0]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-500">{texts.timeLabel}</span>
                  <span className="text-sm font-semibold text-stone-800">
                    {extractTime(selectedSlot.start_time)} – {extractTime(selectedSlot.end_time)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleModifyTime}
                className="mt-3 text-sm text-stone-500 hover:text-stone-800 cursor-pointer underline"
                type="button"
              >
                {texts.modifyTime}
              </button>
            </div>
          )}

          {submitSuccess ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-stone-100">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto mb-4">
                <i className="ri-check-line text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">{texts.successTitle}</h3>
              <p className="text-sm text-stone-500 mb-6">{texts.successMessage}</p>
              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  setCurrentStep(0);
                }}
                className="inline-flex items-center justify-center bg-stone-900 text-white hover:bg-stone-700 transition-colors cursor-pointer whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium"
                type="button"
              >
                {texts.newBooking}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-stone-100 space-y-4">
              <h4 className="text-sm font-semibold text-stone-700 mb-2">
                <i className="ri-edit-line mr-2 text-stone-400"></i>
                {texts.formTitle}
              </h4>

              {submitError && (
                <p className="text-xs text-rose-500 bg-rose-50 px-3 py-2 rounded-lg">{submitError}</p>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">{texts.nameLabel} *</label>
                <input
                  name="customer_name"
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => handleFormChange('customer_name', e.target.value)}
                  placeholder={texts.namePlaceholder}
                  className="w-full px-3 py-2.5 bg-stone-50 rounded-lg text-sm focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">{texts.phoneLabel} *</label>
                <input
                  name="customer_phone"
                  type="tel"
                  required
                  value={formData.customer_phone}
                  onChange={(e) => handleFormChange('customer_phone', e.target.value)}
                  placeholder={texts.phonePlaceholder}
                  className="w-full px-3 py-2.5 bg-stone-50 rounded-lg text-sm focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">{texts.notesLabel}</label>
                <textarea
                  name="notes"
                  rows={3}
                  maxLength={500}
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  placeholder={texts.notesPlaceholder}
                  className="w-full px-3 py-2.5 bg-stone-50 rounded-lg text-sm focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-stone-900 hover:bg-stone-700 text-white rounded-md text-sm font-medium transition-colors cursor-pointer disabled:opacity-60"
              >
                {submitting ? texts.submitting : texts.submitBtn}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}