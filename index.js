require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
});
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger_output.json");

const app = express();
app.use(bodyParser.json());

// Cấu hình Swagger
swaggerDocument.host = process.env.HOST;
swaggerDocument.schemes = process.env.SCHEMES;
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Định nghĩa route API
app.post("/notes", async (req, res) => {
  try {
    const note = req.body.note;
    const result = await admin.firestore().collection("notes").add({ note });
    res.status(201).json({ id: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi lưu trữ ghi chú." });
  }
});

app.put("/notes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const note = req.body.note;
    const docRef = admin.firestore().collection("notes").doc(id);
    await docRef.update({ note });
    res.status(200).json({ message: "Ghi chú đã được cập nhật thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi cập nhật ghi chú." });
  }
});

app.get("/notes", async (req, res) => {
  try {
    const notes = [];
    const snapshot = await admin.firestore().collection("notes").get();
    snapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json({ notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi đọc ghi chú." });
  }
});

// Khởi động server trên cổng 3000
app.listen(3000, () => {
  console.log("Server đã được khởi động trên cổng 3000");
});
