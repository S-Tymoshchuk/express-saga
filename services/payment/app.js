const mongoose = require("mongoose");
const Payment = require('./mongoDB')
const {
  consumerKafka,
  producerKafka
} = require("../../cqrs/Kafka");
const payment = async () => {
  await consumerKafka.connect()
  await consumerKafka.subscribe({
    topic: 'payment',
    fromBeginning: true
  })
  await consumerKafka.run({
    eachMessage: async ({
      message
    }) => {
      const obj = JSON.parse(message.value)
      const payment = await new Payment(obj)
      await payment.save()

      await producerKafka.connect()

      await producerKafka.send({
        topic: 'payment-reply',
        messages: [{
          value: JSON.stringify(obj)
        }]
      })
      const newPayment = {
        transactionId: payment.transactionId,
        payment: 'payment-reply'
      }
      const replyPayment = await new Payment(newPayment)
      await replyPayment.save()
      await producerKafka.disconnect()
    }
  })

}

async function run() {
  mongoose.connect("mongodb://localhost:27017/payment", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
run();

module.exports = payment