import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ERC20JSON from '../contracts-data/ERC20Mock.json';
import localAddresses from '../contracts-data/local-addresses.json';

const useTokenBalance = (account, balanceUpdated) => {
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        if (!account) return;

        const fetchBalance = async () => {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum)
                const tokenAddress = localAddresses.token;
                console.log('Token address:', tokenAddress);
                const tokenContract = new ethers.Contract(tokenAddress, ERC20JSON.abi, provider);
                console.log('Fetching balance for account:', account, tokenContract);
                const balance = await tokenContract.balanceOf(account);
                setBalance(balance.toString());
            } catch (error) {
                console.error('Failed to fetch balance:', error);
            }
        };

        fetchBalance();
    }, [account, balanceUpdated]);

    return balance;
};

export default useTokenBalance;
