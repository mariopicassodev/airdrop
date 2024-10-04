'use client';

import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from "../context/AppContext";
import useTokenBalance from '../hooks/useTokenBalance';
import useClaimAirdrop from '../hooks/useClaimAirdrop';
import useAvaibleClaimAmount from '@/hooks/useAvaibleClaimAmount';
import Toast from "../components/Toast";
import { useForm } from 'react-hook-form';

export default function Home() {
    const { account, connectWallet, disconnectWallet, error } = useContext(AppContext);
    const [balanceUpdated, setBalanceUpdated] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "", visible: false });
    const { register, handleSubmit, formState: { errors } } = useForm()

    const balance = useTokenBalance(account, balanceUpdated);
    const{ avaibleAmount, elgibilityError } = useAvaibleClaimAmount(account, balanceUpdated);
    const { claimAirdrop, claiming, claimError, claimSuccess } = useClaimAirdrop();


    useEffect(() => {
        if (claimSuccess) {
            setToast({ message: "Airdrop claimed", type: "success", visible: true });
        }
    }, [claimSuccess]);

    const onSubmit = async (data) => {
        console.log('Claiming airdrop...');
        await claimAirdrop(account, data.amount);
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
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center space-y-4 mt-8">
                            <input
                                type="text"
                                placeholder="Amount"
                                {...register('amount', {
                                    required: "Amount is required",
                                    validate: value => {
                                        const numberValue = parseFloat(value);
                                        if (isNaN(numberValue) || numberValue <= 0) {
                                            return 'Amount must be greater than 0';
                                        }
                                        if (numberValue > avaibleAmount) {
                                            return `Amount must be less than or equal to ${avaibleAmount}`;
                                        }
                                        return true;
                                    }
                                })}
                                className="input input-bordered input-primary w-full max-w-xs"
                            />
                            {errors.amount && <p className="text-red-500">{errors.amount.message}</p>}
                            <button className="btn btn-primary btn-wide" type="submit" disabled={claiming}>
                                {claiming ? 'Claiming...' : 'Claim Airdrop'}
                            </button>


                            {claimError && <p className="text-red-500">{`Error: ${claimError}`}</p>}
                        </form>
                        <div className="mt-auto text-center mb-8">
                            <p>Account: {account}</p>
                            <p>Avaible to claim: {avaibleAmount !== null ? `${avaibleAmount} MTK` : 'Loading...'}</p>
                            <p>Balance: {balance !== null ? `${balance} MTK` : 'Loading..'}</p>
                        </div>
                        {elgibilityError && <p className="text-red-500">{elgibilityError}</p>}
                    </>
                ) : (
                    <p>Connect your wallet to get started</p>
                )}
                {error && <p className="text-red-500">{`Error: ${error}`}</p>}
            </div>
            <Toast message={toast.message} type={toast.type} onClose={handleCloseToast} visible={toast.visible} />
        </div>
    );
}
