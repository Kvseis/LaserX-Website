import Image from 'next/image';

export default function WhatsAppLogo({ className = '' }: { className?: string }) {
  return <Image className={`whatsapp-logo ${className}`.trim()} src="/images/images.jpg" width={32} height={32} alt="" aria-hidden="true" />;
}
