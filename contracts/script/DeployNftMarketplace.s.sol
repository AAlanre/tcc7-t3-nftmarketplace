// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {SimpleNFT} from "../src/SimpleNft.sol";
import {NFTMarketplace} from "../src/NFTMarketplace.sol";

/// @notice Deploys SimpleNFT and NFTMarketplace.
/// Usage (Sepolia):
///   forge script script/Deploy.s.sol --rpc-url  --broadcast --private-key <key>
/// Usage (testnet, reading PRIVATE_KEY from env):
///   forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify -vvvv
contract DeployNftMarketplace is Script {
    function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    vm.startBroadcast(deployerPrivateKey);

    address deployer = vm.addr(deployerPrivateKey);

    SimpleNFT nft = new SimpleNFT(deployer);
    console.log("SimpleNFT deployed to:", address(nft));

    NFTMarketplace marketplace = new NFTMarketplace(deployer, deployer);
    console.log("NFTMarketplace deployed to:", address(marketplace));

    vm.stopBroadcast();
    }
}