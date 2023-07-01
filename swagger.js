const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./index.js"]; // Đường dẫn đến file chứa mã nguồn của API của bạn

swaggerAutogen(outputFile, endpointsFiles);
