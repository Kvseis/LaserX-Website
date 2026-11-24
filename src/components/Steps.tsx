'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useRef, useState, type UIEvent } from 'react';
import type { AboutCopy } from '@/lib/about-copy';
import { aboutReveal, aboutViewport, useAboutReducedMotion } from './about-section-motion';
import styles from './AboutPage.module.css';

type StepsProps = { label: string; title: string; titles: AboutCopy['process'] };

const images = ['/steps/1.jpg', '/steps/2.jpg', '/steps/3.jpg', '/steps/4.jpg'];
const desktopSizes = '(min-width: 1292px) 540px, (min-width: 1101px) 43vw, 46vw';
const stepNumber = (index: number) => `0${index + 1}`;
const stepIndex = (index: number) => Math.min(images.length - 1, Math.max(0, index));
const stepReveal = {
  ...aboutReveal,
  visible: { ...aboutReveal.visible, transition: { ...aboutReveal.visible.transition, delay: 0.08 } },
};

function StepsHeading({ label, title, id }: { label: string; title: string; id: string }) {
  return (
    <motion.div
      className={`${styles.stepHeading} ${styles.featureReveal}`}
      variants={aboutReveal}
      initial="hidden"
      whileInView="visible"
      viewport={aboutViewport}
    >
      <p className={styles.eyebrow}>{label}</p>
      <h2 id={id}>{title}</h2>
    </motion.div>
  );
}

function StepsDesktop({ label, title, titles }: StepsProps) {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useAboutReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    setActive(stepIndex(Math.floor(progress * titles.length)));
  });

  return (
    <section className={styles.stepsDesktop} ref={section} aria-labelledby="steps-desktop-title">
      <div className={`${styles.container} ${styles.stepsSticky}`}>
        <StepsHeading label={label} title={title} id="steps-desktop-title" />
        <motion.div
          className={`${styles.stepLayout} ${styles.featureReveal}`}
          variants={stepReveal}
          initial="hidden"
          whileInView="visible"
          viewport={aboutViewport}
        >
          <div className={`${styles.stepImage} ${styles.desktopStepImage}`}>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={active}
                className={styles.stepSlide}
                initial={{ opacity: 0, scale: reduced ? 1 : 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0.2 : 0.7 }}
              >
                <Image src={images[active]} alt="" fill sizes={desktopSizes} loading={active === 0 ? 'lazy' : 'eager'} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className={styles.stepCopy}>
            <ol className={styles.visuallyHidden}>
              {titles.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <div className={styles.stepTitles} aria-hidden="true">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={active}
                  initial={{ y: reduced ? 0 : 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: reduced ? 0 : -40, opacity: 0 }}
                  transition={{ duration: reduced ? 0.16 : 0.5 }}
                >
                  <span className={styles.stepNumber}>{stepNumber(active)}</span>
                  <h3>{titles[active]}</h3>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className={styles.stepProgress} aria-hidden="true">
              <motion.div style={{ scaleX: scrollYProgress }} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StepsMobile({ label, title, titles }: StepsProps) {
  const rail = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useAboutReducedMotion();

  function updateActive({ currentTarget }: UIEvent<HTMLOListElement>) {
    const [first, second] = currentTarget.children;
    const stride = (second as HTMLElement).offsetLeft - (first as HTMLElement).offsetLeft;
    if (stride > 0) setActive(stepIndex(Math.round(currentTarget.scrollLeft / stride)));
  }

  function goTo(index: number) {
    const list = rail.current;
    const card = list?.children[index];
    if (card instanceof HTMLElement) list?.scrollTo({ left: card.offsetLeft, behavior: reduced ? 'instant' : 'smooth' });
  }

  return (
    <section className={`${styles.container} ${styles.stepsMobile}`} aria-labelledby="steps-mobile-title">
      <StepsHeading label={label} title={title} id="steps-mobile-title" />
      <motion.div
        className={styles.featureReveal}
        variants={stepReveal}
        initial="hidden"
        whileInView="visible"
        viewport={aboutViewport}
      >
        <ol ref={rail} className={styles.stepRail} onScroll={updateActive} id="steps-rail">
          {titles.map((step, index) => (
            <li className={styles.stepCard} key={step}>
              <div className={styles.stepImage}><Image src={images[index]} alt="" fill sizes="80vw" /></div>
              <div className={styles.stepCardTitle}>
                <span className={styles.stepNumber} aria-hidden="true">{stepNumber(index)}</span>
                <h3>{step}</h3>
              </div>
            </li>
          ))}
        </ol>
        <div className={styles.stepDots}>
          {titles.map((step, index) => (
            <button
              key={step}
              type="button"
              aria-label={`${stepNumber(index)} · ${step}`}
              aria-controls="steps-rail"
              aria-current={active === index ? 'step' : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default function Steps(props: StepsProps) {
  return <div className={styles.process}><StepsDesktop {...props} /><StepsMobile {...props} /></div>;
}
