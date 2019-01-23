# final-project-DavidMinarsch

💥 The DApp is hosted on IPFS [here](https://ipfs.io/ipfs/).

📕 Additional documentation in [docs](../master/docs):
* [avoiding_common_attacks.md](../master/docs/avoiding_common_attacks.md)
* [deployed_addresses.md](../master/docs/deployed_addresses.md)
* [design_pattern_decisions.md](../master/docs/design_pattern_decisions.md)

🐍 Three simple Vyper contracts are available [here](../master/docs/vyper_contracts) (they are not connected to the main project).

## Description
This application allows users who have an Ethereum account to prove the existence of a file at a specific point in time by registering an IPFS hash of the file on the Ethereum blockchain.

To preserve the privacy of the user's file it is not permanently stored. The file is only temporarily stored (in the client and the IPFS node) to generate the IPFS hash. The generated IPFS hash and a time stamp are stored in a smart contract that can be referenced at a later date to verify the existence of the file at the referenced time.

Implicit to the above use case of proof of existence are other use cases like file integrity checking.

User stories:
- A user visits the app from a web3 enabled browser or web2 browser with a MetaMask extension. The user must have at least one account registered in their wallet. By default the application uses the first account address registered in the wallet. The user can upload a file to the app and initiate a transaction which references the IPFS hash of the file and a time stamp on the blockchain.

- The app reads the user's account address and shows all the previous registrations associated to this address. The registration information includes the IPFS hash and the timestamp.

- The user can check if a given file has already been registered and at which time by uploading it to the app. If the file has already been registered by the user or another user then the app will show the registration information (IPFS hash and timestamp) and a link to the relevant account address which has registered the file.

The app is deployed on the Rinkeby test net and served from IPFS at:


## Development setup:
Go to root folder and ensure Node.js version is aligned:
```
nvm install
```
Install all dependencies for contract development:
```
npm install
```
Install all dependencies for client development:
```
cd client && npm install
```

## For development (non-upgradable route):
Note: This approach is only included to meet the project requirements. The preferred approach is described in the next section. This approach deploys the contract to the test network without initializing it. This projects uses ZeppelinOS for which contract initialization is handled with an initialize() function rather than a constructor(), hence `truffle migrate` does not pick up on the initialization. This contract will not be upgradeable (logic and storage are not separated).

1. Navigate to project root and delete all historic compiled contracts:
```
rm -rf client/src/contracts/*
```
2. Start a test blockchain (in deterministic mode: so it generates deterministic addresses based on a pre-defined mnemonic) with the ganache-cli:
```
ganache-cli --deterministic
```
3. In a second terminal window test contracts for expected behaviour:
```
truffle test
```
4. Compile contracts:
```
truffle compile
```
5. Migrate contracts onto the test blockchain:
```
truffle migrate
```
6. (Optional) Run tests on DApp:
```
cd client && npm test
```
7. Start the dev-server
```
cd client && npm run start
```
8. Make sure MetaMask points to correct network AND has your account loaded. The DApp will likely show an error if you do not connect it to the local test network via the MetaMask dropdown!


## For development (upgradable route utilizing Zeppelin-OS) - preferred approach:
1. Delete all historic compiled contracts:
```
rm -rf client/src/contracts/*
```

2. Start a test blockchain (in deterministic mode: so it generates deterministic addresses based on a pre-defined mnemonic) with ganache-cli:
```
ganache-cli --deterministic

```
Take the first account address listed and add it to a .env file under DEPLOYER_ADDRESS
```
export DEPLOYER_ADDRESS=0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1
```
Take the second and third account address listed and add it to the same .env file under BENEFICIARY_ADDRESS and PAUSER_ADDRESS
```
export BENEFICIARY_ADDRESS=0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0
export PAUSER_ADDRESS=0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b
```
Note, to send transactions to the contract we **MUST** use a different address than the one which was used to deploy the contract (read more on this at [ZeppelinOS](https://docs.zeppelinos.org/docs/deploying.html)).


3. In a second terminal window compile and add the contracts to zeppelin os project:
```
npx zos add ProofOfExistence
```

4. Test contracts for expected behaviour:
```
NODE_ENV=test npx truffle test
```

5. Migrate contracts onto the test blockchain :

a) First, create a session:
```
npx zos session --network development --from $DEPLOYER_ADDRESS --expires 3600
```
b) Second, create/deploy logic contract:
```
npx zos push
```
c) Third, create/deploy first usable upgradeable instance (proxy) of ProofOfExistence contract:
```
npx zos create ProofOfExistence --init initialize --args $BENEFICIARY_ADDRESS,$PAUSER_ADDRESS
```
You will see the contract address printed on terminal.
d) (Optional) Interact with the contract via Truffle console (`truffle console`), like so:
```
const proofOfExistence = await ProofOfExistence.at('<your-contract-address>')
```
or
```
const networkId = await web3.eth.net.getId()
const address = await ProofOfExistence.networks[networkId].address
const proofOfExistence = await ProofOfExistence.at(address)
```
Then confirm the beneficiary equals the deployer address set above:
```
const beneficiary_address = await web3.eth.getAccounts().then(a => {return a[1];})
const beneficiary = await proofOfExistence.beneficiary({from: beneficiary_address })
beneficiary === beneficiary_address
```

