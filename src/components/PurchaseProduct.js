const { Container, Row, Button } = require("react-bootstrap")

function PurchaseProduct(props) { 
    
    const purchaseButtonOnClickHandler = (event) => {
        event.preventDefault()
        buyerPurchaseProduct()
    }

    const buyerPurchaseProduct = () => {
        const sellingAmount = props.sellingAmount
        const mockERC20Contract = props.mockERC20Contract
        const escrowContract = props.escrowContract
        const web3 = props.web3
        const buyerAddress = props.buyerAddress

        mockERC20Contract.methods.approve(
            escrowContract.options.address,
            web3.utils.toWei(sellingAmount.toString())).send({ from: buyerAddress }).on('transactionHash', (hash) => {
                escrowContract.methods.purchase().send({ from: buyerAddress }, function (error, result) {
                    if (error) {
                        return error
                    } else {
                        return result
                    }
                })
            })
    }

    return (
        <Container>
            <Row>
                Buyer to purchase from seller {props.sellerAddress}
            </Row>
            <Row>
                <Button onClick={purchaseButtonOnClickHandler}>Purchase product</Button>
            </Row>
        </Container>
    )
}

export default PurchaseProduct;