const request = require('supertest');
const app = require('../server');

describe('Books API', () => {
    describe('GET /api/books', () => {
        test('should return all books', async () => {
            const response = await request(app).get('/api/books');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        test('should return books with correct properties', async () => {
            const response = await request(app).get('/api/books');

            expect(response.status).toBe(200);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('title');
            expect(response.body[0]).toHaveProperty('author');
            expect(response.body[0]).toHaveProperty('genre');
            expect(response.body[0]).toHaveProperty('copiesAvailable');
        });
    });

    describe('GET /api/books/:id', () => {
        test('should return book by ID', async () => {
            const response = await request(app).get('/api/books/1');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', 1);
            expect(response.body).toHaveProperty('title');
            expect(response.body).toHaveProperty('author');
        });

        test('should return specific book details', async () => {
            const response = await request(app).get('/api/books/1');

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(1);
            expect(response.body.title).toBe('The Great Gatsby');
            expect(response.body.author).toBe('F. Scott Fitzgerald');
        });

        test('should return 404 for non-existent book ID', async () => {
            const response = await request(app).get('/api/books/999');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Book not found');
        });
    });

    describe('POST /api/books', () => {
        test('should create a new book', async () => {
            const newBook = {
                title: "The Catcher in the Rye",
                author: "J.D. Salinger",
                genre: "Fiction",
                copiesAvailable: 4
            };

            const response = await request(app)
                .post('/api/books')
                .send(newBook);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('The Catcher in the Rye');
            expect(response.body.author).toBe('J.D. Salinger');
            expect(response.body.genre).toBe('Fiction');
            expect(response.body.copiesAvailable).toBe(4);
        });

        test('should create another new book with incremented ID', async () => {
            const newBook = {
                title: "Brave New World",
                author: "Aldous Huxley",
                genre: "Dystopian Fiction",
                copiesAvailable: 6
            };

            const response = await request(app)
                .post('/api/books')
                .send(newBook);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('Brave New World');
        });
    });

    describe('PUT /api/books/:id', () => {
        test('should update existing book', async () => {
            const updatedBook = {
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                genre: "Classic Fiction",
                copiesAvailable: 10
            };

            const response = await request(app)
                .put('/api/books/1')
                .send(updatedBook);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(1);
            expect(response.body.genre).toBe('Classic Fiction');
            expect(response.body.copiesAvailable).toBe(10);
        });

        test('should update all fields of a book', async () => {
            const updatedBook = {
                title: "To Kill a Mockingbird - Updated",
                author: "Harper Lee",
                genre: "Classic Literature",
                copiesAvailable: 8
            };

            const response = await request(app)
                .put('/api/books/2')
                .send(updatedBook);

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('To Kill a Mockingbird - Updated');
            expect(response.body.genre).toBe('Classic Literature');
            expect(response.body.copiesAvailable).toBe(8);
        });

        test('should return 404 when updating non-existent book', async () => {
            const updatedBook = {
                title: "Non-existent Book",
                author: "Unknown Author",
                genre: "Mystery",
                copiesAvailable: 1
            };

            const response = await request(app)
                .put('/api/books/999')
                .send(updatedBook);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Book not found');
        });
    });

    describe('DELETE /api/books/:id', () => {
        test('should delete existing book', async () => {
            const response = await request(app).delete('/api/books/3');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Book deleted successfully');
            expect(response.body).toHaveProperty('book');
            expect(response.body.book).toHaveProperty('id', 3);
        });

        test('should return deleted book details', async () => {
            const response = await request(app).delete('/api/books/2');

            expect(response.status).toBe(200);
            expect(response.body.book).toHaveProperty('id', 2);
            expect(response.body.book).toHaveProperty('title');
        });

        test('should return 404 when deleting non-existent book', async () => {
            const response = await request(app).delete('/api/books/999');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Book not found');
        });
    });

    describe('Full CRUD workflow', () => {
        test('should create, read, update, and delete a book', async () => {
            const newBook = {
                title: "Animal Farm",
                author: "George Orwell",
                genre: "Political Satire",
                copiesAvailable: 12
            };

            const createResponse = await request(app)
                .post('/api/books')
                .send(newBook);

            expect(createResponse.status).toBe(201);
            expect(createResponse.body.title).toBe("Animal Farm");
            const createdId = createResponse.body.id;

            const readResponse = await request(app).get(`/api/books/${createdId}`);
            expect(readResponse.status).toBe(200);
            expect(readResponse.body.id).toBe(createdId);

            const updatedBook = {
                title: "Animal Farm",
                author: "George Orwell",
                genre: "Political Satire",
                copiesAvailable: 15
            };

            const updateResponse = await request(app)
                .put(`/api/books/${createdId}`)
                .send(updatedBook);

            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body.copiesAvailable).toBe(15);

            const deleteResponse = await request(app).delete(`/api/books/${createdId}`);
            expect(deleteResponse.status).toBe(200);
            expect(deleteResponse.body.message).toBe('Book deleted successfully');
            
        });
    });
});