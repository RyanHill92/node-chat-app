const path = require('path');
const express = require('express');

//Notice how the hop back a folder is cleared out.
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
console.log(publicPath);


const app = express();

//Must call express.static inside app.use.
app.use(express.static(publicPath));

app.listen(port, () => {
  console.log(`Server up on Port ${port}`);
});
