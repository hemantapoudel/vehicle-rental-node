import "dotenv/config";

export default {
    PORT: parseInt(process.env.PORT as string, 10) || 8080,
    AAKASH_AUTH: process.env.AAKASH_AUTH || "",
    JWT_SECRET: "supersecretjwtsecret",
    UPLOADS: process.env.UPLOADS || "http://localhost:8080/uploads/"
};
