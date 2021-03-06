pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";
import "../access/roles/PauserRole.sol";


/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 */
contract Pausable is Initializable, PauserRole {
    event LogPaused();
    event LogUnpaused();

    bool private _paused = false;

    function initialize(address sender) public initializer {
        PauserRole.initialize(sender);
    }

    /**
      * @return true if the contract is paused, false otherwise.
    */
    function paused() public view returns(bool) {
        return _paused;
    }

    /**
      * @dev Modifier to make a function callable only when the contract is not paused.
    */
    modifier whenNotPaused() {
        require(!_paused, "Cannot be paused.");
        _;
    }

    /**
      * @dev Modifier to make a function callable only when the contract is paused.
    */
    modifier whenPaused() {
        require(_paused, "Must be paused.");
        _;
    }

    /**
      * @dev called by the owner to pause, triggers stopped state
    */
    function pause() public onlyPauser whenNotPaused {
        _paused = true;
        emit LogPaused();
    }

    /**
      * @dev called by the owner to unpause, returns to normal state
    */
    function unpause() public onlyPauser whenPaused {
        _paused = false;
        emit LogUnpaused();
    }

    uint256[50] private ______gap;
}
