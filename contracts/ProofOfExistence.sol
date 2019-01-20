pragma solidity >=0.5.0 <0.6.0;

import "../node_modules/zos-lib/contracts/Initializable.sol";


/** @title ProofOfExistence
  * @author David Minarsch
  * @notice A contract to register hashes of data as a proof of existence of the data at a given point in time.
*/
contract ProofOfExistence is Initializable {

    address payable public beneficiary;
    uint public count;
    mapping ( bytes32 => uint ) private hashToId;
    mapping ( address => uint[] ) private registrantToIds;

    struct Registration {
        bytes32 hash;
        address registrant;
        uint timestamp;
    }

    mapping ( uint => Registration ) private idToRegistration;

    event LogRegistration(bytes32 indexed _hash, address indexed _registrant, uint indexed _id);
    event LogWithdrawal(address indexed _hash);
    event LogForcefulDonation(uint indexed _balance);

    // @dev Fallback to accept only ether sent to it forcefully.
    function () external {
        emit LogForcefulDonation(address(this).balance);
    }

    // @dev Function to withdraw ether sent forcefully to the contract for the beneficiary
    function withdraw()
        external
    {
        // We could check the beneficiary is calling this function; but if someone else calls 
        // this function we don't have to pay the gas fee so we don't actually care.
        // require(msg.sender == beneficiary, "Only the contract beneficiary can call this function.");

        // Send the amount to the beneficiary
        beneficiary.transfer(address(this).balance);
        emit LogWithdrawal(msg.sender);
    }

    /** @dev Function to register hash
      * @param _hash The IPFS hash.
    */
    function registerHash(bytes32 _hash) 
        external
    {
        // require (isValidHash(_hash));
        require(isNotRegistered(_hash), "This hash is already registered.");
        count += 1;
        uint _id = count;
        hashToId[_hash] = _id;
        registrantToIds[msg.sender].push(_id);
        idToRegistration[_id] = Registration(_hash, msg.sender, now);
        emit LogRegistration(_hash, msg.sender, _id);
    }

    // @dev Contract constructor: set beneficiary
    function initialize ()
        public
        initializer
    {
        beneficiary = msg.sender;
    }

    /** @dev Function which returns all registration data given an id.
      * @param _id of file.
      * @return hash The IPFS hash.
      * @return registrant The address of the registrant.
      * @return timestamp The timestamp when the registered happened.
    */
    function getRegistrationForId(uint _id)
        public
        view
        returns (bytes32 hash, address registrant, uint timestamp)
    {
        return (idToRegistration[_id].hash, idToRegistration[_id].registrant, idToRegistration[_id].timestamp);
    }

    /** @dev Function which returns all registration data given a hash.
      * @param _hash The IPFS hash.
      * @return hash The IPFS hash.
      * @return registrant The address of file registrant.
      * @return timestamp The timestamp when file was registered.
    */
    function getRegistrationForHash(bytes32 _hash)
        public
        view
        returns (bytes32 hash, address registrant, uint timestamp)
    {
        return getRegistrationForId(getIdForHash(_hash));
    }

    /** @dev Function which returns all ids for an address
      * @param _registrant Address of registrant.
      * @return _ids Array of ids.
    */
    function getIdsForAddress(address _registrant)
        public
        view
        returns (uint[] memory _ids)
    {
        return registrantToIds[_registrant];
    }

    /** @dev Function which returns id given a hash.
      * @param _hash The IPFS hash.
      * @return id The id.
    */
    function getIdForHash(bytes32 _hash)
        internal
        view
        returns (uint id)
    {
        return hashToId[_hash];
    }

    /** @dev Function to check that a hash is not registered.
      * @param _hash The IPFS hash
      * @return boolean
    */
    function isNotRegistered(bytes32 _hash) 
        internal
        view
        returns (bool)
    {
        return hashToId[_hash] == 0;
    }
}
