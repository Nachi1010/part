import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserData } from "@/contexts/UserDataContext";
import { getImagePath } from "@/App";
import { X } from "lucide-react";

// קומפוננטת רישום צפה שמופיעה לאחר גלילה בדף
export const FloatingRegistration = () => {
  const { currentLang, getTextDirection } = useLanguage();
  const { userIp, isIpLoaded } = useUserData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [dismissedTime, setDismissedTime] = useState<number | null>(null);
  const [userInteractedWithMainForm, setUserInteractedWithMainForm] = useState(false);
  const [userScrolledAfterMainForm, setUserScrolledAfterMainForm] = useState(false);
  
  // מעקב אחר טופס הרגיל וגלילה
  useEffect(() => {
    // מאזין לאירועים של טופס רגיל
    const mainFormElement = document.getElementById('registration-form');
    let scrollTimeout: ReturnType<typeof setTimeout>;
    let scrollPosition = window.scrollY;
    
    // בדיקה אם המשתמש התקדם מעבר לטופס הרגיל (גלל מטה)
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      
      // בודק אם המשתמש השתמש בטופס הרגיל
      if (mainFormElement) {
        const formRect = mainFormElement.getBoundingClientRect();
        
        // אם הטופס נראה בחלון הדפדפן והמשתמש כבר השתמש בו
        if (formRect.top < window.innerHeight && formRect.bottom > 0) {
          setUserInteractedWithMainForm(true);
        }
        
        // אם המשתמש גלל מטה אחרי שהשתמש בטופס
        if (userInteractedWithMainForm && currentScrollPosition > scrollPosition && formRect.bottom < 0) {
          setUserScrolledAfterMainForm(true);
        }
      }
      
      scrollPosition = currentScrollPosition;
      
      // איפוס הטיימר בכל גלילה כדי למנוע קריאות מרובות
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // אין צורך בפעולה נוספת כאן, רק מונע ריבוי עדכונים
      }, 100);
    };
    
    // הוספת האזנה לאירועי גלילה
    window.addEventListener('scroll', handleScroll);
    
    // ניקוי האזנה בעת פירוק הקומפוננטה
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [userInteractedWithMainForm]);
  
  // מעקב אחר זמן השהייה בדף ופתיחת הטופס - עם התנאים החדשים
  useEffect(() => {
    // קבועי זמן
    const INITIAL_SHOW_DELAY = 60000; // דקה להצגה ראשונית
    const REAPPEAR_DELAY = 60000; // דקה להופעה חוזרת
    
    let timer: ReturnType<typeof setTimeout>;
    
    // בודק אם הטופס כבר נסגר בעבר והאם עבר מספיק זמן להצגה חוזרת
    if (isDismissed && dismissedTime) {
      const timeSinceDismiss = Date.now() - dismissedTime;
      
      // אם עברה דקה מאז שהטופס נסגר, נאפשר הצגה חוזרת
      if (timeSinceDismiss >= REAPPEAR_DELAY) {
        setIsDismissed(false);
        setDismissedTime(null);
      } else {
        // אם טרם עברה דקה, נמתין עד שתעבור דקה מהסגירה
        const remainingTime = REAPPEAR_DELAY - timeSinceDismiss;
        timer = setTimeout(() => {
          setIsDismissed(false);
          setDismissedTime(null);
        }, remainingTime);
      }
    } 
    // התנאי החדש: מציג את הטופס רק אם המשתמש השתמש בטופס הרגיל וגלל מטה אחרי זה
    else if (!isDismissed && !isVisible && userInteractedWithMainForm && userScrolledAfterMainForm) {
      timer = setTimeout(() => {
        setIsVisible(true);
      }, INITIAL_SHOW_DELAY);
    }
    
    // ניקוי הטיימר
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isDismissed, isVisible, dismissedTime, userInteractedWithMainForm, userScrolledAfterMainForm]);
  
  // מצב הטופס - ללא שדה תעודת זהות
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  
  // עדכון ערכים
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // סגירת הטופס
  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    setDismissedTime(Date.now()); // שומר את הזמן שבו הטופס נסגר
  };

  // תרגומים
  const translations = {
    en: {
      title: "Don't miss out!",
      subtitle: "Register now for early access",
      namePlaceholder: "Enter your full name",
      emailPlaceholder: "you@example.com",
      phonePlaceholder: "Enter your phone number",
      submitButton: "Register Now",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      phoneLabel: "Phone Number",
      successMessage: "Registration submitted successfully!",
      errorMessage: "Something went wrong. Please try again.",
      validationError: "Missing required information:",
      missingName: "Name is required",
      missingEmail: "Valid email is required",
      missingPhone: "Phone number with at least 10 digits is required",
      loading: "Processing..."
    },
    he: {
      title: "אל תפספסו!",
      subtitle: "הירשמו עכשיו לגישה מוקדמת",
      namePlaceholder: "ישראל ישראלי",
      emailPlaceholder: "your@email.com",
      phonePlaceholder: "050-000-0000",
      submitButton: "הירשמו עכשיו",
      nameLabel: "שם מלא",
      emailLabel: "כתובת אימייל",
      phoneLabel: "מספר טלפון",
      successMessage: "ההרשמה הושלמה בהצלחה!",
      errorMessage: "משהו השתבש. אנא נסו שוב.",
      validationError: "חסר מידע נדרש:",
      missingName: "נדרש למלא שם",
      missingEmail: "נדרשת כתובת אימייל תקינה",
      missingPhone: "נדרש מספר טלפון עם 10 ספרות",
      loading: "מעבד..."
    }
  };

  const t = translations[currentLang];
  
  // פונקציית עזר לבדיקת תקינות אימייל
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email ? emailRegex.test(email) : false;
  };
  
  // פונקציית עזר לבדיקת תקינות מספר טלפון (לפחות 9 ספרות)
  const isValidPhone = (phone: string): boolean => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 9;
  };

  // עדכון הלוגיקה של השליחה - משתמש באותה לוגיקה כמו קובץ Registration.tsx
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // בדיקות תקינות 
      const hasValidName = formData.name && formData.name.trim() !== '';
      const hasValidEmail = isValidEmail(formData.email);
      const hasValidPhone = isValidPhone(formData.phone);
      
      // רק אם הנתונים לא תקינים, נציג שגיאה ונעצור את התהליך
      if (!hasValidName || !hasValidEmail || !hasValidPhone) {
        // הצגת הודעת שגיאה עם פירוט החסרים
        let errorDetails = t.validationError + "\n";
        
        if (!hasValidName) {
          errorDetails += "\n- " + t.missingName;
        }
        
        if (!hasValidEmail) {
          errorDetails += "\n- " + t.missingEmail;
        }
        
        if (!hasValidPhone) {
          errorDetails += "\n- " + t.missingPhone;
        }
        
        toast({
          title: "❌ " + "Validation Error",
          description: errorDetails,
          variant: "destructive",
          duration: 7000,
        });
        
        setIsSubmitting(false);
        return;  // עוצר את התהליך אם יש שגיאות תקינות
      }
      
      // חיפוש אם המשתמש כבר נרשם בעבר לפי אימייל או טלפון
      let existingUserId = null;
      
      // נבדוק אם המשתמש קיים לפי אימייל
      if (hasValidEmail) {
        const { data: existingUserByEmail } = await supabase
          .from('registration_data')
          .select('user_id')
          .eq('email', formData.email)
          .limit(1);
          
        if (existingUserByEmail && existingUserByEmail.length > 0) {
          existingUserId = existingUserByEmail[0].user_id;
        }
      }
      
      // אם לא מצאנו לפי אימייל, ננסה לפי טלפון
      if (!existingUserId && hasValidPhone) {
        const { data: existingUserByPhone } = await supabase
          .from('registration_data')
          .select('user_id')
          .eq('phone', formData.phone)
          .limit(1);
          
        if (existingUserByPhone && existingUserByPhone.length > 0) {
          existingUserId = existingUserByPhone[0].user_id;
        }
      }
      
      // הכנת האובייקט לשליחה לסופאבייס
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        source: 'floating_form', // סימון שמקור ההרשמה הוא מהטופס הצף
        metadata: {
          browser_info: navigator.userAgent,
          form_locale: currentLang,
          form_timestamp: new Date().toISOString(),
          previous_registration_id: existingUserId || null,
          is_update: existingUserId ? true : false,
          ip_was_loaded: isIpLoaded
        }
      };
      
      // הוספת כתובת IP אם זמינה
      if (userIp && userIp.trim() !== '') {
        try {
          registrationData['ip_address'] = userIp;
          
          // שומרים גם במטא-דאטה למקרה שהעמודה לא קיימת בטבלה
          registrationData.metadata['ip_address'] = userIp;
        } catch (ipError) {
          console.warn('Could not add IP address to registration data', ipError);
        }
      }
      
      // שליחה לסופבייס עם טבלה "registration_data"
      const { error } = await supabase.from('registration_data').insert([registrationData]);

      if (error) throw error;

      // הצגת הודעת הצלחה - תמיד כי הגענו לכאן רק אם עברנו את הבדיקות
      toast({
        title: "✅ " + "Success",
        description: t.successMessage,
        variant: "success",
        duration: 5000,
      });
      
      // סגירת הטופס לאחר הרשמה מוצלחת
      handleDismiss();
      
      // יצירת פרמטרים לשליחה לדף הנחיתה
      const params = new URLSearchParams({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        source: 'floating_registration_form'
      }).toString();
      
      // ניווט לאתר HR עם הפרמטרים
      window.location.href = `https://hr.practicsai.com?${params}`;

      // כדי לספק רישום טוב יותר של פעילות המשתמש, גם לטבלת הלוגים
      try {
        await supabase.from('activity_log').insert([{
          user_id: null, // ה-trigger יטפל בזה
          action: existingUserId ? 'REGISTRATION_UPDATE' : 'REGISTRATION_NEW',
          table_name: 'registration_data',
          details: {
            form_data: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            },
            previous_registration_id: existingUserId,
            has_valid_email: hasValidEmail,
            has_valid_phone: hasValidPhone,
            client_timestamp: new Date().toISOString()
          }
        }]);
      } catch (logError) {
        // שגיאות ברישום לוג לא יעצרו את תהליך ההרשמה
        console.warn('Failed to write to activity log:', logError);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "❌ " + "Error",
        description: t.errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // קבלת ערך ה-direction המתאים לשפה
  const direction = getTextDirection();

  // אם הטופס לא מוצג, לא נרנדר כלום
  if (!isVisible || isDismissed) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 px-3 sm:px-4 py-2 sm:py-3 transform transition-all duration-700 ease-out flex justify-center"
      style={{
        direction,
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        animation: isVisible ? 'float-in 0.7s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
        perspective: '1000px',
        willChange: 'transform'
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float-in {
            0% { 
              transform: translateY(100%);
              opacity: 0; 
            }
            30% { 
              opacity: 1; 
            }
            100% { 
              transform: translateY(0);
              opacity: 1; 
            }
          }
          
          .glow-effect {
            background: radial-gradient(circle at center, rgba(59, 130, 246, 0.5) 0%, rgba(37, 99, 235, 0) 70%);
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          
          .glow-button:hover .glow-effect {
            opacity: 0.5;
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% { 
              transform: scale(0.95);
              opacity: 0.3;
            }
            50% { 
              transform: scale(1.05); 
              opacity: 0.5;
            }
            100% { 
              transform: scale(0.95);
              opacity: 0.3;
            }
          }
        `
      }} />

      <div className="w-full max-w-lg mx-auto">
        {/* כרטיס הטופס */}
        <div 
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700 relative"
          style={{ 
            boxShadow: '0 clamp(0.5rem, 4vw, 1.5rem) clamp(1rem, 6vw, 1.75rem) rgba(0, 0, 0, 0.4), 0 -1px 0 rgba(255, 255, 255, 0.1) inset',
            maxWidth: '100%',
          }}
        >
          {/* כפתור סגירה */}
          <button 
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1.5 sm:p-2 rounded-full bg-slate-800/70 hover:bg-slate-700 transition-colors z-20"
            aria-label="סגור טופס"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4 text-slate-300" />
          </button>
          
          {/* כותרת */}
          <div 
            className="p-4 sm:p-5 md:p-6 pb-3 sm:pb-4" 
            style={{ 
              background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
              {t.title}
            </h2>
            <p className="text-slate-300 opacity-90 text-xs sm:text-sm">
              {t.subtitle}
            </p>
          </div>
          
          {/* גוף הטופס */}
          <div className="p-4 sm:p-5 md:p-6 pt-3 sm:pt-4">
            <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
              {/* שם */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 text-slate-200">
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder={t.namePlaceholder}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border border-slate-600 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* אימייל */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 text-slate-200">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border border-slate-600 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* טלפון */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 text-slate-200">
                  {t.phoneLabel}
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder={t.phonePlaceholder}
                  value={formData.phone}
                  style={{ direction }}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border border-slate-600 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* כפתור שליחה */}
              <div className="pt-2 sm:pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 sm:py-3 px-4 sm:px-6 text-white font-semibold rounded-md shadow-md disabled:opacity-70 transition-all hover:shadow-lg relative overflow-hidden glow-button"
                  style={{ 
                    background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 0.125rem 0.625rem rgba(0, 0, 0, 0.25)'
                  }}
                >
                  <span className="absolute inset-0 w-full h-full glow-effect"></span>
                  {isSubmitting ? (
                    <span className="flex items-center justify-center relative z-10">
                      <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t.loading}
                    </span>
                  ) : <span className="relative z-10">{t.submitButton}</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}; 