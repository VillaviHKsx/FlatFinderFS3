/*import React, { useContext, useEffect, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Header from '../components/Header';
import '../styles/login.css';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const [flats, setFlats] = useState([]);
  const [filters, setFilters] = useState({ city: '', priceRange: [0, 10000], areaRange: [0, 500] });
//  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const flatsCollection = collection(db, 'flats');
        const snapshot = await getDocs(flatsCollection);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFlats(data);
      } catch (error) {
        console.error('Error fetching flats:', error);
      }
    };

    fetchFlats();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredFlats = flats.filter((flat) => {
    return (
      flat.city.toLowerCase().includes(filters.city.toLowerCase()) &&
      flat.rentPrice >= filters.priceRange[0] &&
      flat.rentPrice <= filters.priceRange[1] &&
      flat.areaSize >= filters.areaRange[0] &&
      flat.areaSize <= filters.areaRange[1]
    );
  });


  return (
    <div>
      <Header user={user} onLogout={logout}/>
      <div className="home-container">
        <h2>Available Flats</h2>
        <div className="filters">
          <InputText
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            placeholder="City"
          />
          <InputNumber
            value={filters.priceRange[0]}
            onValueChange={(e) => handleFilterChange('priceRange', [e.value, filters.priceRange[1]])}
            placeholder="Min Price"
          />
          <InputNumber
            value={filters.priceRange[1]}
            onValueChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], e.value])}
            placeholder="Max Price"
          />
          <InputNumber
            value={filters.areaRange[0]}
            onValueChange={(e) => handleFilterChange('areaRange', [e.value, filters.areaRange[1]])}
            placeholder="Min Area"
          />
          <InputNumber
            value={filters.areaRange[1]}
            onValueChange={(e) => handleFilterChange('areaRange', [filters.areaRange[0], e.value])}
            placeholder="Max Area"
          />
        </div>
        <DataTable value={filteredFlats}>
          <Column field="city" header="City" />
          <Column field="rentPrice" header="Rent Price" />
          <Column field="areaSize" header="Area Size" />
        </DataTable>
      </div>
    </div>
  );
};

export default Home; */


import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Header from '../components/Header';
import '../styles/login.css';

const Home = () => {
  const [flats, setFlats] = useState([]);

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const flatsCollection = collection(db, 'flats');
        const snapshot = await getDocs(flatsCollection);
        const data = snapshot.docs.map((doc) => {
          const flatData = doc.data();
          // Convertir dateAvailable a un objeto Date si es necesario
          if (flatData.dateAvailable && flatData.dateAvailable.seconds) {
            flatData.dateAvailable = new Date(flatData.dateAvailable.seconds * 1000);
          }
          return { id: doc.id, ...flatData };
        });
        setFlats(data);
      } catch (error) {
        console.error('Error fetching flats:', error);
      }
    };

    fetchFlats();
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return new Date(date.seconds * 1000).toLocaleDateString();
  };

  return (
    <div>
      <Header />
      <div className="home-container">
        <DataTable value={flats}>
          <Column field="city" header="City" />
          <Column field="streetName" header="Street Name" />
          <Column field="streetNumber" header="Street Number" />
          <Column field="areaSize" header="Area Size" />
          <Column field="hasAC" header="Has AC" body={(rowData) => (rowData.hasAC ? 'Yes' : 'No')} />
          <Column field="yearBuilt" header="Year Built" />
          <Column field="rentPrice" header="Rent Price" />
          <Column field="dateAvailable" header="Date Available" body={(rowData) => formatDate(rowData.dateAvailable)} />
        </DataTable>
      </div>
    </div>
  );
};

export default Home;