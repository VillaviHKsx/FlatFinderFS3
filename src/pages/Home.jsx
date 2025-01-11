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