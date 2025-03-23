import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { smoothScrollTo } from "@/lib/scrollUtils";
import { getImagePath } from "@/App";

const translations = {
  en: {
    title: "AI development.",
    subtitle: "Leading the Universe Future",
    cta: "Join"
  },
  he: {
    title: "AI development.",
    subtitle: "להוביל את עתיד היקום",
    cta: "להרשמה"
  }
};

export const Hero = () => {
  const { currentLang, getTextDirection } = useLanguage();

  // Helper function to get the appropriate font family based on language
  const getFontFamily = (isTitle: boolean) => {
    if (isTitle) {
      return "'Oswald', sans-serif"; // אחדנו את הגופן של הכותרת הראשית לשתי השפות
    }
    return currentLang === 'en' ? 
      "'Cormorant Garamond', serif" : 
      "'Rubik', 'Assistant', sans-serif";
  };

  return (
    <header id="hero" className="main-header relative text-center text-white h-[clamp(15vh,45vw,83vh)] overflow-hidden -mt-[clamp(1rem,2vw,2rem)]">
      <img 
        src={getImagePath("/images/1.jpeg")}
        alt="AI Revolution Background"
        className="absolute top-0 left-0 w-full h-[calc(100%+clamp(1rem,2vw,2rem))] object-cover brightness-70 z-[-1] select-none transition-[filter] duration-300 ease-in-out"
        loading="eager"
        fetchPriority="high"
      />
      
      {/* Enhanced overlay with gradient for better text visibility */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-black/50 to-black/60 z-0" />
      
      <div className={`absolute top-[20%] ${currentLang === 'en' ? 'left-[10%]' : 'right-[10%]'} leading-none ${currentLang === 'en' ? 'text-left' : 'text-right'} w-full z-10 flex flex-col gap-0`}>
        {/* Enhanced title with language-specific premium font */}
        <h1 
          className="text-[8vw] relative" 
          style={{ 
            direction: getTextDirection(),
            color: "#FFFFFF",
            textShadow: "0vw 0.1vw 0.2vw rgba(0,0,0,0.5), 0vw 0.2vw 0.4vw rgba(0,0,0,0.3)",
            padding: "0.1em 0",
            fontFamily: getFontFamily(true),
            fontWeight: 700,
            letterSpacing: "0",
            textTransform: currentLang === 'en' ? 'uppercase' : 'uppercase',
            fontSize: '8vw',
            fontStretch: 'normal'
          }}
        >
          {translations[currentLang].title}
        </h1>

        {/* Subtitle with language-specific elegant font */}
        <h2 
          className="text-[7vw] tracking-wider font-bold" 
          style={{ 
            direction: getTextDirection(),
            color: "#111",
            textShadow: "-0.05vw -0.05vw 0 #777, 0.05vw -0.05vw 0 #777, -0.05vw 0.05vw 0 #777, 0.05vw 0.05vw 0 #777, 0 0.1vw 0.2vw rgba(0,0,0,0.5)",
            filter: "drop-shadow(0 0.05vw 0.1vw rgba(0,0,0,0.5))",
            fontFamily: getFontFamily(false),
            fontWeight: currentLang === 'en' ? 600 : 500, // מעט יותר קל בעברית
            letterSpacing: currentLang === 'en' ? "0.02em" : "0.02em"
          }}
        >
          {translations[currentLang].subtitle}
        </h2>
        
        {/* Subtle highlight around the headers */}
        <div 
          className="absolute -z-10"
          style={{ 
            width: "100%", 
            height: "100%",
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%)",
            [currentLang === 'en' ? 'left' : 'right']: "0",
            top: "0"
          }}
        />
      </div>
      
      <div className="button-container absolute bottom-[15%] w-full flex justify-center">
        <button 
          onClick={() => smoothScrollTo('registration-form')}
          className="cta-button"
          style={{
            background: "linear-gradient(135deg, #2a384d, #445a7a)",
            color: "#ffffff",
            fontWeight: currentLang === 'en' ? "bold" : "600",
            padding: "clamp(0.6vw, 1vw, 1.4vw) clamp(2vw, 2.5vw, 3vw)",
            borderRadius: "clamp(0.4rem, 0.8vw, 12px)",
            fontSize: "clamp(1rem, 5vw, 8vw)",
            fontFamily: currentLang === 'en' ? getFontFamily(false) : "'Cinzel', 'Amatic SC', 'Heebo', sans-serif",
            textDecoration: "none",
            boxShadow: `0 clamp(0.2vw, 0.4vw, 0.6vw) clamp(0.8vw, 1.2vw, 1.6vw) rgba(0, 0, 0, 0.6), 0 0 0 clamp(0.15vw, 0.3vw, 0.45vw) rgba(255, 255, 255, 0.4)`,
            border: `clamp(0.15vw, 0.3vw, 0.4vw) solid #eaeaea`,
            textTransform: "uppercase",
            letterSpacing: currentLang === 'en' ? "0.05em" : "0.1em",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5em",
            position: "relative",
            overflow: "hidden",
            zIndex: 10,
            direction: getTextDirection(),
            height: "clamp(2rem, 5vw, 6vw)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(clamp(-0.3vw, -0.4vw, -0.5vw))";
            e.currentTarget.style.boxShadow = `0 clamp(0.4vw, 0.8vw, 1.2vw) clamp(1.2vw, 2vw, 2.8vw) rgba(0, 0, 0, 0.7), 0 0 0 clamp(0.2vw, 0.4vw, 0.6vw) rgba(255, 255, 255, 0.5)`;
            e.currentTarget.style.background = "linear-gradient(135deg, #394d69, #5678a3)";
            e.currentTarget.style.border = `clamp(0.15vw, 0.3vw, 0.4vw) solid #ffffff`;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 clamp(0.2vw, 0.4vw, 0.6vw) clamp(0.8vw, 1.2vw, 1.6vw) rgba(0, 0, 0, 0.6), 0 0 0 clamp(0.15vw, 0.3vw, 0.45vw) rgba(255, 255, 255, 0.4)`;
            e.currentTarget.style.background = "linear-gradient(135deg, #2a384d, #445a7a)";
            e.currentTarget.style.border = `clamp(0.15vw, 0.3vw, 0.4vw) solid #eaeaea`;
          }}
        >
          <span className="cta-text">{translations[currentLang].cta}</span>
        </button>
      </div>

      {/* Add Google Fonts */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Karantina:wght@700&family=Cormorant+Garamond:wght@600&family=Rubik:wght@500&family=Assistant:wght@500&family=Cinzel:wght@500;700&family=Amatic+SC:wght@700&family=Heebo:wght@500;700&display=swap');

      `}} />
    </header>
  );
};