// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title SimpleNFT
/// @notice A minimal ERC-721 collection where anyone can mint a token by paying
///         a mint price and supplying a metadata URI (e.g. an IPFS link).
contract SimpleNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    uint256 public mintPrice = 0.01 ether;

    event Minted(address indexed to, uint256 indexed tokenId, string tokenURI);

    constructor(address initialOwner)
        ERC721("Simple NFT", "SNFT")
        Ownable(initialOwner)
    {}

    /// @notice Mint a new NFT to `to` with metadata at `uri`.
    function mint(address to, string memory uri) external payable returns (uint256) {
        require(msg.value >= mintPrice, "SimpleNFT: insufficient payment");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit Minted(to, tokenId, uri);
        return tokenId;
    }

    /// @notice Owner can update the mint price.
    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
    }

    /// @notice Owner can withdraw accumulated mint fees.
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "SimpleNFT: nothing to withdraw");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "SimpleNFT: withdraw failed");
    }

    function totalMinted() external view returns (uint256) {
        return _nextTokenId;
    }
}
