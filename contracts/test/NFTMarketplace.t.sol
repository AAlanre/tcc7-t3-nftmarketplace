// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {SimpleNFT} from "../src/SimpleNft.sol";
import {NFTMarketplace} from "../src/NFTMarketplace.sol";

contract NFTMarketplaceTest is Test {
    SimpleNFT internal nft;
    NFTMarketplace internal marketplace;

    address internal owner = makeAddr("owner");
    address internal seller = makeAddr("seller");
    address internal buyer = makeAddr("buyer");
    address internal feeRecipient = makeAddr("feeRecipient");

    uint256 internal constant MINT_PRICE = 0.01 ether;
    uint256 internal constant LIST_PRICE = 1 ether;
    uint256 internal constant TOKEN_ID = 0;

    event Listed(address indexed nftContract, uint256 indexed tokenId, address indexed seller, uint256 price);
    event ListingCancelled(address indexed nftContract, uint256 indexed tokenId, address indexed seller);
    event Sold(address indexed nftContract, uint256 indexed tokenId, address indexed buyer, address seller, uint256 price);

    function setUp() public {
        nft = new SimpleNFT(owner);
        marketplace = new NFTMarketplace(owner, feeRecipient);

        vm.deal(seller, 10 ether);
        vm.deal(buyer, 10 ether);

        vm.prank(seller);
        nft.mint{value: MINT_PRICE}(seller, "ipfs://token-0");
    }

    function _approveAndList() internal {
        vm.prank(seller);
        nft.approve(address(marketplace), TOKEN_ID);

        vm.prank(seller);
        marketplace.listItem(address(nft), TOKEN_ID, LIST_PRICE);
    }

    function test_ListItem_Succeeds() public {
        vm.prank(seller);
        nft.approve(address(marketplace), TOKEN_ID);

        vm.expectEmit(true, true, true, true);
        emit Listed(address(nft), TOKEN_ID, seller, LIST_PRICE);

        vm.prank(seller);
        marketplace.listItem(address(nft), TOKEN_ID, LIST_PRICE);

        NFTMarketplace.Listing memory listing = marketplace.getListing(address(nft), TOKEN_ID);
        assertTrue(listing.active);
        assertEq(listing.price, LIST_PRICE);
        assertEq(listing.seller, seller);
    }

    function test_ListItem_RevertsWithoutApproval() public {
        vm.prank(seller);
        vm.expectRevert("Marketplace: marketplace not approved");
        marketplace.listItem(address(nft), TOKEN_ID, LIST_PRICE);
    }

    function test_ListItem_RevertsIfNotOwner() public {
        vm.prank(buyer);
        vm.expectRevert("Marketplace: not token owner");
        marketplace.listItem(address(nft), TOKEN_ID, LIST_PRICE);
    }

    function test_BuyItem_TransfersNftAndSplitsFunds() public {
        _approveAndList();

        uint256 sellerBalBefore = seller.balance;
        uint256 feeBalBefore = feeRecipient.balance;

        vm.expectEmit(true, true, true, true);
        emit Sold(address(nft), TOKEN_ID, buyer, seller, LIST_PRICE);

        vm.prank(buyer);
        marketplace.buyItem{value: LIST_PRICE}(address(nft), TOKEN_ID);

        assertEq(nft.ownerOf(TOKEN_ID), buyer);

        uint256 feeBps = marketplace.feeBps();
        uint256 expectedFee = (LIST_PRICE * feeBps) / 10_000;
        uint256 expectedSellerProceeds = LIST_PRICE - expectedFee;

        assertEq(seller.balance, sellerBalBefore + expectedSellerProceeds);
        assertEq(feeRecipient.balance, feeBalBefore + expectedFee);

        NFTMarketplace.Listing memory listing = marketplace.getListing(address(nft), TOKEN_ID);
        assertFalse(listing.active);
    }

    function test_BuyItem_RevertsWithWrongPayment() public {
        _approveAndList();

        vm.prank(buyer);
        vm.expectRevert("Marketplace: incorrect payment");
        marketplace.buyItem{value: 0.5 ether}(address(nft), TOKEN_ID);
    }

    function test_BuyItem_RevertsIfListingInactive() public {
        vm.prank(buyer);
        vm.expectRevert("Marketplace: listing not active");
        marketplace.buyItem{value: LIST_PRICE}(address(nft), TOKEN_ID);
    }

    function test_CancelListing_Succeeds() public {
        _approveAndList();

        vm.expectEmit(true, true, true, true);
        emit ListingCancelled(address(nft), TOKEN_ID, seller);

        vm.prank(seller);
        marketplace.cancelListing(address(nft), TOKEN_ID);

        NFTMarketplace.Listing memory listing = marketplace.getListing(address(nft), TOKEN_ID);
        assertFalse(listing.active);
    }

    function test_CancelListing_RevertsIfNotSeller() public {
        _approveAndList();

        vm.prank(buyer);
        vm.expectRevert("Marketplace: not seller");
        marketplace.cancelListing(address(nft), TOKEN_ID);
    }

    function test_UpdateListingPrice_Succeeds() public {
        _approveAndList();

        uint256 newPrice = 2 ether;
        vm.prank(seller);
        marketplace.updateListingPrice(address(nft), TOKEN_ID, newPrice);

        NFTMarketplace.Listing memory listing = marketplace.getListing(address(nft), TOKEN_ID);
        assertEq(listing.price, newPrice);
    }

    function test_SetFeeBps_RevertsAboveCap() public {
        vm.prank(owner);
        vm.expectRevert("Marketplace: fee too high");
        marketplace.setFeeBps(2000);
    }

    function test_SetFeeBps_SucceedsWithinCap() public {
        vm.prank(owner);
        marketplace.setFeeBps(500);
        assertEq(marketplace.feeBps(), 500);
    }

    /// @dev Fuzz test: any valid price should split correctly between seller and fee recipient.
    function testFuzz_BuyItem_SplitsFundsCorrectly(uint96 price) public {
        vm.assume(price > 0 && price <= 100 ether);

        vm.prank(seller);
        nft.approve(address(marketplace), TOKEN_ID);
        vm.prank(seller);
        marketplace.listItem(address(nft), TOKEN_ID, price);

        vm.deal(buyer, uint256(price) + 1 ether);

        uint256 sellerBalBefore = seller.balance;
        uint256 feeBalBefore = feeRecipient.balance;

        vm.prank(buyer);
        marketplace.buyItem{value: price}(address(nft), TOKEN_ID);

        uint256 feeBps = marketplace.feeBps();
        uint256 expectedFee = (uint256(price) * feeBps) / 10_000;
        uint256 expectedSellerProceeds = uint256(price) - expectedFee;

        assertEq(seller.balance, sellerBalBefore + expectedSellerProceeds);
        assertEq(feeRecipient.balance, feeBalBefore + expectedFee);
        assertEq(nft.ownerOf(TOKEN_ID), buyer);
    }
}
