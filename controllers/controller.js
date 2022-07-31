const express = require("express");
const dbconnection = require("../dbLayer/db.js");
const { generateAuthToken } = require("../middleware/auth");
const bcrypt = require("bcryptjs");
exports.registerUser = async (req, res) => {
  try {
    const { userName, password, userType } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const mySqlQuery =
      "insert into users (user_name,password,type) values(?,?,?)";
    const result = await dbconnection.query(
      mySqlQuery,
      [userName, hashedPassword, userType],
      function (err, rows) {
        if (err) {
          res.status(501).json({
            status: false,
            message: err.message,
          });
        } else {
          res
            .status(201)
            .json({ status: true, message: "User registered successfully" });
        }
      }
    );
  } catch (err) {
    res.status(501).json({
      status: false,
      message: err.message,
    });
  }
};

exports.logIn = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const mySqlQuery =
      "select id,user_name,password from users where user_name=?";
    await dbconnection.query(
      mySqlQuery,
      [userName],
      async function (err, user) {
        if (err || user.length == 0) {
          res
            .status(404)
            .json({ status: false, message: "Username not found" });
        } else {
          const passwordIsValid = bcrypt.compareSync(
            password,
            user[0].password
          );

          if (!passwordIsValid) {
            return res.status(404).json({
              status: false,
              accessToken: null,
              message: "Invalid password",
            });
          }
          const { token } = await generateAuthToken(user[0].id);
          return res.status(404).json({
            status: true,
            accessToken: token,
            data: {
              userName: user[0].user_name,
            },
          });
        }
      }
    );
  } catch (err) {
    res.status(501).json({
      status: false,
      message: err.message,
    });
  }
};

exports.fetchAllSellers = async (req, res) => {
  try {
    const mySqlQuery = "select id,user_name from users where type='SELLER'";
    await dbconnection.query(mySqlQuery, [], async function (err, users) {
      if (err || users.length == 0) {
        res.status(404).json({ status: false, message: "Sellers not found" });
      } else {
        return res.status(404).json({
          status: true,
          message: `${users.length} sellers found`,
          data: users,
        });
      }
    });
  } catch (err) {
    res.status(501).json({
      status: false,
      message: err.message,
    });
  }
};

exports.createCatalog = async (req, res) => {
  try {
    const { sellerId, productIds } = req.body;
    const products = JSON.stringify(productIds);

    const mySqlQuery =
      "insert into catalogs (seller_id,product_ids) values(?,?)";
    await dbconnection.query(
      mySqlQuery,
      [sellerId, products],
      function (err, rows) {
        if (err) {
          res.status(501).json({
            status: false,
            message: err.message,
          });
        } else {
          res
            .status(201)
            .json({ status: true, message: "Catalog created successfully" });
        }
      }
    );
  } catch (err) {
    res.status(501).json({
      status: false,
      message: err.message,
    });
  }
};

exports.fetchCatalog = async (req, res) => {
  try {
    const { seller_id } = req.params;

    const mySqlQuery1 =
      "select u.user_name as sellerName,c.product_ids,c.id as catalogId from catalogs as c,users as u where c.seller_id=?  and c.seller_id=u.id";

    await dbconnection.query(
      mySqlQuery1,
      [seller_id],
      async function (err, data) {
        if (err || data.length == 0) {
          res.status(404).json({ status: false, message: "Catalog not found" });
        } else {
          const product_ids = JSON.parse(data[0].product_ids);

          const mySqlQuery = `select * from products where id in(?)`;
          await dbconnection.query(
            mySqlQuery,
            [product_ids],
            async function (err, productData) {
              if (err || productData.length == 0) {
                res
                  .status(404)
                  .json({ status: false, message: "Catalog not found" });
              } else {
                data[0].products = productData;

                return res.status(404).json({
                  status: true,
                  message: `Catalog found`,
                  data,
                });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    res.status(501).json({
      status: false,
      message: err.message,
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { productIds, buyerId } = req.body;
    const { seller_id } = req.params;
    const products = JSON.stringify(productIds);

    const mySqlQuery =
      "insert into orders (seller_id,buyer_id,product_ids) values(?,?,?)";
    await dbconnection.query(
      mySqlQuery,
      [seller_id, buyerId, products],
      function (err, rows) {
        if (err) {
          res.status(501).json({
            status: false,
            message: err.message,
          });
        } else {
          res
            .status(201)
            .json({ status: true, message: "Order created successfully" });
        }
      }
    );
  } catch (err) {
    res.status(501).json({
      status: false,
      message: err.message,
    });
  }
};

exports.fetchOrder = async (req, res) => {
  try {
    const { sellerId } = req.body;

    const mySqlQuery =
      "select u.user_name as sellerName,o.product_ids,o.id as orderId,o.seller_id from orders as o,users as u where o.seller_id=? and o.seller_id=u.id";

    await dbconnection.query(
      mySqlQuery,
      [sellerId],
      async function (err, datas) {
        if (err || datas.length == 0) {
          res.status(404).json({ status: false, message: "Order not found" });
        } else {
          let product_ids = [];
          datas.forEach(async (data) => {
            product_ids.push(...JSON.parse(data.product_ids));
          });

          const uniqueProductIds = [...new Set(product_ids)];
          if (uniqueProductIds.length > 0) {
            const mySqlQuery = `select * from products where id in(?)`;
            await dbconnection.query(
              mySqlQuery,
              [uniqueProductIds],
              async function (err, productDatas) {
                if (err) {
                  res.status(404).json({ status: false, message: err.message });
                } else {
                  datas.forEach(async (data) => {
                    let subData = [];
                    productDatas.forEach(async (productData) => {
                      if (data.product_ids.includes(productData.id)) {
                        subData.push(productData);
                      }
                    });
                    data.products = subData;
                  });
                  return res.status(404).json({
                    status: true,
                    message: `${datas.length} Orders found`,
                    data: datas,
                  });
                }
              }
            );
          } else {
            return res.status(404).json({
              status: true,
              message: `${datas.length} Orders found`,
              data: datas,
            });
          }
        }
      }
    );
  } catch (err) {
    res.status(501).json({
      status: false,
      message: err.message,
    });
  }
};
