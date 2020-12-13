import { Button, Form } from 'react-bootstrap';
import "web3"
import StandardButtonBody from './StandardButtonBody';

const { Component } = require("react");

function SellerBody(props) {
    
    const sellerRefundButtonOnClickHandler = (event) => {
        event.preventDefault()

        const escrowContract = props.escrowContract
        const sellerAddress = props.sellerAddress

        escrowContract.methods.refundBuyer().send({ from: sellerAddress }, function (error, result) {
            if (error) {
                return error
            } else {
                return result
            }
        })
    }

    const sellerCancelPurchaseButtonOnClickHandler = (event) => {
        event.preventDefault()

        const escrowContract = props.escrowContract
        const sellerAddress = props.sellerAddress

        escrowContract.methods.cancelPurchase().send({ from: sellerAddress }, function (error, result) {
            if (error) {
                return error
            } else {
                return result
            }
        })
    }
    
    let body
    let textToDisplay
    switch (props.escrowState) {
        case "0":
            body = <SellerInitializeBody {...props}/>
            break;
        case "1":
            textToDisplay = "Cancel transaction"
            body = <StandardButtonBody
                    textToDisplay = {textToDisplay}
                    buttonOnClickHandler = {sellerCancelPurchaseButtonOnClickHandler}
                    buttonText = "Click to cancel transaction"/>
            break;
        case "2":
            textToDisplay = "Refund buyer: " + props.buyerAddress 
            body = <StandardButtonBody 
                    textToDisplay = "Refund buyer"
                    buttonOnClickHandler = {sellerRefundButtonOnClickHandler}
                    buttonText = "Click to refund buyer"/>
            break; 
        case "3":
    body = <div>Contract end. Money has been refunded to buyer. {props.buyerAddress}</div>
            break;
        case "4":
            body = <div>Contract end. Funds have been released to seller (you).</div>
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