import { useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import './NavBar.css'

const Navbar = () => {
    const { currentUser, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    const mazeBax = () => {
        //chis, do this part
    }

    return (
        <nav className="h-20 bg-white px-6 flex items-center justify-evenly border-b shadow-sm">

            <div className="part">


                <button className="border-2 border-blue-500 text-blue-500 rounded-lg px-3 py-1 hover:bg-blue-100 transition cursor-pointer">
                    Your Mazes
                </button>

            </div>

            <div className="part">
                <span className=" text-xl font-semibold text-purple-600">
                    KnowledgeGrasp
                </span>

            </div>


            <div className="part">
                <button
                    className=" border-4 border-blue-500 text-blue-500 rounded-lg px-4 py-1 hover:bg-blue-100 transition"
                    onClick={handleLogout}>
                    Logout
                </button>

            </div>


        </nav>

    )
}

export default Navbar;