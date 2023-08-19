export interface ChainInfo {
  id: string;
  name: string;
  chain: string;
  chainId: number;
  rpc: string[];
  icon: string;
  nativeCurrency: {
    decimals: number;
    name: string;
    symbol: string;
  };
  explorers: Explorer[];
  status: any;
  faucets: any[];
}

export interface Explorer {
  url: string;
  name: string;
  standard: string;
}
