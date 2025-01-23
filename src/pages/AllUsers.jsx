import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SplitButton } from 'primereact/splitbutton';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import '../styles/login.css';

const AllUsers = () => {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersAndFlats = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const flatsCollection = collection(db, 'flats');

        const [usersSnapshot, flatsSnapshot] = await Promise.all([
          getDocs(usersCollection),
          getDocs(flatsCollection)
        ]);

        const flatsData = flatsSnapshot.docs.map((doc) => doc.data());

        const usersData = usersSnapshot.docs.map((doc) => {
          const userData = doc.data();
          const userFlatsCount = flatsData.filter(flat => flat.ownerId === doc.id).length;
          return {
            id: doc.id,
            ...userData,
            birthDate: userData.birthDate || 'Unknown',
            flatsCount: userFlatsCount
          };
        });

        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users and flats:', error);
      }
    };

    fetchUsersAndFlats();
  }, []);

  const openUserProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const grantAdminPermissions = async (userId) => {
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, { role: 'admin' });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: 'admin' } : user
        )
      );
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Admin permissions granted',
      });
    } catch (error) {
      console.error('Error granting admin permissions:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error granting admin permissions',
      });
    }
  };

  const removeUser = async (userId) => {
    try {
      // Eliminar el usuario de Firestore
      await deleteDoc(doc(db, 'users', userId));
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      // Eliminar el usuario de Firebase Authentication
      //const userToDelete = await auth.getUser(userId);
      //if (userToDelete) {
      //  await deleteUser(userToDelete);
      //}

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User removed',
      });
    } catch (error) {
      console.error('Error removing user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error removing user',
      });
    }
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
      {
        label: 'Grant Admin',
        icon: 'pi pi-key',
        command: () => grantAdminPermissions(rowData.id)
      },
      {
        label: 'Remove User',
        icon: 'pi pi-trash',
        command: () => removeUser(rowData.id)
      }
    ];

    return (
      <SplitButton label="" icon="pi pi-cog" model={items} className="p-button-primary" />
    );
  };

  const avatarTemplate = (rowData) => {
    return <img src={rowData.avatarUrl} alt="Avatar" className="user-avatar" />;
  };

  if (user?.role !== 'admin') {
    return <p>Access denied. Only admins can view this page.</p>;
  }

  return (
    <div>
      <Header user={user} onLogout={logout} />
      <div className="all-users-container">
        <DataTable value={users}>
          <Column header="Avatar" body={avatarTemplate} />
          <Column field="firstName" header="First Name" />
          <Column field="lastName" header="Last Name" />
          <Column field="email" header="Email" />
          <Column field="birthDate" header="Birth Date" />
          <Column field="flatsCount" header="Number of Flats" />
          <Column field="role" header="Role Admin" body={roleTemplate} />
          <Column header="Actions" body={actionTemplate} />
        </DataTable>
      </div>
    </div>
  );
};

export default AllUsers;