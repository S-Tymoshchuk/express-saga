const {
  producerKafka
} = require("../Kafka.js");

const start = async () => {
  const payment = {
    transactionId: Date.now(),
    payment: "payment",
  };
  await producerKafka.connect();
  await producerKafka.send({
    topic: "payment",
    messages: [{
      value: JSON.stringify(payment),
    }, ],
  });
  await producerKafka.disconnect()
};

module.exports = start;