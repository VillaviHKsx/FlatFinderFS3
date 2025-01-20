import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SplitButton } from 'primereact/splitbutton';
import { Button } from 'primereact/button';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import NewFlat from './NewFlat';  // Asegúrate de que el nombre sea el correcto

import '../styles/login.css';

const MyFlats = () => {
  const { user, logout } = useContext(AuthContext);
  const [flats, setFlats] = useState([]);
  const [newFlatDialogVisible, setNewFlatDialogVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const flatsCollection = collection(db, 'flats');
        const q = query(flatsCollection, where('ownerId', '==', user.uid));
        const snapshot = await getDocs(q);
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

    if (user) {
      fetchFlats();
    }
  }, [user]);

  const openFlatPage = (flatId) => {
    navigate(`/flat/${flatId}`);
  };

  const editFlat = (flatId) => {
    navigate(`/edit-flat/${flatId}`);
  };

  const deleteFlat = async (flatId) => {
    try {
      await deleteDoc(doc(db, 'flats', flatId));
      setFlats((prevFlats) => prevFlats.filter((flat) => flat.id !== flatId));
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Flat deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting flat:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error deleting flat',
      });
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return new Date(date.seconds * 1000).toLocaleDateString();
  };

  const actionTemplate = (rowData) => {
    const items = [
      {
        label: 'Open',
        icon: 'pi pi-external-link',
        command: () => openFlatPage(rowData.id)
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => editFlat(rowData.id)
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => deleteFlat(rowData.id)
      }
    ];

    return (
      <SplitButton icon="pi pi-cog" model={items} className="p-button-primary" />
    );
  };

  const handleNewFlat = (newFlat) => {
    setFlats((prevFlats) => [...prevFlats, newFlat]);
  };

  return (
    <div>
      <Header user={user} onLogout={logout} />
      <div className="my-flats-container">
        <div className="button-container">
          <Button label="New Flat" icon="pi pi-plus" onClick={() => setNewFlatDialogVisible(true)} className="p-button-primary" />
        </div>
        <DataTable value={flats}>
          <Column field="city" header="City" />
          <Column field="streetName" header="Street Name" />
          <Column field="streetNumber" header="Street Number" />
          <Column field="areaSize" header="Area Size" />
          <Column field="hasAC" header="Has AC" body={(rowData) => (rowData.hasAC ? 'Yes' : 'No')} />
          <Column field="yearBuilt" header="Year Built" />
          <Column field="rentPrice" header="Rent Price" />
          <Column field="dateAvailable" header="Date Available" body={(rowData) => formatDate(rowData.dateAvailable)} />
          <Column header="Actions" body={actionTemplate} />
        </DataTable>
      </div>
      <NewFlat visible={newFlatDialogVisible} onHide={() => setNewFlatDialogVisible(false)} onNewFlat={handleNewFlat} />
    </div>
  );
};

export default MyFlats;