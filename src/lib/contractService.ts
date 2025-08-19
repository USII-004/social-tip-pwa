import { ExecuteMsg, QueryMsg, BalanceResponse, EscrowResponse, AccountResponse, Coin } from "./contract";

export class contractService {
  private client: any //Abstraxion cosmWasm client is not exported use any
  private contractAddress: string;
  private address: string;

  constructor(client: any, contractAddress: string, address: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.address = address;
  }

  async register(identifier: string) {
    const msg: ExecuteMsg = { register: { identifier } };
    return await this.client.execute(
      this.address,
      this.contractAddress,
      msg,
      { gas: "auto", treasury: process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS }, // Use treasury for gasless register
      "Register identifier"
    );
  }

  async transfer(identifier: string, amount: string, denom: string = "uxion") {
    if (parseInt(amount) < 100) {
      throw new Error("Amount too small to cover platform fee");
    }
    const msg: ExecuteMsg = {
      transfer: { identifier, amount: { denom, amount } },
    };
    return await this.client.execute(
      this.address,
      this.contractAddress,
      msg,
      "auto",
      "Transfer tokens",
      [{ denom, amount }]
    );
  }

  async claim(identifier: string) {
    const msg: ExecuteMsg = { claim: { identifier } };
    return await this.client.execute(
      this.address,
      this.contractAddress,
      msg,
      { gas: "auto", treasury: process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS }, // Use treasury for gasless claim
      "Claim escrow tokens"
    );
  }

  async getBalance(address: string): Promise<BalanceResponse> {
    const msg: QueryMsg = { get_balance: { address } };
    return await this.client.queryContractSmart(this.contractAddress, msg);
  }

  async getEscrow(identifier: string): Promise<EscrowResponse> {
    const msg: QueryMsg = { get_escrow: { identifier } };
    return await this.client.queryContractSmart(this.contractAddress, msg);
  }

  async getAccount(identifier: string): Promise<AccountResponse> {
    const msg: QueryMsg = { get_account: { identifier } };
    return await this.client.queryContractSmart(this.contractAddress, msg);
  }
}