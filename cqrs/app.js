const express = require("express");
const mongoose = require("mongoose");
const start = require("./commands/payment.handlrer");
const { consumerKafkaReply } = require("./Kafka");
const Payment = require("./mongoDB");

//Components
const PaymentComponent = require("../services/payment/app");
PaymentComponent();

const app = express();

app.post("/", async (req, res) => {
  start();
  res.end();

  await consumerKafkaReply.connect();

  await consumerKafkaReply.subscribe({
    topic: "payment-reply",
    fromBeginning: true,
  });
  await consumerKafkaReply.run({
    eachMessage: async ({ topic, message }) => {
      if (topic === "payment-reply") {
        const paymentDone = await JSON.parse(message.value);
        const newPayment = {
          transactionId: paymentDone.transactionId,
          payment: "prepare order",
        };

        const payment = await new Payment(newPayment);
        await payment.save();
        await consumerKafkaReply.disconnect();
      } else {
        return null;
      }
      console.log(topic);
      console.log(message.value.toString());
    },
  });
});

async function run() {
  mongoose.connect("mongodb://localhost:27017/payment", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  app.listen(3001, () => {
    console.log("Server is running...");
  });
}
run();
