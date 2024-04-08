import React, { useState } from 'react';

interface CurrencySelectorProps {
  onCurrencyChange: (currency: string) => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ onCurrencyChange }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('HKD');

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const currency = event.target.value;
    setSelectedCurrency(currency);
    onCurrencyChange(currency);
  };

  return (
    <div className="relative inline-block text-left">
      <div className="origin-top-right w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
        <select
          value={selectedCurrency}
          onChange={handleCurrencyChange}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="HKD">HKD</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="JPY">JPY</option>
          <option value="GBP">GBP</option>
        </select>
      </div>
    </div>
  );
};
