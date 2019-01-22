# Simple Coin

# Simple Coin params
# Event for logging that coins were sent
Sent: event({_sender: address, _receiver: address, _amount: uint256})

# Minter can create new coins and assign them
minter: public(address)

# Keep track of who own's how many coins
balances: public(map(address, uint256))

# Create a simple coin with the minter set
# to the deployer of the contract.
@public
def __init__():
    self.minter = msg.sender

# Mint new coins for a _receiver to the given _amount
@public
def mint(_receiver: address, _amount: uint256):
    # Check if sender is allowed to mint
    assert msg.sender == self.minter
    # Add amount to balances
    self.balances[_receiver] += _amount

# Send simple coins from sender to receiver
@public
def send(_receiver: address, _amount: uint256):
    # The sender must have enough balances
    assert self.balances[msg.sender] >= _amount
    # Send _amount from sender to receiver in balances
    self.balances[msg.sender] -= _amount
    self.balances[_receiver] += _amount
    # Log coin sending event
    log.Sent(msg.sender, _receiver, _amount)