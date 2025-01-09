import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SplitButton } from 'primereact/splitbutton';
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

  const roleTemplate = (rowData) => {
    return rowData.role === 'admin' ? 'Yes' : 'No';
  };

  const actionTemplate = (rowData) => {
    const items = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => openUserProfile(rowData.id)
      },
      // Puedes agregar más acciones aquí si es necesario
    ];

    return (
      <SplitButton label="Actions" model={items} className="p-button-primary" />
    );
  };

  if (user?.role !== 'admin') {
    return <p>Access denied. Only admins can view this page.</p>;
  }

  return (
    <div>
      <Header user={user} onLogout={logout} />
      <div className="all-users-container">
        <DataTable value={users}>
          <Column field="firstName" header="First Name" />
          <Column field="lastName" header="Last Name" />
          <Column field="email" header="Email" />
          <Column field="role" header="Role" body={roleTemplate} />
          <Column
            header="Actions"
            body={actionTemplate}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default AllUsers;