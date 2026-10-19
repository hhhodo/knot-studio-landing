import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: '홈', path: '/' },
  { label: '강의 시간표', path: '/classes' },
  { label: '원데이클래스', path: '/oneday' },
  { label: '실 & 도안 샵', path: '/shop' },
  { label: '공방 소개', path: '/about' },
];

function useCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      const items: { id: number; qty: number }[] = JSON.parse(localStorage.getItem('knot_cart') || '[]');
      setCount(items.reduce((sum, item) => sum + item.qty, 0));
    };
    update();
    window.addEventListener('storage', update);
    // 같은 탭 내 cart 변경 감지
    const interval = setInterval(update, 500);
    return () => {
      window.removeEventListener('storage', update);
      clearInterval(interval);
    };
  }, []);

  return count;
}

export default function KnotNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const cartCount = useCartCount();
  const isHome = location.pathname === '/';
  const transparent = isHome && !scrolled;

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }

    const alreadySeen = sessionStorage.getItem('knot_hero_seen') === 'true';

    // 이미 본 적 있으면 히어로가 100vh만 차지 → 스크롤 위치 무관하게 는 바로다 흰 네비바
    if (alreadySeen) {
      setScrolled(true);
      return;
    }

    // 첫 방문: pin된 히어로 구간(100vh + 150%) 지나면 흰 네비바
    const heroHeight = window.innerHeight * 2.5;
    const handleScroll = () => {
      setScrolled(window.scrollY > heroHeight);
    };
    setScrolled(window.scrollY > heroHeight);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-transparent border-b border-transparent'
          : 'bg-white border-b border-stone-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className={`text-base font-bold tracking-tight transition-colors duration-300 ${
            transparent ? 'text-white' : 'text-stone-900'
          }`}>
            Knot Studio
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[13px] font-medium transition-colors duration-200 whitespace-nowrap ${
                transparent
                  ? location.pathname === link.path
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                  : location.pathname === link.path
                    ? 'text-stone-900'
                    : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/cart"
            className={`relative w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer ${
              transparent
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <i className="ri-shopping-bag-line" style={{ fontSize: '20px' }}></i>
            {cartCount > 0 && (
              <span
                className={`absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[10px] font-bold px-0.5 ${
                  transparent ? 'bg-white text-stone-900' : 'bg-stone-900 text-white'
                }`}
                style={{ lineHeight: 1 }}
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/oneday"
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
              transparent
                ? 'bg-white text-stone-900 hover:bg-white/90'
                : 'bg-stone-900 text-white hover:bg-stone-700'
            }`}
          >
            체험 예약하기
          </Link>
        </div>

        <button
          className={`md:hidden w-8 h-8 flex items-center justify-center cursor-pointer transition-colors duration-200 ${
            transparent ? 'text-white' : 'text-stone-700'
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`text-lg ${menuOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100">
          <nav className="flex flex-col py-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-6 py-3 text-[13px] font-medium transition-colors ${
                  location.pathname === link.path ? 'text-stone-900 bg-stone-50' : 'text-stone-500 hover:bg-stone-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-6 py-3 border-t border-stone-100 mt-1">
              <Link
                to="/oneday"
                className="block w-full text-center px-4 py-2 bg-stone-900 text-white rounded-full text-[13px] font-medium"
              >
                체험 예약하기
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
