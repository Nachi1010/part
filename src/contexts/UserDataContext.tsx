import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// הגדרת סוג הנתונים שיישמרו בקונטקסט
interface UserDataContextType {
  userIp: string;
  isIpLoaded: boolean;
}

// יצירת הקונטקסט עם ערכי ברירת מחדל
const UserDataContext = createContext<UserDataContextType>({
  userIp: "",
  isIpLoaded: false,
});

// הוק נוח לשימוש בקונטקסט
export const useUserData = () => useContext(UserDataContext);

interface UserDataProviderProps {
  children: ReactNode;
}

export const UserDataProvider = ({ children }: UserDataProviderProps) => {
  const [userIp, setUserIp] = useState("");
  const [isIpLoaded, setIsIpLoaded] = useState(false);

  // מבצע טעינה של כתובת ה-IP מיד עם אתחול האפליקציה
  useEffect(() => {
    const fetchUserIp = async () => {
      try {
        // יצירת בקשה עם טיימאאוט
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // טיימאאוט ארוך יותר בטעינה הראשונית

        // ניסיון ראשון - שירות ipapi
        try {
          const response = await fetch('https://ipapi.co/json/', { 
            signal: controller.signal 
          });
          const data = await response.json();
          if (data && data.ip) {
            setUserIp(data.ip);
            setIsIpLoaded(true);
            console.log('IP address fetched successfully:', data.ip);
            clearTimeout(timeoutId);
            return;
          }
        } catch (primaryError) {
          console.warn('Primary IP service failed, trying backup service:', primaryError);
        }

        // ניסיון שני - שירות גיבוי ipify אם הראשון נכשל
        try {
          const backupResponse = await fetch('https://api.ipify.org?format=json', { 
            signal: controller.signal 
          });
          const backupData = await backupResponse.json();
          if (backupData && backupData.ip) {
            setUserIp(backupData.ip);
            setIsIpLoaded(true);
            console.log('IP address fetched from backup service:', backupData.ip);
            clearTimeout(timeoutId);
            return;
          }
        } catch (backupError) {
          console.warn('Backup IP service also failed:', backupError);
        }

        // אם הגענו לכאן, שני השירותים נכשלו
        setIsIpLoaded(true); // מסמן שסיימנו את הניסיון אפילו אם נכשל
        clearTimeout(timeoutId);
        
      } catch (error) {
        console.warn('Error fetching IP address:', error);
        setIsIpLoaded(true); // מסמן שסיימנו את הניסיון
      }
    };

    fetchUserIp();
  }, []);

  const value = {
    userIp,
    isIpLoaded
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}; 