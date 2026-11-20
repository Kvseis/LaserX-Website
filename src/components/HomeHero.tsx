'use client';

import Image from 'next/image';
import { useRef, type MouseEvent } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ButtonArrow from './ButtonArrow';
import { whatsapp } from '@/lib/contact';
import type { SiteCopy } from '@/lib/messages/az';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const imageSizes = '(max-width: 720px) calc(100vw - 32px), (max-width: 900px) 680px, (max-width: 1848px) 49vw, 910px';
const reducedMotion = '(prefers-reduced-motion: reduce)';

function showResults(event: MouseEvent<HTMLAnchorElement>) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const target = document.getElementById('neticeler');
  if (!target) return;

  event.preventDefault();
  const hash = event.currentTarget.hash;
  if (window.location.hash !== hash) window.history.pushState(null, '', hash);
  const heading = target.querySelector('h2');
  if (heading) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
  target.scrollIntoView({ behavior: window.matchMedia(reducedMotion).matches ? 'instant' : 'smooth' });
}

export default function HomeHero({ copy, bookingLabel, fontClassName }: {
  copy: SiteCopy['home'];
  bookingLabel: string;
  fontClassName: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const visual = visualRef.current;
    if (!section || !stage || !visual) return;

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const updateReveal = ({ progress }: ScrollTrigger) => {
        visual.style.setProperty('--hero-reveal', `${35 + progress * 65}%`);
        visual.toggleAttribute('data-reveal-complete', progress === 1);
      };
      const stickyTop = () => Math.min(0, window.innerHeight - stage.offsetHeight);
      const measureStage = () => stage.style.setProperty('--hero-sticky-top', `${stickyTop()}px`);

      measureStage();
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: () => `top ${stickyTop()}px`,
        end: () => `+=${section.offsetHeight - stage.offsetHeight}`,
        onRefreshInit: measureStage,
        onRefresh: updateReveal,
        onUpdate: updateReveal,
      });
      updateReveal(trigger);

      if (trigger.progress === 0 && section.getBoundingClientRect().top >= -1) {
        gsap.from('.hero-reveal', { y: 12, opacity: 0.72, duration: 0.62, stagger: 0.05, ease: 'power2.out' });
        gsap.from(visual, { opacity: 0.55, duration: 0.7, ease: 'power2.out' });
      }

      return () => {
        visual.style.removeProperty('--hero-reveal');
        visual.removeAttribute('data-reveal-complete');
        stage.style.removeProperty('--hero-sticky-top');
      };
    });

    return () => media.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={`hero ${fontClassName}`} aria-labelledby="home-hero-title">
      <div ref={stageRef} className="hero-stage">
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="hero-eyebrow hero-reveal">{copy.heroEyebrow}</p>
            <h1 id="home-hero-title" className="hero-reveal">
              <span>{copy.headline[0]}</span>{' '}<span>{copy.headline[1]}</span>
            </h1>
            <p className="hero-description hero-reveal">{copy.description}</p>
            <div className="hero-links hero-reveal">
              <div className="hero-actions">
                <a className="hero-book" href="#sifaris">{bookingLabel}<ButtonArrow /></a>
                <a className="hero-results" href="#neticeler" onClick={showResults}>{copy.heroResults}<ButtonArrow /></a>
              </div>
              <a className="hero-equipment" href={`${whatsapp}?text=${encodeURIComponent(copy.equipmentInquiry)}`}>
                {copy.equipmentCta}<ButtonArrow />
              </a>
            </div>
          </div>
          <figure className="hero-figure">
            <div ref={visualRef} className="hero-visual">
              <Image src="/images/rust-before.webp" width={1536} height={1024} sizes={imageSizes} alt={copy.heroVisualAlt} preload />
              <Image className="hero-clean" src="/images/rust-after.webp" width={1536} height={1024} sizes={imageSizes} alt="" loading="eager" />
              <span className="hero-laser" aria-hidden="true" />
            </div>
            <figcaption>{copy.heroVisualCaption}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
