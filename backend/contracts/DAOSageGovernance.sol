// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./DAOSage.sol";

/**
 * @title DAOSageGovernance
 * @notice This contract is used for managing proposals and votes in a decentralized autonomous organization
 * @dev It allows participants to submit proposals, vote on them, and withdraw their votes.
 * @author Jeremy Narrainasamy
 */
contract DAOSageGovernance is Ownable{

    /// @dev Structs to define a Vote
    struct Vote {
        bool voted;                     // whether the participant has voted or not
        uint8 weight;                   // the weight of the vote (determined by the DAOSage)
    }

    /// @dev Structs to define a Proposal
    struct Proposal {
        string name;                    // the name of the proposal
        string description;             // the description of the proposal
        address owner;                  // the address of the participant who submitted the proposal
        bool validated;                 // the proposal has been validated or not
        uint voteCount;                 // the total weight of the votes received
    }

    // Instance of DAOSage contract
    DAOSage private daoSage;

    // Array to store all proposals. Public for testing access.
    Proposal[] public proposals;

    // Mapping to store the votes of each participant for each proposal
    mapping(uint => mapping(address => Vote)) private proposalsVoted;

    /// @dev Define an event to log when a new proposal is submitted
    event ProposalSubmitted(address owner, uint id, string name, string description);

    /// @dev Define an event to log when a vote is submitted or withdrawn
    event VoteSubmitted(address indexed voter, uint indexed id, bool voted);

    /// @dev Define an event to log when a proposal is validated
    event ProposalValidated(uint id);

    /// @dev Modifier to restrict access to only DAOSage participants
    modifier onlyParticipants() {
        require( daoSage.isParticipant(msg.sender) ,"Not participant");
        _;
    }

    /**
     * @dev Constructor to set the instance of the DAOSage contract.
     * @param _daoAddress The address of the DAOSage contract.
     */
    constructor(address _daoAddress){
        daoSage = DAOSage(_daoAddress);
    }

    /**
     * @dev Function to submit a new proposal.
     * Only participants with a token can execute this function.
     * Emits a ProposalSubmitted event.
     * @param _name The name of the proposal.
     * @param _desc The description of the proposal.
     */
    function submitProposal(string calldata _name, string calldata _desc) external onlyParticipants {
        require(bytes(_name).length > 0 && bytes(_desc).length > 0,
            "Proposal name and description must not be empty.");

        Proposal memory newProposal;
        newProposal.name = _name;
        newProposal.description = _desc;
        newProposal.owner = msg.sender;
        proposals.push(newProposal);

        emit ProposalSubmitted(msg.sender, proposals.length - 1, _name, _desc);
    }

    /**
     * @dev Function to get a specific proposal.
     * @param _id The ID of the proposal.
     * @return The proposal details.
     */
    function getProposal(uint _id) external view returns(Proposal memory) {
        require(_id < proposals.length, 'Proposal not found');

        return proposals[_id];
    }

    /**
     * @dev Function to submit a vote for a proposal.
     * Only participants with a token can execute this function.
     * Emits a VoteSubmitted event.
     * Emits a ProposalValidated event if proposal is validated.
     * @param _id The ID of the proposal.
     */
    function submitVote(uint _id) external onlyParticipants {
        require(_id < proposals.length, 'Proposal not found');
        require(!proposals[_id].validated, 'Already validated');
        require(!proposalsVoted[_id][msg.sender].voted, 'Already submitted');

        uint registered = daoSage.nbRegisteredAddress();
        proposalsVoted[_id][msg.sender].voted = true;
        proposalsVoted[_id][msg.sender].weight = daoSage.getVoteWeight(msg.sender);
        proposals[_id].voteCount += proposalsVoted[_id][msg.sender].weight;

        emit VoteSubmitted(msg.sender, _id, true);

        if( proposals[_id].voteCount > registered/2 )
        {
            proposals[_id].validated = true;
            emit ProposalValidated(_id);
        }
    }

    /**
     * @dev Function to withdraw a vote for a proposal.
     * Only participants with a token can execute this function.
     * Emits a VoteSubmitted event.
     * @param _id The ID of the proposal.
     */
    function withdrawVote(uint _id) external onlyParticipants {
        require(_id < proposals.length, 'Proposal not found');
        require(proposalsVoted[_id][msg.sender].voted, 'Already withdrawn');

        proposalsVoted[_id][msg.sender].voted = false;
        proposals[_id].voteCount -= proposalsVoted[_id][msg.sender].weight;

        emit VoteSubmitted(msg.sender, _id, false);
    }
}