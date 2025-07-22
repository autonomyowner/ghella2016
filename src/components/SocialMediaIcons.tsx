'use client';

import React from 'react';

interface WebsiteSettings {
  social_linkedin?: string;
  social_youtube?: string;
  social_tiktok?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_twitter?: string;
}

interface SocialMediaIconsProps {
  settings: WebsiteSettings;
}

const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({ settings }) => {
  const socialLinks = [
    {
      key: 'linkedin',
      url: settings.social_linkedin,
      icon: 'fab fa-linkedin-in',
      hoverClass: 'hover:bg-blue-600 hover:border-blue-500',
      title: 'تابعنا على LinkedIn'
    },
    {
      key: 'youtube',
      url: settings.social_youtube,
      icon: 'fab fa-youtube',
      hoverClass: 'hover:bg-red-600 hover:border-red-500',
      title: 'تابعنا على YouTube'
    },
    {
      key: 'tiktok',
      url: settings.social_tiktok,
      icon: 'fab fa-tiktok',
      hoverClass: 'hover:bg-black hover:border-gray-800',
      title: 'تابعنا على TikTok'
    },
    {
      key: 'facebook',
      url: settings.social_facebook,
      icon: 'fab fa-facebook-f',
      hoverClass: 'hover:bg-blue-600 hover:border-blue-500',
      title: 'تابعنا على Facebook'
    },
    {
      key: 'instagram',
      url: settings.social_instagram,
      icon: 'fab fa-instagram',
      hoverClass: 'hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:border-purple-500',
      title: 'تابعنا على Instagram'
    },
    {
      key: 'twitter',
      url: settings.social_twitter,
      icon: 'fab fa-twitter',
      hoverClass: 'hover:bg-blue-400 hover:border-blue-400',
      title: 'تابعنا على Twitter'
    }
  ].filter(link => link.url);

  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <div className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 flex flex-col space-y-3 md:space-y-4">
      {socialLinks.map((link, index) => (
        <a
          key={link.key}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 border border-white/20 ${link.hoverClass}`}
          title={link.title}
          style={{
            animationDelay: `${1.2 + index * 0.1}s`,
            animation: 'fadeInScale 0.5s ease-out forwards'
          }}
        >
          <i className={`${link.icon} text-white text-sm md:text-lg group-hover:text-white`}></i>
        </a>
      ))}
      
      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default SocialMediaIcons; 