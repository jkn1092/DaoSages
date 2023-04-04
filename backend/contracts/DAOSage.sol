// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DAOSage is Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Participant {
        uint tokenFinder;
        uint tokenBrainer;
        uint tokenWisemen;
    }

    struct Audit {
        bool audited;
        uint8 grade;
    }

    struct Project {
        uint id;
        string name;
        address owner;
        mapping(address => Audit) audits;
        uint totalScore;
        uint nbScore;
    }

    struct Proposal {
        uint id;
        string name;
        string description;
        address owner;
        bool validated;
        uint voteCount;
    }

    address[] registeredAddress;
    mapping(address => Participant) public participants;
    Project[] public projects;
    Proposal[] public proposals;
    mapping(uint => mapping(address => bool)) public proposalsVoted;

    // Define an event to log when a new project is submitted
    event ProjectSubmitted(address owner, uint id, string name);

    // Define an event to log when an audit is submitted
    event AuditSubmitted(address indexed voter, uint indexed id, uint8 grade);

    // Define an event to log when a new proposal is submitted
    event ProposalSubmitted(address owner, uint id, string name, string description);

    // Define an event to log when a vote is submitted
    event VoteSubmitted(address indexed voter, uint indexed id, bool voted);

    // Define an event to log when a proposal is validated
    event ProposalValidated(uint id);

    modifier onlyFinders() {
        require( (_exists(participants[msg.sender].tokenFinder) && _ownerOf(participants[msg.sender].tokenFinder) == msg.sender)
            || (_exists(participants[msg.sender].tokenWisemen) && _ownerOf(participants[msg.sender].tokenWisemen) == msg.sender),
            "Not finder or wisemen");
        _;
    }

    modifier onlyBrainers() {
        require( (_exists(participants[msg.sender].tokenBrainer) && _ownerOf(participants[msg.sender].tokenBrainer) == msg.sender)
            || (_exists(participants[msg.sender].tokenWisemen) && _ownerOf(participants[msg.sender].tokenWisemen) == msg.sender),
            "Not brainer or wisemen");
        _;
    }

    constructor() ERC721("DaoSages", "DS") {
        mintWisemen(msg.sender);
    }

    function submitProject(string memory _name) public onlyFinders {
        require(bytes(_name).length > 0, "Project name must not be empty.");

        Project storage newProject = projects.push();
        newProject.name = _name;
        newProject.owner = msg.sender;

        emit ProjectSubmitted(msg.sender, projects.length-1, _name);
    }

    function auditProject(uint256 _index, uint8 _grade) public onlyBrainers {
        require(_index >= 0 && _index < projects.length, "Invalid project index.");
        require(_grade >= 0 && _grade <= 10, "Grade must be between 1 and 10.");

        if( projects[_index].audits[msg.sender].audited )
        {
            uint totalScore = projects[_index].totalScore;
            totalScore -= projects[_index].audits[msg.sender].grade;
            totalScore += _grade;
            projects[_index].totalScore = totalScore;
        }
        else
        {
            projects[_index].nbScore++;
            projects[_index].totalScore += _grade;
            projects[_index].audits[msg.sender].audited = true;
        }
        projects[_index].audits[msg.sender].grade = _grade;

        emit AuditSubmitted(msg.sender, _index, _grade);
    }

    function getAudit(uint256 _index) public view returns(uint audit) {
        require(_index >= 0 && _index < projects.length, "Invalid project index.");

        if( projects[_index].nbScore > 0 )
            audit = projects[_index].totalScore / projects[_index].nbScore;
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

        emit ProposalSubmitted(msg.sender, newProposal.id, _name, _desc);
    }

    function getProposal(uint _id) public view returns(Proposal memory) {
        require(_id < proposals.length, 'Proposal not found');

        return proposals[_id];
    }

    function submitVote(uint _id) public {
        require(_id < proposals.length, 'Proposal not found');
        require(!proposals[_id].validated, 'Already validated');
        require(!proposalsVoted[_id][msg.sender], 'Already submitted');

        proposalsVoted[_id][msg.sender] = true;
        proposals[_id].voteCount++;

        emit VoteSubmitted(msg.sender, _id, true);

        if( proposals[_id].voteCount > registeredAddress.length/2 )
        {
            proposals[_id].validated = true;
            emit ProposalValidated(_id);
        }
    }

    function withdrawVote(uint _id) public {
        require(_id < proposals.length, 'Proposal not found');
        require(proposalsVoted[_id][msg.sender], 'Already withdrawn');

        proposalsVoted[_id][msg.sender] = false;
        proposals[_id].voteCount--;

        emit VoteSubmitted(msg.sender, _id, false);
    }

    function mintFinder(address _to) external {
        require(!_exists(participants[_to].tokenFinder), 'Already minted');

        _tokenIds.increment();
        uint newItemId = _tokenIds.current();
        _mint(_to, newItemId);
        _setTokenURI(newItemId, "https://gateway.pinata.cloud/ipfs/QmPAZCi2WSKkG8kn5cDzK6Z8cUP19szPhU4nN44Ta9uUN6/finder.json");
        participants[_to].tokenFinder = newItemId;
        registeredAddress.push(_to);
    }

    function mintBrainer(address _to) external {
        require(!_exists(participants[_to].tokenBrainer), 'Already minted');

        _tokenIds.increment();
        uint newItemId = _tokenIds.current();
        _mint(_to, newItemId);
        _setTokenURI(newItemId, "https://gateway.pinata.cloud/ipfs/QmPAZCi2WSKkG8kn5cDzK6Z8cUP19szPhU4nN44Ta9uUN6/brainer.json");
        participants[_to].tokenBrainer = newItemId;
        registeredAddress.push(_to);
    }

    function mintWisemen(address _to) onlyOwner public {
        require(!_exists(participants[_to].tokenWisemen), 'Already minted');

        _tokenIds.increment();
        uint newItemId = _tokenIds.current();
        _mint(_to, newItemId);
        _setTokenURI(newItemId, "https://gateway.pinata.cloud/ipfs/QmPAZCi2WSKkG8kn5cDzK6Z8cUP19szPhU4nN44Ta9uUN6/wise.json");
        participants[_to].tokenWisemen = newItemId;
        registeredAddress.push(_to);
    }

    function getRoles() public view returns (bool isFinder, bool isBrainer, bool isWise) {
        uint tokenFinder = participants[msg.sender].tokenFinder;
        uint tokenBrainer = participants[msg.sender].tokenBrainer;
        uint tokenWisemen = participants[msg.sender].tokenWisemen;

        if(_exists(tokenFinder) && _ownerOf(tokenFinder) == msg.sender)
            isFinder = true;

        if(_exists(tokenBrainer) && _ownerOf(tokenBrainer) == msg.sender)
            isBrainer = true;

        if(_exists(tokenWisemen) && _ownerOf(tokenWisemen) == msg.sender)
            isWise = true;
    }
}


