import { useLanguage } from "@/contexts/LanguageContext";

export function PartnerLogos() {
  const { currentLang } = useLanguage();

  const partners = [
    { name: "Google", logo: "./images/partners/google.png", logoWebp: "./images/partners/google.webp", logoAvif: "./images/partners/google.avif" },
    { name: "Microsoft", logo: "./images/partners/microsoft.png", logoWebp: "./images/partners/microsoft.webp", logoAvif: "./images/partners/microsoft.avif" },
    { name: "Amazon", logo: "./images/partners/amazon.png", logoWebp: "./images/partners/amazon.webp", logoAvif: "./images/partners/amazon.avif" },
    { name: "Meta", logo: "./images/partners/meta.png", logoWebp: "./images/partners/meta.webp", logoAvif: "./images/partners/meta.avif" },
    { name: "NVIDIA", logo: "./images/partners/nvidia.png", logoWebp: "./images/partners/nvidia.webp", logoAvif: "./images/partners/nvidia.avif" },
    { name: "OpenAI", logo: "./images/partners/open.png", logoWebp: "./images/partners/open.webp", logoAvif: "./images/partners/open.avif" },
    { name: "Anthropic", logo: "./images/partners/antrophic.png", logoWebp: "./images/partners/antrophic.webp", logoAvif: "./images/partners/antrophic.avif" },
    { name: "AI21", logo: "./images/partners/ai21.png", logoWebp: "./images/partners/ai21.webp", logoAvif: "./images/partners/ai21.avif" },
    { name: "RunAI", logo: "./images/partners/runai.png", logoWebp: "./images/partners/runai.webp", logoAvif: "./images/partners/runai.avif" },
    { name: "Codum", logo: "./images/partners/codum.png", logoWebp: "./images/partners/codum.webp" },
    { name: "DID", logo: "./images/partners/did.png", logoWebp: "./images/partners/did.webp", logoAvif: "./images/partners/did.avif" },
    { name: "Xupr", logo: "./images/partners/xupr thbyk.png", logoWebp: "./images/partners/xupr thbyk.webp", logoAvif: "./images/partners/xupr thbyk.avif" },
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
                  <picture>
                    <source srcSet={partner.logoAvif} type="image/avif" />
                    <source srcSet={partner.logoWebp} type="image/webp" />
                    <img src={partner.logo} alt={partner.name} className="h-16 object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
                  </picture>
                </div>
              ))}
            </div>

            {/* Second part for seamless looping */}
            <div className="logo-slide">
              {partners.map((partner, index) => (
                <div key={`p2-${index}`} className="logo-slide-item">
                  <picture>
                    <source srcSet={partner.logoAvif} type="image/avif" />
                    <source srcSet={partner.logoWebp} type="image/webp" />
                    <img src={partner.logo} alt={partner.name} className="h-16 object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
                  </picture>
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