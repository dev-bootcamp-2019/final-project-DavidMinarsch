# Simple Voting

# Simple Voting params
# Voter information
struct Voter:
    # indicates if voter has voted
    voted: bool
    # index of the voted proposal (meaningless unless `voted` is true)
    vote: int128

# Proposal information
struct Proposal:
    # short name
    name: bytes32
    # number of votes for this proposal
    voteCount: int128

admin: public(address)
voters: public(map(address, Voter))
proposals: public(map(int128, Proposal))
voterCount: public(int128)
voteEnd: public(timestamp)

# Create a simple voting contract
# with two proposals
@public
def __init__(_proposalNames: bytes32[2], _voteEnd: timestamp):
    self.admin = msg.sender
    self.voterCount = 0
    for i in range(2):
        self.proposals[i] = Proposal({
            name: _proposalNames[i],
            voteCount: 0
        })
    self.voteEnd = _voteEnd

# For `voter` to vote on proposal `proposals[proposal].name`.
@public
def vote(_proposal: int128):
    # Throw if vote ended
    assert block.timestamp < self.voteEnd
    # Throw if already voted
    assert not self.voters[msg.sender].voted
    # Throw if not a proposal
    assert _proposal < 2
    self.voters[msg.sender].vote = _proposal
    self.voters[msg.sender].voted = True
    self.proposals[_proposal].voteCount += 1

# Compute winning proposal.
@public
@constant
def winningProposal() -> int128:
    winning_vote_count: int128 = 0
    winning_proposal: int128 = 0
    for i in range(2):
        if self.proposals[i].voteCount > winning_vote_count:
            winning_vote_count = self.proposals[i].voteCount
            winning_proposal = i
    return winning_proposal

# Returns name of the winning proposal.
@public
@constant
def winnerName() -> bytes32:
    return self.proposals[self.winningProposal()].name

# Delete the contract and send any remaining funds to owner
@public
def destroy():
    assert msg.sender == self.admin
    selfdestruct(self.admin)
