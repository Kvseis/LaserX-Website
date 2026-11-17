'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SiteCopy } from '@/lib/messages/az';
import { whatsapp } from '@/lib/contact';
import styles from './HeroSequence.module.css';

const scenes = [
  { id: 'wood', poster: '/images/hero-wood-before.webp', src: '/videos/hero-wood.mp4' },
  { id: 'mold', poster: '/images/hero-mold-before.webp', src: '/videos/hero-mold.mp4' },
  { id: 'metal', poster: '/images/laserx-scroll-poster.webp', src: '/videos/laserx-scroll-cleaning.mp4' },
];

export default function HeroSequence({ copy }: { copy: SiteCopy['home'] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    media.add('(prefers-reduced-motion: no-preference)', () => {
      if (connection?.saveData) return;
      section.dataset.motion = 'true';
      const layers = Array.from(section.querySelectorAll<HTMLElement>('[data-scene]'));
      const videos = layers.map(layer => layer.querySelector('video')!);
      const copyElement = section.querySelector<HTMLElement>('[data-hero-copy]')!;
      let progress = 0;
      const seek = (video: HTMLVideoElement, local: number) => {
        if (!video.duration || video.seeking) return;
        const time = Math.max(0, Math.min(1, local)) * Math.max(0, video.duration - .05);
        if (Math.abs(video.currentTime - time) > .045) video.currentTime = time;
      };
      const render = () => {
        const intro = Math.min(1, progress / .16);
        copyElement.style.opacity = String(1 - Math.min(1, progress / .105));
        copyElement.style.transform = `translateY(${-intro * 45}px)`;
        copyElement.style.visibility = progress > .12 ? 'hidden' : 'visible';
        const starts = [.16, .44, .72];
        layers.forEach((layer, i) => {
          const start = starts[i];
          const end = starts[i + 1] ?? 1.04;
          const fadeIn = i === 0 ? 1 : Math.min(1, Math.max(0, (progress - start) / .025));
          const fadeOut = Math.min(1, Math.max(0, (end - .012 - progress) / .025));
          layer.style.opacity = String(Math.min(fadeIn, fadeOut));
          layer.style.transform = i === 0 ? `translateX(${(1 - intro) * 22}%) scale(${.92 + intro * .08})` : 'none';
          if (window.innerWidth <= 1023) {
            const stageHeight = layer.parentElement!.clientHeight;
            const initialTop = Math.max(stageHeight * .45, copyElement.offsetHeight + 28);
            const top = (1 - intro) * initialTop;
            layer.style.top = `${top}px`;
            layer.style.height = `calc(100% - ${top}px)`;
          } else {
            layer.style.top = '0';
            layer.style.height = '100%';
          }
          seek(videos[i], (progress - start) / (end - start - .04));
        });
      };
      const onReady = () => render();
      videos.forEach((video, i) => {
        video.src = scenes[i].src;
        video.addEventListener('loadeddata', onReady);
        video.addEventListener('seeked', onReady);
      });
      const trigger = ScrollTrigger.create({
        trigger: section, start: 'top top', end: 'bottom bottom',
        onUpdate: self => { progress = self.progress; render(); },
        onRefresh: self => { progress = self.progress; render(); },
      });
      render();
      return () => {
        trigger.kill();
        delete section.dataset.motion;
        copyElement.removeAttribute('style');
        layers.forEach(layer => layer.removeAttribute('style'));
        videos.forEach(video => {
          video.removeEventListener('loadeddata', onReady);
          video.removeEventListener('seeked', onReady);
          video.pause();
          video.removeAttribute('src');
          video.load();
        });
      };
    });
    return () => media.revert();
  }, []);

  return <section className={styles.sequence} ref={sectionRef} id="proses" aria-labelledby="hero-title">
    <div className={styles.stage}>
      <div className={styles.visuals} aria-hidden="true">
        {scenes.map((scene, i) => <div className={styles.scene} data-scene={scene.id} key={scene.id}>
          <Image src={scene.poster} alt="" fill sizes="100vw" preload={i === 0} />
          <video poster={scene.poster} muted playsInline preload="auto" disablePictureInPicture />
        </div>)}
      </div>
      <div className={styles.copy} data-hero-copy>
        <h1 id="hero-title">{copy.headline.join(' ')}</h1>
        <p>{copy.description}</p>
        <div className={styles.actions}>
          <a href="#xidmetler" className={styles.primary}>{copy.exploreServices}<span aria-hidden="true">↗</span></a>
          <a href={whatsapp} className={styles.secondary}>{copy.contactAction}<span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <p className={styles.disclosure}>{copy.filmDisclosure}</p>
    </div>
  </section>;
}
