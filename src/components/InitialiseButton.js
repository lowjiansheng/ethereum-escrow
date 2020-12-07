const { Button } = require("react-bootstrap");

const handleButtonClick = () => {
    
}

function InitialiseButton(props) {
    return (
        <Button 
        variant="secondary"
        onClick={handleButtonClick}
        />
    )
}

export default InitialiseButton;