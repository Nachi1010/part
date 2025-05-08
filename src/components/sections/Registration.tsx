import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserData } from "@/contexts/UserDataContext";
import { getImagePath } from "@/App";

// טופס רישום עם עיצוב מותאם ולוגיקה משופרת
export const Registration = () => {
  const { currentLang, getTextDirection } = useLanguage();
  const { userIp, isIpLoaded } = useUserData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [bgAnimationEnabled, setBgAnimationEnabled] = useState(true);
  
  // אפקט לטיפול באופטימיזציה - כיבוי האנימציה לאחר זמן מסוים
  useEffect(() => {
    // הטיימר יכבה את אנימציית הרקע לאחר 10 שניות כדי לחסוך בביצועים
    const animationTimer = setTimeout(() => {
      setBgAnimationEnabled(false);
    }, 10000);
    
    return () => clearTimeout(animationTimer);
  }, []);
  
  // מצב הטופס
  const [formData, setFormData] = useState({
    name: "",
    id: "",
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

  // תרגומים
  const translations = {
    en: {
      title: "Join Our Elite Program",
      subtitle: "Take your first step towards AI mastery",
      namePlaceholder: "Enter your full name",
      idPlaceholder: "Enter your ID number",
      emailPlaceholder: "you@example.com",
      phonePlaceholder: "Enter your phone number",
      submitButton: "Join our journey",
      nameLabel: "Full Name",
      idLabel: "ID Number",
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
      title: "הגישו מועמדות לתכנית",
      subtitle: "רוכשים משרה נחשקת ומומחיות ב-AI",
      namePlaceholder: "ישראל ישראלי",
      idPlaceholder: "0-0000000-0",
      emailPlaceholder: "your@email.com",
      phonePlaceholder: "050-000-0000",
      submitButton: "הצטרפו אלינו",
      nameLabel: "שם מלא",
      idLabel: "מספר זהות",
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
          console.log("נמצא משתמש קיים לפי אימייל:", existingUserId);
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
          console.log("נמצא משתמש קיים לפי טלפון:", existingUserId);
        }
      }
      
      // הכנת האובייקט לשליחה לסופאבייס
      const registrationData = {
        // לא משתמשים ב-user_id קיים כלל - סופאבייס ייצור מזהה חדש
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        id_number: formData.id || '',
        // שמירת זיהוי של רשומות קודמות במטא-דאטה
        metadata: {
          browser_info: navigator.userAgent,
          form_locale: currentLang,
          form_timestamp: new Date().toISOString(),
          previous_registration_id: existingUserId || null,
          is_update: existingUserId ? true : false,
          ip_was_loaded: isIpLoaded, // מידע נוסף לצורכי ניטור
          source: 'main_registration_form' // הוספנו את ה-source למטא-דאטה
        }
      };
      
      // הוספת כתובת IP לאובייקט רק אם הסכמה תומכת בשדה הזה
      // אם השרת אינו תומך בשדה, הוא יישמט באופן אוטומטי
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

      // בדיקת תנאים להצגת הודעת הצלחה:
      // 1. שם + אימייל תקין
      // 2. או מספר טלפון בן 9 ספרות
      const nameAndEmailValid = hasValidName && hasValidEmail;
      const phoneValid = hasValidPhone;
      const showSuccessMessage = nameAndEmailValid || phoneValid;
      
      // בדיקה אם כל הפרטים הנדרשים מולאו (לצורך מעבר לדף תודה)
      const allFieldsValid = hasValidName && hasValidEmail && hasValidPhone;

      if (showSuccessMessage) {
        // הצגת הודעת הצלחה
        toast({
          title: "✅ " + "Success",
          description: t.successMessage,
          variant: "success",
          duration: 5000,
        });
        
        // ניווט לדף תודה רק אם כל הפרטים מולאו
        if (allFieldsValid) {
          // יצירת פרמטרים לשליחה לדף הנחיתה
          const params = new URLSearchParams({
            name: formData.name || '',
            email: formData.email || '',
            phone: formData.phone || '',
            id: formData.id || '',
            source: 'main_registration_form'
          }).toString();
          
          // ניווט לאתר HR עם הפרמטרים
          window.location.href = `https://hr.practicsai.com?${params}`;
        }
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

      // כדי לספק רישום טוב יותר של פעילות המשתמש, גם לקטבלת הלוגים
      try {
        // אין לנו את ה-user_id החדש כי הוא נוצר אוטומטית בסופאבייס
        // לכן נשתמש ב-null ונסמוך על הטריגר שיוסיף את המידע הדרוש
        await supabase.from('activity_log').insert([{
          // אין לנו user_id במודל החדש, ה-trigger יטפל בזה
          user_id: null,
          action: existingUserId ? 'REGISTRATION_UPDATE' : 'REGISTRATION_NEW',
          table_name: 'registration_data',
          details: {
            form_data: {
              name: formData.name || '',
              email: formData.email || '',
              phone: formData.phone || '',
              id_number: formData.id || '',
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

  return (
    <div 
      id="registration-form"
      className="py-8 md:py-16 lg:py-20 min-h-screen flex items-center justify-center"
      style={{ 
        direction,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* רקע דינמי עם אנימציה משופרת */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${getImagePath("/images/D.avif")}'), url('${getImagePath("/images/D.webp")}'), url('${getImagePath("/images/D.jpeg")}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.4)",
          zIndex: "-3"
        }}
      ></div>
      
      {/* שכבת אנימציית גרדיאנט גולשת - משופרת */}
      <div 
        className="absolute inset-0" 
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0) 70%)",
          opacity: 0.8,
          zIndex: "-2",
          animation: bgAnimationEnabled ? "pulse-gradient 8s infinite alternate" : "none"
        }}
      ></div>

      {/* שכבת אוברליי גריד משופרת */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `linear-gradient(rgba(22, 26, 48, 0.4) 1px, transparent 1px), 
                            linear-gradient(to right, rgba(22, 26, 48, 0.4) 1px, transparent 1px)`,
          backgroundSize: "clamp(20px, 5vw, 50px) clamp(20px, 5vw, 50px)",
          opacity: 0.5,
          zIndex: "-1"
        }}
      ></div>

      {/* שכבת אוברליי גרדיאנט נוספת עם אנימציה - משופרת */}
      <div 
        className="absolute inset-0" 
        style={{
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.5) 100%)",
          opacity: bgAnimationEnabled ? 0.8 : 0.7,
          zIndex: "-1",
          animation: bgAnimationEnabled ? "fade-gradient 10s infinite alternate" : "none"
        }}
      ></div>

      {/* אנימציות CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse-gradient {
            0% {
              opacity: 0.6;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.05);
            }
            100% {
              opacity: 0.6;
              transform: scale(1);
            }
          }
          
          @keyframes fade-gradient {
            0% {
              opacity: 0.6;
              background-position: 0% 50%;
            }
            50% {
              opacity: 0.8;
              background-position: 100% 50%;
            }
            100% {
              opacity: 0.6;
              background-position: 0% 50%;
            }
          }
        `
      }} />
      
      <div className="w-full max-w-md px-4 sm:px-6">
        {/* כרטיס הטופס */}
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
          style={{
            boxShadow: "0 1rem 2.5rem rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          {/* כותרת */}
          <div 
            className="p-5 md:p-6 lg:p-8" 
            style={{ 
              background: "linear-gradient(135deg, #1e293b 0%, #111827 100%)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
            }}
          >
            <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
              {t.title}
            </h2>
            <p className="text-white opacity-80 text-sm sm:text-base">
              {t.subtitle}
            </p>
          </div>
          
          {/* גוף הטופס */}
          <div className="p-5 md:p-6 lg:p-8">
            <form onSubmit={onSubmit} className="space-y-4 md:space-y-5">
              {/* שם */}
              <div>
                <label className="block text-sm font-medium mb-1 md:mb-2 text-gray-700 dark:text-gray-300">
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder={t.namePlaceholder}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* מספר זהות */}
              <div>
                <label className="block text-sm font-medium mb-1 md:mb-2 text-gray-700 dark:text-gray-300">
                  {t.idLabel}
                </label>
                <input
                  type="text"
                  name="id"
                  placeholder={t.idPlaceholder}
                  value={formData.id}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* אימייל */}
              <div>
                <label className="block text-sm font-medium mb-1 md:mb-2 text-gray-700 dark:text-gray-300">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* טלפון */}
              <div>
                <label className="block text-sm font-medium mb-1 md:mb-2 text-gray-700 dark:text-gray-300">
                  {t.phoneLabel}
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder={t.phonePlaceholder}
                  value={formData.phone}
                  style={{ direction }}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* כפתור שליחה */}
              <div className="pt-3 sm:pt-4 md:pt-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 sm:py-3 px-4 sm:px-6 text-white font-semibold rounded-lg shadow-md disabled:opacity-70 relative overflow-hidden"
                  style={{ 
                    background: "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)",
                    boxShadow: "0 0.25rem 0.625rem rgba(0, 0, 0, 0.3)",
                    transition: "all 0.3s ease"
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center relative z-10">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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