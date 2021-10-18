const menu = require('./helpers/menu');
const fs = require('fs');
const { Books } = require('./models/books');
const listado_libros = new Books();
let result;

async function main() {
    fs.readFile('books.json', (err, data) => {
        if (err) return;
        listado_libros.read(JSON.parse(data));
    });
    while (result !== 0) {
        result = await menu(listado_libros);
        fs.writeFileSync('books.json', JSON.stringify(listado_libros));
    }
}

main();
