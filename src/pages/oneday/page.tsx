import { useState } from 'react';
import KnotNavbar from '@/pages/home/components/KnotNavbar';
import KnotFooter from '@/pages/home/components/KnotFooter';
import OnedayBookingModal from './components/OnedayBookingModal';

const programs = [
    {
      title: '대바늘 뜨개 체험',
      desc: '기본 코잡기부터 컵받침 완성까지. 뜨개질이 처음이어도 2시간이면 충분합니다.',
      duration: '2시간',
      price: '35,000원',
      image: 'https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/80fb8a22-3fb3-4b96-a6db-4e4e12af0096_21.png?v=e3a338d6e465ba135a21cc127bb5d68b',
    },
    {
      title: '코바늘 뜨개 체험',
      desc: '코바늘로 귀여운 컵받침 만들기. 도구 사용법부터 작품 완성까지 함께합니다.',
      duration: '2시간',
      price: '35,000원',
      image: 'https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/7c584df6-2b03-486c-a00a-6799ea6c548c_22.png?v=3d3c1dd5faf357b6df0fa27dd8a7df40',
    },
    {
      title: '아미구루미 체험',
      desc: '코바늘로 귀여운 동물 인형 만들기. 선물하기 딱 좋은 소품 완성 수업입니다.',
      duration: '2시간',
      price: '40,000원',
      image: 'https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/8398012d-8932-4843-a08a-4d305c9b8fa0_23.png?v=b9fe40e11a48a6c608e5d55e6bb0ef3c',
    },
    {
      title: '코바늘 가방 체험',
      desc: '나만의 미니 가방 완성하기. 소재 선택부터 마무리까지 강사가 함께합니다.',
      duration: '2시간',
      price: '45,000원',
      image: 'https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/37f177af-fa9f-4d17-9368-5bb5f514ea95_24.png?v=a2e500b1b901f6f10fbcab4e44382e35',
    },
  ];

  export default function OnedayPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState('');

    const handleOpenModal = (programTitle: string) => {
      setSelectedProgram(programTitle);
      setModalOpen(true);
    };

    const handleCloseModal = () => {
      setModalOpen(false);
      setSelectedProgram('');
    };

  return (
    <div className="min-h-screen bg-white">
      <KnotNavbar />

      <div className="pt-16">
        {/* 헤더 배너 */}
        <div className="bg-stone-900 py-16 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/45f9658e-44cd-43a0-8369-c730fd6fc024_32.png?v=3cbc57cdef229e4763e4dc37c6c13c21"
              alt=""
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="relative z-10">
            <p className="text-white/40 text-[11px] tracking-widest uppercase mb-3">One-day Class</p>
            <h1 className="text-white mb-3" style={{ fontSize: '32px', fontWeight: 600 }}>원데이클래스 예약</h1>
            <p className="max-w-md mx-auto leading-relaxed" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)' }}>
              재료 준비 없이 오셔도 됩니다.<br />
              2시간 동안 나만의 첫 작품을 완성해보세요.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-[100px]">
          {/* 체험 프로그램 */}
          <div className="mb-[80px]">
            <div className="mb-12">
              <h2 className="text-stone-900" style={{ fontSize: '32px', fontWeight: 600 }}>체험 프로그램</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {programs.map((p) => (
                <div key={p.title} className="group">
                  <div className="w-full overflow-hidden rounded-xl mb-4" style={{ aspectRatio: '4/3' }}>
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="py-2">
                    <h3 className="text-stone-900 mb-2" style={{ fontSize: '20px', fontWeight: 500 }}>{p.title}</h3>
                    <p className="mb-4 leading-relaxed" style={{ fontSize: '15px', color: '#767676' }}>{p.desc}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span style={{ fontSize: '13px', color: '#a8a29e' }}>{p.duration}</span>
                      <span style={{ fontSize: '16px', fontWeight: 600, color: '#1c1917' }}>{p.price}</span>
                    </div>
                    <button
                      onClick={() => handleOpenModal(p.title)}
                      className="inline-flex items-center justify-center bg-stone-900 text-white hover:bg-stone-700 transition-colors cursor-pointer whitespace-nowrap rounded-md w-full"
                      style={{ height: '46px', fontSize: '15px', fontWeight: 500 }}
                    >
                      클래스 예약하기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <KnotFooter />

      <OnedayBookingModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        programTitle={selectedProgram}
      />
    </div>
  );
}