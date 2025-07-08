import React, { useState, useEffect } from 'react';

interface Quote {
  arabic: string;
  source: string;
  translation?: string;
}

const islamicQuotes: Quote[] = [
  {
    arabic: "مَا مِنْ مُسْلِمٍ يَغْرِسُ غَرْسًا أَوْ يَزْرَعُ زَرْعًا فَيَأْكُلُ مِنْهُ طَيْرٌ أَوْ إِنْسَانٌ أَوْ بَهِيمَةٌ إِلَّا كَانَ لَهُ بِهِ صَدَقَةٌ",
    source: "صحيح البخاري",
    translation: "Whoever plants a tree or sows a crop from which birds, humans, or animals eat, it will be considered charity for them."
  },
  {
    arabic: "إِنْ قَامَتِ السَّاعَةُ وَفِي يَدِ أَحَدِكُمْ فَسِيلَةٌ فَإِنِ اسْتَطَاعَ أَنْ لَا تَقُومَ حَتَّى يَغْرِسَهَا فَلْيَغْرِسْهَا",
    source: "مسند الإمام أحمد",
    translation: "If the Hour comes while one of you has a palm shoot in his hand, let him plant it."
  },
  {
    arabic: "الدُّنْيَا خَضِرَةٌ حُلْوَةٌ وَإِنَّ اللَّهَ مُسْتَخْلِفُكُمْ فِيهَا فَيَنْظُرُ كَيْفَ تَعْمَلُونَ",
    source: "صحيح مسلم",
    translation: "The world is green and beautiful, and Allah has appointed you as His stewards over it to see how you will act."
  },
  {
    arabic: "مَنْ أَحْيَا أَرْضًا مَيْتَةً فَهِيَ لَهُ",
    source: "صحيح البخاري",
    translation: "Whoever revives dead land, it belongs to them."
  }
];

const IslamicQuote: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(islamicQuotes[0]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentQuote(prev => {
          const currentIndex = islamicQuotes.findIndex(q => q.arabic === prev.arabic);
          const nextIndex = (currentIndex + 1) % islamicQuotes.length;
          return islamicQuotes[nextIndex];
        });
        setIsVisible(true);
      }, 300);
    }, 8000); // Change quote every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_1px,_transparent_1px)] bg-[length:20px_20px] from-green-500"></div>
      </div>
      
      <div className="card-responsive glass relative z-10">
        <div className={`transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Islamic ornament */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white text-2xl">
              ☪
            </div>
          </div>
          
          {/* Quote text */}
          <blockquote className="text-center">
            <p className="text-responsive-lg leading-relaxed font-medium text-gray-800 dark:text-gray-200 mb-4 font-arabic">
              "{currentQuote.arabic}"
            </p>
            
            {/* Source */}
            <footer className="text-responsive-sm text-green-600 dark:text-green-400 font-semibold">
              — {currentQuote.source}
            </footer>
            
            {/* Translation (optional) */}
            {currentQuote.translation && (
              <p className="text-responsive-xs text-gray-600 dark:text-gray-400 mt-3 italic">
                {currentQuote.translation}
              </p>
            )}
          </blockquote>
          
          {/* Quote indicator dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {islamicQuotes.map((quote, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuote(quote)}
                className={`w-2 h-2 rounded-full transition-all duration-300 touch-friendly ${
                  quote.arabic === currentQuote.arabic 
                    ? 'bg-green-500 w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`عرض الحديث ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IslamicQuote;

/* 
Usage example:

import IslamicQuote from '@/components/IslamicQuote';

// In your component or page
<IslamicQuote />

// With custom styling
<div className="my-8">
  <IslamicQuote />
</div>
*/
