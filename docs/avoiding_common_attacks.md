# Avoiding Common Attacks

The ProofOfExistence contract is kept relatively simple, utilizes audited libraries, and does not handle value transfer apart from one edge case. Hence it is assumed to be relatively safe.

See also design_pattern_decisions.md for further comments on how the design aids safety.

## Common attacks and how they are avoided:

#### Transaction-Ordering Dependence (TOD) or Front Running
The transaction order can be affected by miner which is a potential issue for a proof of existence contract. Consider a scenario where user U submits a transaction to `registerHash()` which to be valid must include a bytes32 hash H. An attacker A monitoring the mempool could now front run this transaction by including a second transaction to `registerHash()` into the mempool with the same bytes32 hash H and a higher gas fee. This would most likely leed to A's transaction being included before U's causing U's transaction to be rejected by the ProofOfExistence contract as U would already be registered as the registrant of the hash H. This attack cannot be avoided. However, there are several reasons which mitigate this attack somewhat: Firstly, the attacker can only be interested in such an attack if they do not have access to the file generating the hash H and by extension H (otherwise A can just go ahead and register H, making this no attack in the first place). Secondly, the attacker would have to continuously monitor the mempool for transactions and then front run every single transaction from the user U who they want to attack (since A does not have H it is impossible for the attacker to know which hash they are looking for). So U could make the attack expensive for H at the downside of also facing significant costs. Finally, U can submit transactions from different account addresses making it even harder and costlier for A to front run her transaction. A has to effectively front run every transaction!

#### Timestamp Dependence
The ProofOfExistence contract utilizes `block.timestamp`/`now`. However, since accuracy within a 30-second time span is acceptable (see the 30-second rule) this is no further concern.

#### Race Conditions
The ProofOfExistence contact only permits one non-constant non-value transfering transaction called `registerHash()` and one non-constant value transfering transaction called `withdraw()`. The first one is an append only transaction limited to one function call, hence the contract is not subject to race conditions such as reentrancy and cross-function race conditions from this function. The second one is a pull payment implemented as a call to the `transfer` method. All transaction logic (in particular internal contract state changes) is done before `transfer` is called. `Transfer` does not allow for re-entrancy.

#### Integer Underflow/Overflow
The contract uses function implementations borrowed from ZeppelinOS's `SafeMath` library. This ensures calculations are secured against underflow and overflow.

### Denial of Service:
###...due to unexpected revert
The `registerHash()` method and the `initialize` method are the only non-constant functions implementing a `revert`. However, they do not pass execution to other functions or contracts hence no DoS can result.

#### ...due to block gas limit.
The ProofOfExistence contract is not particularly gas intensive and as it uses no loop the gas requirements do not change much from function call to function call.


### Malicious admin
The admin can upgrade the contract to introduce new functionalities or pause it. However, due to the nature of the blockchain historic proof of existence cannot be affected by any actions undertaken by the admin since all historic contract states are forever embedded in the blockchain.

#### Force Sending Ether
This contract does not rely on checking `this.balance` to function correctly. Hence, forcibly sending Ether to the contract cannot negatively affect other users of the contract and there exist no incentives for anyone to undertake such action. In case someone does forcibly send ether the contract `beneficiary` can withdraw the ether, hence no Ether will be lost due to this contract :).