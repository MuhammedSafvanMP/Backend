import Joi from "joi";


//  joi validation 

const authJoi = Joi.object({
  username: Joi.string().min(3).max(30).required(),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }).lowercase().required(),
  password: Joi.string().min(8).required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),

});

export default authJoi;
