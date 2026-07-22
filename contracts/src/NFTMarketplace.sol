// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title NFTMarketplace
/// @notice A simple marketplace for listing and buying any ERC-721 token
///         at a fixed price. Sellers keep custody of their NFT (via
///         `approve`) until it sells; the marketplace never holds tokens.
contract NFTMarketplace is ReentrancyGuard, Ownable {
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;   // in wei
        bool active;
    }

    // nftContract => tokenId => Listing
    mapping(address => mapping(uint256 => Listing)) public listings;

    // Marketplace fee in basis points (e.g. 250 = 2.5%)
    uint256 public feeBps = 250;
    uint256 public constant MAX_FEE_BPS = 1000; // 10% hard cap
    address public feeRecipient;

    event Listed(address indexed nftContract, uint256 indexed tokenId, address indexed seller, uint256 price);
    event ListingCancelled(address indexed nftContract, uint256 indexed tokenId, address indexed seller);
    event ListingUpdated(address indexed nftContract, uint256 indexed tokenId, uint256 newPrice);
    event Sold(address indexed nftContract, uint256 indexed tokenId, address indexed buyer, address seller, uint256 price);

    constructor(address initialOwner, address _feeRecipient) Ownable(initialOwner) {
        require(_feeRecipient != address(0), "Marketplace: zero fee recipient");
        feeRecipient = _feeRecipient;
    }

    /// @notice List an NFT you own for sale at a fixed price.
    /// @dev Caller must have called `approve(marketplace, tokenId)` or
    ///      `setApprovalForAll(marketplace, true)` on the NFT contract first.
    function listItem(address nftContract, uint256 tokenId, uint256 price) external {
        require(price > 0, "Marketplace: price must be > 0");

        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Marketplace: not token owner");
        require(
            nft.isApprovedForAll(msg.sender, address(this)) ||
            nft.getApproved(tokenId) == address(this),
            "Marketplace: marketplace not approved"
        );

        listings[nftContract][tokenId] = Listing({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            active: true
        });

        emit Listed(nftContract, tokenId, msg.sender, price);
    }

    /// @notice Cancel an active listing you created.
    function cancelListing(address nftContract, uint256 tokenId) external {
        Listing storage listing = listings[nftContract][tokenId];
        require(listing.active, "Marketplace: listing not active");
        require(listing.seller == msg.sender, "Marketplace: not seller");

        delete listings[nftContract][tokenId];
        emit ListingCancelled(nftContract, tokenId, msg.sender);
    }

    /// @notice Update the price of an active listing you created.
    function updateListingPrice(address nftContract, uint256 tokenId, uint256 newPrice) external {
        Listing storage listing = listings[nftContract][tokenId];
        require(listing.active, "Marketplace: listing not active");
        require(listing.seller == msg.sender, "Marketplace: not seller");
        require(newPrice > 0, "Marketplace: price must be > 0");

        listing.price = newPrice;
        emit ListingUpdated(nftContract, tokenId, newPrice);
    }

    /// @notice Buy a listed NFT by sending exactly the listing price in ETH.
    function buyItem(address nftContract, uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[nftContract][tokenId];
        require(listing.active, "Marketplace: listing not active");
        require(msg.value == listing.price, "Marketplace: incorrect payment");

        // Effects: clear listing before external calls
        delete listings[nftContract][tokenId];

        // Interactions: move funds, then move the NFT
        uint256 fee = (listing.price * feeBps) / 10_000;
        uint256 sellerProceeds = listing.price - fee;

        IERC721(nftContract).safeTransferFrom(listing.seller, msg.sender, tokenId);

        (bool feeSent, ) = payable(feeRecipient).call{value: fee}("");
        require(feeSent, "Marketplace: fee transfer failed");

        (bool sellerSent, ) = payable(listing.seller).call{value: sellerProceeds}("");
        require(sellerSent, "Marketplace: seller transfer failed");

        emit Sold(nftContract, tokenId, msg.sender, listing.seller, listing.price);
    }

    /// @notice Owner can adjust the marketplace fee (capped at MAX_FEE_BPS).
    function setFeeBps(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= MAX_FEE_BPS, "Marketplace: fee too high");
        feeBps = newFeeBps;
    }

    /// @notice Owner can update where fees are sent.
    function setFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Marketplace: zero address");
        feeRecipient = newRecipient;
    }

    function getListing(address nftContract, uint256 tokenId) external view returns (Listing memory) {
        return listings[nftContract][tokenId];
    }
}
