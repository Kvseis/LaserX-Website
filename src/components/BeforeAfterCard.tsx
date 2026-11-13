'use client';

import { useRef, useState, type PointerEvent } from 'react';
import type { SiteCopy } from '@/lib/messages/az';

const imageSizes = '(max-width: 760px) 60vw, (max-width: 1000px) 46vw, (max-width: 1565px) 23vw, 348px';
const clamp = (value: number) => Math.round(Math.max(0, Math.min(100, value)));

type Gesture = {
  pointerId: number;
  startX: number;
  startY: number;
  startSplit: number;
  left: number;
  width: number;
  handle: boolean;
  step: number;
  moved: boolean;
};

export default function BeforeAfterCard({ id, title, detail, copy }: {
  id: string;
  title: string;
  detail: string;
  copy: SiteCopy['results'];
}) {
  const [split, setSplit] = useState(50);
  const gesture = useRef<Gesture | null>(null);
  const suppressClick = useRef(false);

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const button = (event.target as Element).closest('button');
    gesture.current = {
      pointerId: event.pointerId, startX: event.clientX, startY: event.clientY,
      startSplit: split, left: bounds.left, width: bounds.width,
      handle: Boolean(button), step: Number(button?.dataset.step ?? 0), moved: false,
    };
    suppressClick.current = false;
    // Keep capture on the original button even as the handle moves with the pointer.
    (button ?? event.currentTarget).setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const active = gesture.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - active.startX;
    const deltaY = event.clientY - active.startY;
    if (!active.moved) {
      if (Math.abs(deltaY) > 8 && Math.abs(deltaY) > Math.abs(deltaX)) {
        gesture.current = null;
        suppressClick.current = true;
        return;
      }
      if (Math.abs(deltaX) < 5) return;
      active.moved = true;
    }
    // Preserve the grab offset on either arrow; dragging must never jump or add a click.
    setSplit(clamp(active.handle
      ? active.startSplit + deltaX / active.width * 100
      : (event.clientX - active.left) / active.width * 100));
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    const active = gesture.current;
    if (!active || active.pointerId !== event.pointerId) return;
    suppressClick.current = active.moved || active.handle;
    if (active.handle && !active.moved) {
      setSplit((value) => clamp(value + active.step));
    } else if (!active.handle && !active.moved) {
      setSplit(clamp((event.clientX - active.left) / active.width * 100));
    }
    gesture.current = null;
  }

  return <article className="result-card">
    <div className="result-visual"
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={finishDrag}
      onPointerCancel={() => { gesture.current = null; suppressClick.current = true; }}
      onLostPointerCapture={() => { gesture.current = null; }}
      onDragStart={(event) => event.preventDefault()}
      onClickCapture={(event) => {
        if (suppressClick.current && event.detail !== 0) {
          event.preventDefault();
          event.stopPropagation();
        }
        suppressClick.current = false;
      }}
    >
      <div className="result-after" style={{ clipPath: `inset(0 0 0 ${split}%)` }}>
        <img src={`/images/comparisons/${id}-after-480.webp`} srcSet={`/images/comparisons/${id}-after-480.webp 480w, /images/comparisons/${id}-after-960.webp 960w`} width={1536} height={1024} sizes={imageSizes} loading="lazy" decoding="async" draggable={false} alt={`${title}: ${copy.afterAlt}`} />
        <span className="result-label after-label">{copy.after}</span>
      </div>
      <div className="result-before" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
        <img src={`/images/comparisons/${id}-before-480.webp`} srcSet={`/images/comparisons/${id}-before-480.webp 480w, /images/comparisons/${id}-before-960.webp 960w`} width={1536} height={1024} sizes={imageSizes} loading="lazy" decoding="async" draggable={false} alt={`${title}: ${copy.beforeAlt}`} />
        <span className="result-label before-label">{copy.before}</span>
      </div>
      <span className="result-divider" style={{ left: `${split}%` }} aria-hidden="true" />
      <input
        aria-label={copy.slider.replace('{title}', title)}
        aria-valuetext={`${copy.before} ${split}%, ${copy.after} ${100 - split}%`}
        type="range" min="0" max="100" value={split}
        onChange={(event) => setSplit(Number(event.target.value))}
      />
      <div className="result-handle" style={{ left: `clamp(var(--handle-half), ${split}%, 100% - var(--handle-half))` }}>
        <button type="button" data-step="-15" aria-label={`${title}: ${copy.moreAfter}`} onClick={() => setSplit((value) => clamp(value - 15))}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6" /></svg>
        </button>
        <button type="button" data-step="15" aria-label={`${title}: ${copy.moreBefore}`} onClick={() => setSplit((value) => clamp(value + 15))}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
        </button>
      </div>
    </div>
    <div className="result-card-copy"><span>{detail}</span><h3>{title}</h3></div>
  </article>;
}
