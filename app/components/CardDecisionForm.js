'use client'; 

import React, { useState } from 'react';
import axios from 'axios';


const CardDecisionForm = () => {


  const [category, setCategory] = useState('');
  const [bestCard, setBestCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      setError('Please select a category');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/card-decision', { category });
      const { bestCard, multiplier, transferRate } = response.data;
      setBestCard({ name: bestCard, multiplier, transferRate });
    } catch (error) {
      setError('Failed to get the best card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      
      <h1 className="text-2xl mb-4">Which Card to Use?</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label htmlFor="category" className="block">Select a Category:</label>

          <select
            id="category"
            value={category}
            onChange={handleCategoryChange}
            className="border p-2"
          >
        
            <option value="">--Choose a Category--</option>
            <option value="Dining">Dining</option>
            <option value="ForeignCurrency">Foreign Currency</option>
            <option value="EWalletTopup">E-Wallet Topup</option>
            <option value="OnlineSpending">Online Spending</option>

          </select>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded"
        >

          {loading ? 'Loading...' : 'Get Best Card'}

        </button>

      </form>


      {error && <div className="text-red-500">{error}</div>}

      {bestCard && (
        <div className="mt-4">
          <h2 className="text-lg">Best Card for {category}:</h2>
          <p><strong>Card Name:</strong> {bestCard.name}</p>
          <p><strong>Multiplier:</strong> {bestCard.multiplier}x</p>
          <p><strong>Transfer Rate:</strong> {bestCard.transferRate}</p>
        </div>
      )}
    </div>
  );
};



export default CardDecisionForm;
