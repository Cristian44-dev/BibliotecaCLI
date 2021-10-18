require('colors')
const inquirer = require('inquirer')
const { Book } = require('../models/books')
const { v4: uuidv4 } = require('uuid')
const questionsMain = () => {
    return inquirer.prompt([
        {
            type: 'list',
            message: 'Selecciona un opción',
            name: 'option',
            pageSize: 8,
            choices: [
                {
                    name: 'Comenzar Libro',
                    value: 1,
                },
                {
                    name: 'Agregar/Eliminar Frase',
                    value: 2,
                },
                {
                    name: 'Agregar/Eliminar Palabra',
                    value: 3,
                },
                {
                    name: 'Revisar Libro',
                    value: 4,
                },
                {
                    name: 'Terminar Libro',
                    value: 5,
                },
                {
                    name: 'Eliminar Libro',
                    value: 6,
                },
                {
                    name: 'Lista de Libros',
                    value: 7,
                },
                {
                    name: 'Salir'.red,
                    value: 0,
                },
            ],
        },
    ])
}

const question_one = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Nombre del libro',
        },
        {
            type: 'input',
            name: 'author',
            message: 'Nombre del autor',
        },
    ])
}

const question_two = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'sentence',
            message: 'Ingrese Frase a guardar',
        },
        {
            type: 'input',
            name: 'page',
            message: 'Ingrese Página',
        },
    ])
}

const question_three = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'word',
            message: 'Ingrese Palabra',
        },
        {
            type: 'input',
            name: 'definition',
            message: 'Ingrese Definición',
        },
    ])
}

const question_four = (book) => {
    let estado = `Libro Sin terminar`.red
    if (book.state) {
        estado = 'Libro Terminado'.green
    }
    return inquirer.prompt([
        {
            type: 'list',
            name: 'rev',
            message: 'Seleccione una opción',
            suffix: ` ${estado.bold}`,
            choices: [
                {
                    name: 'Revisar Frases',
                    value: 1,
                },
                {
                    name: 'Revisar Palabras',
                    value: 2,
                },
                new inquirer.Separator(),
                {
                    name: 'Volver a menú'.red,
                    value: 0,
                },
            ],
        },
    ])
}

const question_five = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'opinion',
            message: 'Opinion Final',
        },
    ])
}

const addRemove = () => {
    return inquirer.prompt([
        {
            type: 'list',
            message: 'Selecciona una opción',
            name: 'confirm',
            choices: [
                {
                    name: 'Agregar',
                    value: 1,
                },
                {
                    name: 'Eliminar',
                    value: 2,
                },
                new inquirer.Separator(),
                {
                    name: 'Volver a menú'.red,
                    value: 0,
                },
            ],
        },
    ])
}

const list_books = (listado_libros, estado = false) => {
    let books = listado_libros.listado.map((i_libro) => {
        return {
            name: `${i_libro.title} (${
                i_libro.state ? 'Terminado'.green : 'Sin terminar'.red
            })`,
            value: i_libro.id,
            state: i_libro.state,
        }
    })
    if (estado) books = books.filter((i_libro) => !i_libro.state)
    books.push(new inquirer.Separator(), {
        name: 'Volver a menú'.red,
        value: 0,
    })
    return inquirer.prompt([
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione Libro',
            choices: books,
        },
    ])
}

const list_sentences = (sentences) => {
    const locution = sentences.map((i_sentence) => {
        return {
            name: i_sentence.sentence,
            value: i_sentence.id,
        }
    })

    locution.push(new inquirer.Separator(), {
        name: 'Volver a menú'.red,
        value: 0,
    })

    return inquirer.prompt([
        {
            type: 'list',
            name: 'sentence',
            message: 'Seleccione Frase',
            choices: locution,
        },
    ])
}

