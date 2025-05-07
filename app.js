// app.js
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();


// Initialize Express app
const app = express();
app.use(express.json());

// Initialize Sequelize with MySQL connection
const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASS,{
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
});


// Define a model
const Book = sequelize.define('Book', {
  title: DataTypes.STRING,
  author: DataTypes.STRING
});

// Sync the model with the database
(async () => {
  await sequelize.sync();
  console.log('Database synchronized');
})();

// Create a new book
app.post('/books', async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a book by ID
app.get('/books/:id', async (req, res) => {
    try {
      const book = await Book.findByPk(req.params.id);
      if (book) {
        res.json(book);
      } else {
        res.status(404).send('Book not found');
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Update a book
app.put('/books/:id', async (req, res) => {
  try {
    const [updatedRows] = await Book.update(req.body, {
      where: { id: req.params.id }
    });
    if (updatedRows > 0) {
      const updatedBook = await Book.findByPk(req.params.id);
      res.json(updatedBook);
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a book
app.delete('/books/:id', async (req, res) => {
  try {
    const deletedRows = await Book.destroy({
      where: { id: req.params.id }
    });
    if (deletedRows > 0) {
      res.status(204).send();
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});