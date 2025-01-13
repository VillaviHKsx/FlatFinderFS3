/*import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Header from '../components/Header';
import '../styles/login.css';

const ViewFlat = () => {
  const { user, logout } = useContext(AuthContext);
  const { flatId } = useParams();
  const [flat, setFlat] = useState(null);

  useEffect(() => {
    const fetchFlat = async () => {
      try {
        const flatDoc = doc(db, 'flats', flatId);
        const flatSnapshot = await getDoc(flatDoc);
        if (flatSnapshot.exists()) {
          setFlat(flatSnapshot.data());
        }
      } catch (error) {
        console.error('Error fetching flat:', error);
      }
    };

    fetchFlat();
  }, [flatId]);

  const formatDate = (date) => {
    if (!date) return '';
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return new Date(date.seconds * 1000).toLocaleDateString();
  };

  return (
    <div>
      <Header user={user} onLogout={logout} />
      <div className="view-flat-container">
        {flat && (
          <DataTable value={[flat]}>
            <Column field="city" header="City" />
            <Column field="streetName" header="Street Name" />
            <Column field="streetNumber" header="Street Number" />
            <Column field="areaSize" header="Area Size" />
            <Column field="hasAC" header="Has AC" body={(rowData) => (rowData.hasAC ? 'Yes' : 'No')} />
            <Column field="yearBuilt" header="Year Built" />
            <Column field="rentPrice" header="Rent Price" />
            <Column field="dateAvailable" header="Date Available" body={(rowData) => formatDate(rowData.dateAvailable)} />
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default ViewFlat; */

/*import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Header from '../components/Header';
import '../styles/login.css';

const ViewFlat = () => {
  const { user, logout } = useContext(AuthContext);
  const { flatId } = useParams();
  const [flat, setFlat] = useState(null);

  useEffect(() => {
    const fetchFlat = async () => {
      try {
        const flatDoc = doc(db, 'flats', flatId);
        const flatSnapshot = await getDoc(flatDoc);
        if (flatSnapshot.exists()) {
          setFlat(flatSnapshot.data());
        }
      } catch (error) {
        console.error('Error fetching flat:', error);
      }
    };

    fetchFlat();
  }, [flatId]);

  const formatDate = (date) => {
    if (!date) return '';
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return new Date(date.seconds * 1000).toLocaleDateString();
  };

  return (
    <div>
      <Header user={user} onLogout={logout} />
      <div className="view-flat-container">
        {flat && (
          <DataTable value={[flat]}>
            <Column field="city" header="City" />
            <Column field="streetName" header="Street Name" />
            <Column field="streetNumber" header="Street Number" />
            <Column field="areaSize" header="Area Size" />
            <Column field="hasAC" header="Has AC" body={(rowData) => (rowData.hasAC ? 'Yes' : 'No')} />
            <Column field="yearBuilt" header="Year Built" />
            <Column field="rentPrice" header="Rent Price" />
            <Column field="dateAvailable" header="Date Available" body={(rowData) => formatDate(rowData.dateAvailable)} />
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default ViewFlat; */

import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Header from '../components/Header';
import '../styles/login.css';

const ViewFlat = () => {
  const { user, logout } = useContext(AuthContext);
  const { flatId } = useParams();
  const navigate = useNavigate();
  const [flat, setFlat] = useState(null);

  useEffect(() => {
    const fetchFlat = async () => {
      try {
        const flatDoc = doc(db, 'flats', flatId);
        const flatSnapshot = await getDoc(flatDoc);
        if (flatSnapshot.exists()) {
          setFlat(flatSnapshot.data());
        }
      } catch (error) {
        console.error('Error fetching flat:', error);
      }
    };

    fetchFlat();
  }, [flatId]);

  const formatDate = (date) => {
    if (!date) return '';
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return new Date(date.seconds * 1000).toLocaleDateString();
  };

  const editFlat = () => {
    navigate(`/edit-flat/${flatId}`);
  };

  const actionTemplate = () => {
    if (flat && flat.ownerId === user.uid) {
      return (
        <Button
          label="Edit"
          icon="pi pi-pencil"
          className="p-button-warning"
          onClick={editFlat}
        />
      );
    }
    return null;
  };

  return (
    <div>
      <Header user={user} onLogout={logout} />
      <div className="view-flat-container">
        {flat && (
          <DataTable value={[flat]}>
            <Column field="city" header="City" />
            <Column field="streetName" header="Street Name" />
            <Column field="streetNumber" header="Street Number" />
            <Column field="areaSize" header="Area Size" />
            <Column field="hasAC" header="Has AC" body={(rowData) => (rowData.hasAC ? 'Yes' : 'No')} />
            <Column field="yearBuilt" header="Year Built" />
            <Column field="rentPrice" header="Rent Price" />
            <Column field="dateAvailable" header="Date Available" body={(rowData) => formatDate(rowData.dateAvailable)} />
            {flat && flat.ownerId === user.uid && (
              <Column header="Actions" body={actionTemplate} />
            )}
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default ViewFlat;