"use client";

import { ethers } from "ethers";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { connectWallet } from "@/lib/web3";

type WalletContextValue = {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
useEffect(() => {
  async function checkConnection() {
    const ethereum = window.ethereum;

    if (!ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const accounts = await provider.send("eth_accounts", []);

      if (accounts.length > 0) {
        setAddress(accounts[0]);
      } else {
        setAddress(null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  checkConnection();

  const ethereum = window.ethereum;

if (!ethereum) return;

 function handleAccountsChanged(accounts: unknown) {
  const accountList = Array.isArray(accounts)
    ? (accounts as string[])
    : [];

  if (accountList.length === 0) {
    setAddress(null);
  } else {
    setAddress(accountList[0]);
  }
}

 if ("on" in ethereum) {
  (ethereum as any).on(
    "accountsChanged",
    handleAccountsChanged
  );
}
  return () => {
  if ("removeListener" in ethereum) {
    (ethereum as any).removeListener(
      "accountsChanged",
      handleAccountsChanged
    );
  }
};
}, []);

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);

      const { address } = await connectWallet();

      setAddress(address);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    // MetaMask cannot be disconnected programmatically.
    // We simply clear the UI state.
    setAddress(null);
  }, []);

  const value = useMemo(
    () => ({
      address,
      isConnected: Boolean(address),
      isConnecting,
      connect,
      disconnect,
    }),
    [address, isConnecting, connect, disconnect]
  );

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }

  return context;
}