import { useState } from 'react';
import { ethers } from 'ethers';
import addresses from '../contracts-data/local-addresses.json';
import airdropJSON from '../contracts-data/Airdrop.json';


const usePause = () => {
    const [pausing, setPausing] = useState(false);
    const [pauseError, setPauseError] = useState(null);
    const [pauseSuccess, setPauseSuccess] = useState(false);

    const pause = async () => {
        setPauseError(null);
        setPauseSuccess(false);
        setPausing(true);

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const airdropContract = new ethers.Contract(addresses.airdrop, airdropJSON.abi, provider);
            const airdropContractWithSigner = airdropContract.connect(signer);

            const tx = await airdropContractWithSigner.pause();
            await tx.wait();
            setPauseSuccess(true);
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
                errorMessage = 'An error occurred while pausing the airdrop';
            }

            setPauseError(errorMessage);
        } finally {
            setPausing(false);
        }
    };

    return { pause, pausing, pauseError, pauseSuccess };
};

export default usePause;
