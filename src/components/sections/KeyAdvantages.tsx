import React, { useState } from 'react';
import { Brain, Award, Briefcase, BookOpen, FileText, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Original AI icon component (restored)
const AIIcon = () => (
  <div className="custom-icon-container">
    <svg viewBox="0 0 24 24" width="100%" height="100%" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
      <path d="M8 12h8M12 16V8"></path>
      <text x="6.5" y="18" fontSize="6" fill="currentColor">AI</text>
    </svg>
  </div>
);
// Refined Hybrid Learning Icon - closer to previous design
const HybridLearningIcon = () => (
  <div className="custom-icon-container">
    <svg viewBox="0 0 24 24" width="100%" height="100%" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Work-life balance scale concept */}
      <line x1="12" y1="3" x2="12" y2="21" />
      <path d="M5 7h14" />
      
      {/* Left side - person/classroom */}
      <circle cx="7" cy="5" r="2" />
      <path d="M4 12a3 3 0 0 0 6 0" />
      
      {/* Right side - computer/remote */}
      <rect x="14" y="4" width="6" height="4" rx="1" />
      <path d="M17 8v2" />
      <path d="M15 13h4v3" />
    </svg>
  </div>
);

// Improved Pedagogical Approach Icon - with structured framework
const PedagogicalIcon = () => (
  <div className="custom-icon-container">
    <svg viewBox="0 0 24 24" width="100%" height="100%" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Structured framework/grid */}
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
      
      {/* Knowledge transfer element */}
      <circle cx="12" cy="7" r="1" />
      <circle cx="7" cy="12" r="1" />
      <circle cx="17" cy="12" r="1" />
      <circle cx="12" cy="17" r="1" />
      <path d="M12 7L7 12L12 17L17 12L12 7" />
    </svg>
  </div>
);

// Custom Signature/Contract Icon
const GuaranteedJobIcon = () => (
  <div className="custom-icon-container">
    <svg viewBox="0 0 24 24" width="100%" height="100%" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M8 11l3 3 5-5" />
    </svg>
  </div>
);

// Improved Morning/Evening Courses Icon
const FlexibleScheduleIcon = () => (
  <div className="custom-icon-container">
    <svg viewBox="0 0 24 24" width="100%" height="100%" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Clock face */}
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
      
      {/* Sun and moon indicators */}
      <path d="M3 12a9 9 0 0 0 9 9" />
      <path d="M12 3a9 9 0 0 1 9 9" />
      
      {/* Sun rays */}
      <line x1="4.5" y1="4.5" x2="6" y2="6" />
      <line x1="18" y1="6" x2="19.5" y2="4.5" />
      
      {/* Moon element */}
      <path d="M18 14a6 6 0 0 1-6 6" />
    </svg>
  </div>
);

// Completely redesigned Personal Admission Process Icon - focus on mental capabilities
const PersonalAdmissionIcon = () => (
  <div className="custom-icon-container">
    <svg viewBox="0 0 24 24" width="100%" height="100%" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Head silhouette */}
      <path d="M12 2a7 7 0 0 1 7 7v1.5a4.5 4.5 0 0 1-4.5 4.5H12" />
      <path d="M8 15.5A4.5 4.5 0 0 1 3.5 11V9a7 7 0 0 1 7-7h.5" />
      
      {/* Brain visualization */}
      <path d="M10 10c1-1 2-1 3 0" />
      <path d="M11 12c1-1 2-1 3 0" />
      <path d="M12 7c1 1 1 2 0 3" />
      <path d="M7 7c1 1 1 2 0 3" />
      
      {/* Checkmark for selection */}
      <path d="M12 19l-2-2" />
      <path d="M12 19l4-4" />
    </svg>
  </div>
);

interface AdvantageItemProps {
  icon: React.FC | React.ElementType;
  title: string;
  description: string;
}

