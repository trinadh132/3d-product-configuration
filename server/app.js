const express = require("express");
const mysql = require("mysql2");
const serverless = require("serverless-http");
const cors = require("cors");

const app = express();

// Setup CORS options
const corsOptions = {
  origin: "*", // using  '*' to allow all domains
  methods: "GET",
  allowedHeaders: ["Content-Type"], // replace with the headers you want to allow
};

// Enable CORS using the cors middleware
app.use(cors(corsOptions));
app.use(express.json());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get("/data", (req, res) => {
  pool.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: results });
  });
});

app.post("/record-colors-time", (req, res) => {
  const { meshname, color, time } = req.body;

  //  duration in milliseconds and should be stored as bigint.
  const timeBigInt = BigInt(time);

  const query = `
    INSERT INTO UserProductPartColorTime (user_id, part_name, color_name, time_spent)
    VALUES (?, ?, ?, ?);
  `;

  const values = [7028, meshname, color, timeBigInt];

  pool.query(query, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Data inserted successfully", data: results });
  });
});

module.exports.handler = serverless(app);
