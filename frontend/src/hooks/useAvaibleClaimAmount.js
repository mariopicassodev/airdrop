import { useState, useEffect } from "react";
import { ethers } from "ethers";
import localAddresses from '../contracts-data/testnet-addresses.json';
import airdropJSON from '../contracts-data/Airdrop.json';
import { getProofAndClaimableAmount } from "@/utils/merkle-tree";
import { NO_MATCHING_ACCOUNT_ERROR } from "@/utils/constants";


const useAvaibleClaimAmount = (account, balanceUpdated) => {
    const [avaibleAmount, setAvaibleAmount] = useState(null);
    const [elgibilityError, setElgibilityError] = useState(null);

    useEffect(() => {
        if (!account) return;

        const fetchAvaibleAmount = async () => {
            setElgibilityError(null);
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const airdropContract = new ethers.Contract(localAddresses.airdrop, airdropJSON.abi, provider);
                const claimedAmount = await airdropContract.getClaimedAmount(account);

                const { proof, totalAmount } = getProofAndClaimableAmount(account);

                // Convert claimedAmount and totalAmount to BigInt
                const claimedAmountBigInt = BigInt(claimedAmount.toString());
                const totalAmountBigInt = BigInt(totalAmount.toString());

                // Perform arithmetic operation using BigInt
                const avaibleAmountBigInt = totalAmountBigInt - claimedAmountBigInt;

                // Convert avaibleAmountBigInt to string before setting state
                setAvaibleAmount(avaibleAmountBigInt.toString());

            } catch (error) {
                if (error.code === NO_MATCHING_ACCOUNT_ERROR) {
                    setElgibilityError("You are not eligible for the airdrop");
                }
                setAvaibleAmount("0");
                console.error('Failed to fetch avaible amount:', error);
            }
        };

        fetchAvaibleAmount();
    }, [account, balanceUpdated]);

    return { avaibleAmount, elgibilityError };
};

export default useAvaibleClaimAmount;
