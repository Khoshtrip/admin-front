import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import LoginModal from "./LoginModal";
import { useNavigate } from "react-router-dom";
import "../../styles/core/Header.css";

const HeaderTabs = () => {
    return (
        <>
            <Nav.Link href="/" className="on-primary">
                Home
            </Nav.Link>
            <Nav.Link href="/packages" className="on-primary">
                Packages
            </Nav.Link>
            <Nav.Link href="/providers" className="on-primary">
                Providers
            </Nav.Link>
        </>
    );
};

const Header = () => {
    return (
        <>
            <Navbar expand="sm" className="bg-primary on-primary">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/" className="on-primary">
                        KhoshTrip
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="me-auto my-2 my-lg-0">
                            <HeaderTabs />
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default Header;
