import { useEffect, useState } from "react";
import StatusBadge from "./components/StatusBadge";
import useDebounce from "./hooks/useDebounce";
import TransactionDetails from "./components/TransactionDetails";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [hidePending, setHidePending] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const handleDispute = () => {
    if (!selectedTransaction) return;

    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === selectedTransaction.id
          ? { ...transaction, status: "Disputed" }
          : transaction
      )
    );

    setSelectedTransaction((current) => ({
      ...current,
      status: "Disputed",
    }));
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());

    const matchesCategory =
      category === "All" || transaction.category === category;

    const matchesPending =
      !hidePending || transaction.status !== "Pending";

    return matchesSearch && matchesCategory && matchesPending;
  });

  useEffect(() => {
    fetch("/transactions.json")
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
      })
      .catch((error) => {
        console.error("Failed to load transactions:", error);
      });
  }, []);

  return (
    <div>
      <h1>Checking Account Ledger</h1>

      <p>Total Transactions: {transactions.length}</p>

      <div className="controls">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
          <option value="Utilities">Utilities</option>
          <option value="Income">Income</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={hidePending}
            onChange={(e) => setHidePending(e.target.checked)}
          />
          Hide Pending
        </label>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                onClick={() => setSelectedTransaction(transaction)}
              >
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td>{transaction.category}</td>
                <td>UGX {transaction.amount.toLocaleString()}</td>
                <td>
                  <StatusBadge status={transaction.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TransactionDetails
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        onDispute={handleDispute}
      />
    </div>
  );
}

export default App;