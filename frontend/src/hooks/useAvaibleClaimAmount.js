import { useState } from "react";
import { ethers } from "ethers";
import localAddresses from '../contracts-data/local-addresses.json';
import airdropJSON from '../contracts-data/airdrop.json';
import whitelist from '../contracts-data/test-local-whitelist.json';

const useAvaibleClaimAmount = (account, balanceUpdated) => {
    const [avaibleAmount, setAvaibleAmount] = useState(null);

    useEffect(() => {
        if (!account) return;

        const fetchAvaibleAmount = async () => {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const airdropContract = new ethers.Contract(localAddresses.airdrop, airdropJSON.abi, provider);
                const claimedAmount = await airdropContract.getClaimedAmount(account);
                const totalAmount = whitelist.reduce((result, whitelistValue) => whitelistValue[0] === account ? result : whitelistValue[1] , null);
                const avaibleAmount = totalAmount - claimedAmount;

                setAvaibleAmount(avaibleAmount.toString());
            } catch (error) {
                console.error('Failed to fetch avaible amount:', error);
            }
        };

        fetchAvaibleAmount();
    }, [account, balanceUpdated]);

    return avaibleAmount;
};

export default useAvaibleClaimAmount;
