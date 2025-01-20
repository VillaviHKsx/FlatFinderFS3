import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Header from '../components/Header';
import '../styles/login.css';

const Favourites = () => {
  const [flats, setFlats] = useState([]);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchFavoriteFlats = async () => {
      try {
        const flatFavoritesCollection = collection(db, 'flatfavorite');
        const q = query(flatFavoritesCollection, where('userId', '==', user.uid));
        const snapshot = await getDocs(q);

        const flatsData = snapshot.docs.map((doc) => {
          const flatData = doc.data();
          // Convertir dateAvailable a un objeto Date si es necesario
          if (flatData.dateAvailable && flatData.dateAvailable.seconds) {
            flatData.dateAvailable = new Date(flatData.dateAvailable.seconds * 1000);
          }
          return { id: doc.id, ...flatData };
        });

        setFlats(flatsData);
      } catch (error) {
        console.error('Error fetching favorite flats:', error);
      }
    };

    if (user) {
      fetchFavoriteFlats();
    }
  }, [user]);

  const formatDate = (date) => {
    if (!date) return '';
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return new Date(date.seconds * 1000).toLocaleDateString();
  };

  const handleRemoveFavorite = async (flatId) => {
    try {
      const flatFavoriteDoc = doc(db, 'flatfavorite', `${user.uid}_${flatId}`);
      await deleteDoc(flatFavoriteDoc);
      setFlats((prevFlats) => prevFlats.filter((flat) => flat.id !== flatId));
    } catch (error) {
      console.error('Error removing favorite flat:', error);
    }
  };

  const removeFavoriteTemplate = (rowData) => {
    return (
      <Button
        label="Remove"
        icon="pi pi-times"
        className="p-button-primary"
        onClick={() => handleRemoveFavorite(rowData.id)}
      />
    );
  };

  return (
    <div>
      <Header user={user} onLogout={logout} />
      <div className="favourites-container">
        <DataTable value={flats}>
          <Column field="city" header="City" />
          <Column field="streetName" header="Street Name" />
          <Column field="streetNumber" header="Street Number" />
          <Column field="areaSize" header="Area Size" />
          <Column field="hasAC" header="Has AC" body={(rowData) => (rowData.hasAC ? 'Yes' : 'No')} />
          <Column field="yearBuilt" header="Year Built" />
          <Column field="rentPrice" header="Rent Price" />
          <Column field="dateAvailable" header="Date Available" body={(rowData) => formatDate(rowData.dateAvailable)} />
          <Column field="ownerName" header="Owner Full Name" />
          <Column field="ownerEmail" header="Owner Email" />
          <Column header="Actions" body={removeFavoriteTemplate} />
        </DataTable>
      </div>
    </div>
  );
};

export default Favourites;