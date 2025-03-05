const express = require('express');
const { createDoc, getDocs, deleteDoc, updateDoc, getSingleDocs } = require('./docs.controller');
const router = express.Router();

// Get all documents for a specific user
router.get('/:userId', getDocs);

// Get all documents for a specific user
router.get('/single/:docsId', getSingleDocs);

// Create a new document
router.post('/createdoc', createDoc);

// Update a document
router.put('/:userId/:docId', updateDoc);

// Delete a document
router.delete('/:userId/:docId', deleteDoc);

module.exports = router;
