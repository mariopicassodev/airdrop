import { useState } from 'react';
import { ethers } from 'ethers';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree'
import addresses from '../contracts-data/local-addresses.json';
import airdropJSON from '../contracts-data/Airdrop.json';
import merkleTreeJSON from '../contracts-data/local-whitelist-tree.json';
import { getProofAndTotalAmount } from '@/utils/merkle-tree';



const useClaimAirdrop = (airdropAddress) => {
    const [claiming, setClaiming] = useState(false);
    const [claimError, setClaimError] = useState(null);
    const [claimSuccess, setClaimSuccess] = useState(false);

    const claimAirdrop = async (account, partialAmount) => {
        setClaiming(true);

        try {
            const merkleTree = StandardMerkleTree.load(merkleTreeJSON);
            const { merkleProof, totalAmount } = getProofAndTotalAmount(merkleTree, account);
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

    return { claimAirdrop, claiming, claimError, claimSuccess };
};

export default useClaimAirdrop;
