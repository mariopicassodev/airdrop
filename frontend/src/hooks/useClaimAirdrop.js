import { useState } from 'react';
import { ethers } from 'ethers';
import addresses from '../contracts-data/local-addresses.json';
import airdropJSON from '../contracts-data/Airdrop.json';
import { getProofAndTotalAmount } from '@/utils/merkle-tree';



const useClaimAirdrop = (airdropAddress) => {
    const [claiming, setClaiming] = useState(false);
    const [claimError, setClaimError] = useState(null);
    const [claimSuccess, setClaimSuccess] = useState(false);

    const claimAirdrop = async (account, partialAmount) => {
        setClaimError(null);
        setClaimSuccess(false);
        setClaiming(true);

        try {

            const { proof, totalAmount } = getProofAndTotalAmount(account);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const airdropContract = new ethers.Contract(addresses.airdrop, airdropJSON.abi, provider);
            const airdropContractWithSigner = airdropContract.connect(signer);

            console.log(proof, totalAmount, partialAmount);
            const tx = await airdropContractWithSigner.claim(proof, totalAmount, partialAmount);
            await tx.wait();
            setClaimSuccess(true);

        } catch (error) {
            console.error(error);
            let errorMessage;
            if (error?.code === "ACTION_REJECTED"){
                return;
            }
            else if (error?.revert?.args?.[0]){
                errorMessage = error?.revert?.args?.[0];
            }
            else {
                errorMessage = 'An error occurred while claiming the airdrop';
            }

            setClaimError(errorMessage);
        } finally {
            setClaiming(false);
        }
    };

    return { claimAirdrop, claiming, claimError, claimSuccess };
};

export default useClaimAirdrop;