6. (Optional) Run tests on DApp:
```
cd client && npm test
```

7. Start the dev-server
```
cd client && npm run start
```

8. Make sure MetaMask points to correct network **AND** has your account loaded. This **MUST** be an account different to the first one listed in Ganache (see above for why), I suggest taking the last one with private key:
```
0xb0057716d5917badaf911b193b12b910811c1497b5bada8d7711f758981c3773
```

### Pausing the contract:
Before continuing have a look at [design_pattern_decisions.md](../blob/master/docs/design_pattern_decisions.md) to read about the Emergency Stop Pattern there.

1. Start Truffle console and get the contract instance:
```
const proofOfExistence = await ProofOfExistence.at('<your-contract-address>')
```
or
```
const networkId = await web3.eth.net.getId()
const address = await ProofOfExistence.networks[networkId].address
const proofOfExistence = await ProofOfExistence.at(address)
```
2. Confirm the pauser has the pauser role and the contract is not paused:
```
const pauser_address = await web3.eth.getAccounts().then(a => {return a[2];})
proofOfExistence.isPauser(pauser_address, {from: pauser_address})
proofOfExistence.paused({from: pauser_address})
```
3. Pause the contract (only the pauser can do so):
```
proofOfExistence.pause({from: pauser_address})
proofOfExistence.paused({from: pauser_address})
```
4. Unpause the contract again:
```
proofOfExistence.unpaused({from: pauser_address})
```

### Upgrading the contract using ZeppelinOS:
Before continuing have a look at [design_pattern_decisions.md](../blob/master/docs/design_pattern_decisions.md) to read about Upgradeability there.

1. Let's now extend the existing contract by adding a tracker of when the last registration occurred. Below line 26 of the contact add a new variable:
```
uint public lastTimestamp;
```
and below line 62 we update it each time a registration takes place:
```
lastTimestamp = now;
```
2. Now we are ready to push the new code to the network:
```
npx zos push
```
If this step throws an error ('No AST nodes with id <ID> found') then remove the old compiled contracts (`rm -rf client/src/contracts/*`) and try again ([more info here](https://github.com/zeppelinos/zos/issues/465))
3. And update the existing proxy with the new logic contract:
```
npx zos update ProofOfExistence
```
4. Check that the getter function for our new public variable is set:
```
const proofOfExistence = await ProofOfExistence.at('<your-contract-address>')
const lastTimestamp = await proofOfExistence.lastTimestamp({from: pauser_address})
```
For more on upgradeability see the [ZeppelinOS Docs](https://docs.zeppelinos.org/docs/upgrading.html).

### Linting:
You can run a linting script (first make `lint_all` executable: `chmod +x lint_all`) which runs the common linters:
```
./lint_all

```
More linters (with issues due to React/ZeppelinOS setup):
```
myth -x contracts/ProofOfExistence.sol
myth --truffle
slither contracts/ProofOfExistence.sol
```

## Build for production:
Build for production:
```
cd client && npm run build
```
Then to serve run:
```
serve -s build
```

## Deployment to IPFS

1. Start an ipfs node
```
ipfs daemon
```
2. Deploy the build folder to IPFS
```
ipfs init
ipfs add -r build
```
3. Visit the deployed DApp at:
```
http://127.0.0.1:8080/ipfs/<yourHash>
```
where your hash is the last one listed on console next to the keyword build (see [here](https://medium.com/elbstack/decentralized-hosting-of-a-static-react-app-with-ipfs-aae11b860f5e) for more).

## Known issues:
Due to my limited React knowledge the current DApp won't properly load all registrations if a user has more than 12 (i.e. the first set of) registrations. This is a React only issue and as such not part of the scope of this project.

## Style guide
This project's solidity code follows:
https://solidity.readthedocs.io/en/develop/style-guide.html
