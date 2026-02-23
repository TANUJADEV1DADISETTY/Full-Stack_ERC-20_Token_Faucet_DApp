// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FaucetToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000 * 10 ** 18;
    address public faucet;

    constructor() ERC20("FaucetToken", "FTK") Ownable(msg.sender) {}

    function setFaucet(address _faucet) external onlyOwner {
        require(faucet == address(0), "Faucet already set");
        require(_faucet != address(0), "Invalid faucet address");
        faucet = _faucet;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == faucet, "Only faucet can mint");
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }
}
