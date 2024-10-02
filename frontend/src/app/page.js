'use client';

import React, { useContext, useState } from 'react';
import { AppContext } from "../context/AppContext";
import useTokenBalance from '../hooks/useTokenBalance';
import useClaimAirdrop from '../hooks/useClaimAirdrop';
import Toast from "../components/Toast";

export default function Home() {
    const { account, connectWallet, disconnectWallet, error } = useContext(AppContext);
    const [balanceUpdated, setBalanceUpdated] = useState(false);
    const [amount, setAmount] = useState('');
    const [toast, setToast] = useState({ message: "", type: "", visible: false });


    const balance = useTokenBalance(account, balanceUpdated);
    const avaibleAmount = useAvaibleClaimAmount(account);
    const { claimAirdrop, claiming, claimError, claimSuccess } = useClaimAirdrop();

    const handleClaim = async () => {
        console.log('Claiming airdrop...');
        await claimAirdrop(account, amount);
        if (claimSuccess) {
            setToast({ message: "Airdrop claimed", type: "success", visible: true });
        }
        setBalanceUpdated(!balanceUpdated); // Toggle the state to trigger re-fetching the balance

    }

    const handleCloseToast = () => {
        setToast({ ...toast, visible: false });
    };

    return (
        <div className='min-h-screen flex flex-col overflow-hidden'>
            <div className="navbar bg-base-100">
                <div className="navbar-start">
                    <a className="btn btn-ghost text-xl">Airdrop MTK</a>
                </div>
                <div className="navbar-end">
                    {account ? (
                        <a className="btn btn-secondary" onClick={disconnectWallet}>Disconnect</a>
                    ) : (
                        <a className="btn btn-primary" onClick={connectWallet}>Connect</a>
                    )}
                </div>
            </div>

            <h1 className="text-6xl text-center">Airdrop MyToken</h1>
            <div className="flex flex-col justify-between items-center flex-grow">
                {account ? (
                    <>
                        <div className="flex flex-col items-center space-y-4 mt-8">
                            <button className="btn btn-primary btn-wide" onClick={handleClaim} disabled={claiming}>
                                {claiming ? 'Claiming...' : 'Claim Airdrop'}
                            </button>
                            {claimError && <p className="text-red-500">{`Error: ${claimError}`}</p>}
                            <input
                                type="text"
                                placeholder="Amount"
                                onChange={(e) => setAmount(e.target.value)}
                                className="input input-bordered input-primary w-full max-w-xs"
                            />
                        </div>
                        <div className="mt-auto text-center mb-8">
                            <p>Account: {account}</p>
                            <p>Avaible to claim: {avaibleAmount}</p>
                            <p>Balance: {balance !== null ? `${balance} MTK` : 'Loading...'}</p>
                        </div>
                    </>
                ) : (
                    <p>Connect your wallet to get started</p>
                )}
                {error && <p className="text-red-500">{`Error: ${error}`}</p>}
            </div>
            <Toast message="Airdrop claimed" type="success" visible={false} onClose={handleCloseToast} />
        </div>
    );
}
