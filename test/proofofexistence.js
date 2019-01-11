const ProofOfExistence = artifacts.require('../contracts/ProofOfExistence.sol');

contract('ProofOfExistence', (accounts) => {
  const ACCOUNT_ONE = accounts[0];
  const ACCOUNT_TWO = accounts[1];
  const ACCOUNT_THREE = accounts[2];
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
        { from: ACCOUNT_ONE, gas },
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
          { from: ACCOUNT_ONE, gas },
        );
      } catch (err) { assert.equal(err.message.includes('revert'), true, 'Does not revert on same hash beeing registered twice'); }
    });

    // This tests that two more hashes can be registered.
    it('...should register two more hashes.', async () => {
      const gasTwo = await proofOfExistence.registerHash.estimateGas(SAMPLE_HASH_TWO);
      await proofOfExistence.registerHash.sendTransaction(
        SAMPLE_HASH_TWO,
        { from: ACCOUNT_TWO, gasTwo },
      );
      const gasThree = await proofOfExistence.registerHash.estimateGas(SAMPLE_HASH_THREE);
      await proofOfExistence.registerHash.sendTransaction(
        SAMPLE_HASH_THREE,
        { from: ACCOUNT_TWO, gasThree },
      );
    });
  });

  // This tests getting the registration data from a hash
  describe('Retrieving registration data by hash', () => {
    it('...should show correct registration data.', async () => {
      const result = await proofOfExistence.getRegistrationForHash.call(SAMPLE_HASH_ONE);
      assert.equal(result.registrant, ACCOUNT_ONE, 'Does not show correct registrant.');
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
      const resultAccountOne = await proofOfExistence.getIdsForAddress.call(ACCOUNT_ONE);
      const resultAccountTwo = await proofOfExistence.getIdsForAddress.call(ACCOUNT_TWO);
      const resultAccountThree = await proofOfExistence.getIdsForAddress.call(ACCOUNT_THREE);
      assert.equal(resultAccountOne.length, 1, 'Returns incorrect number of ids.');
      assert.equal(resultAccountOne[0], 1, 'Returns incorrect ids.');
      assert.equal(resultAccountTwo.length, 2, 'Returns incorrect number of ids.');
      assert.equal(resultAccountTwo[0], 2, 'Returns incorrect ids.');
      assert.equal(resultAccountTwo[1], 3, 'Returns incorrect ids.');
      assert.equal(resultAccountThree.length, 0, 'Returns incorrect number of ids.');
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
      assert.equal(resultOne.registrant, ACCOUNT_ONE, 'Returns incorrect registrant.');
      assert.equal(resultOne.hash, SAMPLE_HASH_ONE, 'Returns incorrect hash.');
      assert.equal(resultTwo.registrant, ACCOUNT_TWO, 'Returns incorrect registrant.');
      assert.equal(resultTwo.hash, SAMPLE_HASH_TWO, 'Returns incorrect hash.');
      assert.equal(resultThree.registrant, ACCOUNT_TWO, 'Returns incorrect registrant.');
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

    it('...should reject any ether sent to the contract.', async () => {
      try {
        const initialBalance = await getBalancePromise(proofOfExistence.address);
        sendTransactionPromise({
          from: ACCOUNT_THREE,
          to: proofOfExistence.address,
          value: 10e18,
          data: 10e18,
        }).catch(() => {});
        const currentBalance = await getBalancePromise(proofOfExistence.address);
        assert.equal(initialBalance, currentBalance, 'Balance increased when it should not.');
      } catch (err) {
        assert.equal(err.message.includes('revert'), true, 'It did not revert as expected.');
      }
    });
  });
});
