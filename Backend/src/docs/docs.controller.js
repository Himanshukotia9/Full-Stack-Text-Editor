const Docs = require('./docs.model');

// Create a new document
const createDoc = async (req, res) => {
    try {
        const { userId, title, content } = req.body;

        // Validate request
        if (!userId || !title) {
            return res.status(400).json({ message: "User ID and Title are required." });
        }

        // Create a new document
        const newDoc = new Docs({
            title,
            content,
            uploadedBy: userId,
        });

        await newDoc.save();

        res.status(201).json({ message: "Document created successfully", doc: newDoc });
    } catch (error) {
        console.error("Error creating document:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all documents for a specific user
const getDocs = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate user ID
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const userDocs = await Docs.find({ uploadedBy: userId });

        res.status(200).json(userDocs);
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all documents for a specific user
const getSingleDocs = async (req, res) => {
    try {
        const { docsId } = req.params;

        // Validate user ID
        if (!docsId) {
            return res.status(400).json({ message: "Docs ID is required." });
        }

        const userDocs = await Docs.find({ _id: docsId });

        res.status(200).json(userDocs);
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete a document
const deleteDoc = async (req, res) => {
    try {
        const { docId, userId } = req.params;

        // Validate parameters
        if (!docId || !userId) {
            return res.status(400).json({ message: "Document ID and User ID are required." });
        }

        // Find the document
        const doc = await Docs.findById(docId);

        if (!doc) {
            return res.status(404).json({ message: "Document not found." });
        }

        // Check if the document belongs to the user
        if (doc.uploadedBy.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized: You can only delete your own documents." });
        }

        await Docs.findByIdAndDelete(docId);

        res.status(200).json({ message: "Document deleted successfully." });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// Update a document
const updateDoc = async (req, res) => {
    try {
        const { docId, userId } = req.params;
        const { content } = req.body;

        // Validate parameters
        if (!docId || !userId) {
            return res.status(400).json({ message: "Document ID and User ID are required." });
        }

        // Find the document
        const doc = await Docs.findById(docId);

        if (!doc) {
            return res.status(404).json({ message: "Document not found." });
        }

        // Check if the document belongs to the user
        if (doc.uploadedBy.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized: You can only update your own documents." });
        }

        // Update fields if provided
        if (content) doc.content = content;
        doc.lastUpdate = new Date();

        await doc.save();

        res.status(200).json({ message: "Document updated successfully.", doc });
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createDoc,
    getDocs,
    getSingleDocs,
    updateDoc,
    deleteDoc,
};
