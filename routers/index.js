const express = require("express");
const router = new express.Router();
const {
  registerUserValidator,
  loginUserValidator,
  headersValidator,
  createCatalogValidator,
  fetchCatalogValidator,
  createOrderValidator,
  fetchOrderValidator,
} = require("../middleware/userValidator");
const { checkUserName, verifyMe } = require("../middleware/auth");
const userController = require("../controllers/controller");

//---------------------------Registration-----------------------------
router.post(
  "/api/auth/register",
  [registerUserValidator, checkUserName],
  userController.registerUser
);
//---------------------------Log in-----------------------------
router.post("/api/auth/login", loginUserValidator, userController.logIn);

//---------------------------List of all sellers-----------------------------s
router.get(
  "/api/buyer/list-of-sellers",
  [headersValidator, verifyMe],
  userController.fetchAllSellers
);

//---------------------------Create catalog-----------------------------
router.post(
  "/api/seller/create-catalog",
  [headersValidator, verifyMe, createCatalogValidator],
  userController.createCatalog
);

//---------------------------Get seller catalog-----------------------------
router.get(
  "/api/buyer/seller-catalog/:seller_id",
  [headersValidator, verifyMe, fetchCatalogValidator],
  userController.fetchCatalog
);
//---------------------------Create Order-----------------------------
router.post(
  "/api/buyer/create-order/:seller_id",
  [headersValidator, verifyMe, createOrderValidator, fetchCatalogValidator],
  userController.createOrder
);
//---------------------------Get seller order-----------------------------
router.get(
  "/api/seller/orders",
  [headersValidator, verifyMe, fetchOrderValidator],
  userController.fetchOrder
);

module.exports = router;
