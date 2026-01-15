// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Connect to MongoDB =====
mongoose.connect('mongodb+srv://basava84310_db_user:3D4qHCDeoT8h3C1B@cluster0.l0sfugp.mongodb.net/PocketBudget').then(()=>{
    console.log("Connected to MongoDB")
})
// ===== Transaction Schema =====
const transactionSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true, min: 0.01 },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, default: 'General' },
    createdAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// ===== API Routes =====

// Get all transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a transaction
app.post('/api/transactions', async (req, res) => {
    try {
        const { description, amount, type, category } = req.body;

        if (!description || !amount || !type) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than zero' });
        }

        const transaction = new Transaction({ description, amount, type, category });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a transaction
app.delete('/api/transactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.json({ message: 'Transaction deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ===== Start Server =====
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
