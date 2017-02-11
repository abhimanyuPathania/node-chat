const path = require('path');
const express = require('express');


const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname + '/../public');
// console.log(publicPath);

var app = express();
app.use(express.static(publicPath));


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});