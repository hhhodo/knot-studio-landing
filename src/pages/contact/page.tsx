import KnotNavbar from '@/pages/home/components/KnotNavbar';
import KnotFooter from '@/pages/home/components/KnotFooter';
import ContactInfoBento from './components/ContactInfoBento';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <KnotNavbar />

      <div className="pt-16">
        <div className="bg-stone-900 py-16 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://readdy.ai/api/search-image?query=cozy%20knitting%20studio%20interior%20with%20wooden%20table%20and%20yarn%20baskets%2C%20warm%20ambient%20lighting%2C%20inviting%20craft%20space%20atmosphere%2C%20soft%20natural%20tones&width=1440&height=400&seq=contactbg001&orientation=landscape"
              alt=""
              className="w-full h-full object-cover object-top opacity-15"
            />
          </div>
          <div className="relative z-10">
            <p className="text-white/40 text-[11px] tracking-widest uppercase mb-3">Contact</p>
            <h1 className="text-[32px] font-semibold text-white mb-3">문의하기</h1>
            <p className="text-white/50 text-[14px] max-w-md mx-auto leading-relaxed">
              궁금한 점이 있으시면 언제든지 연락주세요.<br />
              빠르게 답변 드리겠습니다.
            </p>
          </div>
        </div>

        <ContactInfoBento />
      </div>

      <KnotFooter />
    </div>
  );
}
