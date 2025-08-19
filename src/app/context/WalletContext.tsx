"use client"

import  { createContext, useContext, useEffect, useState } from "react";
import { 
  Abstraxion,
  useAbstraxionAccount,
  useAbstraxionSigningClient,
  useAbstraxionClient,
  useModal
} from "@burnt-labs/abstraxion";
import "@burnt-labs/ui/dist/index.css";

interface WalletContextType {
  address: string | null;
  balance: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  client: any | null;  // abstraxion cosmWasm client is not exported use any
  queryClient: any | null;
  toDisplayXion: (amount: string) => string;
  executeContract: (contractAddr: string, msg: Record<string, any>, funds?: {denom: string, amount: string}[]) => Promise<any>;
  queryContract: (contractAddr: string, msg: Record<string, any>) => Promise<any>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: account } = useAbstraxionAccount();
  const { client, logout } = useAbstraxionSigningClient();
  const { client: queryClient } = useAbstraxionClient();

  const [ address, setAddress ] = useState<string | null>(null);
  const [ balance, setBalance ] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useModal();

  const modalReturn = useModal();
  console.log('useModal() returns:', modalReturn);

  // convert micro xion ("uxion") to readable XION
  const toDisplayXion = (amount: string) => {
    return (Number(amount) / 1_000_000).toFixed(6) + "XION";
  };

  
  // loads balance whenever account changes
  useEffect(() => {
    if (account?.bech32Address) {
      setAddress(account.bech32Address);
      fetchBalance(account.bech32Address);
    } else {
      setAddress(null);
      setBalance(null)
    }
  }, [account, queryClient]);

  const connectWallet = async () => {
    console.log("wallet connection initiated")
    setModalOpen(true); // Opens abstraxion modal for email/Google/Passkey login
  };

  const disconnectWallet = () => {
    logout?.(); // only call logout if not undefined
    setAddress(null);
    setBalance(null);
  };

  const fetchBalance = async (address: string) => {
    if (!queryClient) return;
    try {
      const balance = await queryClient.getBalance(address, "uxion");
      setBalance(`${balance.amount}uxion`);
    } catch (error) {
      console.error("Error fetching Balance:", error);
      setBalance("Error fetching Balance")
    }
  };

  // Execute smart contract transaction
  const executeContract = async (contractAddr: string, msg: Record<string, any>, funds: { denom: string, amount: string }[] = []) => {
    if (!client || !address) throw new Error("Wallet not connected");
    try {
      const result = await client.execute(
        address,
        contractAddr,
        msg,
        "auto",
        "",
        funds
      );
      console.log("Execute success:", result);
      await fetchBalance(address);
      return result;
    } catch (error) {
      console.error("Execute error:", error);
      throw error;
    }
  };

  // Query smart contract
  const queryContract = async (contractAddr: string, msg: Record<string, any>) => {
    if (!queryClient) throw new Error("Query client not ready");
    try {
      const res = await queryClient.queryContractSmart(contractAddr, msg);
      console.log("Query result:", res);
      return res;
    } catch (error) {
      console.error("Query error", error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider 
      value={{ 
        address,
        balance,
        connectWallet,
        disconnectWallet,
        client,
        queryClient,
        toDisplayXion,
        executeContract,
        queryContract,
      }}>
      <Abstraxion onClose={() => setModalOpen(false)} />
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  };
  return context;
};