const list_words = (words) => {
    const term = words.map((i_word) => {
        return {
            name: i_word.word,
            value: i_word.id,
        }
    })

    term.push(new inquirer.Separator(), {
        name: 'Volver a menú'.red,
        value: 0,
    })

    return inquirer.prompt([
        {
            type: 'list',
            name: 'word',
            message: 'Seleccione Palabra',
            choices: term,
        },
    ])
}

const rev_sentences = (sentences) => {
    const locution = sentences.map((i_sentence) => {
        return {
            name: `${i_sentence.sentence} (página ${i_sentence.page})`,
            value: '',
        }
    })

    locution.push(new inquirer.Separator(), {
        name: 'Volver a menú'.red,
        value: 0,
    })

    return inquirer.prompt([
        {
            type: 'list',
            name: 'frases',
            message: 'Presione Enter para continuar',
            choices: locution,
        },
    ])
}

const rev_words = (words) => {
    const term = words.map((i_word) => {
        return {
            name: `${i_word.word}: ${i_word.definition}`,
            value: '',
        }
    })

    term.push(new inquirer.Separator(), {
        name: 'Volver a menú'.red,
        value: 0,
    })

    return inquirer.prompt([
        {
            type: 'list',
            name: 'palabra',
            message: 'Presione Enter para continuar',
            choices: term,
        },
    ])
}

const questionConfirm = () => {
    return inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmacion',
            message: '¿Está seguro de eliminar este libro?',
        },
    ])
}

async function menu(listado_libros) {
    console.clear() //Limpiamos la consola

    console.log('> BIBLIOTECA DE LIBROS \n'.blue)

    const { option } = await questionsMain()

    const actionFunction = {
        1: async function () {
            const { title, author } = await question_one()
            if (title === '' || author === '') return
            const new_boook = new Book(title, author, uuidv4())
            listado_libros.setBook(new_boook)
        },
        2: async function () {
            const { id } = await list_books(listado_libros)
            if (id === 0) return
            const { confirm } = await addRemove()
            const list = {
                1: async function () {
                    const { sentence, page } = await question_two()
                    listado_libros.setSentence(sentence, page, id)
                },
                2: async function () {
                    const sentences = listado_libros.getSentences(id)
                    const { sentence } = await list_sentences(sentences)
                    listado_libros.sentenceRemove(id, sentence)
                },
                0: async function () {
                    return
                },
            }
            await list[confirm]()
        },
        3: async function () {
            const { id } = await list_books(listado_libros)
            if (id === 0) return
            const { confirm } = await addRemove()
            const list = {
                1: async function () {
                    const { word, definition } = await question_three()
                    listado_libros.setWord(word, definition, id)
                },
                2: async function () {
                    const words = listado_libros.getWords(id)
                    const { word } = await list_words(words)
                    listado_libros.wordRemove(id, word)
                },
                0: async function () {
                    return
                },
            }
            await list[confirm]()
        },
        4: async function () {
            const { id } = await list_books(listado_libros)
            if (id === 0) return
            const { rev } = await question_four(listado_libros.bookFilter(id))
            const list = {
                1: async function () {
                    const sentences = listado_libros.getSentences(id)
                    await rev_sentences(sentences)
                },
                2: async function () {
                    const words = listado_libros.getWords(id)
                    await rev_words(words)
                },
                0: async function () {
                    return
                },
            }
            await list[rev]()
        },
        5: async function () {
            const { id } = await list_books(listado_libros, true)
            if (id === 0) return
            const book = listado_libros.bookFilter(id)
            const { opinion } = await question_five()
            book.state = true
            book.opinion = opinion
        },
        6: async function () {
            const { id } = await list_books(listado_libros)
            if (id === 0) return
            const { confirmacion } = await questionConfirm()
            confirmacion ? listado_libros.bookRemove(id) : null
        },
        7: async function () {
            await list_books(listado_libros)
        },
        0: function () {
            return 0
        },
    }
    return await actionFunction[option]()
}

module.exports = menu
