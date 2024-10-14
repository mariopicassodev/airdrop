import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import merkleTreeJSON from "../contracts-data/testnet-whitelist-tree.json"
import { NO_MATCHING_ACCOUNT_ERROR } from "@/utils/constants";


export function getProofAndClaimableAmount(account) {
    let proof;
    let totalAmount;
    const tree = StandardMerkleTree.load(merkleTreeJSON);

    for (const [i, v] of tree.entries()) {
        if (v[0].toLowerCase() === account.toLowerCase()) {
            proof = tree.getProof(i);
            totalAmount = v[1];
            break;
        }
    }

    if (!proof) {
        console.error('No matching account found in the Merkle tree for:', account);
        const error = new Error('No matching account found in the Merkle tree');
        error.code = NO_MATCHING_ACCOUNT_ERROR;
        throw error;
    }
    return { proof, totalAmount };
}

export function getTotalClaimableAmount(){
    const tree = StandardMerkleTree.load(merkleTreeJSON);
    let totalClaimableAmount = 0;
    for (const [i, v] of tree.entries()) {

        totalClaimableAmount += Number(v[1]);
    }
    return totalClaimableAmount;
}
