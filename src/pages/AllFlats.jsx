import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import SearchBar from '../components/SearchBar'; 
import Header from '../components/Header';

function formatDate(timestamp) {
    if (timestamp && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toLocaleDateString(); // Convierte a una fecha legible
    } else if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString(); // Si ya es una fecha
    } else {
        console.error('El valor proporcionado no es un Timestamp válido:', timestamp);
        return ''; // Retorna una cadena vacía o un valor predeterminado
    }
}

function AllFlats() {
    const [flats, setFlats] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchFlats = async () => {
            const flatsCollection = collection(db, 'flats');
            const flatsSnapshot = await getDocs(flatsCollection);
            const flatsList = flatsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setFlats(flatsList);
        };
        
        fetchFlats();
    }, []);

    const filteredFlats = flats.filter(flat =>
        flat.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flat.streetName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <Header />
            <h1>All Flats</h1>
            <SearchBar onSearch={setSearchQuery} />
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
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFlats.map(flat => (
                        <tr key={flat.id}>
                            <td>{flat.city}</td>
                            <td>{flat.streetName}</td>
                            <td>{flat.streetNumber}</td>
                            <td>{flat.hasAC ? 'Yes' : 'No'}</td>
                            <td>{flat.areaSize}</td>
                            <td>{flat.price}</td>
                            <td>{formatDate(flat.dateAvailable)}</td>
                            <td>{flat.yearBuilt}</td>
                            <td>
                                {/* Acciones aquí, por ejemplo un botón de editar o eliminar */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AllFlats;
