// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.1;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Base64.sol";

contract BreakNFT is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Team{
        uint teamIndex;
        string teamName;
        string teamImageURI;
    }

    mapping(address => uint256) public nftHolders;
    mapping(address => uint256) public nftHolderAttributes;

    Team[] sportsTeams;

    event teamNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
    

    constructor(string[] memory teamNames, string[] memory teamImageURIs) ERC721("BreakNFT", "BNFT"){
        
        for(uint i = 0; i < teamNames.length; i+=1)
        {
            sportsTeams.push(Team({
                teamIndex : i,
                teamName : teamNames[i],
                teamImageURI : teamImageURIs[i]
            }));

            Team memory t = sportsTeams[i];
            console.log("Initialized new team with name %s, img %s", t.teamName, t.teamImageURI);
        }
        console.log("This is my NFT contract. Whoa!");
        
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        Team memory team = sportsTeams[_tokenId];

        string memory json = Base64.encode(
            abi.encodePacked(
            '{"name": "',
            team.teamName,
            '-- NFT #: ',
            Strings.toString(_tokenId),
            '", "description": "This NFT represents the rights to the team chosen by the break participant", "image": "',
            team.teamImageURI,
            '"}'
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
  
        return output;
    }

    function makeAnNFT(uint _teamIndex) external{
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);

        console.log("Minted NFT for %s, owner is %s", sportsTeams[_teamIndex].teamName, string(abi.encodePacked(msg.sender)));

        string memory base64 = tokenURI(newItemId);
        _tokenIds.increment();
        _setTokenURI(newItemId, base64);
        nftHolders[msg.sender] = newItemId;
        emit teamNFTMinted(msg.sender, newItemId, _teamIndex);
    }

    function getAllDefaultTeams() public view returns (Team[] memory)
    {
        return sportsTeams;
    }

    function getTeam(uint256 index) public view returns(Team memory)
    {
        return sportsTeams[index];
    }

    function checkIfUserHasNft() public view returns (Team memory)
    {
        uint256 userNftTokenId = nftHolders[msg.sender];
        if(userNftTokenId > 0)
        {
            return sportsTeams[userNftTokenId];
        }
        else
        {
            Team memory empty;
            return empty;
        }
    }

}
