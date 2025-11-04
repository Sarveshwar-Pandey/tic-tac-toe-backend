require('dotenv').config();
require('./Models/db')

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./Routes/authRouter')

const PORT = process.env.PORT || 4000

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', authRouter)

app.listen(PORT, () => {
  console.log(`Server is listening at PORT ${PORT}`);
})