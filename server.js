const express = require('express');
const app = express();

// Postavljanje EJS kao view engine
app.set('view engine', 'ejs');

// Test ruta
app.get('/', (req, res) => {
    res.render('index'); // prikazuje views/index.ejs
});

// Pokretanje servera
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on 3000 `);
});
