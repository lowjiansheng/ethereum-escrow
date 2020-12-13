import Escrow from '../abis/Escrow.json'
import ItemReceived from './ItemReceived';
import PurchaseProduct from './PurchaseProduct';

const { Component } = require("react");

function BuyerBody(props) {
    let body
    console.log(props.escrowState)
    switch(props.escrowState) {
        case "0":
            body = <BuyerWaiting {...props}/>
            break
        case "1":
            body = <PurchaseProduct {...props}/>
            break;
        case "2":
            body = <ItemReceived {...props}/>
            break;
        case "3":
            body = <div>Contract end. Money has been refunded to buyer(you).</div>
        case "4":
            body = <div>Contract end. Funds have been released to the seller.</div>
            break;
        default:
            body = <div>Error state</div>
    }
    
    return (
        <div>
            { body }
        </div>
    )
}

function BuyerWaiting(props) {
    return <div>
        Currently waiting on an action from seller
    </div>
}

export default BuyerBody;