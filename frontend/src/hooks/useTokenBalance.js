import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const useTokenBalance = (account, tokenAddress) => {
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        if (!account || !tokenAddress) return;

        const fetchBalance = async () => {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const tokenContract = new ethers.Contract(tokenAddress, [
                    'function balanceOf(address owner) view returns (uint256)'
                ], provider);
                const balance = await tokenContract.balanceOf(account);
                setBalance(ethers.utils.formatEther(balance));
            } catch (error) {
                console.error('Failed to fetch balance:', error);
            }
        };

        fetchBalance();
    }, [account, tokenAddress]);

    return balance;
};

export default useTokenBalance;
