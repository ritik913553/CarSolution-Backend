import Joi from "joi";

const registerUserSchema = Joi.object({
    fullName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().min(6).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
});

const addressSchema = Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().required(),
    country: Joi.string().required(),
});

const fillUserDetailsSchema = Joi.object({


    gender: Joi.string().required(),

    dob: Joi.date().required(),

    age: Joi.number().required(),

    address: Joi.array().items(addressSchema).min(1).required(),

    phone: Joi.string().length(10).required(),


    fcmToken: Joi.string().allow(null),

    addharNumber: Joi.string().length(12).required(),

    brandName: Joi.array().items(Joi.string()).min(1).required(),
});


export { registerUserSchema,fillUserDetailsSchema};
