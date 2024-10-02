export function getProofAndTotalAmount(merkleTree, account) {
    let merkleProof;
    let totalAmount;

    for (const [i, v] of merkleTree.entries()) {
        if (v[0] === account) {
            merkleProof = merkleTree.getProof(i);
            totalAmount = v[1];
        }
    }

    return { merkleProof, totalAmount };
}
