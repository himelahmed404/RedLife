import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Pageshell = ({ children }) => {
    return (
        <div>
            <Navbar></Navbar>
            {children}
            <Footer></Footer>
        </div>
    );
};

export default Pageshell;