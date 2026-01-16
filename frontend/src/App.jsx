import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("General");
  const [search, setSearch] = useState("");
  const [warning, setWarning] = useState("");

  // ✅ LIVE BACKEND URL (Render)
  const API_URL = "https://pocketbuget-2.onrender.com/api/transactions";

  /* ================= Fetch Transactions ================= */
  const fetchTransactions = async () => {
    try {
      const res = await axios.get(API_URL);
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  /* ================= Balance Calculation ================= */
  const balance = transactions.reduce(
    (acc, t) => (t.type === "income" ? acc + t.amount : acc - t.amount),
    0
  );

  /* ================= Add Transaction ================= */
  const addTransaction = async (e) => {
    e.preventDefault();
    setWarning("");

    if (!description || amount <= 0) {
      alert("Enter valid values");
      return;
    }

    if (type === "expense" && amount > balance) {
      setWarning("Expense exceeds available balance!");
      return;
    }

    try {
      const res = await axios.post(API_URL, {
        description,
        amount: Number(amount),
        type,
        category,
      });

      setTransactions([res.data, ...transactions]);
      setDescription("");
      setAmount("");
      setCategory("General");
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  /* ================= Delete Transaction ================= */
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  /* ================= Search Filter ================= */
  const filteredTransactions = transactions.filter(
    (t) =>
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-4 text-indigo-600">
        PocketBudget
      </h1>

      <h2 className="text-xl font-semibold text-center mb-2">
        Balance:{" "}
        <span className={balance >= 0 ? "text-green-500" : "text-gray-700"}>
          ${balance.toFixed(2)}
        </span>
      </h2>

      {warning && (
        <p className="text-center text-red-500 font-medium mb-4">{warning}</p>
      )}

      {/* Add Transaction */}
      <form
        onSubmit={addTransaction}
        className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4"
      >
        <input
          className="w-full border rounded p-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          className="w-full border rounded p-2"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <select
          className="w-full border rounded p-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          className="w-full border rounded p-2"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button className="w-full bg-indigo-600 text-white py-2 rounded">
          Add Transaction
        </button>
      </form>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by description or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      {/* Transactions */}
      <ul className="space-y-3">
        {filteredTransactions.map((t) => (
          <li
            key={t._id}
            className="flex justify-between items-center p-4 bg-white rounded shadow"
          >
            <div>
              <p className="font-semibold">{t.description}</p>
              <p className="text-sm text-gray-500">
                ${t.amount} • {t.type} • {t.category}
              </p>
            </div>
            <button
              onClick={() => deleteTransaction(t._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

// import { useEffect, useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [transactions, setTransactions] = useState([]);
//   const [description, setDescription] = useState('');
//   const [amount, setAmount] = useState('');
//   const [type, setType] = useState('income');
//   const [category, setCategory] = useState('General');
//   const [search, setSearch] = useState('');
//   const [warning, setWarning] = useState('');

//   const API_URL = 'http://localhost:5000/api/transactions';

//   // Fetch transactions
//   const fetchTransactions = async () => {
//     try {
//       const res = await axios.get(API_URL);
//       setTransactions(res.data);
//     } catch (err) {
//       console.error('Error fetching transactions:', err);
//     }
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   // Calculate total balance
//   const balance = transactions.reduce(
//     (acc, t) => (t.type === 'income' ? acc + t.amount : acc - t.amount),
//     0
//   );

//   // Add transaction
//   const addTransaction = async (e) => {
//     e.preventDefault();
//     setWarning(''); // clear previous warnings

//     if (!description || amount <= 0) return alert('Enter valid values');

//     // Check if expense exceeds balance
//     if (type === 'expense' && amount > balance) {
//       setWarning('Expense exceeds available balance!');
//       return; // do NOT add the transaction
//     }

//     const date = new Date().toISOString();

//     try {
//       const res = await axios.post(API_URL, {
//         description,
//         amount,
//         type,
//         category,
//         date,
//       });

//       setTransactions([res.data, ...transactions]);
//       setDescription('');
//       setAmount('');
//       setCategory('General');
//     } catch (err) {
//       console.error('Error adding transaction:', err);
//     }
//   };

//   // Delete transaction
//   const deleteTransaction = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/${id}`);
//       setTransactions(transactions.filter((t) => t._id !== id));
//     } catch (err) {
//       console.error('Error deleting transaction:', err);
//     }
//   };

//   // Filtered transactions based on search
//   const filteredTransactions = transactions.filter(
//     (t) =>
//       t.description.toLowerCase().includes(search.toLowerCase()) ||
//       t.category.toLowerCase().includes(search.toLowerCase())
//   );

//   // Format date nicely
//   const formatDate = (isoString) => {
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//     };
//     return new Date(isoString).toLocaleString(undefined, options);
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold text-center mb-4 text-indigo-600">
//         PocketBudget
//       </h1>

//       {/* Balance Display */}
//       <h2 className="text-xl font-semibold text-center mb-2">
//         Balance:{' '}
//         <span className={balance >= 0 ? 'text-green-500' : 'text-gray-700'}>
//           ${balance.toFixed(2)}
//         </span>
//       </h2>

//       {/* Warning */}
//       {warning && (
//         <p className="text-center text-red-500 font-medium mb-4">{warning}</p>
//       )}

//       {/* Add Transaction Form */}
//       <form
//         onSubmit={addTransaction}
//         className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4"
//       >
//         <input
//           className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />
//         <input
//           type="number"
//           className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           placeholder="Amount"
//           value={amount}
//           onChange={(e) => setAmount(Number(e.target.value))}
//         />
//         <select
//           className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//         >
//           <option value="income">Income</option>
//           <option value="expense">Expense</option>
//         </select>
//         <input
//           className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           placeholder="Category"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//         />
//         <button
//           type="submit"
//           className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
//         >
//           Add Transaction
//         </button>
//       </form>

//       {/* Search */}
//       <input
//         type="text"
//         placeholder="Search by description or category..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full mb-4 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//       />

//       {/* Transactions List */}
//       <ul className="space-y-3">
//         {filteredTransactions.map((t) => (
//           <li
//             key={t._id}
//             className="flex justify-between items-center p-4 bg-white rounded shadow hover:shadow-md transition"
//           >
//             <div>
//               <p className="font-semibold">{t.description}</p>
//               <p className="text-sm text-gray-500">
//                 ${t.amount} • {t.type} • {t.category}
//               </p>
//               {t.date && (
//                 <p className="text-xs text-gray-400">{formatDate(t.date)}</p>
//               )}
//             </div>
//             <button
//               onClick={() => deleteTransaction(t._id)}
//               className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//             >
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;



// import { useEffect, useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [transactions, setTransactions] = useState([]);
//   const [description, setDescription] = useState('');
//   const [amount, setAmount] = useState('');
//   const [type, setType] = useState('income');
//   const [category, setCategory] = useState('General');
//   const [search, setSearch] = useState('');

//   const API_URL = 'http://localhost:5000/api/transactions';

//   // Fetch transactions
//   const fetchTransactions = async () => {
//     const res = await axios.get(API_URL);
//     setTransactions(res.data);
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   // Add transaction
//   const addTransaction = async (e) => {
//     e.preventDefault();
//     if (!description || amount <= 0) return alert('Enter valid values');

//     // Add current date and time
//     const date = new Date().toISOString();

//     const res = await axios.post(API_URL, { description, amount, type, category, date });
//     setTransactions([res.data, ...transactions]);
//     setDescription('');
//     setAmount('');
//     setCategory('General');
//   };

//   // Delete transaction
//   const deleteTransaction = async (id) => {
//     await axios.delete(`${API_URL}/${id}`);
//     setTransactions(transactions.filter((t) => t._id !== id));
//   };

//   // Calculate total balance
//   const balance = transactions.reduce(
//     (acc, t) => (t.type === 'income' ? acc + t.amount : acc - t.amount),
//     0
//   );

//   // Filtered transactions based on search
//   const filteredTransactions = transactions.filter(
//     (t) =>
//       t.description.toLowerCase().includes(search.toLowerCase()) ||
//       t.category.toLowerCase().includes(search.toLowerCase()) 
      
//   );

//   // Format date nicely
//   const formatDate = (isoString) => {
//     const options = { 
//       year: 'numeric', month: 'short', day: 'numeric', 
//       hour: '2-digit', minute: '2-digit', second: '2-digit' 
//     };
//     return new Date(isoString).toLocaleString(undefined, options);
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold text-center mb-4 text-indigo-600">PocketBudget</h1>
//       <h2 className="text-xl font-semibold text-center mb-6">
//         Balance: <span className={balance >= 0 ? 'text-green-500' : 'text-red-500'}>${balance.toFixed(2)}</span>
//       </h2>

//       {/* Add Transaction Form */}
//       <form onSubmit={addTransaction} className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4">
//         <input
//           className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />
//         <input
//           type="number"
//           className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           placeholder="Amount"
//           value={amount}
//           onChange={(e) => setAmount(Number(e.target.value))}
//         />
//         <select
//           className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//         >
//           <option value="income">Income</option>
//           <option value="expense">Expense</option>
//         </select>
//         <input
//           className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           placeholder="Category"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//         />
//         <button
//           type="submit"
//           className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
//         >
//           Add Transaction
//         </button>
//       </form>

//       {/* Search */}
//       <input
//         type="text"
//         placeholder="Search by description or category..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full mb-4 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//       />

//       {/* Transactions List */}
//       <ul className="space-y-3">
//         {filteredTransactions.map((t) => (
//           <li
//             key={t._id}
//             className="flex justify-between items-center p-4 bg-white rounded shadow hover:shadow-md transition"
//           >
//             <div>
//               <p className="font-semibold">{t.description}</p>
//               <p className="text-sm text-gray-500">
//                 ${t.amount} • {t.type} • {t.category}
//               </p>
//               {t.date && (
//                 <p className="text-xs text-gray-400">{formatDate(t.date)}</p>
//               )}
//             </div>
//             <button
//               onClick={() => deleteTransaction(t._id)}
//               className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//             >
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [transactions, setTransactions] = useState([]);
//   const [description, setDescription] = useState('');
//   const [amount, setAmount] = useState('');
//   const [type, setType] = useState('income');
//   const [category, setCategory] = useState('General');
//   const [search, setSearch] = useState('');

//   const API_URL = 'http://localhost:5000/api/transactions';

//   // Fetch transactions
//   const fetchTransactions = async () => {
//     const res = await axios.get(API_URL);
//     setTransactions(res.data);
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   // Add transaction
//   const addTransaction = async (e) => {
//     e.preventDefault();
//     if (!description || amount <= 0) return alert('Enter valid values');

//     const res = await axios.post(API_URL, { description, amount, type, category });
//     setTransactions([res.data, ...transactions]);
//     setDescription('');
//     setAmount('');
//     setCategory('General');
//   };

//   // Delete transaction
//   const deleteTransaction = async (id) => {
//     await axios.delete(`${API_URL}/${id}`);
//     setTransactions(transactions.filter(t => t._id !== id));
//   };

//   // Calculate total balance
//   const balance = transactions.reduce(
//     (acc, t) => (t.type === 'income' ? acc + t.amount : acc - t.amount),
//     0
//   );

//   // Filtered transactions based on search
//   const filteredTransactions = transactions.filter(
//     (t) =>
//       t.description.toLowerCase().includes(search.toLowerCase()) ||
//       t.category.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold text-center mb-4 text-indigo-600">PocketBudget</h1>
//       <h2 className="text-xl font-semibold text-center mb-6">
//         Balance: <span className={balance >= 0 ? 'text-green-500' : 'text-red-500'}>${balance.toFixed(2)}</span>
//       </h2>

//       {/* Add Transaction Form */}
//       <form onSubmit={addTransaction} className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4">
//         <input
//           className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />
//         <input
//           type="number"
//           className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           placeholder="Amount"
//           value={amount}
//           onChange={(e) => setAmount(Number(e.target.value))}
//         />
//         <select
//           className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//         >
//           <option value="income">Income</option>
//           <option value="expense">Expense</option>
//         </select>
//         <input
//           className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           placeholder="Category"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//         />
//         <button
//           type="submit"
//           className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
//         >
//           Add Transaction
//         </button>
//       </form>

//       {/* Search */}
//       <input
//         type="text"
//         placeholder="Search by description or category..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full mb-4 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//       />

//       {/* Transactions List */}
//       <ul className="space-y-3">
//         {filteredTransactions.map((t) => (
//           <li
//             key={t._id}
//             className="flex justify-between items-center p-4 bg-white rounded shadow hover:shadow-md transition"
//           >
//             <div>
//               <p className="font-semibold">{t.description}</p>
//               <p className="text-sm text-gray-500">
//                 ${t.amount} • {t.type} • {t.category}
//               </p>
//             </div>
//             <button
//               onClick={() => deleteTransaction(t._id)}
//               className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//             >
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
