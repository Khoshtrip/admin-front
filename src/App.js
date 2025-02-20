import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/core/Header";
import MainPage from "./pages/MainPage";
import "./styles/global.scss";
import Products from "./pages/Products";
import KhoshAlert from "./components/core/KhoshAlert";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import LoginModal from "./components/core/LoginModal";

function App() {
    const { isAuthenticated } = useContext(AuthContext);
    return (
        <div className="App">
            <KhoshAlert />
            {!isAuthenticated && <LoginModal />}
            {isAuthenticated && (
                <>
                    <Header />
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/products" element={<Products />} />
                    </Routes>
                </>
            )}
        </div>
    );
}

export default App;
