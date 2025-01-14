require("dotenv").config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (fileBuffer, bucketName, key) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: "application/octet-stream", // Optional: Set content type
  };

  try {
    const result = await s3.send(new PutObjectCommand(params));
    console.log(`File uploaded successfully: ${key}`);
    return { Location: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}` };
  } catch (error) {
    console.error("Error uploading file:", error.message);
    throw error;
  }
};

module.exports = { uploadToS3 };
