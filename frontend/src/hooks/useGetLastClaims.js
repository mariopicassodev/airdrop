import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import addresses from '../contracts-data/testnet-addresses.json';
import airdropJSON from '../contracts-data/Airdrop.json';

const useGetLastClaims = () => {
    const [lastClaims, setLastClaims] = useState([]);
    const [errorLastClaims, setErrorLastClaims] = useState(null);

    useEffect(() => {
        const getClaims = async () => {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const airdropContract = new ethers.Contract(addresses.airdrop, airdropJSON.abi, provider);

                const filterClaimed = await airdropContract.filters.Claimed();
                const events = await airdropContract.queryFilter(filterClaimed, 2510415, 'latest'); // From contract deployment to latest block

                const claims = events.map((event) => ({
                    account: event.args[0],
                    amount: event.args.amount.toString(),
                }));
                const lastClaimsInverted = claims.slice(-10);
                const lastClaims = lastClaimsInverted.reverse();
                setLastClaims(lastClaims);
            }
            catch (error) {
                console.error('Failed to fetch lastClaims:', error);
                setErrorLastClaims('Failed to fetch lastClaims');
            }
        };
        getClaims();
    }, []);

    return {lastClaims, errorLastClaims};
}

export default useGetLastClaims;
