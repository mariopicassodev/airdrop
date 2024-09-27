import { useState } from 'react';
import { ethers } from 'ethers';

const useClaimAirdrop = (airdropAddress) => {
    const [claiming, setClaiming] = useState(false);
    const [claimError, setClaimError] = useState(null);

    const claimAirdrop = async (account, merkleProof, amount) => {
        setClaiming(true);
        setClaimError(null);

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const airdropContract = new ethers.Contract(airdropAddress, [
                'function claim(bytes32[] calldata merkleProof, uint256 amount) external'
            ], signer);

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
