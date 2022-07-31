const Joi = require("joi");
const {
  validator,
  headerValidator,
  paramsValidator,
} = require("./requestValidator");
const registerUserSchema = Joi.object().keys({
  userName: Joi.string().min(3).max(40).required(),
  password: Joi.string().min(3).max(40).required(),
  userType: Joi.string().valid("BUYER", "SELLER").required(),
});

const loginUserSchema = Joi.object().keys({
  userName: Joi.string().min(3).max(40).required(),
  password: Joi.string().min(3).max(40).required(),
});
const headerSchema = Joi.object()
  .keys({
    authorization: Joi.string().required(),
  })
  .options({ allowUnknown: true });

const createCatalogSchema = Joi.object().keys({
  sellerId: Joi.number().required(),
  productIds: Joi.array().items(Joi.number().required()).min(1).required(),
});

const fetchCatalogSchema = Joi.object().keys({
  seller_id: Joi.number().required(),
});
const createOrderSchema = Joi.object().keys({
  buyerId: Joi.number().required(),
  productIds: Joi.array().items(Joi.number().required()).min(1).required(),
});

const fetchOrderSchema = Joi.object().keys({
  sellerId: Joi.number().required(),
});

const registerUserValidator = validator(registerUserSchema);
const loginUserValidator = validator(loginUserSchema);
const headersValidator = headerValidator(headerSchema);
const createCatalogValidator = validator(createCatalogSchema);
const fetchCatalogValidator = paramsValidator(fetchCatalogSchema);
const createOrderValidator = validator(createOrderSchema);
const fetchOrderValidator = validator(fetchOrderSchema);

module.exports = {
  registerUserValidator,
  loginUserValidator,
  headersValidator,
  createCatalogValidator,
  fetchCatalogValidator,
  createOrderValidator,
  fetchOrderValidator,
};
