// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";


contract Airdrop is Ownable, Pausable {
    bytes32 public merkleRoot;

    mapping(address => uint256) public claimedAmount;
    IERC20 public token;
    uint256 public totalClaimedAmount;
    event Claimed(address indexed account, uint256 amount);

    constructor(bytes32 _merkleRoot, address _tokenAddress) Ownable(msg.sender) {
        merkleRoot = _merkleRoot;
        token = IERC20(_tokenAddress);
    }

    function claim(bytes32[] calldata merkleProof, uint256 claimableAmount, uint256 claimAmount) whenNotPaused public {

        // Verify that claimAmount is less than claimableAmount
        require(claimAmount <= claimableAmount, "Partial amount is greater than total amount");

        // Verify the Merkle proof
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(msg.sender, claimableAmount))));
        require(verify(merkleProof, merkleRoot, leaf), "Invalid Merkle proof");

        // Now the total amount and the addr are verified.
        // Calculate remaining amount to claim
        uint256 remainingAmount = claimableAmount - claimedAmount[msg.sender];
        require(claimAmount <= remainingAmount, "Partial amount is greater than remaining amount");
        require(remainingAmount > 0, "No more tokens to claim");

        // Update the withdrawal record
        claimedAmount[msg.sender] += claimAmount;

        // Save the total claimed amount
        totalClaimedAmount += claimAmount;

        // Transfer the ERC-20 tokens
        require(token.transfer(msg.sender, claimAmount), "Token transfer failed");

        emit Claimed(msg.sender, claimAmount);
    }


    function pause() external onlyOwner {
        _pause();
    }


    function unpause() external onlyOwner {
        _unpause();
    }

    function getClaimedAmount(address _address) public view returns (uint256) {
        return claimedAmount[_address];
    }

    function updateMerkleRoot(bytes32 newRoot) external onlyOwner {
        merkleRoot = newRoot;
    }

    receive() external payable {}


    // INTERNAL FUNCTIONS

    function verify(bytes32[] memory proof, bytes32 root, bytes32 leaf) private pure returns (bool) {
        return processProof(proof, leaf) == root;
    }

    function processProof(bytes32[] memory proof, bytes32 leaf) private pure returns (bytes32) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            computedHash = _hashPair(computedHash, proof[i]);
        }
        return computedHash;
    }

    function _hashPair(bytes32 a, bytes32 b) private pure returns (bytes32) {
        return a < b ? keccak256(abi.encode(a, b)) : keccak256(abi.encode(b, a));
    }
}
