import React, { useContext, useEffect, useState } from 'react';
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
      <Header user={user} onLogout={logout} />
      <div className="login-container">
        <div className="p-grid">
          <div className="p-col-12 p-md-4">
            <InputText
              placeholder="Filter by City"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            />
          </div>
          <div className="p-col-12 p-md-4">
            <InputNumber
              placeholder="Min Price"
              value={filters.priceRange[0]}
              onValueChange={(e) => handleFilterChange('priceRange', [e.value, filters.priceRange[1]])}
            />
            <InputNumber
              placeholder="Max Price"
              value={filters.priceRange[1]}
              onValueChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], e.value])}
            />
          </div>
        </div>
        <DataTable value={filteredFlats} paginator rows={10} responsiveLayout="scroll">
          <Column field="city" header="City" sortable />
          <Column field="streetName" header="Street Name" />
          <Column field="rentPrice" header="Rent Price" sortable />
        </DataTable>
      </div>
    </div>
  );
};

export default Home;