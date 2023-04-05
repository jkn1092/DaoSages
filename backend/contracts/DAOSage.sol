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
        string name;
        address owner;
        mapping(address => Audit) audits;
        uint totalScore;
        uint nbScore;
    }

    uint public nbRegisteredAddress;
    mapping(address => Participant) public participants;
    Project[] public projects;

    // Define an event to log when a new project is submitted
    event ProjectSubmitted(address owner, uint id, string name);

    // Define an event to log when an audit is submitted
    event AuditSubmitted(address indexed voter, uint indexed id, uint8 grade);

    modifier onlyFinders() {
        require( _exists(participants[msg.sender].tokenFinder) || _exists(participants[msg.sender].tokenWisemen) ,
            "Not finder or wisemen");
        _;
    }

    modifier onlyBrainers() {
        require( _exists(participants[msg.sender].tokenBrainer) || _exists(participants[msg.sender].tokenWisemen),
            "Not brainer or wisemen");
        _;
    }

    constructor() ERC721("DaoSages", "DS") {
        mintWisemen(msg.sender);
    }

    function mintFinder(address _to) external payable {
        require(!_exists(participants[_to].tokenFinder), 'Already minted');
        require(msg.value >= 0.01 ether, 'insufficient eth');

        _tokenIds.increment();
        uint newItemId = _tokenIds.current();
        _mint(_to, newItemId);
        _setTokenURI(newItemId, "https://gateway.pinata.cloud/ipfs/QmcTho9sZmAASyihTcKV2bkX4mrnDeyKTBHnYhM8tgpW7X/finder.json");
        participants[_to].tokenFinder = newItemId;
        nbRegisteredAddress++;
    }

    function mintBrainer(address _to) external payable{
        require(!_exists(participants[_to].tokenBrainer), 'Already minted');
        require(msg.value >= 0.02 ether, 'insufficient eth');

        _tokenIds.increment();
        uint newItemId = _tokenIds.current();
        _mint(_to, newItemId);
        _setTokenURI(newItemId, "https://gateway.pinata.cloud/ipfs/QmcTho9sZmAASyihTcKV2bkX4mrnDeyKTBHnYhM8tgpW7X/brainer.json");
        participants[_to].tokenBrainer = newItemId;
        nbRegisteredAddress++;
    }

    function mintWisemen(address _to) onlyOwner public {
        require(!_exists(participants[_to].tokenWisemen), 'Already minted');

        _tokenIds.increment();
        uint newItemId = _tokenIds.current();
        _mint(_to, newItemId);
        _setTokenURI(newItemId, "https://gateway.pinata.cloud/ipfs/QmcTho9sZmAASyihTcKV2bkX4mrnDeyKTBHnYhM8tgpW7X/wise.json");
        participants[_to].tokenWisemen = newItemId;
        nbRegisteredAddress++;
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

    function tokenFinderURI() public view returns(string memory) {
        require(_exists(participants[msg.sender].tokenFinder), 'Finder not mint');
        return tokenURI(participants[msg.sender].tokenFinder);
    }

    function tokenBrainerURI() public view returns(string memory) {
        require(_exists(participants[msg.sender].tokenBrainer), 'Brainer not mint');
        return tokenURI(participants[msg.sender].tokenBrainer);
    }

    function tokenWiseURI() public view returns(string memory) {
        require(_exists(participants[msg.sender].tokenWisemen), 'Wise not mint');
        return tokenURI(participants[msg.sender].tokenWisemen);
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

    function getVoteWeight(address _voter) public view returns(uint8 weight){
        if( _exists(participants[_voter].tokenWisemen) )
            weight = 4;
        else if( _exists(participants[_voter].tokenBrainer) )
            weight = 2;
        else
            weight = 1;
    }

    function isParticipant(address _participant) public view returns(bool){
        return(_exists(participants[_participant].tokenFinder) || _exists(participants[_participant].tokenBrainer) ||
        _exists(participants[_participant].tokenWisemen));
    }
}