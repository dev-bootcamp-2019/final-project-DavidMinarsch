pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ProofOfExistence.sol";


contract TestProofOfExistence {

    function testTheTruth() public {
        Assert.equal(true, true, "It should be true.");
    }

}
