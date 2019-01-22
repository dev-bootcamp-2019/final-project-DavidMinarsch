pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ProofOfExistence.sol";


contract TestProofOfExistence {
    ProofOfExistence public proofOfExistenceDeployed = ProofOfExistence(DeployedAddresses.ProofOfExistence());

    function testContractWasDeployedWithoutInitialization() public {
        address payable beneficiary = proofOfExistenceDeployed.beneficiary();
        address payable zeroAddress = 0x0000000000000000000000000000000000000000;
        // We expect the contract to be deployed but not initialized
        // (as deployment here happens via Truffle, not zos):
        require(beneficiary == zeroAddress, "Deployment did cause initialization."); // string(abi.encodePacked(toString(msg.sender), toString(beneficiary)))
    }

    function toString(address x) internal pure returns (string memory) {
        bytes memory b = new bytes(20);
        for (uint i = 0; i < 20; i++)
            b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
        return string(b);
    }
}

