import React from 'react';

interface BulelengLogoProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export const PKBI_LOGO_IMAGE_URL =
  'https://res.cloudinary.com/diuclq0nb/image/upload/v1788677533/Screenshot_20260906-145038_ug9vvz.png';

export const BulelengLogo: React.FC<BulelengLogoProps> = ({
  size = 80,
  className = '',
  glow = false,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full bg-blue-500/30 blur-xl animate-pulse"
          style={{ transform: 'scale(1.25)' }}
        />
      )}

      <img
        src={PKBI_LOGO_IMAGE_URL}
        alt="Logo PKBI Kabupaten Buleleng"
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain rounded-full drop-shadow-lg"
      />
    </div>
  );
};

