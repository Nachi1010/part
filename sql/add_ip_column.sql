-- SQL להוספת עמודת IP לטבלת ההרשמה

-- בדיקה האם העמודה כבר קיימת לפני הוספה (למניעת שגיאות)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'registration_data' 
        AND column_name = 'ip_address'
    ) THEN
        -- הוספת העמודה אם היא לא קיימת
        ALTER TABLE registration_data 
        ADD COLUMN ip_address VARCHAR(45);  -- IPv6 יכול להיות עד 45 תווים
        
        -- הוספת הערה לעמודה
        COMMENT ON COLUMN registration_data.ip_address 
        IS 'כתובת ה-IP של המשתמש בזמן ההרשמה';
    END IF;
END $$; 