import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import merkleTreeJSON from "../contracts-data/local-whitelist-tree.json"
import { NO_MATCHING_ACCOUNT_ERROR } from "@/utils/constants";


export function getProofAndTotalAmount(account) {
    let proof;
    let totalAmount;
    const tree = StandardMerkleTree.load(merkleTreeJSON);

    for (const [i, v] of tree.entries()) {
        if (v[0].toLowerCase() === account.toLowerCase()) {
            proof = tree.getProof(i);
            console.log('Value:', v);
            console.log('Proof:', proof);
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
