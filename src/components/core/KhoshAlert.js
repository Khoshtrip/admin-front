import React, { useState, useEffect } from "react";
import { Alert, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

let showGlobalAlert;

const KhoshAlert = () => {
    const [alertConfig, setAlertConfig] = useState({
        show: false,
        variant: "primary",
        duration: 2000,
        message: "",
        title: "",
        footer: "",
    });

    useEffect(() => {
        if (alertConfig.show && alertConfig.duration) {
            const timer = setTimeout(() => {
                setAlertConfig((prev) => ({ ...prev, show: false }));
            }, alertConfig.duration);

            return () => clearTimeout(timer);
        }
    }, [alertConfig]);

    showGlobalAlert = (config) => {
        setAlertConfig({
            show: true,
            variant: config.variant || "primary",
            duration: config.duration || 2000,
            message: config.message || "",
            title: config.title || "",
            footer: config.footer || "",
        });
    };

    return (
        <div
            style={{
                position: "fixed",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 99999,
                maxWidth: "90%",
                minWidth: "400px",
            }}
        >
            {alertConfig.show && (
                <Alert
                    variant={alertConfig.variant}
                    dismissible
                    onClose={() =>
                        setAlertConfig((prev) => ({ ...prev, show: false }))
                    }
                    style={{
                        animation: "fadeIn 0.5s ease-out",
                    }}
                >
                    {alertConfig.title && (
                        <Alert.Heading>{alertConfig.title}</Alert.Heading>
                    )}
                    {alertConfig.message && (
                        <p className="mb-0">{alertConfig.message}</p>
                    )}
                    {alertConfig.footer && <hr />}
                    {alertConfig.footer && (
                        <p className="mb-0">{alertConfig.footer}</p>
                    )}
                    {/* <div className="d-flex justify-content-end">
                        <Button
                            onClick={(prev)  =>
                                setAlertConfig({ ...prev, show: false })
                            }
                            variant={`outline-${alertConfig.variant}`}
                        >
                            Close me
                        </Button>
                    </div> */}
                </Alert>
            )}
        </div>
    );
};

export { showGlobalAlert };
export default KhoshAlert;
