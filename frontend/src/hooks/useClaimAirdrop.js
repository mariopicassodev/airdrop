import { useState } from 'react';
import { ethers } from 'ethers';

const useClaimAirdrop = (airdropAddress) => {
    const [claiming, setClaiming] = useState(false);
    const [claimError, setClaimError] = useState(null);

    const claimAirdrop = async (account, merkleProof, amount) => {
        setClaiming(true);
        setClaimError(null);

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const airdropContract = new ethers.Contract(airdropAddress, airdropJSON.abi, provider);
            const tx = await airdropContract.claim(merkleProof, amount);
            await tx.wait();
        } catch (error) {
            console.error('Failed to claim airdrop:', error);
            setClaimError(error.message);
        } finally {
            setClaiming(false);
        }
    };

    return { claimAirdrop, claiming, claimError };
};

export default useClaimAirdrop;
