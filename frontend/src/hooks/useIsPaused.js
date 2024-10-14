import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import addresses from '../contracts-data/testnet-addresses.json';
import airdropJSON from '../contracts-data/Airdrop.json';


const useIsPaused = (pauseUpdated) => {
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const checkIsPaused = async () => {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const airdropContract = new ethers.Contract(addresses.airdrop, airdropJSON.abi, provider);
                const isPaused = await airdropContract.paused();
                console.log("isPaused: " + isPaused);
                setIsPaused(isPaused);
            }
            catch (error) {
                console.error('Failed to fetch isPaused:', error);
            }

        };
        checkIsPaused();
    }, [pauseUpdated]);

    return isPaused;
}


export default useIsPaused;
