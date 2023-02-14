# Listening to business events

https://stuart-team.atlassian.net/wiki/spaces/EN/pages/1398410733/How+to+test+changes+in+Kafka+events

Once configuring the whole app

Open `rails console` and type 

``` ruby
message = BusinessEvent::V2::DriverAssignmentSucceeded.new(assignment_id: 123123, driver_id: 4343)
backend_message = BusinessEvent::V2::BusinessEvent.new(
  created_at: Time.current,
  msg: message
)
topic = "biz-madrid"
Services::LogEvents::PushBusinessEvent.call(
  message: backend_message.avro_message_value.force_encoding(Encoding::BINARY),
  topic: topic
)

```
Result in console

![image](https://user-images.githubusercontent.com/9019542/218819390-2742dcf5-6cd3-4110-ab1a-6951c1559477.png)
