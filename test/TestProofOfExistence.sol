pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ProofOfExistence.sol";

contract TestProofOfExistence {}

// contract TestProofOfExistence {

//     ProofOfExistence public proofOfExistenceDeployed = ProofOfExistence(DeployedAddresses.ProofOfExistence());
//     ProofOfExistence public proofOfExistenceCreated = new ProofOfExistence(msg.sender, msg.sender);

//     function testContractWasDeployed() public {
//         address payable beneficiary = proofOfExistenceDeployed.beneficiary();
//         Assert.equal(beneficiary, msg.sender, "The beneficiary was not set correctly.");
//     }
    
//     function testBeneficiaryCanWithdrawFunds() public {
//         address payable beneficiary = proofOfExistenceCreated.beneficiary();
//         uint startBalance = beneficiary.balance;
//         uint expectedWithdrawAmount = address(proofOfExistenceCreated).balance;

//         proofOfExistenceCreated.withdraw();

//         // prevent overflow
//         uint256 expectedTotal = startBalance + expectedWithdrawAmount;
//         require(expectedTotal >= startBalance, "Overflow occured, check the code!");
        

//         Assert.equal(beneficiary.balance, expectedTotal, "The withdraw function does not work as expected.");
//     }
// }
