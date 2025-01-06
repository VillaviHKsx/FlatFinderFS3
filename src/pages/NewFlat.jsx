import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import Header from "../components/Header";

function NewFlat() {
    const [formData, setFormData] = useState({
        city: '',
        streetName: '',
        streetNumber: '',
        hasAC: false,
        areaSize: '',
        price: '',
        dateAvailable: '',
        yearBuilt: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "flats"), formData);
            alert('Flat added successfully!');
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return (
        <div>
            <Header />
            <h1>New Flat</h1>
            
            <form onSubmit={handleSubmit}>
                <label htmlFor="city">City:</label>
                <br />
                <input type="text" id="city" name="city" onChange={handleChange} />
                <br />
                <label htmlFor="streetName">Street Name:</label>
                <br />
                <input type="text" id="streetName" name="streetName" onChange={handleChange} />
                <br /> 
                <label htmlFor="streetNumber">Street Number:</label>
                <br />
                <input type="text" id="streetNumber" name="streetNumber" onChange={handleChange} />
                <br /> 
                <label htmlFor="hasAC">Has AC:</label>
                <br />
                <input type="checkbox" id="hasAC" name="hasAC" onChange={handleChange} />
                <br />   
                <label htmlFor="areaSize">Area Size:</label>
                <br />    
                <input type="text" id="areaSize" name="areaSize" onChange={handleChange} />
                <br /> 
                <label htmlFor="price">Price:</label>
                <br />
                <input type="text" id="price" name="price" onChange={handleChange} />
                <br />
                <label htmlFor="dateAvailable">Date Available:</label>
                <br />    
                <input type="date" id="dateAvailable" name="dateAvailable" onChange={handleChange} />
                <br />
                <label htmlFor="yearBuilt">Year Built:</label>
                <br />
                <input type="text" id="yearBuilt" name="yearBuilt" onChange={handleChange} />
                <br />
                <button type="submit">Create Flat</button>
            </form>
        </div>
    );
}

export default NewFlat;
