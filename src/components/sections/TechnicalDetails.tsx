import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Clock, Award, School, Briefcase, BookOpen, Users, HandMetal } from "lucide-react";
import React from "react";
import { smoothScrollTo } from "@/lib/scrollUtils";

interface TechnicalDetailProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  direction: "ltr" | "rtl";
}

const TechnicalDetail: React.FC<TechnicalDetailProps> = ({ icon, title, description, direction }) => {
  const textAlign = direction === 'rtl' ? 'text-right' : 'text-left';
  
  return (
    <div className="flex items-center border-b border-gray-200 last:border-0 py-6" style={{ direction }}>
      <div className="flex-shrink-0">
        <div className="w-5 h-5 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <div className={`flex-1 min-w-0 ${textAlign}`} style={{ marginLeft: direction === 'ltr' ? '2rem' : '0', marginRight: direction === 'rtl' ? '2rem' : '0' }}>
        <div>
          <span className="font-medium text-gray-900" style={{ fontSize: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)' }}>
            {title}
          </span>
          <span className="text-gray-600 ms-2" style={{ fontSize: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)' }}>
            {description}
          </span>
        </div>
      </div>
    </div>
  );
};

export const TechnicalDetails = () => {
  const { currentLang, getTextDirection } = useLanguage();
  const direction = getTextDirection();

  const content = {
    en: {
      title: "Course Details",
      details: [
        {
          icon: <MapPin className="w-4 h-4" />,
          title: "Central Location:",
          description: "Studies will take place at closerAI's office campus in Palo Alto and Tel Aviv"
        },
        {
          icon: <Clock className="w-4 h-4" />,
          title: "Course Duration:",
          description: "One intensive year, 5 days a week, approximately 40 hours weekly"
        },
        {
          icon: <Award className="w-4 h-4" />,
          title: "Certification:",
          description: "Official certification recognized in the industry and backed by 35 leading AI companies"
        },
        {
          icon: <School className="w-4 h-4" />,
          title: "Full Academic Resources:",
          description: "Top-tier lecturers and access to the most advanced tools in the market"
        },
        {
          icon: <Briefcase className="w-4 h-4" />,
          title: "Job Placement:",
          description: "100% guaranteed employment for all successful course graduates. Guaranteed"
        },
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: "Curriculum:",
          description: "Dynamic syllabus adapted to all the latest innovations in AI worlds"
        },
        {
          icon: <HandMetal className="w-4 h-4" />,
          title: "Hands-on Experience:",
          description: "Continuous experience on real and live projects throughout (almost) the entire course"
        },
        {
          icon: <Users className="w-4 h-4" />,
          title: "Class Size:",
          description: "Limited to 25 participants divided into teams for optimal productivity"
        },
        {
          icon: <School className="w-4 h-4" />,
          title: "Professional Guidance:",
          description: "Experienced mentors and leaders from our senior staff"
        },
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: "Hebrew Language:",
          description: "All lectures in Tel Aviv branch will be conducted in Hebrew only"
        }
      ]
    },
    he: {
      title: "פרטי הקורס",
      details: [
        {
          icon: <MapPin className="w-4 h-4" />,
          title: "מיקום:",
          description: "הלימודים יתקיימו בקמפוסים של חברת closerAI במרכזי הערים פאלו-אלטו ותל-אביב"
        },
        {
          icon: <Clock className="w-4 h-4" />,
          title: "משך הקורס:",
          description: "שנה אחת אינטנסיבית, 5 ימים בשבוע, כ-40 שעות שבועיות"
        },
        {
          icon: <Award className="w-4 h-4" />,
          title: "הסמכה:",
          description: "תעודה רשמית המוכרת בתעשייה ומגובה בידי 35 חברות AI ממובילות השוק"
        },
        {
          icon: <School className="w-4 h-4" />,
          title: "משאבים אקדמיים מלאים:",
          description: "סגל מרצים מן השורה הראשונה, וגישה לכלים המתקדמים ביותר בשוק"
        },
        {
          icon: <Briefcase className="w-4 h-4" />,
          title: "השמה בעבודה:",
          description: "100% הבטחת תעסוקה לכלל מסיימי הקורס בהצלחה. בהתחייבות"
        },
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: "תכנית לימודים:",
          description: "סילבוס דינמי ומותאם לכל החידושים האחרונים בעולמות ה-AI"
        },
        {
          icon: <HandMetal className="w-4 h-4" />,
          title: "התנסות מעשית:",
          description: "התנסות רציפה על פרוייקטים אמיתיים וחיים לאורך (כמעט) כל הקורס"
        },
        {
          icon: <Users className="w-4 h-4" />,
          title: "גודל כיתה:",
          description: "מוגבל ל-25 משתתפים בחלוקה לצוותים, לפרודוקטיביות מיטבית"
        },
        {
          icon: <School className="w-4 h-4" />,
          title: "הדרכה מקצועית:",
          description: "מנטורים מנוסים ומובילים מבכירי העובדים שלנו ילוו כל אחד מהצוותים"
        },
        {
          icon: <BookOpen className="w-4 h-4" />,
          title: "שפה:",
          description: "כל ההרצאות וההדרכות בסניף תל אביב יועברו בעברית מלאה"
        }
      ]
    }
  };

  return (
    <section id="technical-details" className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-100/90 backdrop-blur-sm rounded-xl shadow-sm">
            <div className="px-8 py-8">
              <h2 
                className="font-semibold mb-8"
                style={{ 
                  direction, 
                  textAlign: direction === 'rtl' ? 'right' : 'left',
                  fontSize: 'clamp(1.5rem, 1.3rem + 1vw, 2rem)'
                }}
              >
                {content[currentLang].title}
              </h2>
              <div>
                {content[currentLang].details.map((detail, index) => (
                  <TechnicalDetail
                    key={index}
                    icon={detail.icon}
                    title={detail.title}
                    description={detail.description}
                    direction={direction}
                  />
                ))}
              </div>
              <div className="mt-8 border-t border-gray-200 pt-8">
                <div className="flex justify-center">
                  <button 
                    onClick={() => smoothScrollTo('registration-form')}
                    className="px-6 py-3 bg-white text-primary border-2 border-primary rounded-full transition-all duration-300 shadow-sm hover:shadow-md active:bg-primary active:text-white md:hover:bg-primary md:hover:text-white"
                    style={{ direction }}
                  >
                    {currentLang === 'he' ? 'לפרטים נוספים' : 'More Details'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 