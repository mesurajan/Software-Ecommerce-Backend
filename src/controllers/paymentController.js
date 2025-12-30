const Order = require("../models/Order");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const generateEsewaSignature = (message, secret) => {
  return crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("base64");
};

// 1️⃣ Initiate Payment
const initiateEsewaPayment = async (req, res) => {
  try {
    const { items, shipping, subtotal, deliveryFee, total } = req.body;

    const transaction_uuid = uuidv4();

    await Order.create({
      user: req.user._id,     
      items,
      shipping,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: "ESEWA",
      transaction_uuid,
    });

    const signed_field_names =
      "total_amount,transaction_uuid,product_code";

    const dataToSign = `total_amount=${total},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_MERCHANT_CODE}`;

    const signature = generateEsewaSignature(
      dataToSign,
      process.env.ESEWA_SECRET_KEY
    );

    res.json({
      success: true,
      esewaUrl: process.env.ESEWA_BASE_URL,
      params: {
        amount: subtotal,
        tax_amount: 0,
        total_amount: total,
        transaction_uuid,
        product_code: process.env.ESEWA_MERCHANT_CODE,
        product_service_charge: 0,
        product_delivery_charge: deliveryFee,
        success_url: "http://localhost:5174/api/payment/esewa/success",
        failure_url: "http://localhost:5174/api/payment/esewa/failure",
        signed_field_names,
        signature,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2️⃣ Success callback
const esewaSuccess = async (req, res) => {
  try {
    const { data } = req.query; // data is base64 or JSON string
    const parsed = JSON.parse(Buffer.from(data, "base64").toString());
    const { transaction_uuid } = parsed;

    await Order.findOneAndUpdate(
      { transaction_uuid },
      { paymentStatus: "PAID" }
    );

    res.redirect("http://localhost:5173/payment-success");
  } catch (err) {
    console.error(err);
    res.redirect("http://localhost:5173/payment-failed");
  }
};

// 3️⃣ Failure callback
const esewaFailure = async (req, res) => {
  console.warn("eSewa payment failed", req.query);
  res.redirect("http://localhost:5173/payment-failed");
};
// ✅ EXPORTS
module.exports = {
  initiateEsewaPayment,
  esewaSuccess,
  esewaFailure,
};
