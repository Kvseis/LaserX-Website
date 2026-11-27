import Image from 'next/image';

export default function BrandWordmark() {
  return <span className="brand-wordmark" role="img" aria-label="LaserX">
    Laser<Image unoptimized src="/images/laserx-mark-128.webp" width={28} height={28} alt="" />
  </span>;
}
