# final-project-DavidMinarsch


## Description
This application allows users who have an Ethereum account to prove the existence of a file at a specific point in time by registering an IPFS hash of the file on the Ethereum blockchain.

To preserve the privacy of the user's file it is not permanently stored. The file is only temporarily stored (in the client and the IPFS node) to generate the IPFS hash. The generated IPFS hash and a time stamp are stored in a smart contract that can be referenced at a later date to verify the existence of the file at the referenced time.

Implicit to the above use case of proof of existence are other use cases like file integrity checking.

User stories:
- A user visits the app from a web3 enabled browser or web2 browser with a Metamask extension. The user must have at least one account registered in their wallet. By default the application uses the first account address registered in the wallet. The user can upload a file to the app and initiate a transaction which references the IPFS hash of the file and a time stamp on the blockchain.

- The app reads the user's account address and shows all the previous registrations associated to this address. The registration information includes the IPFS hash and the timestamp.

- The user can check if a given file has already been registered and at which time by uploading it to the app. If the file has already been registered by the user or another user then the app will show the registration information (IPFS hash and timestamp) and a link to the relevant account address which has registered the file.

The app is deployed on the Rinkeby test net and served from IPFS at:


## Style guide
This project's solidity code follows:
https://solidity.readthedocs.io/en/develop/style-guide.html

## Setup:
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
0)
Delete all historic compiled contracts:
```
rm -rf client/src/contracts/*
```
1) Start a test blockchain (in deterministic mode: so it generates deterministic addresses based on a pre-defined mnemonic) with ganache:
```
ganache-cli --deterministic
```
2) In a second terminal window test contracts for expected behaviour:
```
truffle test
```
3) Compile contracts:
```
truffle compile
```
4) Migrate contracts onto the test blockchain:
```
truffle migrate
```
5) Test dapp:
```
cd client && npm test
```
6) Start the dev-server
```
cd client && npm run start
```
7) Make sure MetaMask points to correct network and has your account loaded.

## For development (upgradable route utilizing Zeppelin-OS)
0)
Delete all historic compiled contracts:
```
rm -rf client/src/contracts/*
```

1) Start a test blockchain (in deterministic mode: so it generates deterministic addresses based on a pre-defined mnemonic) with ganache:
```
ganache-cli --deterministic

```
Take the first account address listed and add it to a .env file under DEPLOYER_ADDRESS
```
export DEPLOYER_ADDRESS=0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1
```
Take the second and third account address listed and add it to the same .env file under BENEFICIARY_ADDRESS and PAUSER_ADDRESS
```
export BENEFICIARY_ADDRESS=0xffcf8fdee72ac11b5c542428b35eef5769c409f0
export PAUSER_ADDRESS=0x22d491bde2303f2f43325b2108d26f1eaba1e32b
```
Note, to send transactions to the contract we MUST use a different address than the one which was used to deploy the contract (read more on this at ZeppelinOS).


2) In a second terminal window compile and add the contracts to zeppelin os project:
```
npx zos add ProofOfExistence
```

3) Test contracts for expected behaviour:
```
NODE_ENV=test npx truffle test
```

4) Migrate contracts onto the test blockchain :
a) First, create a session:
```
npx zos session --network development --from $DEPLOYER_ADDRESS --expires 3600
```
b) Second, create/deploy logic contract:
```
npx zos push
```
c) Third, create first usable upgradeable instance (proxy) of ProofOfExistence contract:
```
npx zos create ProofOfExistence --init initialize --args $BENEFICIARY_ADDRESS,$PAUSER_ADDRESS
```
Optional: Take note of the instance address in case you want to interact with the contract via Truffle console (`truffle console`), like so:
```
const proofOfExistence = await ProofOfExistence.at('<your-contract-address>')
```
or, simpler still:
```
const proofOfExistence = await ProofOfExistence.at(ProofOfExistence.address)
```
Then confirm the beneficiary equals the deployer address set above:
```
const beneficiary = await proofOfExistence.beneficiary()
const owner_address = await web3.eth.getAccounts().then(a => {return a[0];})
const deployer_address = await web3.eth.getAccounts().then(a => {return a[1];})
beneficiary === deployer_address
```
5) Test dapp:
```
cd client && npm test
```
6) Start the dev-server
```
cd client && npm run start
```
NOTE: there remain some issues with the contract instance not being maintained in react's state. Due to my limited experience I was unable to fix this.

