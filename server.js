const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

let books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        copiesAvailable: 5
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        copiesAvailable: 3
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian Fiction",
        copiesAvailable: 7
    }
];

/* Create your REST API here with the following endpoints:
    'GET /api/books': 'Get all books',
    'GET /api/books/:id': 'Get a specific book',
    'POST /api/books': 'Add a new book',
    'PUT /api/books/:id': 'Update a book',
    'DELETE /api/books/:id': 'Delete a book'
*/

app.get('/api/books', (req, res) => {
    res.json(books);
});

app.get('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);

    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

app.post('/api/books', (req, res) => {
    const { title, author, genre, copiesAvailable } = req.body;
    
    const newBook = {
        id: books.length + 1,
        title,
        author,
        genre,
        copiesAvailable
    };
    
    books.push(newBook);
    res.status(201).json(newBook);
});

app.put('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const { title, author, genre, copiesAvailable } = req.body;
    
    const bookIndex = books.findIndex(b => b.id === bookId);
    
    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }
    
    books[bookIndex] = { id: bookId, title, author, genre, copiesAvailable };
    res.json(books[bookIndex]);
});

app.delete('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);
    
    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }
    
    const deletedBook = books.splice(bookIndex, 1)[0];
    res.json({ message: 'Book deleted successfully', book: deletedBook });
});

module.exports = app;

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Books API server running at http://localhost:${port}`);
    });
}