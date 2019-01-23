const IPFS = require('ipfs-http-client');

const remoteConfig = { host: 'ipfs.infura.io', port: 5001, protocol: 'https' };
const ipfs = new IPFS(remoteConfig);

export default ipfs;