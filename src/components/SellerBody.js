import { Button, Form } from 'react-bootstrap';
import Web3 from 'web3';
import Escrow from '../abis/Escrow.json'
import ContractStates from '../constants/ContractStates'
import "web3"

const { Component } = require("react");

function SellerBody(props) {
    let body
    switch (props.escrowState) {
        case "0":
            body = <SellerInitializeBody {...props}/>
            break;
        case "4":
            body = <div>Contract end</div>
            break;
        default:
            body = <SellerWaiting {...props}/>
    }

    return (
        <div>
            {body}
        </div>
    )
}

function SellerInitializeBody(props) {

    const onFormSubmit = (event) => {
        event.preventDefault()
        const sellingAmount = event.target.elements.sellingAmount.value
        if (sellingAmount == '' || sellingAmount == 0) {
            return
        } else {
            props.setSellingAmountHandler(sellingAmount)
            let res = sellerInitializeContract(props.escrowContract, 10, props.web3, props.mockERC20Contract, props.sellerAddress)
            console.log(res)
            return res
        }
    }

    return (
        <Form onSubmit={onFormSubmit}>
            <Form.Group controlId="sellingAmount">
                <Form.Label>Selling amount</Form.Label>
                <Form.Control type="number" placeholder="10"/>
                <Form.Text className="text-muted">How much do you want to sell your item for?</Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
        </Form>
    )
}

function SellerWaiting(props) {
    return (
        <div>
            Currently waiting on an action from buyer
        </div>
    )
}

// This function calls the blockchain
async function sellerInitializeContract(escrowContract, sellingAmount, web3, mockERC20Contract, sellerAddress) {
    console.log("Calling the blockchain")
    const sellingAmountInWei = web3.utils.toWei((2 * sellingAmount).toString())
    console.log(sellingAmountInWei)
    console.log(escrowContract.options.address)
    
    mockERC20Contract.methods.approve(escrowContract.options.address, sellingAmountInWei).send({from: sellerAddress}).on('transactionHash', (hash) => {
        escrowContract.methods.sellerInitialize(web3.utils.toWei(sellingAmount.toString())).send({ from: sellerAddress }, function (error, result) {
            if (error) {
                return error
            } else {
                return result
            }
        })
    })
}

export default SellerBody;