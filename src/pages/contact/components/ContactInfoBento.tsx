import { useState, type FormEvent } from 'react';

const contactMethods = [
  { title: '전화 문의', desc: '평일 09:00 – 20:00', icon: 'ri-phone-line', value: '02-1234-5678' },
  { title: '이메일 문의', desc: '1~2일 내 답변', icon: 'ri-mail-line', value: 'hello@knotstudio.kr' },
  { title: '카카오톡', desc: '빠른 답변 가능', icon: 'ri-kakao-talk-fill', value: '@knotstudio' },
  { title: '오시는 길', desc: '홍대입구역 3번 출구 도보 10분', icon: 'ri-map-pin-line', value: '서울 마포구 연남동 123-45 2층' },
];

export default function ContactInfoBento() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const data = new URLSearchParams();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));

    try {
      await fetch('https://readdy.ai/api/form/knot-contact-001', {
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

  return (
    <section className="py-[80px]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {contactMethods.map((m) => (
            <div key={m.title} className="bg-stone-50 rounded-xl p-5">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-stone-200 text-stone-600 mb-4">
                <i className={`${m.icon} text-base`}></i>
              </div>
              <h3 className="text-[14px] font-semibold text-stone-800 mb-1">{m.title}</h3>
              <p className="text-[12px] text-stone-400 mb-2">{m.desc}</p>
              <p className="text-[13px] text-stone-600 font-medium">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-[28px] font-semibold text-stone-900 mb-3">메시지 보내기</h2>
            <p className="text-[15px] text-stone-500 mb-8 leading-relaxed">
              강의 수강신청, 원데이클래스 예약, 상품 문의 등<br />
              어떤 내용이든 편하게 남겨주세요.
            </p>

            {submitted ? (
              <div className="bg-stone-50 rounded-xl p-10 text-center">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto mb-4">
                  <i className="ri-check-line text-2xl"></i>
                </div>
                <h3 className="text-[18px] font-semibold text-stone-800 mb-2">문의가 접수되었습니다</h3>
                <p className="text-[14px] text-stone-500 mb-6">1~2일 내로 답변 드리겠습니다.</p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                  className="inline-flex items-center justify-center bg-stone-900 text-white hover:bg-stone-700 transition-colors cursor-pointer whitespace-nowrap rounded-md"
                  style={{ height: '50px', paddingLeft: '22px', paddingRight: '22px', fontSize: '15px', fontWeight: 500 }}
                >
                  새 문의 작성
                </button>
              </div>
            ) : (
              <form id="contact-form" data-readdy-form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-xs text-rose-500 bg-rose-50 px-3 py-2 rounded-lg">{error}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-stone-600 mb-1.5">이름 *</label>
                    <input
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="홍길동"
                      className="w-full px-3.5 py-2.5 bg-stone-50 rounded-lg text-[14px] focus:outline-none transition-colors border border-stone-100 focus:border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-stone-600 mb-1.5">연락처</label>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="010-0000-0000"
                      className="w-full px-3.5 py-2.5 bg-stone-50 rounded-lg text-[14px] focus:outline-none transition-colors border border-stone-100 focus:border-stone-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-stone-600 mb-1.5">이메일 *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className="w-full px-3.5 py-2.5 bg-stone-50 rounded-lg text-[14px] focus:outline-none transition-colors border border-stone-100 focus:border-stone-300"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-stone-600 mb-1.5">문의 유형 *</label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-stone-50 rounded-lg text-[14px] focus:outline-none transition-colors border border-stone-100 focus:border-stone-300 cursor-pointer"
                  >
                    <option value="">선택해주세요</option>
                    <option value="강의 문의">강의 문의</option>
                    <option value="원데이클래스 문의">원데이클래스 문의</option>
                    <option value="상품 문의">상품 문의</option>
                    <option value="자격증 과정 문의">자격증 과정 문의</option>
                    <option value="기타 문의">기타 문의</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-stone-600 mb-1.5">내용 *</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    maxLength={500}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="문의 내용을 입력해주세요."
                    className="w-full px-3.5 py-2.5 bg-stone-50 rounded-lg text-[14px] focus:outline-none transition-colors border border-stone-100 focus:border-stone-300 resize-none"
                  />
                  <p className="text-right text-[11px] text-stone-300 mt-0.5">{formData.message.length}/500</p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-stone-900 hover:bg-stone-700 text-white rounded-md text-[15px] font-medium transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
                >
                  {loading ? '전송 중...' : '문의 보내기'}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="w-full rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img
                src="/knot-studio-landing/images/shopbg001.jpg"
                alt="Knot Studio"
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="bg-stone-50 rounded-xl p-6 space-y-4">
              <h3 className="text-[15px] font-semibold text-stone-800">운영 시간</h3>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between text-stone-600">
                  <span>평일 (월~금)</span>
                  <span className="font-medium text-stone-800">09:00 – 20:00</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>토요일</span>
                  <span className="font-medium text-stone-800">10:00 – 18:00</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>일요일 / 공휴일</span>
                  <span className="text-stone-400">휴무</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