7) Make sure MetaMask points to correct network and has your account loaded. This MUST be an account different to the first one (see above for why), I suggest taking the last one with private key:
```
0xb0057716d5917badaf911b193b12b910811c1497b5bada8d7711f758981c3773
```


### Pausing the contract:
Before continuing have a look at design_pattern_decisions.md to read about the Emergency Stop Pattern there.

1) Start Truffle console and get the contract instance:
```
const proofOfExistence = await ProofOfExistence.at('<your-contract-address>')
```
2) Confirm the onwer has the Pauser role and the contract is not paused:
```
const owner_address = await web3.eth.getAccounts().then(a => {return a[0];})
proofOfExistence.isPauser(owner_address)
proofOfExistence.paused()
```
3) Pause the contract (only the owner can do so):
```
proofOfExistence.pause({from: owner_address})
proofOfExistence.paused()
```
4) Unpause the contract again:
```
proofOfExistence.unpaused()
```

### Upgrading the contract using ZeppelinOS:
Before continuing have a look at design_pattern_decisions.md to read about Upgradeability there.

1) Let's now extend the existing contract by adding a tracker of when the last registration occurred. Below line 26 of the contact add a new variable:
```
uint public lastTimestamp;
```
and below line 62 we update it each time a registration takes place:
```
lastTimestamp = now;
```
2) Now we are ready to push the new code to the network:
```
npx zos push
```
If this step throws an error ('No AST nodes with id <ID> found') then remove the old compiled contracts (`rm -rf client/src/contracts/*`) and try again (more info here: https://github.com/zeppelinos/zos/issues/465)
3) And update the existing proxy with the new logic contract:
```
npx zos update ProofOfExistence
```
4) Check that the getter function for our new public variable is set:
```
const proofOfExistence = await ProofOfExistence.at('<your-contract-address>')
const lastTimestamp = await proofOfExistence.lastTimestamp()
```

Source:
https://docs.zeppelinos.org/docs/upgrading.html

### Using truffle console:
You can interact with the deployed contracts directly via Truffle console:
```
const account = web3.eth.getAccounts().then(a => {return a[0];})
const proofOfExistence = await ProofOfExistence.at(ProofOfExistence.address)
const count = await proofOfExistence.count()
const ids = await proofOfExistence.getIdsForAddress.call(await web3.eth.getAccounts().then(a => {return a[0];}))
```

### Linting:
You can run a linting script (first make `lint_all` executable: `chmod +x lint_all`) which runs the common linters:
```
./lint_all

```
More linters (some with issues due to React/ZeppelinOS setup):
```
myth -x contracts/ProofOfExistence.sol
myth --truffle
slither contracts/ProofOfExistence.sol
```

## For production:
Build for production:
```
cd client && npm run build
```

### Deployment to IPFS

1. Change environment variable to `production`

2. Check webpack to make sure all compression settings are correct

3. Run
```
$ ipfs daemon
# and
$ ipfs add -r public
```

### Known issues:
Due to my limited React knowledge the current app won't properly load all registrations if a user has more than 12 (i.e. the first set of) registrations. This is a React only issue and as such not part of the scope of this project.

Access mobile cam from web app:
https://stackoverflow.com/questions/8581081/how-to-access-a-mobiles-camera-from-a-web-app
https://www.html5rocks.com/en/tutorials/getusermedia/intro/
https://www.smashingmagazine.com/2018/04/audio-video-recording-react-native-expo/