const AdvantageItem: React.FC<AdvantageItemProps> = ({ icon: Icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { currentLang, getTextDirection } = useLanguage();
  const isRTL = getTextDirection() === "rtl";

  return (
    <div 
      className={`bg-white rounded-lg shadow-md flex flex-col items-center justify-center transition-all duration-300 p-3 xs:p-2 sm:p-3 md:p-4 lg:p-6 relative z-10
        ${isHovered ? 'transform -translate-y-1 shadow-lg' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`w-full flex flex-row ${isRTL ? 'flex-row-reverse' : ''} items-center gap-3 xs:gap-1 sm:gap-2 md:gap-3`}>
        <div className={`flex-shrink-0 flex-grow-0 w-[25%] max-w-24 aspect-square xs:p-1 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
          {typeof Icon === 'function' ? (
            <div className="text-primary w-full h-full">
              <Icon />
            </div>
          ) : (
            <Icon 
              className="w-full h-full text-primary"
              strokeWidth={1.5} 
            />
          )}
        </div>

        <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'} flex-1`}>
          <h3 
            className={`text-xl font-semibold mb-2 xs:mb-1 text-center text-gray-800 ${isHovered ? 'text-primary' : ''}`}
            style={{ direction: getTextDirection() }}
          >
            {title}
          </h3>
          <p 
            className="text-gray-600 text-center xs:text-xs sm:text-sm md:text-base"
            style={{ direction: getTextDirection() }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export const KeyAdvantages = () => {
  const { currentLang, getTextDirection } = useLanguage();
  
  const advantages = {
    en: [
      {
        icon: AIIcon,
        title: "Leading AI Development Company",
        description: "Be part of a pioneering team at the forefront of AI innovation"
      },
      {
        icon: HybridLearningIcon,
        title: "Hybrid Learning",
        description: "Perfect balance of theoretical knowledge and practical application"
      },
      {
        icon: PedagogicalIcon,
        title: "Unique Pedagogical Approach",
        description: "Innovative learning methodology tailored specifically for AI sciences"
      },
      {
        icon: GuaranteedJobIcon,
        title: "Guaranteed Employment",
        description: "Join our team upon successful completion of the program"
      },
      {
        icon: Award,
        title: "Prestigious Certification",
        description: "Industry-recognized credentials valued by leading tech companies"
      },
      {
        icon: FileText,
        title: "Cutting-Edge Research",
        description: "Access to the latest advancements in artificial intelligence"
      },
      {
        icon: FlexibleScheduleIcon,
        title: "Morning/Evening Courses",
        description: "Flexible scheduling options to fit your lifestyle"
      },
      {
        icon: PersonalAdmissionIcon,
        title: "Personal Admission Process",
        description: "Selection based on mental capabilities and analytical thinking"
      }
    ],
    he: [
      {
        icon: AIIcon,
        title: "חברת פיתוח AI מובילה",
        description: "היו חלק מצוותים חלוציים בחזית החדשנות בתחום ה-AI"
      },
      {
        icon: HybridLearningIcon,
        title: "למידה היברידית",
        description: "איזון מושלם בין ידע תיאורטי ויישום מעשי"
      },
      {
        icon: PedagogicalIcon,
        title: "גישה פדגוגית ייחודית",
        description: "מתודולוגיית למידה חדשנית המותאמת במיוחד למדעי ה-AI"
      },
      {
        icon: GuaranteedJobIcon,
        title: "תעסוקה מובטחת",
        description: "הצטרפו לצוותים שלנו עם סיום מוצלח של התכנית"
      },
      {
        icon: Award,
        title: "הסמכה יוקרתית",
        description: "תעודה מוכרת ומגובה בידי חברות AI מובילות"
      },
      {
        icon: FileText,
        title: "מחקר עדכני",
        description: "גישה למעבדה מתקדמת ולמחקר החדשני ביותר בתחום"
      },
      {
        icon: FlexibleScheduleIcon,
        title: "קורסי בוקר/ערב",
        description: "אפשרויות לימוד גמישות המתאימות לסגנונות חיים שונים"
      },
      {
        icon: PersonalAdmissionIcon,
        title: "קבלה על בסיס אישי",
        description: "הבחירה מבוססת על יכולות מנטליות וחשיבה אנליטית בלבד"
      }
    ]
  };

  const sectionTitle = currentLang === "he" ? "מה בתוכנית" : "What We Offer";

  return (
    <section className="bg-gray-700 py-16">
      <div className="container mx-auto px-4">
        <h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-white"
          style={{ direction: getTextDirection() }}
        >
          {sectionTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {advantages[currentLang].map((advantage, index) => (
            <AdvantageItem
              key={index}
              icon={advantage.icon}
              title={advantage.title}
              description={advantage.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};