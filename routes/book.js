const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const User = require('../models/user');
const { authenticateToken } = require('./userAuth');

// Add Book
router.post('/add-book', authenticateToken, async (req, res) => {
  try {
     const { url, title, author, price, desc, language } = req.body;
     if (!url || !title || !author) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }
    const book = new Book({ url, title, author, price, desc, language });
    await book.save();
    return res.status(201).json({ message: 'Book added successfully', book });
  } catch (err) {
    console.error('Error adding book:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Update Book
router.post('/update-book/:id', authenticateToken, async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: admin only' });
    }
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json({ message: 'Book updated successfully', updatedBook });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete Book
router.delete('/delete-book/:id', authenticateToken, async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: admin only' });
    }
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get All Books
router.get('/get-all-books', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: books });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get Recently Added Books
router.get('/get-recent-books', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    res.status(200).json({ status: 'success', data: books });
  } catch (error) {
    console.error('Error fetching recent books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get Book by ID
router.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ status: 'not found', message: 'Book not found' });
    res.status(200).json({ status: 'success', data: book });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: 'Invalid book ID format' });
    }
    console.error('Error fetching book by ID:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

module.exports = router;
