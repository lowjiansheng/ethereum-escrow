pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Escrow {

    address public buyer;
    address public seller;

    uint32 sellingAmount;

    string public name;

    ERC20 public ercToken;

    constructor(address _tokenAddress, uint32 _sellingAmount) {
        name = "Escrow smart contract";
        seller = msg.sender;
        sellingAmount = _sellingAmount;
        ercToken = ERC20(_tokenAddress);
    }

    modifier onlyBuyer() {
        require(
            msg.sender == buyer,
            "only buyer can call this."
        );
        _;
    }

    modifier onlySeller() {
        require(
            msg.sender == seller,
            "only seller can call this."
        );
        _;
    }

    // This is sent once the buyer decides to buy the item
    function confirmPurchase() public onlyBuyer payable {
        buyer = msg.sender;
        require(
            ercToken.balanceOf(buyer) > sellingAmount,
            "user does not have enough balance"
        );

        ercToken.transferFrom(buyer, address(this), sellingAmount);
    }

    // once buyer received the item, will call this to release funds to seller
    function itemReceived() public onlyBuyer payable {
        ercToken.transfer(seller, sellingAmount);
    }

}