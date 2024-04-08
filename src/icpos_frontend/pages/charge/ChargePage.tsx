import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import HeaderSection from "../../components/HeaderSection";
import { Link } from "@tanstack/router";
import MainSection from "../../components/MainSection";
import Page from "../../components/Page";
import { X } from "lucide-react";
import { KeyPad } from "./components/KeyPad";
import { Key } from "./types/key.type";
import ChargeButton from "./components/ChargeButton";
import { CurrencySelector } from "../../pages/charge/components/CurrencySelector";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ChargePage() {
  const [amount, setAmount] = useState<string>("0");
  const [currency, setCurrency] = useState<string>("HKD");
  const [icpAmount, setIcpAmount] = useState<string>("0");

  const debouncedAmount = useDebounce(amount, 500); // Добавляем дебаунсинг для amount

  useEffect(() => {
    const updateIcpAmount = async () => {
      if (debouncedAmount === "0") {
        setIcpAmount("0");
        return;
      }

      const rate = await fetchCurrencyRate(currency);
      if (rate) {
        const convertedAmount = parseFloat(debouncedAmount) * rate;
        setIcpAmount(convertedAmount.toString());
      } else {
        console.error("Can't get exchange rate.");
      }
    };

    updateIcpAmount();
  }, [debouncedAmount, currency]);

  async function fetchCurrencyRate(currency: string) {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=${currency.toLowerCase()}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data['internet-computer'][currency.toLowerCase()];
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      return null;
    }
  }

  const handleCurrencyChange = (selectedCurrency: string) => {
    setCurrency(selectedCurrency);
  };

  const handleKey = (key: Key) => {
    let newValue = amount;
    switch (key) {
      case "decimal":
        newValue += amount.includes(".") ? "" : ".";
        break;
      case "backspace":
        newValue = amount.slice(0, -1) || "0";
        break;
      default:
        newValue = amount === "0" ? key : amount + key;
        break;
    }
    setAmount(newValue);
  };

  return (
    <Page>
      <div className="relative flex flex-col grow">
        <HeaderSection>
          <Link to="/merchant">
            <Button variant="ghost" size="icon">
              <X className="w-4 h-4" />
            </Button>
          </Link>
          Charge
        </HeaderSection>
        <div className="flex flex-col flex-1 items-center mt-10">
          <CurrencySelector onCurrencyChange={handleCurrencyChange} />
        </div>
        <MainSection>
          <div className="flex flex-col items-center justify-between flex-1 pt-2 pb-10 space-y-5 grow">
            <div className="text-4xl font-bold">{`${amount} ${currency}`}</div>
            <div>ICP: {icpAmount}</div>
            <div className="flex-grow" />
            <KeyPad onKey={handleKey} />
            <ChargeButton amount={icpAmount} />
          </div>
        </MainSection>
      </div>
    </Page>
  );
}
