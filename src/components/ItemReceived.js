const { Container, Row, Button } = require("react-bootstrap")

function ItemReceived(props) { 
    
    const itemReceivedOnClickHandler = (event) => {
        event.preventDefault()
        buyerItemReceived()
    }

    const buyerItemReceived = () => {
        const escrowContract = props.escrowContract
        const buyerAddress = props.buyerAddress

        escrowContract.methods.itemReceived().send({ from: buyerAddress }, function (error, result) {
            if (error) {
                return error
            } else {
                return result
            }
        })
    }

    return (
        <Container>
            <Row>
                Item Received
            </Row>
            <Row>
                <Button onClick={itemReceivedOnClickHandler}>Item Received!</Button>
            </Row>
        </Container>
    )
}

export default ItemReceived;