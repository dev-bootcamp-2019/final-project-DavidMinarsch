# final-project-DavidMinarsch

## Style guide
This project's solidity code follows:
https://solidity.readthedocs.io/en/develop/style-guide.html

## Setup:
Go to root folder and ensure Node.js version is aligned:
```
nvm install
```
Install all dependencies for truffle:
```

```
Install all dependencies for client:
```
cd client && npm install
```

## For development:
1) Start a test blockchain (in deterministic mode: so it generates deterministic addresses based on a pre-defined mnemonic) with ganache:
```
ganache-cli --deterministic
```
2) In a second terminal window test contracts for expected behaviour:
```
truffle test
```
3) Migrate contracts onto the test blockchain:
```
truffle migrate
```
4) Test dapp:
```
cd client && npm test
```
5) Start the dev-server
```
cd client && npm run start
```
6) Make sure MetaMask points to correct network and has your account loaded.


### Truffle console:
You can interact with the deployed contracts directly via Truffle console:
```
const account = web3.eth.getAccounts().then(a => {return a[0];})
const poe = await ProofOfExistence.at(ProofOfExistence.address)
const count = await poe.count()
const ids = await poe.getIdsForAddress.call(await web3.eth.getAccounts().then(a => {return a[0];}))
```

### Linting:
You can run a linting script (first make `lint_all` executable: `chmod +x lint_all`) which runs the common linters:
```
./lint_all

```
More linters (some with issues due to React/Zos setup):
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

### Deployment Steps


##

  Create logic contract:
  zos add MyContract
  zos session --network development --from SENDER_ADDRESS --expires $TIME_TO_EXPIRY
  zos push

  Create upgradeable instance:
  zos create MyContract --init initialize --args 42,hitchhiker

  Update:
  zos push
  zos update MyContract







## To IPFS

1. Change environment variable to `production`

2. Check webpack to make sure all compression settings are correct

3. Run
```
$ ipfs daemon
# and
$ ipfs add -r public
```


Guide:



Access mobile cam from web app:
https://stackoverflow.com/questions/8581081/how-to-access-a-mobiles-camera-from-a-web-app
https://www.html5rocks.com/en/tutorials/getusermedia/intro/
https://www.smashingmagazine.com/2018/04/audio-video-recording-react-native-expo/
