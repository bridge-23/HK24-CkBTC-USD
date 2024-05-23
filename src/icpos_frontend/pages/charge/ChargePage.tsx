import { useEffect, useState } from "react";
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
import { icpos } from '../../../declarations/icpos';

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
  const [currency, setCurrency] = useState<string>("USD");
  const [ckBTCAmount, setCkBTCAmount] = useState<string>("0");

  const debouncedAmount = useDebounce(amount, 500);

  useEffect(() => {
    const updateIcpAmount = async () => {
      if (debouncedAmount === "0") {
        setCkBTCAmount("0");
        return;
      }

      const rate = await fetchCurrencyRate();
      if (rate) {
        const convertedAmount = parseFloat(debouncedAmount) / rate;
        setCkBTCAmount(convertedAmount.toString());
      } else {
        console.error("Can't get exchange rate.");
      }
    };

    updateIcpAmount();
  }, [debouncedAmount]);

  async function fetchCurrencyRate() {
    try {
      const rate = await icpos.get_icp_usd_exchange();
      return parseFloat(rate);
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
            <div>ckBTC: {ckBTCAmount}</div>
            <div className="flex-grow" />
            <KeyPad onKey={handleKey} />
            <ChargeButton amount={ckBTCAmount} />
          </div>
        </MainSection>
      </div>
    </Page>
  );
}
