import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import addresses from '../contracts-data/local-addresses.json';
import airdropJSON from '../contracts-data/Airdrop.json';
import { getTotalClaimableAmount } from '@/utils/merkle-tree';


const useStatsTotalClaimedAmount = (claimsUpdated) => {
    const [totalClaimedAmount, setTotalClaimedAmount] = useState(0);
    const totalClaimableAmount = getTotalClaimableAmount();

    useEffect(() => {
        const getTotalClaimedAmount = async () => {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const airdropContract = new ethers.Contract(addresses.airdrop, airdropJSON.abi, provider);
                const totalClaimedAmount = await airdropContract.totalClaimedAmount();
                console.log("totalClaimedAmount: " + totalClaimedAmount);
                setTotalClaimedAmount(totalClaimedAmount.toString());

            }
            catch (error) {
                console.error('Failed to fetch totalClaimedAmount:', error);
            }
        };
        getTotalClaimedAmount();
        console.log("totalClaimableAmount: " + totalClaimableAmount);
        console.log("totalClaimedAmount: " + totalClaimedAmount);
    }, [claimsUpdated]);



    return { totalClaimedAmount, totalClaimableAmount };
}

export default useStatsTotalClaimedAmount;
