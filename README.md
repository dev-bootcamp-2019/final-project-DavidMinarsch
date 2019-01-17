# final-project-DavidMinarsch

## To run:
Ensure Node.js version is aligned:
```
nvm install
```

Start ganache-cli test blockchain:
```
ganache-cli --deterministic
```
In second terminal window start the dev-server
```
cd client && npm run start
```
make sure MetaMask points to correct network


All available commands:

  Compile:              truffle compile
  Migrate:              truffle migrate
  Test contracts:       truffle test
  Test dapp:            cd client && npm test
  Run dev server:       cd client && npm run start
  Build for production: cd client && npm run build


  Create logic contract:
  zos add MyContract
  zos session --network development --from SENDER_ADDRESS --expires $TIME_TO_EXPIRY
  zos push

  Create upgradeable instance:
  zos create MyContract --init initialize --args 42,hitchhiker

  Update:
  zos push
  zos update MyContract



<!-- let proofOfExistence = ProofOfExistence.deployed().then(function(instance) { return instance; })
 -->
web3.eth.getAccounts().then(a => {return a[0];})
var poe = await ProofOfExistence.at(ProofOfExistence.address)
let foo = await poe.count()
poe.count()
const resultAccountOne = await poe.getIdsForAddress.call(await web3.eth.getAccounts().then(a => {return a[0];}))
```
eslint migrations/**
eslint test/proofofexistence.js
eslint client/src/App.js
solhint "contracts/**/*.sol"
solhint "test/**/*.sol"
myth -x contracts/ProofOfExistence.sol
myth --truffle
slither .
solium -d contracts/
```

## Style guide
Follows:
https://solidity.readthedocs.io/en/develop/style-guide.html

## Run tests
```
truffle test
```


# Deployment Steps

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

Create IPFS hash:
https://github.com/saurfang/ipfs-multihash-on-solidity
https://ethereum.stackexchange.com/questions/52824/convert-hash-function-hex-to-bytes32
https://ethereum.stackexchange.com/questions/17094/how-to-store-ipfs-hash-using-bytes

Access mobile cam from web app:
https://stackoverflow.com/questions/8581081/how-to-access-a-mobiles-camera-from-a-web-app
https://www.html5rocks.com/en/tutorials/getusermedia/intro/
https://www.smashingmagazine.com/2018/04/audio-video-recording-react-native-expo/
