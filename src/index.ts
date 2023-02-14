import { Kafka } from 'kafkajs';
import { SchemaRegistry, readAVSCAsync } from '@kafkajs/confluent-schema-registry';
import path from 'path';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});
const registry = new SchemaRegistry({ host: 'http://localhost:9090' });

const run = async () => {
  console.log('run');
  const schema = await readAVSCAsync(path.join(__dirname, '/BusinessEvent.avsc'));

  const consumer = kafka.consumer({ groupId: 'test-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: 'biz-madrid' });

  await consumer.run({
    eachMessage: async (props: any) => {
      console.log('>>>>>>>> new message from kafka <<<<<<<<');
      const { topic, partition, message } = props;

      const decodedMessage = {
        ...message,
        value: await registry.decode(message.value),
      };
      console.log('decodedMessage >>>>>>', decodedMessage);

      console.log('decodedMessage.value >>>>>', decodedMessage.value);
    },
  });
};

run().catch(console.error);
