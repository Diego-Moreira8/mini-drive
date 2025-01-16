require("dotenv").config();
const express = require("express");

const app = express();

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on http://localhost:${listener.address().port}/`);
});
