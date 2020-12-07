import Escrow from '../abis/Escrow.json'
import ContractStates from '../constants/ContractStates'

const { Component } = require("react");

function BuyerBody(props) {
    return (
        <p>Buyer. Contract state : {ContractStates[props.escrowState]}</p>
    )
}

export default BuyerBody;