# Design Pattern Decisions

### Upgradability
This contract is `upgradable`. The `zos` (Zeppelin OS) framework is used to achieve battle tested upgradeability patterns. The underlying approach is called Transparent storage:
...

.It utilizes a zeppelin standard `EternalStorage` and saves all data to
storage contract rather than in itself. The storage contract can only be modified by its proxy, which is
set to be the `FileRegistry` contract. When an upgrade is needed, the owner of `FileRegistry` can simply call
`upgradeContract()` and change the proxy address inside EternalStorage to a newly deployed proxy. All previously
uploaded data will be preserved and save high cost of data duplication on the Eth blockchain.

### Curcuit Breaker (Emergency Stop)
This contract inherits from standard zeppelin `Pausable` and `Ownable` contracts. Only the `owner` of the
contract can pause the contract and restrict any further state mutation.



### Restricting Access
The permission to access is carefully designed. Once the main `FileRegistry` contract is deployed, it deploys
an external storage contract, and becomes the owner of said contract. FileRegistry then has sole access to
write data to the new contract due to the `onlyOwner` modifier attached to all `set` functions.

Within the `File Registry`, the address that deploys the contract has ownership and the privilege to call
`transferOwnership()` following the zeppelin standard, or change the proxy of the storage contract to a
new, upgraded registry.

### Fail Early, Fail Loud
The design of the contracts stick to the *Fail Early, Fail Loud* philosophy and checks all inputs at the
beginning of each function with `require()` and `revert()`.

### Immortal
With the emergency stop and upgradability, there is no particular reason why this contracts has to expire at
a certain moment in time. Therefore the mortality design pattern is not applied.

### Additional
- Push vs. Pull Payments:

  No pays are made in this contract and therefore this does not apply.

- State Machine:

  This contract has 1 constant state.

- Speed bump:

  Not implemented.


  https://zeppelinos.org/
  https://docs.zeppelinos.org/docs/writing_contracts.html