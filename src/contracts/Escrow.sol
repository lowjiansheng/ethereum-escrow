pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Escrow {

    address public buyer;
    address public seller;

    uint public sellingAmount;

    string public name;

    IERC20 public ercToken;

    enum State { Created, SellerInitialized, Active, Inactive, Release }

    State public currentState;

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

    // constructor should be called by the seller for initialisation
    constructor(address _tokenAddress) {
        name = "Escrow smart contract";
        
        ercToken = IERC20(_tokenAddress);

        currentState = State.Created;
    }

    // whoever calls this contract will be the seller
    function sellerInitialize(uint _sellingAmount) public inState(State.Created) payable {
        seller = msg.sender;

        sellingAmount = _sellingAmount;
        // seller sends over 2x of the amount to this smart contract
        ercToken.transferFrom(seller, address(this), 2 * sellingAmount);

        currentState = State.SellerInitialized;
    }

    // This is sent when the buyer decides to buy the item
    function purchase() public inState(State.SellerInitialized) payable {
        buyer = msg.sender;
        require(
            ercToken.balanceOf(buyer) > sellingAmount,
            "user does not have enough balance"
        );

        // buyer sends over 2x of the amount to this smart contract
        ercToken.transferFrom(buyer, address(this), 2 * sellingAmount);
        
        currentState = State.Active;
    }

    // if buyer doesn't initiate a purchase, allow the seller to get back the funds
    function cancelPurchase() public onlySeller inState(State.Created) payable {
        require(
            ercToken.balanceOf(address(this)) == 2 * sellingAmount,
            "this address does not have enough balance"
        );

        ercToken.transfer(seller, 2 * sellingAmount);
    }

    function refundBuyer() public onlySeller inState(State.Active) payable {
        require(
            ercToken.balanceOf(address(this)) == 4 * sellingAmount,
            "contract does not have enough balance"
        );

        ercToken.transfer(seller, 2 * sellingAmount);
        ercToken.transfer(buyer, 2 * sellingAmount);

        currentState = State.Inactive;
    }

    // once buyer received the item, will call this to release funds to seller
    function itemReceived() public onlyBuyer payable {
        require(
            ercToken.balanceOf(address(this)) == 4 * sellingAmount,
            "contract does not have enough balance"
        ); 
        
        ercToken.transfer(seller, 3 * sellingAmount);
        ercToken.transfer(buyer, sellingAmount);

        currentState = State.Release;
    }

}