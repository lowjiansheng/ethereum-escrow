pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(
        address _buyer,
        address _seller,
        uint256 amountToMint
    ) public ERC20("MockERC20", "MERC") {
        _mint(_buyer, amountToMint);
        _mint(_seller, amountToMint);
    }
}
