import * as z from "zod";

// הגדרת סכמה גמישה יותר שתואמת את דרישות העסק:
// או מספר טלפון
// או שם + אימייל
export const registrationFormSchema = z.object({
  name: z.string().optional(),
  id: z.string().optional(), 
  email: z.string().optional(),
  phone: z.string().optional(),
});