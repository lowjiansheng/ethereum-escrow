const { Navbar, Nav, Button, Row, ButtonGroup, ToggleButton } = require("react-bootstrap");

function HeaderBar (props) {
    return (
    <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Escrow</Navbar.Brand>
        <Nav className="mr-auto">
            <Row>
                <Button variant="outline-dark" onClick={props.sellerOnClick}>Seller</Button>
                <Button variant="outline-dark" onClick={props.buyerOnClick}>Buyer</Button>
            </Row>
        </Nav>
        <Nav className="mr-sm-2">
            Ether balance: {props.etherBalance} {props.ercSymbol} balance: {props.ercBalance}
        </Nav>
    </Navbar>
    )
}

export default HeaderBar;