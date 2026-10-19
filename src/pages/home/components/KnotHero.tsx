import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './KnotHero.css';

gsap.registerPlugin(ScrollTrigger);

const SESSION_KEY = 'knot_hero_seen';

export default function KnotHero() {
  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(SESSION_KEY) === 'true';

    // 이미 본 적 있으면 → 커버 숨기고 바로 완성 상태로
    if (alreadySeen) {
      gsap.set('.knot-hero__cover', { display: 'none' });
      gsap.set('.knot-hero__bg', { scale: 1.08, filter: 'blur(0px) brightness(1)' });
      gsap.set('.knot-hero__title', { scale: 1, opacity: 1, filter: 'blur(0px)' });
      gsap.set('.knot-hero__subtitle', { opacity: 1, y: 0 });
      gsap.set('.knot-hero__cta', { opacity: 1 });
      gsap.set('.knot-hero__scroll', { opacity: 1 });
      return;
    }

    // 첫 방문 → 줌인 애니메이션 실행 후 seen 기록
    sessionStorage.setItem(SESSION_KEY, 'true');

    const ctx = gsap.context(() => {
      // ── Phase 1: 이미지 줌인 → 배경 선명해지며 타이틀 등장 ──
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '.knot-hero-container',
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: 1,
          },
        })
        .to('.knot-hero__cover-img', {
          scale: 2,
          z: 350,
          transformOrigin: 'center center',
          ease: 'power1.inOut',
        })
        .to(
          '.knot-hero__cover',
          {
            '--overlay-opacity': 0,
            ease: 'power1.inOut',
          },
          '<'
        )
        .to(
          '.knot-hero__bg',
          {
            scale: 1.08,
            filter: 'blur(0px) brightness(1)',
            ease: 'power1.inOut',
          },
          '<'
        )
        .to(
          '.knot-hero__title',
          {
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            ease: 'power1.inOut',
          },
          '<'
        )
        .to(
          '.knot-hero__subtitle',
          {
            opacity: 1,
            y: 0,
            ease: 'power1.inOut',
          },
          '-=0.3'
        )
        .to(
          '.knot-hero__cta',
          {
            opacity: 1,
            ease: 'power1.inOut',
          },
          '-=0.2'
        )
        .to(
          '.knot-hero__scroll',
          {
            opacity: 1,
            ease: 'power1.inOut',
          },
          '-=0.2'
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <main>
      {/* ── Hero 인트로 섹션 ── */}
      <div className="knot-hero-container">
        <section className="knot-hero">
          <div className="knot-hero__content">
            {/* 배경 이미지 */}
            <div className="knot-hero__bg" />

            {/* 메인 타이틀 */}
            <h1
              className="knot-hero__title text-white"
              style={{ fontWeight: 400, fontFamily: "'Bagel Fat One', cursive" }}
            >
              작고 소소한 행복
            </h1>

            {/* 서브타이틀 */}
            <div className="knot-hero__subtitle" style={{ top: 'calc(50vh + 6rem)' }}>
              <p className="text-white/75 text-base md:text-lg tracking-wide">
                뜨개질 입문부터 자격증까지 · 원데이클래스 · 실 &amp; 도안 샵
              </p>
            </div>

            {/* CTA 버튼 */}
            <div className="knot-hero__cta">
              <Link
                to="/oneday"
                className="px-7 py-3 rounded-full text-sm font-semibold text-stone-900 bg-white hover:bg-stone-100 transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                원데이클래스 예약
              </Link>
              <Link
                to="/classes"
                className="px-7 py-3 rounded-full text-sm font-semibold text-stone-900 bg-white hover:bg-stone-100 transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                강의 시간표 보기
              </Link>
            </div>

            {/* 스크롤 인디케이터 */}
            <div className="knot-hero__scroll animate-bounce">
              <i className="ri-arrow-down-line text-white/50 text-xl" />
            </div>
          </div>

          {/* 커버 이미지 (줌인 애니메이션용) */}
          <div className="knot-hero__cover">
            <img
              className="knot-hero__cover-img"
              src="https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/dd6a8939-2130-43a7-b941-3ff5207ef0dc_unnamed.png?v=a5db142b9885112617dda7d2cdb61491"
              alt="뜨개 실 클로즈업"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
