function TransactionDetails({ transaction, onClose, onDispute }) {
  if (!transaction) {
    return null;
  }

  return (
    <div className="details-panel">
      <h2>Transaction Details</h2>

      <p>
        <strong>ID:</strong> {transaction.id}
      </p>

      <p>
        <strong>Date:</strong> {transaction.date}
      </p>

      <p>
        <strong>Description:</strong> {transaction.description}
      </p>

      <p>
        <strong>Category:</strong> {transaction.category}
      </p>

      <p>
        <strong>Amount:</strong> UGX {transaction.amount.toLocaleString()}
      </p>

      <p>
        <strong>Status:</strong> {transaction.status}
      </p>

      <p>
        <strong>Merchant:</strong> {transaction.merchant}
      </p>

      <p>
        <strong>Account:</strong> {transaction.account}
      </p>

      <button onClick={onDispute}>
        Dispute Charge
      </button>

      <button onClick={onClose}>
        Close
      </button>
    </div>
  );
}

export default TransactionDetails;