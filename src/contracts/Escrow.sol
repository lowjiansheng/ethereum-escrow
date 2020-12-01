pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Escrow {

    address public buyer;
    address public seller;

    uint public sellingAmount;

    string public name;

    IERC20 public ercToken;

    enum State { Created, Active, Inactive, Release }

    State public currentState;

    constructor(address _tokenAddress, uint _sellingAmount) {
        name = "Escrow smart contract";
        seller = msg.sender;
        sellingAmount = _sellingAmount;
        ercToken = IERC20(_tokenAddress);

        currentState = State.Created;
    }

    modifier inState(State _state) {
        require(
            currentState == _state,
            "State is incorrect"
        );
        _;
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

    function refundBuyer() public onlySeller inState(State.Active) payable {
        require(
            ercToken.balanceOf(address(this)) == sellingAmount,
            "contract does not have enough balance"
        );

        ercToken.transfer(seller, sellingAmount);
        currentState = State.Inactive;
    }

    // This is sent once the buyer decides to buy the item
    function confirmPurchase() public inState(State.Created) payable {
        buyer = msg.sender;
        require(
            ercToken.balanceOf(buyer) > sellingAmount,
            "user does not have enough balance"
        );

        ercToken.transferFrom(buyer, address(this), sellingAmount);
        currentState = State.Active;
    }

    // once buyer received the item, will call this to release funds to seller
    function itemReceived() public onlyBuyer inState(State.Active) payable {
        require(
            ercToken.balanceOf(address(this)) >= sellingAmount,
            "contract does not have enough balance"
        ); 
        
        ercToken.transfer(seller, sellingAmount);
        currentState = State.Release;
    }

}