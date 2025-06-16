import Joi from "joi";

export const SignInJoiSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.email": "כתובת אימייל לא תקינה",
            "string.empty": "שדה האימייל הוא חובה",
        }),

    password: Joi.string()
        .min(6)
        .max(256)
        .required()
        .messages({
            "string.empty": "שדה הסיסמה הוא חובה",
            "string.min": "הסיסמה חייבת להכיל לפחות 6 תווים",
        }),
});
