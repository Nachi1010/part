import { useLanguage } from "@/contexts/LanguageContext";
import { getImagePath } from "@/App";

export function PartnerLogos() {
  const { currentLang } = useLanguage();

  const partners = [
    { name: "Google", logo: "/images/partners/google.png" },
    { name: "Microsoft", logo: "/images/partners/microsoft.png" },
    { name: "Amazon", logo: "/images/partners/amazon.png" },
    { name: "Meta", logo: "/images/partners/meta.png" },
    { name: "NVIDIA", logo: "/images/partners/nvidia.png" },
    { name: "OpenAI", logo: "/images/partners/open.png" },
    { name: "Anthropic", logo: "/images/partners/antrophic.png" },
    { name: "AI21", logo: "/images/partners/ai21.png" },
    { name: "RunAI", logo: "/images/partners/runai.png" },
    { name: "Codum", logo: "/images/partners/codum.png" },
    { name: "DID", logo: "/images/partners/did.png" },
    { name: "Xupr", logo: "/images/partners/xupr thbyk.png" },
  ];

  const translations = {
    en: {
      title: "Our partners",
    },
    he: {
      title: "השותפים שלנו",
    },
  }[currentLang];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">
          {translations.title}
        </h2>

        <div className="relative overflow-hidden">
          <div className="logo-slider-track">
            {/* First part of the logos */}
            <div className="logo-slide">
              {partners.map((partner, index) => (
                <div key={`p1-${index}`} className="logo-slide-item">
                  <img src={getImagePath(partner.logo)} alt={partner.name} className="h-16 object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
              ))}
            </div>

            {/* Second part for seamless looping */}
            <div className="logo-slide">
              {partners.map((partner, index) => (
                <div key={`p2-${index}`} className="logo-slide-item">
                  <img src={getImagePath(partner.logo)} alt={partner.name} className="h-16 object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`
          .logo-slider-track {
            display: flex;
            animation: scroll 60s linear infinite;
            width: calc(250px * ${partners.length} * 2);
          }
          .logo-slide {
            display: flex;
            width: calc(250px * ${partners.length});
          }
          .logo-slide-item {
            width: 250px;
            padding: 0 20px;
            flex-shrink: 0;
          }
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-250px * ${partners.length}));
            }
          }
          .logo-slider-track:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </section>
  );
}