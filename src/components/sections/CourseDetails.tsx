import { MapPin, Clock, Award, School, Briefcase, BookOpen, Code, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LucideIcon } from "lucide-react";
import { Sparkle, Activity, Link, Settings2, BarChart4 } from "lucide-react";
import { useState } from "react";
import React from "react";

// Custom Neural Network Icon
const NeuralNetworkIcon = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {/* Input Layer */}
    <circle cx="4" cy="6" r="2" />
    <circle cx="4" cy="12" r="2" />
    <circle cx="4" cy="18" r="2" />
    
    {/* Hidden Layer */}
    <circle cx="12" cy="4" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="20" r="2" />
    
    {/* Output Layer */}
    <circle cx="20" cy="8" r="2" />
    <circle cx="20" cy="16" r="2" />
    
    {/* Connections */}
    <path d="M6 6L10 4M6 6L10 12M6 6L10 20" />
    <path d="M6 12L10 4M6 12L10 12M6 12L10 20" />
    <path d="M6 18L10 4M6 18L10 12M6 18L10 20" />
    <path d="M14 4L18 8M14 12L18 8M14 20L18 8" />
    <path d="M14 4L18 16M14 12L18 16M14 20L18 16" />
  </svg>
);

// הגדרת טיפוסים לקומפוננטה
interface DetailItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isRTL: boolean;
  direction: "ltr" | "rtl";
}

// Course Detail Item Component
const DetailItem = ({ icon, title, description, isRTL, direction }: DetailItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-3 xs:p-2 sm:p-3 md:p-4 lg:p-6 relative z-10"
    >
      <div className={`w-full flex flex-row ${isRTL ? 'flex-row-reverse' : ''} items-center gap-3 xs:gap-1 sm:gap-2 md:gap-3`}>
        <div className="flex-shrink-0 flex-grow-0 w-[25%] max-w-24 aspect-square xs:p-1">
          <div className="text-primary w-full h-full">
            {icon}
          </div>
        </div>

        <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'} flex-1`}>
          <h3 
            className="text-xl font-semibold mb-2 xs:mb-1 text-center text-gray-800"
            style={{ direction }}
          >
            {title}
          </h3>
          <p 
            className="text-gray-600 text-center xs:text-xs sm:text-sm md:text-base"
            style={{ direction }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export const CourseDetails = () => {
  const { currentLang, getTextDirection } = useLanguage();
  
  const translations = {
    en: {
      title: "What we are study",
      features: [
        {
          icon: <Sparkle className="w-full h-full" />,
          title: "Fundamentals of AI",
          description: "Master the core concepts, algorithms, and mathematical foundations of artificial intelligence."
        },
        {
          icon: <Activity className="w-full h-full" />,
          title: "Machine Learning",
          description: "Deep dive into supervised, unsupervised, and reinforcement learning methods."
        },
        {
          icon: <NeuralNetworkIcon />,
          title: "Neural Networks",
          description: "Build and optimize various neural network architectures for complex tasks."
        },
        {
          icon: <BarChart4 className="w-full h-full" />,
          title: "Data Analysis",
          description: "Learn to prepare, analyze, and visualize data for AI model development."
        },
        {
          icon: <Link className="w-full h-full" />,
          title: "NLP & Computer Vision",
          description: "Specialize in processing text and visual data with cutting-edge techniques."
        },
        {
          icon: <Settings2 className="w-full h-full" />,
          title: "Real-world Applications",
          description: "Apply your skills to practical problems and innovative solutions."
        }
      ]
    },
    he: {
      title: "אז, מה לומדים אצלנו?",
      features: [
        {
          icon: <Sparkle className="w-full h-full" />,
          title: "יסודות הבינה המלאכותית",
          description: "לימוד מעמיק של מושגי הליבה, אלגוריתמים ויסודות מתמטיים של בינה מלאכותית."
        },
        {
          icon: <Activity className="w-full h-full" />,
          title: "למידת מכונה",
          description: "צלילה עמוקה לשיטות למידה בהשגחה, ללא השגחה, ולמידה בחיזוקים."
        },
        {
          icon: <NeuralNetworkIcon />,
          title: "רשתות נוירונים",
          description: "בנייה ואופטימיזציה של ארכיטקטורות רשתות נוירונים מגוונות למשימות מורכבות."
        },
        {
          icon: <BarChart4 className="w-full h-full" />,
          title: "ניתוח נתונים",
          description: "לימוד הכנה, ניתוח והדמיית נתונים לפיתוח מודלים של בינה מלאכותית."
        },
        {
          icon: <Link className="w-full h-full" />,
          title: "עיבוד שפה טבעית וראייה ממוחשבת",
          description: "התמחות בעיבוד טקסט ונתונים חזותיים באמצעות טכניקות מתקדמות."
        },
        {
          icon: <Settings2 className="w-full h-full" />,
          title: "יישומים מעשיים",
          description: "יישום המיומנויות שלכם לפתרון בעיות מעשיות ופיתוח פתרונות חדשניים."
        }
      ]
    }
  };

  const content = translations[currentLang];
  const direction = getTextDirection();
  const isRTL = currentLang === "he";

  return (
    <section id="course-details" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-white p-6">
          <div className={`max-w-2xl mx-auto mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h2 
              className="text-3xl font-bold mb-4 text-primary"
              style={{ direction }}
            >
              {content.title}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {content.features.map((feature, index) => (
              <DetailItem
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                isRTL={isRTL}
                direction={direction}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};