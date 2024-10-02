import { useState, useEffect } from "react";
import { ethers } from "ethers";
import localAddresses from '../contracts-data/local-addresses.json';
import airdropJSON from '../contracts-data/Airdrop.json';
import merkleTreeJSON from '../contracts-data/local-whitelist-tree.json';
import { getProofAndTotalAmount } from "@/utils/merkle-tree";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

const useAvaibleClaimAmount = (account, balanceUpdated) => {
    const [avaibleAmount, setAvaibleAmount] = useState(null);

    useEffect(() => {
        if (!account) return;

        const fetchAvaibleAmount = async () => {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const airdropContract = new ethers.Contract(localAddresses.airdrop, airdropJSON.abi, provider);
                const claimedAmount = await airdropContract.getClaimedAmount(account);
                const merkleTree = StandardMerkleTree.load(merkleTreeJSON);
                const { proof, totalAmount } = getProofAndTotalAmount(merkleTree, account);

                // Convert claimedAmount and totalAmount to BigInt
                const claimedAmountBigInt = BigInt(claimedAmount.toString());
                const totalAmountBigInt = BigInt(totalAmount.toString());

                // Perform arithmetic operation using BigInt
                const avaibleAmountBigInt = totalAmountBigInt - claimedAmountBigInt;

                // Convert avaibleAmountBigInt to string before setting state
                setAvaibleAmount(avaibleAmountBigInt.toString());

            } catch (error) {
                console.error('Failed to fetch avaible amount:', error);
            }
        };

        fetchAvaibleAmount();
    }, [account, balanceUpdated]);

    return avaibleAmount;
};

export default useAvaibleClaimAmount;
