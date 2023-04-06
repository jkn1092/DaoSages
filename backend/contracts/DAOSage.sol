// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title DAOSage
 * @notice This contract for a DAO with ERC721 tokens that represent different roles within the organization.
 * @dev Members with these roles (finders, brainers, wisemen) can submit and audit projects,
 * and a total score is calculated for each project based on the grades it receives.
 * @author Jeremy Narrainasamy
 */
contract DAOSage is Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    /// @dev Struct to define the tokenIds a participant has for each role.
    struct Participant {
        uint tokenFinder;                       // ERC721 token ID for "finder" role
        uint tokenBrainer;                      // ERC721 token ID for "brainer" role
        uint tokenWisemen;                      // ERC721 token ID for "wisemen" role
    }

    /// @dev Struct to define an audit of a project.
    struct Audit {
        bool audited;                           // Indicates if the project has been audited
        uint8 grade;                            // The grade (0-10) given to the project
    }

    /// @dev Struct to define a project.
    struct Project {
        string name;                            // The name of the project
        address owner;                          // The address of the project owner
        mapping(address => Audit) audits;       // Mapping of auditor addresses to their audit
        uint totalScore;                        // The total score of the project
        uint nbScore;                           // The number of auditors who have audited the project
    }

    // The number of registered addresses
    uint public nbRegisteredAddress;

    // Mapping of participant addresses to their roles
    mapping(address => Participant) public participants;

    // Array of all projects
    Project[] public projects;

    /// @dev Define an event to log when a new project is submitted
    event ProjectSubmitted(address owner, uint id, string name);

    /// @dev Define an event to log when an audit is submitted
    event AuditSubmitted(address indexed voter, uint indexed id, uint8 grade);

    /// @dev Modifier that restricts a function to finders and wisemen.
    modifier onlyFinders() {
        require( _exists(participants[msg.sender].tokenFinder) || _exists(participants[msg.sender].tokenWisemen) ,
            "Not finder or wisemen");
        _;
    }

    /// @dev Modifier that restricts a function to brainers and wisemen.
    modifier onlyBrainers() {
        require( _exists(participants[msg.sender].tokenBrainer) || _exists(participants[msg.sender].tokenWisemen),
            "Not brainer or wisemen");
        _;
    }

    /**
     * @dev Constructor that mints a "wisemen" token for the contract owner.
     * Initializes the ERC721 contract with the name "DaoSages" and the symbol "DS".
     */
    constructor() ERC721("DaoSages", "DS") {
        mintWisemen(msg.sender);
    }

    /**
     * @dev Function to mint a Finder token to the specified address and assigns the token URI
     * @param _to The address of the user to whom the token is to be minted
     */
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

    /**
     * @dev Function to mint a Brainer token to the specified address and assigns the token URI
     * @param _to The address of the user to whom the token is to be minted
     */
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

    /**
     * @dev Function to mint a Wisemen token to the specified address and assigns the token URI
     * @param _to The address of the user to whom the token is to be minted
     */
    function mintWisemen(address _to) onlyOwner public {
        require(!_exists(participants[_to].tokenWisemen), 'Already minted');

        _tokenIds.increment();
        uint newItemId = _tokenIds.current();
        _mint(_to, newItemId);
        _setTokenURI(newItemId, "https://gateway.pinata.cloud/ipfs/QmcTho9sZmAASyihTcKV2bkX4mrnDeyKTBHnYhM8tgpW7X/wise.json");
        participants[_to].tokenWisemen = newItemId;
        nbRegisteredAddress++;
    }

    /**
     * @dev Returns whether the calling address is a finder, a brainer, and/or a wiseman.
     * @return isFinder boolean indicating whether the calling address is a finder.
     * @return isBrainer boolean indicating whether the calling address is a brainer.
     * @return isWise boolean indicating whether the calling address is a wiseman.
     */
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

    /**
     * @dev Returns the URI of the calling address's finder token.
     * @return string containing the URI of a token
     */
    function tokenFinderURI() public view returns(string memory) {
        require(_exists(participants[msg.sender].tokenFinder), 'Finder not mint');
        return tokenURI(participants[msg.sender].tokenFinder);
    }

    /**
     * @dev Returns the URI of the calling address's brainer token.
     * @return string containing the URI of a token
     */
    function tokenBrainerURI() public view returns(string memory) {
        require(_exists(participants[msg.sender].tokenBrainer), 'Brainer not mint');
        return tokenURI(participants[msg.sender].tokenBrainer);
    }

    /**
     * @dev Returns the URI of the calling address's wisemen token.
     * @return string containing the URI of a token
     */
    function tokenWiseURI() public view returns(string memory) {
        require(_exists(participants[msg.sender].tokenWisemen), 'Wise not mint');
        return tokenURI(participants[msg.sender].tokenWisemen);
    }

    /**
     * @dev Function to submit a new project.
     * Only participants with the "Finder" or "Wisemen" tokens can execute this function.
     * Emits a ProjectSubmitted event.
     * @param _name The name of the project to be submitted.
     */
    function submitProject(string memory _name) public onlyFinders {
        require(bytes(_name).length > 0, "Project name must not be empty.");

        Project storage newProject = projects.push();
        newProject.name = _name;
        newProject.owner = msg.sender;

        emit ProjectSubmitted(msg.sender, projects.length-1, _name);
    }

    /**
     * @dev Function to audit a project.
     * Only participants with the "Brainer" or "Wisemen" tokens can execute this function.
     * Emits a AuditSubmitted event.
     * @param _index The id of the project to be audited.
     * @param _grade The grade of the project to be audited.
     */
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

    /**
     * @dev Function to get audit of a project.
     * @param _index The id of the project.
     * @return audit uint containing the audit of the project
     */
    function getAudit(uint256 _index) public view returns(uint audit) {
        require(_index >= 0 && _index < projects.length, "Invalid project index.");

        if( projects[_index].nbScore > 0 )
            audit = projects[_index].totalScore / projects[_index].nbScore;
    }

    /**
     * @dev Function to get weight of a voter based on the roles minted. Used by the DAOSageGovernance.
     * @param _voter The address of the voter.
     * @return weight uint containing the weight of the voter
     */
    function getVoteWeight(address _voter) public view returns(uint8 weight){
        if( _exists(participants[_voter].tokenWisemen) )
            weight = 4;
        else if( _exists(participants[_voter].tokenBrainer) )
            weight = 2;
        else
            weight = 1;
    }

    /**
     * @dev Function to check if an address is a participant. Used by the DAOSageGovernance.
     * @param _participant The address of the user.
     * @return boolean whether the user is a participant
     */
    function isParticipant(address _participant) public view returns(bool){
        return(_exists(participants[_participant].tokenFinder) || _exists(participants[_participant].tokenBrainer) ||
        _exists(participants[_participant].tokenWisemen));
    }
}