pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ProofOfExistence.sol";


contract TestProofOfExistence {

    ProofOfExistence public proofOfExistence = ProofOfExistence(DeployedAddresses.ProofOfExistence());

    function testBeneficiaryCanWithdrawFunds() public {
        address payable beneficiary = proofOfExistence.beneficiary();
        uint startBalance = beneficiary.balance;
        uint expectedWithdrawAmount = address(proofOfExistence).balance;

        proofOfExistence.withdraw();

        // prevent overflow
        uint256 expectedTotal = startBalance + expectedWithdrawAmount;
        require(expectedTotal >= startBalance, "Overflow occured, check the code!");
        

        Assert.equal(beneficiary.balance, expectedTotal, "The withdraw function does not work as expected.");
    }
}
