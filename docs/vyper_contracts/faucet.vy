# Faucet

# Faucet params
# Event for logging that coins were sent
Deposit: event({_from: address, _amount: wei_value})
Withdrawal: event({_to: address, _amount: wei_value})

# Contract owner can withdraw funds
owner: public(address)

# Create a faucet with the owner set
# to the deployer of the contract.
@public
def __init__():
    self.owner = msg.sender

# Give out ether to anyone who asks
@public
def withdraw(_withdraw_amount: wei_value):
    # Limit withdrawal amount
    assert _withdraw_amount <= as_wei_value(0.1, 'ether')
    # Check for enough balance
    assert self.balance >= _withdraw_amount
    # Log withdrawal
    log.Withdrawal(msg.sender, _withdraw_amount)
    # Send the amount to the address that requested it
    send(msg.sender, _withdraw_amount)
    

# Accept any incoming amount
@public
@payable
def __default__():
    log.Deposit(msg.sender, msg.value)

# Delete the contract and send any remaining funds to owner
@public
def destroy():
    assert msg.sender == self.owner
    selfdestruct(self.owner)
