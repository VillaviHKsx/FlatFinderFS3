import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <>
            <h1>Bienvenido, </h1>

            <ul>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/newflat">New Flat</Link></li>
                <li><Link to="/allflats">All Flats</Link></li>
                <li><Link to="/updateprofile">Update Profile</Link></li>
                <li><Link to="/logout">Logout</Link></li>
            </ul>
        </>
    );
}

export default Header;
