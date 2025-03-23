import { useLanguage } from "@/contexts/LanguageContext";

export const AboutUs = () => {
  const { currentLang, getTextDirection } = useLanguage();
  
  const content = {
    en: {
      title: "About Us",
      text: [
        "The role of an AI creator - whether researcher or developer - demands extensive expertise, broad specialization, and deep familiarity with a wide range of disciplines. Traditional academic institutions have failed to condense the vast amount of required knowledge for this complex field into a single degree. Currently, multiple advanced degrees are needed to cover the diverse knowledge domains required of a worthy AI scientist, including: data science, neuroscience, statistics, physics, and academic-level mathematics, among others. This is in addition to the requirement for extensive experience in software development and algorithms, along with comprehensive knowledge of the enormous existing literature in this young field.",
        "Those who choose to specialize in the field through university will find themselves pursuing a tedious, wasteful, and only partially relevant master's degree (and in many cases, even a doctorate or more). The second 'alternative' is falling into the trap of traditional high-tech educational institutions which, in an attempt to stay relevant, have simply replaced their classic programming course titles with pompous headings like 'Programming in AI Environment' or 'Data Analysis with AI' - where at best, they've incorporated marginal content such as using existing AI systems like ChatGPT and similar tools for work efficiency. These programs will at most help the average software engineer stay relevant for a few more years, after which - like the entire old high-tech industry - they too will be left jobless after their position is taken by generative artificial intelligence.",
        "At closerAI - one of Israel's top ten emerging AI companies - we believe these positions primarily require unique personal and intellectual qualities, such as broad analytical capability and high-level thinking and analysis skills. As neuroscientists in perspective and AI professionals in practice, we know that the most important thing - humanity's advantage over machines - is human cognitive abilities, and only people with the right mental skills can cope in such a complex world. Therefore, instead of insisting on outdated criteria like academic degrees, we recruit the brilliant minds of AI's future and build within them a comprehensive, foundational approach using unique learning and acquisition methods developed specifically for AI by internationally renowned teaching experts. This way, our employees become full-fledged AI scientists with comprehensive knowledge equivalent to graduates with three degrees in mathematics, computer and data science, and neuroscience.",
        "To address the existential need of the AI industry across its various branches, we have developed - in unique collaboration with other leading AI companies - our groundbreaking accelerated training program. It's the world's only program for comprehensive, real AI studies. The course planning focuses particularly on eliminating 'background noise' while maintaining constant dialogue with the dynamic industry needs. Simultaneously, significant thought is invested in imparting autodidactic and analytical capabilities that will enable long-term handling of any technology/project/task - exactly the qualities that AI team leaders look for in their employees.",
        "The innovative and successful learning methodology, considered a registered trade secret of closerAI, is oriented towards systematic and comprehensive acquisition of all required disciplines, from theoretical, intuitive, and performance perspectives. Throughout (almost) the entire course, students acquire the necessary knowledge through hands-on participation in live, real projects that we at closerAI™ are developing in real-time. Thus, alongside theoretical knowledge, students develop an autodidactic approach that will assist them in working in the 'real world' and create for themselves experience and a portfolio equivalent to two-three years of practical experience.",
        "Only candidates with specific traits that will allow us to confidently offer them a pre-defined contract, including a commitment to employment in our company upon course completion, will be accepted into the training program."
      ]
    },
    he: {
      title: "אודותינו",
      text: [
        'משרה של יוצר AI - חוקר או מפתח - דורשת מיומנות רבה, התמחות נרחבת והכרות עמוקה עם מגוון רחב של דיסציפלינות. המוסדות האקדמיים המיושנים לא השכילו לתמצת את החומר הרב הנדרש עבור תחום מורכב זה לכדי תואר יחיד, ולכן ישנו צורך במגוון תארים מתקדמים בכדי לכסות את תחומי הידע המגוונים הנדרשים ממדען AI ראוי לשמו, כמו: מדעי הנתונים, מדעי המוח, סטטיסטיקה, פיסיקה ומתמטיקה ברמה אקדמית, ועוד. זאת מלבד הדרישה לניסיון רב בפיתוח תוכנה ואלגוריתמים והיכרות מקיפה עם הספרות הענקית הקיימת כבר כיום בתחום צעיר-שנים זה.',
        'מי שבוחר להתמקצע בתחום באמצעות האוניברסיטה ייאלץ לגלות כי עליו ללמוד תואר שני (ובמקרים רבים אף שלישי ויותר) מייגע, בזבזני, מרוח ורלוונטי למחצה. ה"אלטרנטיבה" השנייה היא ליפול ברשתם של מוסדות הלימודים מעולמות ההייטק המסורתי, שבניסיון להישאר רלוונטיים פשוט החליפו את הטייטלים של הקורסים הוותיקים בתכנות קלאסי, עם כותרות פומפוזיות כמו "תכנות בסביבת AI" / "ניתוח דאטה עם AI" וכדומה – כשבמקרה הטוב שולבו לתוך הקורסים מעט תכני שוליים כמו שימוש במערכות AI קיימות בסגנון ChatGPT ודומיהן לצורך ייעול העבודה - תכניות שלכל היותר יסייעו למהנדס התוכנה המצוי להישאר רלוונטי לעוד שנים ספורות, שבסופן - כמו כל תעשיית ההייטק הישן - גם הוא יישאר מחוסר עבודה לאחר שמשרתו נלקחה בידי בינה מלאכותית גנרטיבית.',
        'אצלנו, ב-CloserAI - אחת מעשרת חברות ה-AI הצעירות והצומחות בישראל - מאמינים שמשרות מסוג זה דורשות בראש ובראשונה תכונות אישיות ואינטלקטואליות ייחודיות, כמו כושר אנליטי רחב ויכולות חשיבה וניתוח ברמה גבוהה. כמדעני מוח בתפיסה וכאנשי AI ביומיום, אנו יודעים שהדבר החשוב ביותר, יתרון האדם מן המכונה - הוא היכולות המוחיות האנושיות, ורק אנשים עם הכישורים המנטליים המתאימים יכולים להתמודד בעולם מורכב שכזה. ולכן, במקום להתעקש על קריטריונים שעבר עליהם הכלח כמו תואר אקדמי - אנו מגייסים את המוחות המבריקים של עתיד ה-AI, ובונים בתוכם גישה שורשית ומקיפה עם שיטות למידה והקניה ייחודיות שפותחו ספציפית לתחום ה-AI, בידי מומחי הוראה בעלי שם בינלאומי. כך העובדים שלנו הופכים למדעני AI מן המניין עם ידע מקיף ושווה ערך לבוגרי שלשה תארים במתמטיקה, מדעי המחשב והנתונים ומדעי המוח.',
        'בכדי לענות על הצורך הקיומי של תעשיית ה-AI לענפיה השונים – פיתחנו בשת"פ ייחודי עם חברות AI נוספות, מהמובילות בתחום – את ™PracticsAI - תכנית ההכשרה המואצת ופורצת הדרך שלנו. היחידה מסוגה בעולם ללימודי AI אמיתיים ומקיפים. בתכנון הקורס ישנה התמקדות מיוחדת בנטרול של "רעשי רקע", תוך התכתבות מתמדת עם צרכי התעשייה הדינמיים. במקביל, מושקעת חשיבה רבה בהקניית יכולות אוטודידקטיות ואנליטיות, שיאפשרו לכם התמודדות ל-long shot עם כל טכנולוגיה/פרויקט/משימה. בדיוק התכונות שראשי צוותים בעולם ה-AI מחפשים בעובדים שלהם.',
        'מתודולוגיית הלימודים החדשנית והמצליחה של ™PracticsAI שנחשבת לסוד מסחרי רשום של CloserAI, מוכוונת לרכישה שיטתית ומקיפה של כלל הדיסציפלינות הנדרשות, מנקודת מבט תיאורטית, אינטואיטיבית וביצועית. לאורך (כמעט) כל הקורס, התלמיד רוכש את הידע הנדרש בשילוב "hands-on" ותוך השתתפות בפרוייקטים חיים ואמיתיים אותם אנו, ב-CloserAI, מפתחים בזמן אמת. כך שבמקביל לידע התיאורטי התלמיד בונה לעצמו גישה אוטודידקטית שתסייע לו בעבודה ב"עולם האמיתי", ויוצר לעצמו ניסיון ותיק עבודות שווה ערך לשנתיים-שלש של ניסיון מעשי.',
        'להכשרה יתקבלו אך ורק מועמדים עם סט תכונות ספציפיות שיאפשרו לנו להציע להם בלב שלם חתימה על חוזה מפורש מראש, ובו התחייבות לתעסוקה בחברתנו עם סיום הקורס.'
      ]
    }
  };
  
  const direction = getTextDirection();
  const textAlign = currentLang === "he" ? "text-right" : "text-left";

  return (
    <section id="about" className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 
            className="text-3xl font-bold text-primary mb-8"
            style={{ direction }}
          >
            {content[currentLang].title}
          </h2>
          <div 
            className={`prose lg:prose-lg mx-auto ${textAlign}`}
            style={{ direction }}
          >
            {content[currentLang].text.map((paragraph, index) => (
              <p key={index} className="mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};