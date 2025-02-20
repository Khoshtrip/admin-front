import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/core/Login.css";
import { Form, Modal, Button } from "react-bootstrap";
import { AuthenticationApi } from "../../apis/AuthenticationApi";
import { showGlobalAlert } from "./KhoshAlert";

const LoginModal = () => {
    const [showModal, setShowModal] = useState(true);
    const { login, loading, user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        password: "",
        phone_number: "",
        nationalCode: "",
        email: "",
        firstName: "",
        lastName: "",
        passwordRepeat: "",
        verifyCode: "",
        birthDate: "",
        businessName: "",
        businessAddress: "",
        businessPhone: "",
        businessWebsite: "",
    });

    const [touch, setTouch] = useState({});
    const [errors, setErrors] = useState({});
    const [timer, setTimer] = useState(120);
    const [isCounting, setIsCounting] = useState(false);

    const startTimer = () => {
        setIsCounting(true);
        setTimer(120);
    };

    useEffect(() => {
        let interval;
        if (isCounting) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsCounting(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isCounting]);

    const handleChange = (e) => {
        const value = e.target.value.replace(/[۰-۹]/g, (d) =>
            "۰۱۲۳۴۵۶۷۸۹".indexOf(d)
        );
        setFormData({ ...formData, [e.target.name]: value });
        validateField(e.target.name, value);
        setTouch({ ...touch, [e.target.name]: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData.phone_number, formData.password)
            .then(() => {
                onClose();
                console.log(user);
                showGlobalAlert({
                    variant: "success",
                    message: "successfully logged in!",
                });
            })
            .catch(() => {
                let newErrors = { ...errors };
                newErrors.phone_number = "Invalid username or password";
                newErrors.password = "Invalid username or password";
                setErrors(newErrors);
            });
    };

    function validateNationalCode(nationalCode) {
        if (!/^\d{10}$/.test(nationalCode)) return false;

        const check = parseInt(nationalCode[9]);
        const sum = nationalCode
            .slice(0, 9)
            .split("")
            .reduce(
                (acc, digit, index) => acc + parseInt(digit) * (10 - index),
                0
            );

        const remainder = sum % 11;
        return remainder < 2 ? check === remainder : check === 11 - remainder;
    }

    const validateField = (fieldName, value) => {
        let newErrors = { ...errors };
        switch (fieldName) {
            case "password":
                newErrors.password =
                    value.length < 6
                        ? "Password must be at least 6 characters long"
                        : "";
                break;
            case "passwordRepeat":
                newErrors.passwordRepeat =
                    value !== formData.password ? "Passwords do not match" : "";
                break;
            case "email":
                newErrors.email = !/\S+@\S+\.\S+/.test(value)
                    ? "Email is invalid"
                    : "";
                break;
            case "phone_number":
                newErrors.phone_number = !/^(\+98|0)?9\d{9}$/.test(value) // Matches +989xxxxxxxx or 09xxxxxxxx
                    ? "Phone number is invalid"
                    : "";
                break;
            case "businessPhone":
                newErrors.phone_number = !/^\d{9}$/.test(value)
                    ? "Phone number is invalid"
                    : "";
                break;
            case "nationalCode":
                newErrors.nationalCode = !validateNationalCode(value)
                    ? "National Code is invalid"
                    : "";
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const resetState = () => {
        setErrors({});
        setFormData({
            password: "",
            phone_number: "",
            nationalCode: "",
            email: "",
            firstName: "",
            lastName: "",
            passwordRepeat: "",
            verifyCode: "",
            birthDate: "",
            businessName: "",
            businessAddress: "",
            businessPhone: "",
            businessWebsite: "",
        });
        setTouch({});
    };

    const onClose = () => {
        setShowModal(false);
        resetState();
    };

    const resendCode = () => {
        AuthenticationApi.sendVerificationCode(formData.email)
            .then(() => {
                startTimer();
            })
            .catch(() => {});
    };

    return (
        <Modal show={showModal} fullscreen="md-down" centered>
            <Modal.Header>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="PhoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="tel"
                            placeholder="Phone Number"
                            name="phone_number"
                            value={formData.phone_number}
                            isValid={touch.phone_number && !errors.phone_number}
                            isInvalid={!!errors.phone_number}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="Password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? "..." : "Login"}
                    </Button>
                </Form>

                <p className="pt-2">
                    if you don't have an account just ask the admin.
                </p>
            </Modal.Body>
        </Modal>
    );
};

export default LoginModal;
