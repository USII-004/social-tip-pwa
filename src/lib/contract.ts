
export interface Coin {
  denom: string;
  amount: string;
}

export interface InstantiateMsg {
  token_denom: string;
  platform_wallet: string;
}

export type ExecuteMsg = 
  | {register: { identifier: string } }
  | {transfer: { identifier: string; amount: Coin } }
  | {claim: { identifier: string } };

export type QueryMsg = 
  | { get_balance: { address: string } }
  | { get_escrow: { identifier: string } }
  | { get_account: { identifier: string } }

export interface BalanceResponse {
  balance: Coin;
}

export interface EscrowResponse {
  escrow: { sender: string; amount: Coin } | null;
}

export interface AccountResponse {
  address: string | null;
}