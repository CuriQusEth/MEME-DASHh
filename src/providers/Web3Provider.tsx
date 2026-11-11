import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

/**
 * Base Mainnet Denim Upgrade Configuration
 * - Denim activated on Base Mainnet on November 5, 2026.
 * - 200ms canonical blocks replace Flashblocks.
 * - Standard Base Mainnet RPC endpoint: https://mainnet.base.org
 */
export const baseMainnetDenim = {
  ...base,
  name: 'Base Mainnet (Denim)',
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://basescan.org' },
  },
  custom: {
    upgrade: 'Denim',
    blockTimeMs: 200,
    flashblocksRetired: true,
  },
} as const;

export const config = createConfig({
  chains: [baseMainnetDenim],
  connectors: [
    injected()
  ],
  transports: {
    [baseMainnetDenim.id]: http('https://mainnet.base.org', {
      batch: true,
      retryCount: 3,
      retryDelay: 200,
    }),
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 1000,
    },
  },
});

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

