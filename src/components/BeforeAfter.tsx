'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MoveHorizontal } from 'lucide-react';
import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { AboutCopy } from '@/lib/about-copy';
import { useAboutReducedMotion } from './about-section-motion';
import styles from './AboutPage.module.css';

const sizes = '(min-width: 1560px) 775px, (min-width: 768px) 52vw, calc(100vw - 16px)';

export default function BeforeAfter({ before, after, copy }: {
  before: string;
  after: string;
  copy: AboutCopy['comparison'];
}) {
  const frame = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLButtonElement>(null);
  const activePointer = useRef<number | null>(null);
  const [position, setPosition] = useState(50);
  const reduced = useAboutReducedMotion();
  const { scrollYProgress } = useScroll({ target: frame, offset: ['start end', 'end start'] });
  const parallax = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);

  function movePointer(event: PointerEvent<HTMLDivElement>) {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    setPosition(Math.min(100, Math.max(0, (event.clientX - left) / width * 100)));
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || activePointer.current !== null) return;
    activePointer.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    if (event.pointerType === 'mouse') slider.current?.focus({ preventScroll: true });
    movePointer(event);
  }

  function stopDrag(event: PointerEvent<HTMLDivElement>) {
    if (activePointer.current === event.pointerId) activePointer.current = null;
  }

  function handleKey(event: KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        setPosition((value) => Math.max(0, value - 3));
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        setPosition((value) => Math.min(100, value + 3));
        break;
      case 'Home':
        setPosition(0);
        break;
      case 'End':
        setPosition(100);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  return (
    <div
      ref={frame}
      className={styles.comparisonFrame}
      onPointerDown={startDrag}
      onPointerMove={(event) => {
        if (activePointer.current === event.pointerId) movePointer(event);
      }}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      onLostPointerCapture={stopDrag}
    >
      <motion.div className={styles.comparisonImages} style={{ y: reduced ? 0 : parallax }}>
        <Image src={after} alt={copy.afterAlt} fill sizes={sizes} draggable={false} />
        <div className={styles.comparisonBefore} style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Image src={before} alt={copy.beforeAlt} fill sizes={sizes} draggable={false} />
        </div>
      </motion.div>
      <span aria-hidden="true" className={styles.comparisonLabel}>{copy.before}</span>
      <span aria-hidden="true" className={styles.comparisonLabel}>{copy.after}</span>
      <span aria-hidden="true" className={styles.comparisonLine} style={{ left: `${position}%` }} />
      <button
        ref={slider}
        type="button"
        role="slider"
        aria-label={copy.label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        className={styles.comparisonHandle}
        style={{ left: `clamp(22px, ${position}%, calc(100% - 22px))` }}
        onKeyDown={handleKey}
      >
        <MoveHorizontal size={20} aria-hidden="true" />
      </button>
    </div>
  );
}
