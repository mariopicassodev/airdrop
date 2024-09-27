import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserProvider, parseUnits } from "ethers";
import { tokenContractJSON } from '../contracts-data/ERC20Mock.json';
import { addressesJSON } from '../contracts-data/local-addresses.json';

const useTokenBalance = (account) => {
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        if (!account) return;

        const fetchBalance = async () => {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum)
                const tokenAddress = addressesJSON.token;
                const tokenContract = new ethers.Contract(tokenAddress, tokenContractJSON.abi, provider);

                const balance = await tokenContract.balanceOf(account);
                setBalance(ethers.utils.formatEther(balance));
            } catch (error) {
                console.error('Failed to fetch balance:', error);
            }
        };

        fetchBalance();
    }, [account]);

    return balance;
};

export default useTokenBalance;
