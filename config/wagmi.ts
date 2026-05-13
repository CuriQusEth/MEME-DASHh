import { http, createConfig, createStorage, cookieStorage } from 'wagmi';
import { baseSepolia, base } from 'wagmi/chains';
import { baseAccount, injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base], // Currently on Base mainnet due to previous requests
  connectors: [
    injected(),
    baseAccount({ appName: 'Meme Das Orchestrator' }),
  ],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
