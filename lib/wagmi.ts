import { defineChain } from "viem";
import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { ENV } from "./env";

export const studionetChainId = Number(ENV.chainId);

export const studionet = defineChain({
  id: studionetChainId,
  name: "GenLayer Studionet",
  nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
  rpcUrls: { default: { http: [ENV.rpcUrl] }, public: { http: [ENV.rpcUrl] } },
  blockExplorers: { default: { name: "GenLayer Studio Explorer", url: "https://explorer-studio.genlayer.com" } },
  testnet: true,
});

export const wagmiConfig = createConfig({
  chains: [studionet],
  connectors: [injected({ shimDisconnect: true })],
  transports: { [studionet.id]: http(ENV.rpcUrl) },
  ssr: true,
});
