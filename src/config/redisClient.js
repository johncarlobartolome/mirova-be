import { createClient } from "redis";

const redisClient = createClient({
  username: "default",
  password: "sRa8mW4r2SAy73euYf143LtyxB8SRA2E",
  socket: {
    host: "redis-18443.crce185.ap-seast-1-1.ec2.redns.redis-cloud.com",
    port: 18443,
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

await redisClient.connect();

await redisClient.set("foo", "bar");
const result = await redisClient.get("foo");
console.log(result);

export default redisClient;
