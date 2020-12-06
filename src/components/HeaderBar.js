const { Navbar, Nav } = require("react-bootstrap");

function HeaderBar (props) {
    return (
    <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Escrow</Navbar.Brand>
        <Nav>Ether balance: {props.etherBalance}</Nav>
    </Navbar>
    )
}

export default HeaderBar;