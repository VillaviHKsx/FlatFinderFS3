import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Header from '../components/Header';
import '../styles/login.css';

const AllUsers = () => {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const openUserProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (user?.role !== 'admin') {
    return <p>Access denied. Only admins can view this page.</p>;
  }

  return (
    <div>
      <Header user={user} onLogout={logout} />
      <div className="all-users-container">
        <DataTable value={users} paginator rows={10} sortField="firstName" sortOrder={1}>
          <Column field="firstName" header="First Name" sortable />
          <Column field="lastName" header="Last Name" sortable />
          <Column field="birthDate" header="Birth Date" sortable />
          <Column field="email" header="Email" />
          <Column field="flatsCount" header="Flats Count" sortable />
          <Column field="role" header="Is Admin" body={(rowData) => (rowData.role === 'admin' ? 'Yes' : 'No')} />
          <Column
            header="Actions"
            body={(rowData) => (
              <Button label="Profile" icon="pi pi-user" onClick={() => openUserProfile(rowData.id)} />
            )}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default AllUsers;