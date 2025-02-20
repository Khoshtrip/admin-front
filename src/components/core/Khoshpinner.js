import { Spinner } from "react-bootstrap";

const Khoshpinner = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%", // Full viewport width
                marginBlock: "1rem",
            }}
        >
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
};

export default Khoshpinner;
