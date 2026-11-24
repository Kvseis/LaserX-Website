'use client';

import { motion, stagger } from 'framer-motion';
import { Crosshair, FlaskConical, ShieldCheck } from 'lucide-react';
import { useId, useState } from 'react';
import type { AboutCopy } from '@/lib/about-copy';
import { aboutReveal, aboutViewport } from './about-section-motion';
import BeforeAfter from './BeforeAfter';
import styles from './AboutPage.module.css';

const benefitIcons = [ShieldCheck, FlaskConical, Crosshair];
const storyReveal = { visible: { transition: { delayChildren: stagger(0.08) } } };

function Benefits({ items }: { items: AboutCopy['benefits'] }) {
  const id = useId();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? expanded;

  return (
    <motion.div
      className={styles.benefits}
      variants={aboutReveal}
      onPointerLeave={() => setHovered(null)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setHovered(null);
          setExpanded(null);
        }
      }}
    >
      <div className={styles.benefitList}>
        {items.map((item, index) => {
          const Icon = benefitIcons[index];
          return (
            <button
              key={item.title}
              type="button"
              aria-expanded={active === index}
              aria-controls={`${id}-${index}`}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') setHovered(index);
              }}
              onClick={() => {
                setHovered(null);
                setExpanded(expanded === index ? null : index);
              }}
            >
              <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
              {item.title}
            </button>
          );
        })}
      </div>
      <div className={styles.benefitDetails}>
        {items.map((item, index) => (
          <p key={item.title} id={`${id}-${index}`} aria-hidden={active !== index}>{item.text}</p>
        ))}
      </div>
    </motion.div>
  );
}

export default function AboutStory({ about }: {
  about: Pick<AboutCopy, 'storyLabel' | 'storyTitle' | 'storyMuted' | 'storyDescription' | 'benefits' | 'comparison'>;
}) {
  return (
    <motion.section
      className={`${styles.container} ${styles.story}`}
      aria-labelledby="story-title"
      variants={storyReveal}
      initial="hidden"
      whileInView="visible"
      viewport={aboutViewport}
    >
      <motion.div className={styles.featureReveal} variants={aboutReveal}>
        <BeforeAfter before="/images/limestone-before.webp" after="/images/limestone-after.webp" copy={about.comparison} />
      </motion.div>
      <motion.div className={styles.storyCopy} variants={storyReveal}>
        <motion.div className={styles.featureReveal} variants={aboutReveal}>
          <p className={styles.eyebrow}>{about.storyLabel}</p>
          <h2 id="story-title"><span>{about.storyMuted}</span>{about.storyTitle.slice(about.storyMuted.length)}</h2>
        </motion.div>
        <motion.div className={`${styles.storyBody} ${styles.featureReveal}`} variants={aboutReveal}>
          {about.storyDescription.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </motion.div>
        <Benefits items={about.benefits} />
      </motion.div>
    </motion.section>
  );
}
