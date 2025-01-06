import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import Header from "../components/Header";

function AllFlats() {
    const [flats, setFlats] = useState([]);

    useEffect(() => {
        const fetchFlats = async () => {
            const querySnapshot = await getDocs(collection(db, "flats"));
            setFlats(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        };

        fetchFlats();
    }, []);

    return (
        <div>
            <Header />
            <h1>All Flats</h1>
            <table>
                <thead>
                    <tr>
                        <th>City</th>
                        <th>Street Name</th>
                        <th>Street Number</th>
                        <th>Has AC</th>
                        <th>Area Size</th>
                        <th>Price</th>
                        <th>Date Available</th>
                        <th>Year Built</th>
                    </tr>
                </thead>
                <tbody>
                    {flats.map(flat => (
                        <tr key={flat.id}>
                            <td>{flat.city}</td>
                            <td>{flat.streetName}</td>
                            <td>{flat.streetNumber}</td>
                            <td>{flat.hasAC ? "Yes" : "No"}</td>
                            <td>{flat.areaSize}</td>
                            <td>{flat.price}</td>
                            <td>{flat.dateAvailable}</td>
                            <td>{flat.yearBuilt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AllFlats;
