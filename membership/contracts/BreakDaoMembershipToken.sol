// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.1;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Base64.sol";

contract BreakDaoMembershipNFT is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(address => uint256) public nftHolders;

    event membershipNFTMinted(address sender, uint256 tokenId);

    constructor() ERC721("BreakDaoMembershipNFT", "BDM"){
        console.log("This is my NFT contract. Whoa!");
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        
        string memory json = Base64.encode(
            abi.encodePacked(
            '{"name": "Break DAO NFT #: ',
            Strings.toString(_tokenId),
            '", "description": "This NFT represents membership to the Break DAO, allowing access to its functions", "image": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia1.tenor.com%2Fimages%2F5e9fe704c40749047c8144e5f7df7b01%2Ftenor.gif%3Fitemid%3D15661473&f=1&nofb=1"}'
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
  
        return output;
    }

    function makeAnNFT() external{
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);

        console.log("Minted NFT for owner %s", string(abi.encodePacked(msg.sender)));

        string memory base64 = tokenURI(newItemId);
        _tokenIds.increment();
        _setTokenURI(newItemId, base64);
        nftHolders[msg.sender] = newItemId;
        emit membershipNFTMinted(msg.sender, newItemId);
    }

    function checkIfUserHasNft() public view returns (bool)
    {
        uint256 userNftTokenId = nftHolders[msg.sender];
        if(userNftTokenId > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

}
