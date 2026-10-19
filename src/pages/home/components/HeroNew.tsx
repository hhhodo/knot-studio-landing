import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HeroNew.css';

gsap.registerPlugin(ScrollTrigger);

export default function HeroNew() {
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const sectionStickRef = useRef<HTMLElement>(null);
  const opacityRevealRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation timeline
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '.hero-container',
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: 1,
          },
        })
        .to('.hero__cover-img', {
          scale: 2,
          z: 350,
          transformOrigin: 'center center',
          ease: 'power1.inOut',
        })
        .to(
          '.hero__cover',
          {
            '--overlay-opacity': 0,
            ease: 'power1.inOut',
          },
          '<'
        )
        .to(
          '.hero__bg',
          {
            scale: 1.1,
            filter: 'blur(0px) brightness(1)',
            ease: 'power1.inOut',
          },
          '<'
        )
        .to(
          '.hero__title',
          {
            scale: 1,
            
            opacity: 1,
            filter: 'blur(0px)',
            ease: 'power1.inOut',
          },
          '<'
        );

      // Text reveal animation
      const text = opacityRevealRef.current;
      if (text) {
        const chars = text.textContent?.split('') || [];
        text.innerHTML = chars
          .map((char) => {
            // Preserve spaces by using &nbsp; for space characters
            if (char === ' ') {
              return '<span class="char">&nbsp;</span>';
            }
            return `<span class="char">${char}</span>`;
          })
          .join('');

        const charElements = text.querySelectorAll('.char');
        gsap.set(charElements, { opacity: 0.2, y: 0 });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: '.section-stick',
              pin: true,
              start: 'center center',
              end: '+=1500',
              scrub: 1,
            },
          })
          .to(charElements, {
            opacity: 1,
            duration: 1,
            ease: 'none',
            stagger: 1,
          })
          .to({}, { duration: 10 })
          .to('.opacity-reveal', {
            opacity: 0,
            scale: 1.2,
            duration: 50,
          });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main>
      <div className="hero-container" ref={heroContainerRef}>
        <section className="hero">
          <div className="hero__content">
            <div className="hero__bg"></div>
            <h1 className="hero__title font-bold text-white text-center" style={{ fontFamily: 'Caprasimo, cursive' }}>
              Find<br />your tribe
            </h1>
          </div>
          <div className="hero__cover">
            <img
              className="hero__cover-img"
              src="https://assets.codepen.io/204808/hobbit-hole.png"
              alt="Hero background"
            />
          </div>
        </section>
      </div>
      <section
        className="section-stick min-h-screen bg-brand-brown flex justify-center items-center text-white"
        ref={sectionStickRef}
      >
        <p
          className="opacity-reveal text-7xl text-center w-3/5"
          ref={opacityRevealRef}
        >
          What the human being is best at doing is interpreting all new information so that their prior conclusions remain in tact
        </p>
      </section>
    </main>
  );
}
