import React, { useState } from 'react';
import Image from 'next/image';

interface TeamFlipCardProps {
  name: string;
  role: string;
  image?: string;
  bio: string;
  skills: { icon: string; text: string }[];
  roleDescription?: string;
}

const TeamFlipCard: React.FC<TeamFlipCardProps> = ({ name, role, image, bio, skills, roleDescription }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="flip-card group cursor-pointer animate-slide-in-right w-full max-w-sm mx-auto"
      style={{ perspective: '1200px', animationDelay: '0.1s', height: 'auto', minHeight: '400px' }}
      onClick={() => setFlipped((f) => !f)}
      dir="rtl"
    >
      <div
        className={`flip-card-inner transition-transform duration-700 ease-in-out ${flipped ? 'rotate-y-180' : ''} w-full h-full`}
        style={{ transformStyle: 'preserve-3d', minHeight: '400px' }}
      >
        {/* Front */}
        <div
          className="flip-card-front glassmorphic-card flex flex-col items-center justify-center p-6 rounded-2xl shadow-xl border border-green-400/30 bg-gradient-to-br from-green-900/60 to-green-800/80 backdrop-blur-xl text-center w-full h-full relative overflow-hidden"
          style={{ backfaceVisibility: 'hidden', minHeight: '400px' }}
        >
          {image ? (
            <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden z-0">
              <Image
                src={image}
                alt={name}
                className="object-cover w-full h-full"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onError={(e) => {
                  console.error('Image failed to load:', image);
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
                onLoadingComplete={() => {
                  console.log('Image loaded successfully:', image);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-2xl" />
            </div>
          ) : (
            <div className="w-28 h-28 rounded-full flex items-center justify-center bg-green-900/40 mb-4 border-4 border-green-400/30">
              <span className="text-5xl text-green-300">👤</span>
            </div>
          )}
          <div className="relative z-10 flex flex-col items-center justify-center h-full pt-32">
            <h3 className="text-2xl font-bold mb-1 text-green-100 drop-shadow-lg">{name}</h3>
            <p className="text-lg text-green-200 opacity-90 drop-shadow-lg">{role}</p>
            <p className="text-sm text-orange-300 opacity-80 mt-2 drop-shadow-lg">اضغط لمعرفة المزيد</p>
          </div>
        </div>
        {/* Back */}
        <div
          className="flip-card-back glassmorphic-card flex flex-col items-start justify-start p-6 rounded-2xl shadow-xl border border-orange-400/30 bg-gradient-to-br from-green-900/80 to-orange-900/60 backdrop-blur-xl text-center w-full h-full absolute top-0 left-0 overflow-y-auto"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', minHeight: '400px' }}
                  >
            <div className="w-full text-center">
              <h3 className="text-xl font-bold mb-2 text-green-100">{name}</h3>
              <p className="text-sm text-green-200 mb-2">{role}</p>
              
              {roleDescription && (
                <div className="mb-4 p-3 bg-green-900/30 rounded-lg border border-green-400/20">
                  <p className="text-xs text-green-100 leading-relaxed text-right">{roleDescription}</p>
                </div>
              )}
              
              <p className="text-xs text-green-200 leading-relaxed mb-3 text-right">{bio}</p>
              <div className="space-y-1 text-xs">
                {skills.map((skill, idx) => (
                  <p key={idx} className="flex items-center gap-2 justify-center text-green-200">
                    <span className="text-sm">{skill.icon}</span> {skill.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
      </div>
      <style jsx>{`
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.7s var(--transition-normal);
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        .flip-card-front {
          z-index: 2;
        }
        .flip-card-back {
          z-index: 3;
        }
      `}</style>
    </div>
  );
};

export default TeamFlipCard;
