export const ENV = {
  network: process.env.NEXT_PUBLIC_GENLAYER_NETWORK ?? "studionet",
  rpcUrl: process.env.NEXT_PUBLIC_GENLAYER_RPC_URL ?? "https://studio.genlayer.com/api",
  chainId: process.env.NEXT_PUBLIC_GENLAYER_CHAIN_ID ?? "0xf22f",
  contractAddress: process.env.NEXT_PUBLIC_REGISTRY_ADDRESS ?? "0xEa753d1D297D2c4877Fd168c376C0412A07ECd97",
} as const;
export const PREVIEW_MODE = !/^0x[0-9a-fA-F]{40}$/.test(ENV.contractAddress);
