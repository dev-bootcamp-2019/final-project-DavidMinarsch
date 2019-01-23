# Design Pattern Decisions

### Keep it simple
The ProofOfExistence contract has been kept as simple as possible given the desired features. Where possible external and previously audited contracts have been used (Zeppelin OS & Open Zeppelin). The blockchain usage has been restricted to the bare minimum needed: timestamping hashes of files. File storage has not been implemented as it creates additional security concerns and in the case of storage on IPFS creates additional performance problems. External contracts are not called.

### Fail Early, Fail Loud
All inputs to state modifying functions are checked at the beginning of such functions with `require()` statements.

### Restricting Access
The permission to access is carefully designed. All deployment is done via ZeppelinOS which requires a single `deployer` address to be used for initial deployment and further upgrades.

To support `Pausability` a `pauser` address is permitted to storage during contract initialization, giving only the `pauser` control over the `Pausability` feature. (For technical reasons of the ZeppelinOS upgradeability  architecture the `pauser` and `deployer` address are distinct.)

To support withdrawal of funds forcefully sent to the contract a `beneficiary` is permitted to storage during contract initialization, giving only the `beneficiary` control over the withdrawal feature. (For technical reasons of the ZeppelinOS upgradeability  architecture the `beneficiary` and `deployer` address are distinct.)

In principle, `pauser` and `beneficiary` can be the same account.

### Emergency Stop/Circuit Breaker
Circuit breakers stop execution if certain conditions are met, and can be useful when new errors are discovered.

The ProofOfExistence contract inherits from the ZeppelinOS `Pausable` contract. During contract initialization a `pauser` address is set. If at any point a bug is discovered the `pauser` account holder can suspend all write functionality to the ProofOfExistence contract. In particular, sending a `pause()` transaction from the account address of the `pauser` temporarily suspends the `registerHash()` method until the `pauser` `unpause()`'s the contract again.

### Upgradability
The `zos` (Zeppelin OS) framework is used to achieve battle tested upgradeability patterns for the ProofOfExistence contract. The Initializable contract from which the ProofOfExistence contract inherits is used to maintain constructor functionalities for the ProofOfExistence contract. The underlying upgradeability approach is called Transparent Storage. The key is that contract logic and contract storage are separated. The storage contract can only be modified by its proxy. When a deployed contract needs to be amended a new logic contract can be created and deployed without the proxy contract and contract storage having to change. All previously stored data will be preserved avoiding expensive data duplication.

There are a number of important rules to consider when writing upgradeable smart contracts in adherence to ZeppelinOS. These rules are described [here](https://docs.zeppelinos.org/docs/writing_contracts.html). In the context of this project the rules regarding the constructor/initialize function apply and have been followed. Zeppelin OS also strongly recommends to avoid any usage of either `selfdestruct` or `delegatecall` as this can cause serious problems and potentially cause the active logic contract to be destroyed. Neither was used in this project.

The README.md contains an example for a simple contract update. A more advanced upgrade is possible in the future:
At the moment the contract is limited to registering files according to the current IPFS hashing algorithm. Through the upgradeability pattern we can easily extend the contract to handle other hashing algorithms in the future as well. For instance, we could introduce a new struct 
```
struct GenericRegistration {
        bytes32 hash;
        uint8 uint8 hashFunction
        uint8 size
        address registrant;
        uint timestamp;
    }
```
to allow for more diverse hash functions (as specified [here](https://github.com/multiformats/multihash)).

### Careful roll out
The contracts are already exposed to a comprehensive test suite and have been tested on test nets. As a next step one could make a time limited alpha release, made possible through the Circuit Breaker design. As a last step one should implement a security audit undertaken by a third party. Bug bounties can be used to be made aware of bugs.

### Pull payments
To allow for the recovery of Ether which has been forceful sent to the contract a pull payment mechanism is implemented via the `withdraw` function. This protects against `re-entrancy` and `denial of service attacks`.


### State Machine
This contract can be in one of two states. In the `unpaused` state the `registerHash()` method allows for write access to the contracts storage. In the `paused` state the `registerHash()` method is suspended and only read access is possible (apart from for the `pauser` role who maintains write access to revoke the paused state).

### Other design patterns which do not apply/make sense here:
1) Speed Bumps (delaying contract actions) have no obvious applicability in the ProofOfExistence contract.
2) Due to the existence of the Emergency Stop and Upgradability features, immortality is no further concern. Therefore, the mortality design pattern is not applied.