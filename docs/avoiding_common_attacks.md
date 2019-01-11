# Avoid Common Attacks

UPDATE

## Summary

This contract is relatively safe because it is meant to only handle data uploads and not value transfer.

Common race condition attacks such as Reentrancy does not apply here.

However, the integrity of data is important because this DApp.
Therefore, I am careful to disallow any mutation to the uploaded data, by checking for duplicated
file hash before allowing new data to be registered.

I also added a switch to pause the contract to prepare for any unexpected outcome.
In the event that the contract is paused, all data previously saved to the contract
will still be available for viewing. However, it would be impossible to register
new files.

## How the contract avoids common attacks

#### Race Conditions
Currently, the only permissible non-constant transaction supported by the file registry contract
is the registration of a new file. It is an append only transaction and the contract is not subject to
any race condition attack, including

  - Reentrancy
  - Cross-function Race Conditions
  - Pitfalls in Race Condition Solutions

#### Transaction-Ordering Dependence (TOD) / Front Running
While transaction order does matter for individual files to be registered,
it would be difficult for the attacker to have access to the same file hash and submits
it in a span of seconds. Mainly because it is difficult to foresee when a file will be uploaded.

#### Timestamp Dependence
###### 30-second Rule
*"A general rule of thumb in evaluating timestamp usage is:
If the contract function can tolerate a 30-second drift in time, it is safe to use block.timestamp"*

While the file registry contract does use `block.timestamp`, the accuracy is not so crucial that it has to
be exact on 30-seconds interval basis. In addition, since the contract does not involve
value transfer, the malicious attackers would have little incentive to manipulate the timestamp.

#### Integer Overflow and Underflow
All mathematic operations in this contract use the zeppelin standard `SafeMath` library.
Secure from both overflow and underflow.

#### DoS with (Unexpected) revert
The only `revert` in a non-constant function is the one in file registration, to prevent anyone from registering
and overwriting existent files. Since each registration is independent, the revert of one one registration will
not impact others.

#### DoS with Block Gas Limit
The file registry contract does not use any loops and therefore is not subject to this vulnerability.

#### Forcibly Sending Ether to a Contract
This function does not check `this.balance`. Therefore, forcibly sending Ether to contract would
accomplish nothing and there is no incentive for anyone to do so.