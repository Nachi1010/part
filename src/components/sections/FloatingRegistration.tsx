import { useState, useEffect, useRef } from "react";
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
  const [lastSubmitTime, setLastSubmitTime] = useState<number | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const formTimestampRef = useRef<number>(Date.now());
  
  // מצב הטופס - ללא שדה תעודת זהות
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  
  // מעקב אחר גלילה ראשונית והצגת הטופס
  useEffect(() => {
    // מאזין לאירועי גלילה
    const mainFormElement = document.getElementById('registration-form');
    let scrollTimeout: ReturnType<typeof setTimeout>;
    let scrollPosition = window.scrollY;
    let lastAutoSubmitTime = 0;
    const AUTO_SUBMIT_COOLDOWN = 1200; // 2 דקות בין שליחות אוטומטיות
    const SCROLL_THRESHOLD = 100; // הסף המינימלי של גלילה בפיקסלים להפעלת הטריגר
    
    // אירוע גלילה בדף
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      const currentTime = Date.now();
      
      // בדיקה אם המשתמש גלל מספיק להפעלת הטריגר
      if (Math.abs(currentScrollPosition - scrollPosition) > SCROLL_THRESHOLD) {
        if (!hasScrolled) {
          console.log("זוהתה גלילה משמעותית - מסמן hasScrolled=true");
        }
        setHasScrolled(true);
      }
      
      // בודק אם הטופס הרגיל נראה בחלון הדפדפן
      const isMainFormVisible = mainFormElement ? 
        mainFormElement.getBoundingClientRect().top < window.innerHeight && 
        mainFormElement.getBoundingClientRect().bottom > 0 : false;
      
      // אם הטופס הרגיל נראה בחלון הדפדפן
      if (isMainFormVisible) {
        if (!userInteractedWithMainForm) {
          console.log("זוהתה אינטראקציה עם הטופס הראשי");
        }
        setUserInteractedWithMainForm(true);
        // כאשר המשתמש רואה את הטופס הרגיל, אנחנו מאפסים את זמן הסגירה האחרון
        // כדי שהטופס הצף לא יופיע מחדש בזמן שהמשתמש מעיין בטופס הרגיל
        setDismissedTime(null);
        setIsDismissed(true); // מונע מהטופס הצף להופיע
        setIsVisible(false); // ודאות שהטופס הצף מוסתר
      }
      
      // אם המשתמש כבר ראה את הטופס הרגיל וכעת גולל למקום אחר (הטופס לא נראה)
      if (userInteractedWithMainForm && !isMainFormVisible) {
        // אם המשתמש עדיין לא סימן שגלל אחרי הטופס הרגיל, נסמן כעת
        if (!userScrolledAfterMainForm) {
          console.log("המשתמש ראה את הטופס הראשי וכעת גלל ממנו");
          setUserScrolledAfterMainForm(true);
          // איפוס זמן הקפיצה הצפה לאחר אינטראקציה וגלילה
          formTimestampRef.current = Date.now();
          
          // נוסיף טיימר להצגת הטופס הצף לאחר יציאה מהטופס העיקרי
          setTimeout(() => {
            // נבדוק שוב שאכן הטופס הראשי לא נראה
            const mainFormStillVisible = document.getElementById('registration-form')?.getBoundingClientRect().top < window.innerHeight;
            
            if (!mainFormStillVisible && !isDismissed) {
              console.log("מפעיל את הטופס הצף לאחר גלילה מהטופס הראשי + 3 שניות");
              setIsVisible(true);
            }
          }, 3000); // אחרי 3 שניות
        }
        
        // בדיקה אם צריך לשלוח את הנתונים באופן אוטומטי
        // רק אם יש נתונים כלשהם בטופס ולא נשלחו ב-2 דקות האחרונות
        if (currentTime - lastAutoSubmitTime > AUTO_SUBMIT_COOLDOWN &&
            (formData.name || formData.email || formData.phone) &&
            currentTime - (lastSubmitTime || 0) > AUTO_SUBMIT_COOLDOWN) {
          
          // שולח את הנתונים באופן אוטומטי לאחר גלילה
          submitFormData(true);
          lastAutoSubmitTime = currentTime;
        }
      }
      
      // איפוס הטיימר בכל גלילה
      scrollPosition = currentScrollPosition;
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
  }, [userInteractedWithMainForm, userScrolledAfterMainForm, formData, lastSubmitTime, hasScrolled, isDismissed, isVisible]);
  
  // מעקב אחר זמן השהייה בדף ופתיחת הטופס
  useEffect(() => {
    // קבועי זמן
    const INITIAL_SHOW_DELAY = 30000; // חצי דקה להצגה ראשונית (30 שניות)
    const REAPPEAR_DELAY = 60000; // דקה להופעה חוזרת (60 שניות)
    
    let timer: ReturnType<typeof setTimeout>;
    const currentTime = Date.now();
    
    // בדיקה אם הטופס הרגיל מוצג כרגע - במקרה זה אין להציג את הטופס הצף
    const mainFormElement = document.getElementById('registration-form');
    const isMainFormVisible = mainFormElement ? 
      mainFormElement.getBoundingClientRect().top < window.innerHeight && 
      mainFormElement.getBoundingClientRect().bottom > 0 : false;
    
    console.log("מצב טופס צף:", { 
      isDismissed, 
      isVisible, 
      hasScrolled, 
      isMainFormVisible,
      dismissedTime: dismissedTime ? new Date(dismissedTime).toLocaleTimeString() : "אין"
    });
    
    // תנאי 1: אם המשתמש סגר את הטופס באופן יזום, נציג אותו שוב לאחר דקה
    if (isDismissed && dismissedTime && !isMainFormVisible) {
      const timeSinceDismiss = currentTime - dismissedTime;
      
      if (timeSinceDismiss >= REAPPEAR_DELAY) {
        setIsDismissed(false);
        setDismissedTime(null);
        // הצגה מפורשת של הטופס לאחר הזמן שחלף
        setIsVisible(true);
        console.log("מציג טופס צף שוב לאחר סגירה יזומה וזמן המתנה");
      } else {
        const remainingTime = REAPPEAR_DELAY - timeSinceDismiss;
        timer = setTimeout(() => {
          const mainFormElement = document.getElementById('registration-form');
          const isMainFormVisibleNow = mainFormElement ? 
            mainFormElement.getBoundingClientRect().top < window.innerHeight && 
            mainFormElement.getBoundingClientRect().bottom > 0 : false;
            
          if (!isMainFormVisibleNow) {
            setIsDismissed(false);
            setDismissedTime(null);
            // הצגה מפורשת של הטופס
            setIsVisible(true);
            console.log("מציג טופס צף שוב לאחר סגירה יזומה וסיום זמן המתנה");
          }
        }, remainingTime);
      }
    }
    // תנאי 2: הצגה ראשונית של הטופס לאחר גלילה בדף
    else if (!isDismissed && !isVisible && hasScrolled && !isMainFormVisible) {
      // נציג את הטופס לאחר INITIAL_SHOW_DELAY מהגלילה הראשונית
      console.log(`יציג טופס צף לאחר ${INITIAL_SHOW_DELAY/1000} שניות מגלילה ראשונית`);
      timer = setTimeout(() => {
        // בדיקה נוספת שהטופס הראשי לא נראה כעת
        const mainFormElement = document.getElementById('registration-form');
        const isMainFormVisibleNow = mainFormElement ? 
          mainFormElement.getBoundingClientRect().top < window.innerHeight && 
          mainFormElement.getBoundingClientRect().bottom > 0 : false;
        
        if (!isMainFormVisibleNow) {
          setIsVisible(true);
          console.log("מציג טופס צף לאחר גלילה ראשונית והשהייה");
        } else {
          console.log("דילוג על הצגת טופס צף כי הטופס העיקרי מוצג כעת");
        }
      }, INITIAL_SHOW_DELAY);
    }
    // תנאי 3: הצגה מיידית של הטופס אם יש גלילה וכל שאר התנאים מתקיימים
    else if (!isDismissed && !isVisible && hasScrolled && !isMainFormVisible && userScrolledAfterMainForm) {
      // נבדוק את הזמן שחלף מהביקור בטופס הראשי
      const timeSinceMainFormInteraction = currentTime - formTimestampRef.current;
      
      // אם חלפו לפחות 10 שניות מאז אינטראקציה עם הטופס המרכזי, נציג את הטופס הצף
      if (timeSinceMainFormInteraction > 10000) {
        console.log("מציג טופס צף מיידית לאחר 10 שניות מאינטראקציה עם הטופס הראשי");
        setIsVisible(true);
      }
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isDismissed, isVisible, dismissedTime, hasScrolled, userScrolledAfterMainForm, formTimestampRef]);
  
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

    // מחפשים נתונים מהטופס הראשי אם קיימים
    try {
      const mainForm = document.getElementById('registration-form');
      if (mainForm) {
        const nameInput = mainForm.querySelector('input[name="name"]') as HTMLInputElement;
        const emailInput = mainForm.querySelector('input[name="email"]') as HTMLInputElement;
        const phoneInput = mainForm.querySelector('input[name="phone"]') as HTMLInputElement;
        
        // בודק אם יש נתונים כלשהם בטופס הראשי
        const hasMainFormData = nameInput?.value || emailInput?.value || phoneInput?.value;
        
        if (hasMainFormData) {
          console.log("נמצאו נתונים בטופס הראשי, שולח בסגירת הטופס הצף");
          
          // אם יש נתונים בטופס הראשי, נעדכן את ה-formData המקומי
          const tempFormData = {
            name: nameInput?.value || '',
            email: emailInput?.value || '',
            phone: phoneInput?.value || ''
          };
          
          // שולח את נתוני הטופס הראשי
          submitFormDataFromMainForm(tempFormData);
        } else {
          // אם אין נתונים בטופס הראשי, בודק אם יש נתונים בטופס הצף
          const hasFloatingFormData = formData.name || formData.email || formData.phone;
          
          if (hasFloatingFormData) {
            console.log("אין נתונים בטופס הראשי, שולח נתונים מהטופס הצף");
            // שולח את הנתונים מהטופס הצף
            submitFormData(true);
          }
        }
      } else {
        // אם אין טופס ראשי, בודק אם יש נתונים בטופס הצף
        const hasFloatingFormData = formData.name || formData.email || formData.phone;
        
        if (hasFloatingFormData) {
          console.log("לא נמצא טופס ראשי, שולח נתונים מהטופס הצף");
          // שולח את הנתונים מהטופס הצף
          submitFormData(true);
        }
      }
    } catch (error) {
      console.error("שגיאה בניסיון לשלוח נתונים בעת סגירת הטופס:", error);
    }
  };

  // פונקציה לשליחת הנתונים מהטופס הראשי
  const submitFormDataFromMainForm = async (mainFormData: { name: string, email: string, phone: string }) => {
    if (isSubmitting) return;
    
    // לא נשלח אם אין מספיק נתונים
    if (!mainFormData.name && !mainFormData.email && !mainFormData.phone) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      // בדיקות תקינות 
      const hasValidName = mainFormData.name && mainFormData.name.trim() !== '';
      const hasValidEmail = isValidEmail(mainFormData.email);
      const hasValidPhone = isValidPhone(mainFormData.phone);
      
      // חיפוש אם המשתמש כבר נרשם בעבר לפי אימייל או טלפון
      let existingUserId = null;
      
      // נבדוק אם המשתמש קיים לפי אימייל
      if (hasValidEmail) {
        const { data: existingUserByEmail } = await supabase
          .from('registration_data')
          .select('user_id')
          .eq('email', mainFormData.email)
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
          .eq('phone', mainFormData.phone)
          .limit(1);
          
        if (existingUserByPhone && existingUserByPhone.length > 0) {
          existingUserId = existingUserByPhone[0].user_id;
          console.log("נמצא משתמש קיים לפי טלפון:", existingUserId);
        }
      }
      
      // הכנת האובייקט לשליחה לסופאבייס - תואם בדיוק לרגיסטריישן המקורי
      const registrationData = {
        // נתונים מהטופס הראשי
        name: mainFormData.name || '',
        email: mainFormData.email || '',
        phone: mainFormData.phone || '',
        source: 'auto_submit_from_main_form',
        // שמירת זיהוי של רשומות קודמות במטא-דאטה
        metadata: {
          browser_info: navigator.userAgent,
          form_locale: currentLang,
          form_timestamp: new Date().toISOString(),
          previous_registration_id: existingUserId || null,
          is_update: existingUserId ? true : false,
          ip_was_loaded: isIpLoaded,
          is_auto_submit: true,
          from_main_form: true
        }
      };
      
      // הוספת כתובת IP לאובייקט רק אם הסכמה תומכת בשדה הזה
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
      
      // שמירת זמן השליחה האחרון (עבור השליחה האוטומטית)
      setLastSubmitTime(Date.now());

      // כדי לספק רישום טוב יותר של פעילות המשתמש, גם לטבלת הלוגים
      try {
        await supabase.from('activity_log').insert([{
          user_id: null, // ה-trigger יטפל בזה
          action: existingUserId ? 'REGISTRATION_UPDATE' : 'REGISTRATION_NEW',
          table_name: 'registration_data',
          details: {
            form_data: {
              name: mainFormData.name || '',
              email: mainFormData.email || '',
              phone: mainFormData.phone || ''
            },
            from_main_form: true,
            previous_registration_id: existingUserId,
            has_valid_email: hasValidEmail,
            has_valid_phone: hasValidPhone,
            client_timestamp: new Date().toISOString(),
            is_auto_submit: true
          }
        }]);
      } catch (logError) {
        // שגיאות ברישום לוג לא יעצרו את תהליך ההרשמה
        console.warn('Failed to write to activity log:', logError);
      }
    } catch (error) {
      console.error('Registration error with main form data:', error);
    } finally {
      setIsSubmitting(false);
    }
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

  // פונקציה לשליחת הנתונים למסד הנתונים - תואמת במדוייק את הרגיסטריישן המקורי
  const submitFormData = async (isAutoSubmit = false) => {
    if (isSubmitting) return;
    
    // לא נשלח במצב אוטו אם אין מספיק נתונים
    if (isAutoSubmit && !formData.name && !formData.email && !formData.phone) {
      return;
    }
    
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
      
      // הכנת האובייקט לשליחה לסופאבייס - במדויק כמו ברגיסטריישן המקורי
      const registrationData = {
        // לא משתמשים ב-user_id קיים כלל - סופאבייס ייצור מזהה חדש
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        // אין שדה ID בטופס הצף, אך יש שדה source מיוחד
        source: isAutoSubmit ? 'floating_auto_submit' : 'floating_registration_form',
        // שמירת זיהוי של רשומות קודמות במטא-דאטה
        metadata: {
          browser_info: navigator.userAgent,
          form_locale: currentLang,
          form_timestamp: new Date().toISOString(),
          previous_registration_id: existingUserId || null,
          is_update: existingUserId ? true : false,
          ip_was_loaded: isIpLoaded // מידע נוסף לצורכי ניטור
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

      // שליחה אוטומטית לא מציגה הודעות או מנווטת, אלא רק שומרת נתונים
      if (isAutoSubmit) {
        // שמירת זמן השליחה האחרון (עבור השליחה האוטומטית)
        setLastSubmitTime(Date.now());
        return;
      }

      // מכאן ואילך, רק שליחה ידנית מהטופס עצמו (בדיוק כמו ברגיסטריישן המקורי)
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
        
        // סגירת הטופס לאחר הרשמה מוצלחת
        setIsVisible(false);
        setIsDismissed(true);
        
        // ניווט לדף תודה רק אם כל הפרטים מולאו - בדיוק כמו ברגיסטריישן המקורי
        if (allFieldsValid) {
          // יצירת פרמטרים לשליחה לדף הנחיתה
          const params = new URLSearchParams({
            name: formData.name || '',
            email: formData.email || '',
            phone: formData.phone || '',
            source: 'floating_registration_form'
          }).toString();
          
          // ניווט לאתר HR עם הפרמטרים - בדיוק כמו ברגיסטריישן המקורי
          window.location.href = `https://hr.practicsai.com?${params}`;
        }
      } else {
        // הצגת הודעת שגיאה עם פירוט החסרים - בדיוק כמו ברגיסטריישן המקורי
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

      // כדי לספק רישום טוב יותר של פעילות המשתמש, גם לטבלת הלוגים - בדיוק כמו ברגיסטריישן המקורי
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
            },
            previous_registration_id: existingUserId,
            has_valid_email: hasValidEmail,
            has_valid_phone: hasValidPhone,
            client_timestamp: new Date().toISOString(),
            is_auto_submit: isAutoSubmit,
            from_floating_form: true
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

  // עדכון פונקציית השליחה
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    await submitFormData(false); // שליחה ידנית
  };

  // קבלת ערך ה-direction המתאים לשפה
  const direction = getTextDirection();

  // אם הטופס לא מוצג, לא נרנדר כלום
  if (!isVisible || isDismissed) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 transform transition-all duration-700 ease-out flex justify-center"
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
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4), 0 -1px 0 rgba(255, 255, 255, 0.1) inset',
            maxWidth: '100%',
          }}
        >
          {/* כפתור סגירה */}
          <button 
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-2 rounded-full bg-slate-800/70 hover:bg-slate-700 transition-colors z-20"
            aria-label="סגור טופס"
          >
            <X className="h-4 w-4 text-slate-300" />
          </button>
          
          {/* כותרת */}
          <div 
            className="p-6 pb-4" 
            style={{ 
              background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-1">
              {t.title}
            </h2>
            <p className="text-slate-300 opacity-90 text-sm">
              {t.subtitle}
            </p>
          </div>
          
          {/* גוף הטופס */}
          <div className="p-6 pt-4">
            <form onSubmit={onSubmit} className="space-y-4">
              {/* שם */}
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-200">
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder={t.namePlaceholder}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-slate-600 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* אימייל */}
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-200">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-slate-600 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* טלפון */}
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-200">
                  {t.phoneLabel}
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder={t.phonePlaceholder}
                  value={formData.phone}
                  style={{ direction }}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-slate-600 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* כפתור שליחה */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 text-white font-semibold rounded-md shadow-md disabled:opacity-70 transition-all hover:shadow-lg relative overflow-hidden glow-button"
                  style={{ 
                    background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)'
                  }}
                >
                  <span className="absolute inset-0 w-full h-full glow-effect"></span>
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