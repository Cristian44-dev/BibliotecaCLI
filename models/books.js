const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
class Book {
    constructor(title, author, id) {
        this.title = title
        this.author = author
        this.id = id
        this.senteces = []
        this.words = []
        this.state = false
        this.opinion = ''
    }
}

class Books {
    constructor() {
        this.listado = []
    }

    bookFilter(id) {
        return this.listado.filter((i_libro) => i_libro.id === id)[0]
    }

    setBook(book) {
        this.listado.push(book)
    }

    setSentence(sentence, page, id) {
        this.bookFilter(id).senteces.push({
            sentence,
            page,
            id: uuidv4(),
        })
    }
    setWord(word, definition, id) {
        this.bookFilter(id).words.push({
            word,
            definition,
            id: uuidv4(),
        })
    }

    // Metodo para actualizar el listado desde la base de datos al iniciar la CLI
    read({ listado: books }) {
        books.forEach((i_book) => {
            this.listado.push(i_book)
        })
    }

    // Metodo que devuelve todas las frases
    getSentences(id) {
        const book = this.bookFilter(id)
        return book.senteces
    }
    // Metodo para eliminar una frase
    sentenceRemove(idBook, idSentence) {
        const book = this.bookFilter(idBook)
        const sentences = book.senteces
        const sentence = sentences.findIndex(
            (i_sentence) => i_sentence.id === idSentence
        )
        book.senteces.splice(sentence, 1)
    }

    //Metodo que devuelve todas las palabras
    getWords(id) {
        const book = this.bookFilter(id)
        return book.words
    }

    //Metodo que elimina una palabra
    wordRemove(idBook, idWord) {
        const book = this.bookFilter(idBook)
        const words = book.words
        const word = words.findIndex((i_word) => i_word.id === idWord)
        book.words.splice(word, 1)
    }

    // Metodo para eliminar un libro
    bookRemove(id) {
        const bookIndex = this.listado.findIndex((i_book) => i_book.id === id)
        this.listado.splice(bookIndex, 1)
    }
}

module.exports = {
    Books,
    Book,
}
