import dotenv from "dotenv";

const result = dotenv.config();

console.log(result);
console.log("cwd:", process.cwd());
console.log("MONGO_URI:", process.env.MONGO_URI);