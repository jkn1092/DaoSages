pragma solidity ^0.8.18;

import "./Escrow.sol";

contract DAOSage {

    struct Project {
        uint id;
        string name;
        address owner;
        address escrowWallet;
        bool validated;
    }

    address public admin;
    uint public projectCount;
    mapping(uint => Project) public projects;
    mapping(uint => mapping(address => uint8)) public projectsVotes;
    mapping(address => bool) public wise;
    mapping(address => bool) public brainers;

    // Define an event to log when a new project is submitted
    event ProjectSubmitted(address owner, uint id);

    // Define an event to log when a vote is submitted
    event VoteSubmitted(address voter, uint projectId, uint8 grade);

    // Define an event to log when a project is validated
    event ProjectValidated(address owner, uint id);

    // Define an event to log when a project is rejected
    event ProjectRejected(address owner, uint id);

    constructor() {
        admin = msg.sender;
        wise[msg.sender] = true;
    }

    function submitProject(string memory _name) payable public {
        require(bytes(_name).length > 0, "Project name must not be empty.");
        projectCount++;
        Escrow newEscrow = new Escrow(address(this), msg.sender, msg.value);
        Project memory newProject;
        newProject.id = projectCount;
        newProject.name = _name;
        newProject.owner = msg.sender;
        newProject.escrowWallet = address(newEscrow);
        projects[projectCount] = newProject;

        emit ProjectSubmitted(msg.sender, projectCount);
    }

    function vote(uint256 _index, uint8 _grade) public {
        require(_index >= 0 && _index <= projectCount, "Invalid project index.");
        require(_grade >= 0 && _grade <= 10, "Grade must be between 1 and 10.");

        projectsVotes[_index][msg.sender] = _grade;

        emit VoteSubmitted(msg.sender, _index, _grade);
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
        require(!projects[_id].validated, "Proposal has already been executed.");
        require(wise[msg.sender], "Validation done only by wise.");
        projects[_id].validated = true;
        Escrow escrow = Escrow(projects[_id].escrowWallet);
        escrow.release();

        emit ProjectValidated(msg.sender, projectCount);
    }

}


