const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    port: process.env.PORT || 5000,
    db: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    maxUploadSize: process.env.MAX_UPLOAD_SIZE,
  };