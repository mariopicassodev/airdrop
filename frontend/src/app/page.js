'use client';

import { useSDK } from '@metamask/sdk-react';
import React, { useState } from 'react';

export default function Home() {
    const { sdk, connected, connecting, provider, chainId, account, balance } = useSDK();
    const [error, setError] = useState(null);

    const terminate = () => {
        try {
            sdk?.terminate();
        }
        catch (err) {
            setError(err);
            console.warn(`failed to terminate..`, err);
        }
    };

    const connect = async () => {
        try {
            await sdk?.connect();
        } catch (err) {
            console.warn(`failed to connect..`, err);
            setError(err);
        }
    };
    return (
        <div className="App">
            {!account && (
                <button style={{ padding: 10, margin: 10 }} onClick={connect}>
                    Connect
                </button>
            )}
            {account && (
                <div>
                    <p>{chainId && `Connected chain: ${chainId}`}</p>
                    <p>{account && `Connected account: ${account}`}</p>
                    <p>{balance && `Balance: ${balance}`}</p>
                    <button style={{ padding: 10, margin: 10 }} onClick={terminate}>
                        Disconnect
                    </button>
                </div>
            )}
        </div>
    )
}
