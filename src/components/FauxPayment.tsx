import React, { useState } from 'react';

const FAUX_WALLET_ADDRESS = 'tyb74bi748dnnk982nks'; // Replace with your actual wallet address

const FauxPayment: React.FC<{ amount: number }> = ({ amount }) => {
  const [message, setMessage] = useState<string>('');

  const handlePayment = () => {
    if (amount) {
      setMessage(`Please send ${amount} SOL to the following wallet address: ${FAUX_WALLET_ADDRESS}`);
    } else {
      setMessage('Please enter a valid amount.');
    }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-lg font-bold">Faux Payment</h2>
      <button
        onClick={handlePayment}
        className="mt-2 bg-blue-500 text-white rounded p-2"
      >
        Initiate Faux Payment
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default FauxPayment;
