'use client';

import React, { useState } from 'react';
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
export default function Home() {
    const { account, connectWallet, disconnectWallet, error } = useContext(AppContext);
    return (
        <div className='h-svh'>
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
            <div className="flex justify-center items-center h-screen flex-col">
                {account ? (
                    <div className="flex justify-center items-center flex-col">
                    <p>{account}</p>
                    <p>MTK Balance:</p>
                    <button className="btn btn-primary">
                        Claim Airdrop
                    </button>
                    </div>

                ) : (
                    <p>Connect your wallet to get started</p>
                )}
                {error && <p className={"text-red-500"}>{`Error: ${error}`}</p>}
            </div>
        </div>
    );
}
