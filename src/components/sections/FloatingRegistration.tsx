import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  
  // מעקב אחר זמן השהייה בדף ופתיחת הטופס
  useEffect(() => {
    // קבועי זמן
    const INITIAL_SHOW_DELAY = 30000; // חצי דקה להצגה ראשונית
    const REAPPEAR_DELAY = 60000; // דקה להופעה חוזרת
    
    let timer: ReturnType<typeof setTimeout>;
    
    // בודק אם הטופס כבר נסגר בעבר והאם עבר מספיק זמן להצגה חוזרת
    if (isDismissed && dismissedTime) {
      const timeSinceDismiss = Date.now() - dismissedTime;
      
      // אם עברה דקה מאז שהטופס נסגר, נאפשר הצגה חוזרת
      if (timeSinceDismiss >= REAPPEAR_DELAY) {
        console.log('Re-enabling form after 1 minute since dismiss');
        setIsDismissed(false);
        setDismissedTime(null);
      } else {
        // אם טרם עברה דקה, נמתין עד שתעבור דקה מהסגירה
        const remainingTime = REAPPEAR_DELAY - timeSinceDismiss;
        timer = setTimeout(() => {
          console.log('Time to show form again after dismiss');
          setIsDismissed(false);
          setDismissedTime(null);
        }, remainingTime);
      }
    } 
    // אם הטופס לא נסגר בעבר ולא מוצג כרגע, נציג אותו אחרי חצי דקה
    else if (!isDismissed && !isVisible) {
      timer = setTimeout(() => {
        console.log('Showing floating registration form after 30 seconds');
        setIsVisible(true);
      }, INITIAL_SHOW_DELAY);
    }
    
    // ניקוי הטיימר
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isDismissed, isVisible, dismissedTime]);
  
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
    console.log('Form dismissed, will reappear in 1 minute');
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

  // עדכון הלוגיקה של השליחה
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // בדיקות תקינות 
      const hasValidName = formData.name && formData.name.trim() !== '';
      const hasValidEmail = isValidEmail(formData.email);
      const hasValidPhone = isValidPhone(formData.phone);
      
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
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        ip_address: userIp || null,
        source: 'floating_form', // סימון שמקור ההרשמה הוא מהטופס הצף
        metadata: {
          browser_info: navigator.userAgent,
          form_locale: currentLang,
          form_timestamp: new Date().toISOString(),
          previous_registration_id: existingUserId || null,
          is_update: existingUserId ? true : false,
          ip_was_loaded: isIpLoaded,
          user_scroll_time: true
        }
      };
      
      // שליחה לסופבייס עם טבלה "registration_data"
      const { error } = await supabase.from('registration_data').insert([registrationData]);

      if (error) throw error;

      // בדיקת תנאים להצגת הודעת הצלחה
      const nameAndEmailValid = hasValidName && hasValidEmail;
      const phoneValid = hasValidPhone;
      const showSuccessMessage = nameAndEmailValid || phoneValid;
      
      if (showSuccessMessage) {
        // הצגת הודעת הצלחה
        toast({
          title: "✅ " + "Success",
          description: t.successMessage,
          variant: "success",
          duration: 5000,
        });
        
        // סגירת הטופס לאחר הרשמה מוצלחת
        handleDismiss();
      } else {
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
      className="fixed bottom-0 left-0 right-0 z-50 p-4 transform transition-transform duration-500 ease-in-out"
      style={{
        direction,
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)'
      }}
    >
      <div className="mx-auto max-w-md">
        {/* כרטיס הטופס - עם עיצוב צף */}
        <div 
          className="bg-white dark:bg-gray-800 rounded-t-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
          style={{ 
            boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.12)'
          }}
        >
          {/* כפתור סגירה */}
          <button 
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="סגור טופס"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
          
          {/* כותרת */}
          <div 
            className="p-6" 
            style={{ 
              background: 'linear-gradient(135deg, #2b4c7e 0%, #1e293b 100%)'
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-1">
              {t.title}
            </h2>
            <p className="text-white opacity-80 text-sm">
              {t.subtitle}
            </p>
          </div>
          
          {/* גוף הטופס */}
          <div className="p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              {/* שם */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder={t.namePlaceholder}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* אימייל */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* טלפון */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t.phoneLabel}
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder={t.phonePlaceholder}
                  value={formData.phone}
                  style={{ direction }}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* כפתור שליחה */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 text-white font-semibold rounded-lg shadow-md disabled:opacity-70"
                  style={{ 
                    background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t.loading}
                    </span>
                  ) : t.submitButton}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}; 