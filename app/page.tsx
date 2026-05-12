'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const TRANSITION_MS = 1200;
const AUTO_SLIDE_MS = 5500;

const slides = [
  {
    src: '/image1.jpg',
    welcome: "Welcome to Prerana's Makeover",
    title: 'CLASSY BRIDES',
    subtitle: 'Beautiful and natural bridal makeup',
    desc: "Take a tour of Prerana's bridal makeup work",
    btn: 'bridal work',
  },
  {
    src: '/image2.jpg',
    welcome: "Welcome to Prerana's Makeover",
    title: 'TIMELESS BEAUTY',
    subtitle: 'With Subtle and natural finish makeup',
    desc: "Book your wedding date with Prerana's Makeover",
    btn: 'book now',
  },
  {
    src: '/image3.jpg',
    welcome: "Welcome to Prerana's Makeover",
    title: 'START CAREER',
    subtitle: 'Learn from makeup expert Prerana',
    desc: 'Pro Makeup Classes Starting at Pune from July 2021',
    btn: 'read more',
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [imgOpacities, setImgOpacities] = useState([1, 0, 0]);
  const [textOpacity, setTextOpacity] = useState(1);
  const [textTranslate, setTextTranslate] = useState(0); // 0 = normal position
  const isAnimating = useRef(false);

  const goTo = (nextIndex: number) => {
    if (isAnimating.current || nextIndex === current) return;
    isAnimating.current = true;

    // Step 1: Text fade out — move LEFT (jaata hua)
    setTextOpacity(0);
    setTextTranslate(-40);

    setTimeout(() => {
      // Step 2: Image cross-fade
      setImgOpacities(prev => {
        const newOp = [...prev];
        newOp[current] = 0;
        newOp[nextIndex] = 1;
        return newOp;
      });

      // Step 3: New text — position RIGHT side (aane se pehle)
      setTextIndex(nextIndex);
      setCurrent(nextIndex);
      setTextTranslate(80); // right se start karega
      setTextOpacity(0);

      // Step 4: Text fade in — right se left ki taraf slide karo
      setTimeout(() => {
        setTextOpacity(1);
        setTextTranslate(0); // apni jagah pe aa jao
        isAnimating.current = false;
      }, 80);

    }, 500);
  };

  const goPrev = () => goTo((current - 1 + slides.length) % slides.length);
  const goNext = () => goTo((current + 1) % slides.length);

  useEffect(() => {
    const interval = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, AUTO_SLIDE_MS);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">

      {/* ALL Images always rendered */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0"
          style={{
            opacity: imgOpacities[i],
            transition: `opacity ${TRANSITION_MS}ms ease-in-out`,
            zIndex: i === current ? 2 : 1,
          }}
        >
          <Image
            src={slide.src}
            alt={slide.title}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>
      ))}

      {/* Left Arrow */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl opacity-70 hover:opacity-100 transition"
        style={{ zIndex: 20 }}
      >
        &#8249;
      </button>

      {/* Right Arrow */}
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl opacity-70 hover:opacity-100 transition"
        style={{ zIndex: 20 }}
      >
        &#8250;
      </button>

      {/* Text Content */}
      <div
        className="absolute inset-0 flex flex-col justify-center px-16 max-w-2xl"
        style={{ zIndex: 20 }}
      >
        <div
          style={{
            opacity: textOpacity,
            transform: `translateX(${textTranslate}px)`,
            transition: 'opacity 600ms ease, transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <p
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            className="text-white text-lg mb-2"
          >
            {slides[textIndex].welcome}
          </p>
          <h1
            style={{ fontFamily: 'Georgia, serif', letterSpacing: '2px' }}
            className="text-white text-6xl font-black mb-3 leading-tight"
          >
            {slides[textIndex].title}
          </h1>
          <p
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            className="text-white text-xl mb-3"
          >
            {slides[textIndex].subtitle}
          </p>
          <div className="w-16 h-0.5 bg-white mb-5" />
          <p className="text-white text-base mb-8 opacity-90">
            {slides[textIndex].desc}
          </p>
          <button
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            className="px-10 py-3 border border-white text-white text-base hover:bg-white hover:text-black transition-all duration-300"
          >
            {slides[textIndex].btn}
          </button>
        </div>
      </div>

    </main>
  );
}