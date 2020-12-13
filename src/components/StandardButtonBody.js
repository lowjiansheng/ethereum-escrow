const { Container, Button, Row } = require("react-bootstrap");

function StandardButtonBody(props) {
    return (
        <Container>
            <Row>
                {props.textToDisplay}
            </Row>
            <Row>
                <Button onClick={props.buttonOnClickHandler}>{props.buttonText}</Button>
            </Row>
            
        </Container>
    )
}

export default StandardButtonBody;