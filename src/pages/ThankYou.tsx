import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const ThankYou = () => {
  const { currentLang } = useLanguage();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const texts = {
    en: {
      title: "Thank You for Registering!",
      subtitle: "We're excited to have you on board.",
      message: "Our team will contact you shortly with more information about your AI journey.",
      homeLink: "Return to Home"
    },
    he: {
      title: "תודה על ההרשמה!",
      subtitle: "אנחנו נרגשים לקבל אתכם.",
      message: "צוות המומחים שלנו יצור איתכם קשר בקרוב עם מידע נוסף על המסע שלכם בעולם הבינה המלאכותית.",
      homeLink: "חזרה לדף הבית"
    }
  };

  const t = texts[currentLang];

  return (
    <div className="min-h-screen bg-dark-darker flex items-center justify-center">
      <div className="container max-w-md mx-auto px-4">
        <div className="form-container p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2 highlight-text">{t.title}</h1>
            <p className="text-xl mb-4">{t.subtitle}</p>
            <p className="description-text mb-8">{t.message}</p>
            <Link 
              to="/"
              className="premium-button inline-block px-6 py-3 text-lg"
            >
              {t.homeLink}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;