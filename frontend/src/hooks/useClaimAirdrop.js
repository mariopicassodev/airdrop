import { useState } from 'react';
import { ethers } from 'ethers';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree'
import addresses from '../contracts-data/local-addresses.json';
import airdropJSON from '../contracts-data/airdrop.json';
import merkleTreeJSON from '../contracts-data/local-whitelist-tree.json';



const useClaimAirdrop = (airdropAddress) => {
    const [claiming, setClaiming] = useState(false);
    const [claimError, setClaimError] = useState(null);
    const [claimSuccess, setClaimSuccess] = useState(false);

    const claimAirdrop = async (account, partialAmount) => {
        setClaiming(true);

        try {
            const merkleTree = StandardMerkleTree.load(merkleTreeJSON);
            let merkleProof;
            let totalAmount;

            for (const [i, v] of merkleTree.entries()) {
                if (v[0] === account) {
                    merkleProof = merkleTree.getProof(i);
                    totalAmount = v[1];
                }
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const airdropContract = new ethers.Contract(addresses.airdrop, airdropJSON.abi, provider);
            const tx = await airdropContract.claim(merkleProof, totalAmount, partialAmount);
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
