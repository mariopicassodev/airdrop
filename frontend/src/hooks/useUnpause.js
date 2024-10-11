import { useState } from 'react';
import { ethers } from 'ethers';
import addresses from '../contracts-data/local-addresses.json';
import airdropJSON from '../contracts-data/Airdrop.json';

const useUnpause = () => {
    const [unpausing, setUnpausing] = useState(false);
    const [unpauseError, setUnpauseError] = useState(null);
    const [unpauseSuccess, setUnpauseSuccess] = useState(false);

    const unpause = async () => {
        setUnpauseError(null);
        setUnpauseSuccess(false);
        setUnpausing(true);

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const airdropContract = new ethers.Contract(addresses.airdrop, airdropJSON.abi, provider);
            const airdropContractWithSigner = airdropContract.connect(signer);

            const tx = await airdropContractWithSigner.unpause();
            await tx.wait();
            setUnpauseSuccess(true);
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
                errorMessage = 'An error occurred while unpausing the airdrop';
            }

            setUnpauseError(errorMessage);
        } finally {
            setUnpausing(false);
        }
    };

    return { unpause, unpausing, unpauseError, unpauseSuccess };
}

export default useUnpause;
