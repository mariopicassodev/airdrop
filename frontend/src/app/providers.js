'use client'
import { MetaMaskProvider } from '@metamask/sdk-react';

export function Providers({ children }) {
    return (
      <MetaMaskProvider>
        {children}
      </MetaMaskProvider>
    );
  }
