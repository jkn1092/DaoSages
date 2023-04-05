// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./DAOSage.sol";

contract DAOSageGovernance is Ownable{

    struct Vote {
        bool voted;
        uint8 weight;
    }

    struct Proposal {
        string name;
        string description;
        address owner;
        bool validated;
        uint voteCount;
    }

    DAOSage daoSage;
    Proposal[] public proposals;
    mapping(uint => mapping(address => Vote)) proposalsVoted;

    // Define an event to log when a new proposal is submitted
    event ProposalSubmitted(address owner, uint id, string name, string description);

    // Define an event to log when a vote is submitted
    event VoteSubmitted(address indexed voter, uint indexed id, bool voted);

    // Define an event to log when a proposal is validated
    event ProposalValidated(uint id);

    modifier onlyParticipants() {
        require( daoSage.isParticipant(msg.sender) ,"Not participant");
        _;
    }

    constructor(address _daoAddress){
        daoSage = DAOSage(_daoAddress);
    }

    function submitProposal(string calldata _name, string calldata _desc) public onlyParticipants {
        require(bytes(_name).length > 0 && bytes(_desc).length > 0,
            "Proposal name and description must not be empty.");

        Proposal memory newProposal;
        newProposal.name = _name;
        newProposal.description = _desc;
        newProposal.owner = msg.sender;
        proposals.push(newProposal);

        emit ProposalSubmitted(msg.sender, proposals.length - 1, _name, _desc);
    }

    function getProposal(uint _id) public view returns(Proposal memory) {
        require(_id < proposals.length, 'Proposal not found');

        return proposals[_id];
    }

    function submitVote(uint _id) public onlyParticipants {
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

    function withdrawVote(uint _id) public onlyParticipants {
        require(_id < proposals.length, 'Proposal not found');
        require(proposalsVoted[_id][msg.sender].voted, 'Already withdrawn');

        proposalsVoted[_id][msg.sender].voted = false;
        proposals[_id].voteCount -= proposalsVoted[_id][msg.sender].weight;

        emit VoteSubmitted(msg.sender, _id, false);
    }
}