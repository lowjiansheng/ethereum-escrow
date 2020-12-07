const { Navbar, Nav, Button } = require("react-bootstrap");

function HeaderBar (props) {
    return (
    <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Escrow</Navbar.Brand>
        <Button variant="outline-dark" onClick={props.sellerOnClick}>Seller</Button>
        <Button variant="outline-dark" onClick={props.buyerOnClick}>Buyer</Button>
        <Nav className="mr-auto">Ether balance: {props.etherBalance}</Nav>
    <Nav className="mr-auto">{props.ercSymbol} balance: {props.ercBalance}</Nav>
    </Navbar>
    )
}

export default HeaderBar;