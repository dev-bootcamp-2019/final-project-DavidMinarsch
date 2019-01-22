// const zos = require('zos');
const ProofOfExistence = artifacts.require('../contracts/ProofOfExistence.sol');

contract('ProofOfExistence', (accounts) => {
  // const DEPLOYER_ADDRESS = accounts[0];
  const BENEFICIARY_ADDRESS = accounts[1];
  const PAUSER_ADDRESS = accounts[2];
  const USER_ADDRESS = accounts[9];
  const SAMPLE_HASH_ONE = '0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231';
  const SAMPLE_HASH_TWO = '0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f232';
  const SAMPLE_HASH_THREE = '0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f233';
  const SAMPLE_HASH_FOUR = '0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f234';
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const ZERO_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000';

  let proofOfExistence;

  before('Before: get deployed contract instance', async () => {
    try {
      proofOfExistence = await ProofOfExistence.deployed();
    } catch (err) {
      assert.throw(`Failed to create ProofOfExistence contract: ${err.toString()}`);
    }
  });

  // Tests hash registration
  describe('Registering a hash', () => {
    // The count must start at 0 for correct initialization.
    it('...should initialize with the correct count.', async () => {
      const count = await proofOfExistence.count();
      assert.equal(count, 0, 'Incorrect initial count.');
    });

    // This tests if a hash can be successfully registered.
    it('...should register a hash.', async () => {
      const gas = await proofOfExistence.registerHash.estimateGas(SAMPLE_HASH_ONE);
      await proofOfExistence.registerHash.sendTransaction(
        SAMPLE_HASH_ONE,
        { from: USER_ADDRESS, gas },
      );
    });

    // This tests if the count has been correctly incremented following a registration.
    it('...should increment count correctly.', async () => {
      const count = await proofOfExistence.count();
      assert.equal(count, 1, 'Incorrectly incremented count.');
    });

    // This tests the same hash cannot be registered again.
    it('...should not register same hash again.', async () => {
      try {
        const gas = await proofOfExistence.registerHash.estimateGas(SAMPLE_HASH_ONE);
        await proofOfExistence.registerHash.sendTransaction(
          SAMPLE_HASH_ONE,
          { from: USER_ADDRESS, gas },
        );
      } catch (err) { assert.equal(err.message.includes('revert'), true, 'Does not revert on same hash beeing registered twice'); }
    });

    // This tests that two more hashes can be registered.
    it('...should register two more hashes.', async () => {
      const gasTwo = await proofOfExistence.registerHash.estimateGas(SAMPLE_HASH_TWO);
      await proofOfExistence.registerHash.sendTransaction(
        SAMPLE_HASH_TWO,
        { from: BENEFICIARY_ADDRESS, gasTwo },
      );
      const gasThree = await proofOfExistence.registerHash.estimateGas(SAMPLE_HASH_THREE);
      await proofOfExistence.registerHash.sendTransaction(
        SAMPLE_HASH_THREE,
        { from: BENEFICIARY_ADDRESS, gasThree },
      );

    });
  });

  // This tests getting the registration data from a hash
  describe('Retrieving registration data by hash', () => {
    it('...should show correct registration data.', async () => {
      const result = await proofOfExistence.getRegistrationForHash.call(SAMPLE_HASH_ONE);
      assert.equal(result.registrant, USER_ADDRESS, 'Does not show correct registrant.');
      assert.equal(result.hash, SAMPLE_HASH_ONE, 'Does not show correct hash.');
    });

    it('...should not have data for unregistered hash.', async () => {
      const result = await proofOfExistence.getRegistrationForHash.call(SAMPLE_HASH_FOUR);
      assert.equal(result.hash, ZERO_HASH, 'Does have data for unregistered hash.');
    });
  });

  // This tests getting the registration ids from an address
  describe('Retrieving registration ids by address', () => {
    it('...should show correct ids for addresses.', async () => {
      const resultUser = await proofOfExistence.getIdsForAddress.call(USER_ADDRESS);
      const resultBeneficiary = await proofOfExistence.getIdsForAddress.call(BENEFICIARY_ADDRESS);
      const resultPauser = await proofOfExistence.getIdsForAddress.call(PAUSER_ADDRESS);
      assert.equal(resultUser.length, 1, 'Returns incorrect number of ids.');
      assert.equal(resultUser[0], 1, 'Returns incorrect ids.');
      assert.equal(resultBeneficiary.length, 2, 'Returns incorrect number of ids.');
      assert.equal(resultBeneficiary[0], 2, 'Returns incorrect ids.');
      assert.equal(resultBeneficiary[1], 3, 'Returns incorrect ids.');
      assert.equal(resultPauser.length, 0, 'Returns incorrect number of ids.');
    });

    it('...should revert for invalid address.', async () => {
      try {
        await proofOfExistence.getIdsForAddress.call(0);
      } catch (err) { assert.equal(err.message.includes('invalid address'), true, 'Does not revert on invalid address.'); }
    });
  });

  // This tests getting the registration data for an id
  describe('Retrieving registration data by id', () => {
    it('...should show correct registration data for id.', async () => {
      const resultOne = await proofOfExistence.getRegistrationForId.call(1);
      const resultTwo = await proofOfExistence.getRegistrationForId.call(2);
      const resultThree = await proofOfExistence.getRegistrationForId.call(3);
      const resultFour = await proofOfExistence.getRegistrationForId.call(4);
      assert.equal(resultOne.registrant, USER_ADDRESS, 'Returns incorrect registrant.');
      assert.equal(resultOne.hash, SAMPLE_HASH_ONE, 'Returns incorrect hash.');
      assert.equal(resultTwo.registrant, BENEFICIARY_ADDRESS, 'Returns incorrect registrant.');
      assert.equal(resultTwo.hash, SAMPLE_HASH_TWO, 'Returns incorrect hash.');
      assert.equal(resultThree.registrant, BENEFICIARY_ADDRESS, 'Returns incorrect registrant.');
      assert.equal(resultThree.hash, SAMPLE_HASH_THREE, 'Returns incorrect hash.');
      assert.equal(resultFour.registrant, ZERO_ADDRESS, 'Returns incorrect registrant.');
      assert.equal(resultFour.hash, ZERO_HASH, 'Returns incorrect hash.');
    });

    it('...should revert for invalid id.', async () => {
      try {
        await proofOfExistence.getRegistrationForId.call(-1);
      } catch (err) {
        assert.equal(err.message.includes('invalid uint'), true, 'Does not revert on invalid uint.');
      }
    });
  });

  describe('Fallback', () => {
    const getBalancePromise = (_address) => {
      return new Promise((resolve, reject) => {
        web3.eth.getBalance(_address, (err, result) => {
          return err ? reject(err) : resolve(result);
        });
      });
    };

    const sendTransactionPromise = (_obj) => {
      return new Promise((resolve, reject) => {
        web3.eth.sendTransactionPromise(_obj, (err, result) => {
          return err ? reject(err) : resolve(result);
        });
      });
    };

    it('...should accept no ether sent to the contract.', async () => {
      try {
        const initialBalance = await getBalancePromise(proofOfExistence.address);
        sendTransactionPromise({
          from: USER_ADDRESS,
          to: proofOfExistence.address,
          value: 10e18,
          data: 10e18,
        }).catch(() => {});
        const currentBalance = await getBalancePromise(proofOfExistence.address);
        assert.equal(initialBalance, currentBalance, 'Balance increased when it should not.');
      } catch (err) { assert.equal(err.message.includes('revert'), true, 'Does not revert on ether being sent.'); }
    });
  });

  // describe('ZOS upgradeability', () => {
  //   it('...should create a proxy', async function () {
  //     const project = await zos.TestHelper({ from: DEPLOYER_ADDRESS });
  //     const proxy = await project.createProxy(ProofOfExistence, { initMethod: 'initialize', initArgs: [BENEFICIARY_ADDRESS,PAUSER_ADDRESS], initFrom: DEPLOYER_ADDRESS});
  //     const result = await proxy.beneficiary();
  //     assert.equal(result, BENEFICIARY_ADDRESS, 'Returns incorrect beneficiary.');
  //   });
  // });
});


// contract TestProofOfExistence {string(abi.encodePacked("The beneficiary was not set correctly.", "_" ,msg.sender, "_", beneficiary, "_", DeployedAddresses.ProofOfExistence()))

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
