'use client';

import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

const { ethereum } = typeof window !== "undefined" ? window : {};

const AppProvider = ({ children }) => {
    const [account, setAccount] = useState("");
    const [error, setError] = useState("");

    const checkEthereumExists = () => {
        if (!ethereum) {
            setError("Please Install MetaMask.");
            return false;
        }
        return true;
    };

    const getConnectedAccounts = async () => {
        setError("");
        try {
            const accounts = await ethereum.request({
                method: "eth_accounts",
            });
            console.log(accounts);
            setAccount(accounts[0]);
        } catch (err) {
            setError(err.message);
        }
    };

    const connectWallet = async () => {
        setError("");
        if (checkEthereumExists()) {
            try {
                const accounts = await ethereum.request({
                    method: "eth_requestAccounts",
                });
                console.log(accounts);
                setAccount(accounts[0]);
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const disconnectWallet = () => {
        setError("");
        if (checkEthereumExists()) {
            try {
                ethereum.request({
                    method: "wallet_revokePermissions",
                    params: [
                        {
                            eth_accounts: {},
                        },
                    ],
                });
                setAccount("");
            }
            catch (err) {
                setError(err.message);
            }

        }
    };

    useEffect(() => {
        if (checkEthereumExists()) {
            ethereum.on("accountsChanged", getConnectedAccounts);
            console.log("accountsChanged event listener executed");
            getConnectedAccounts();
        }
        return () => {
            ethereum.removeListener("accountsChanged", getConnectedAccounts);
        };
    }, []);

    return (
        <AppContext.Provider
            value={{ account, connectWallet, disconnectWallet, error }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
