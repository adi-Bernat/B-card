import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.object({
        first: Joi.string().min(2).max(256).required(),
        middle: Joi.string().min(2).max(256).allow(""),
        last: Joi.string().min(2).max(256).required(),
    }).required(),

    phone: Joi.string()
        .pattern(/0[0-9]{1,2}-?\s?[0-9]{3}\s?[0-9]{4}/)
        .message('מספר טלפון לא תקין')
        .required(),

    email: Joi.string().email({ tlds: { allow: false } }).required(),

    password: Joi.string()
        .pattern(/((?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*-]).{7,20})/)
        .message('הסיסמה צריכה לכלול אות גדולה, אות קטנה, מספר ותו מיוחד')
        .required(),

    image: Joi.object({
        url: Joi.string().uri().allow(""),
        alt: Joi.string().min(2).max(256).allow(""),
    }).required(),

    address: Joi.object({
        country: Joi.string().required(),
        city: Joi.string().required(),
        street: Joi.string().required(),
        houseNumber: Joi.number().required(),
        zip: Joi.number().allow(""),
    }).required(),

    isBusiness: Joi.boolean().required(),
});
