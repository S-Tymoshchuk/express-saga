const {
  Kafka
} = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const producerKafka = kafka.producer();
const consumerKafkaReply = kafka.consumer({
  groupId: "test",
});
const consumerKafka = kafka.consumer({
  groupId: "test-group",
});

module.exports = {
  producerKafka,
  consumerKafka,
  consumerKafkaReply
};