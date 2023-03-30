// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.18;

import "./Escrow.sol";

contract DAOSage {

    struct Project {
        uint id;
        string name;
        address owner;
        bool validated;
    }

    struct Proposal {
        uint id;
        string name;
        string description;
        address owner;
        bool validated;
        uint voteCount;
    }

    address public admin;
    uint public projectCount;
    mapping(uint => Project) public projects;
    mapping(uint => mapping(address => uint8)) public projectsAudited;

    Proposal[] public proposals;
    mapping(uint => mapping(address => bool)) public proposalsVoted;

    mapping(address => bool) public wise;
    mapping(address => bool) public brainers;
    mapping(address => bool) public finders;

    // Define an event to log when a new project is submitted
    event ProjectSubmitted(address owner, uint projectId, string projectName);

    // Define an event to log when an audit is submitted
    event AuditSubmitted(address voter, uint projectId, uint8 grade);

    // Define an event to log when a project is validated
    event ProjectValidated(uint projectId);

    // Define an event to log when a project is rejected
    event ProjectRejected(uint projectId);

    // Define an event to log when a new proposal is submitted
    event ProposalSubmitted(address owner, uint proposalId, string proposalName);

    // Define an event to log when a vote is submitted
    event VoteSubmitted(address voter, uint proposalId);

    // Define an event to log when a vote is withdrawn
    event VoteWithdraw(address voter, uint proposalId);

    // Define an event to log when a proposal is validated
    event ProposalValidated(uint proposalId);

    constructor() {
        admin = msg.sender;
        wise[msg.sender] = true;
    }

    function submitProject(string memory _name) payable public {
        require(bytes(_name).length > 0, "Project name must not be empty.");

        projectCount++;
        Project memory newProject;
        newProject.id = projectCount;
        newProject.name = _name;
        newProject.owner = msg.sender;
        projects[projectCount] = newProject;

        emit ProjectSubmitted(msg.sender, projectCount, _name);
    }

    function auditProject(uint256 _index, uint8 _grade) public {
        require(_index >= 0 && _index <= projectCount, "Invalid project index.");
        require(_grade >= 0 && _grade <= 10, "Grade must be between 1 and 10.");

        projectsAudited[_index][msg.sender] = _grade;

        emit AuditSubmitted(msg.sender, _index, _grade);
    }

    function getProjectsCount() public view returns (uint256) {
        return projectCount;
    }

    function getProject(uint256 _index) public view returns (address, string memory) {
        require(_index > 0 && _index <= projectCount, "Invalid project index.");
        Project memory project = projects[_index];
        return (project.owner, project.name);
    }

    function validateProject(uint _id) public {
        require(_id > 0 && _id <= projectCount, "Invalid project index.");
        require(!projects[_id].validated, "Project has already been validated.");
        require(wise[msg.sender], "Validation done only by wise.");
        projects[_id].validated = true;

        emit ProjectValidated(_id);
    }

    function submitProposal(string calldata _name, string calldata _desc) public {
        require(bytes(_name).length > 0 && bytes(_desc).length > 0,
            "Proposal name and description must not be empty.");

        Proposal memory newProposal;
        newProposal.id = proposals.length;
        newProposal.name = _name;
        newProposal.description = _desc;
        newProposal.owner = msg.sender;
        proposals.push(newProposal);

        emit ProposalSubmitted(msg.sender, newProposal.id, _name);
    }

    function submitVote(uint _id) public {
        require(_id < proposals.length, 'Proposal not found');
        require(!proposalsVoted[_id][msg.sender], 'Already submitted');

        proposalsVoted[_id][msg.sender] = true;
        proposals[_id].voteCount++;

        emit VoteSubmitted(msg.sender, _id);
    }

    function withdrawVote(uint _id) public {
        require(_id < proposals.length, 'Proposal not found');
        require(proposalsVoted[_id][msg.sender], 'Already withdrawn');

        proposalsVoted[_id][msg.sender] = false;
        proposals[_id].voteCount--;

        emit VoteWithdraw(msg.sender, _id);
    }

    function validateProposal(uint _id) public {
        require(_id < proposals.length, 'Proposal not found');
        require(!proposals[_id].validated, "Proposal has already been validated.");
        require(wise[msg.sender], "Validation done only by wise.");
        proposals[_id].validated = true;

        emit ProposalValidated(_id);
    }
}


