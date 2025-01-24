import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SplitButton } from 'primereact/splitbutton';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import '../styles/login.css';

const AllUsers = () => {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    role: { value: null, matchMode: 'equals' },
    age: { value: null, matchMode: 'between' },
    flatsCount: { value: null, matchMode: 'between' },
    isAdmin: { value: null, matchMode: 'equals' },
  });
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

  const onFilterChange = (e, field) => {
    const value = e.value;
    const newFilters = { ...filters };
    newFilters[field].value = value;
    setFilters(newFilters);
  };

  const roleOptions = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' }
  ];

  return (
    <div>
      <Header user={user} onLogout={logout} />
      <div className="all-users-container">
        <DataTable value={users} paginator rows={10} filters={filters} filterDisplay="menu">
          <Column
            field="avatarUrl"
            header="Avatar"
            body={(rowData) => <img src={rowData.avatarUrl} alt="Avatar" className="user-avatar" />}
          />
          <Column field="firstName" header="First Name" />
          <Column field="lastName" header="Last Name" />
          <Column field="email" header="Email" />
          <Column
            field="role"
            header="Role"
            filter
            filterElement={
              <Dropdown
                value={filters.role.value}
                options={roleOptions}
                onChange={(e) => onFilterChange(e, 'role')}
                placeholder="Select a Role"
              />
            }
          />
          <Column
            field="age"
            header="Age"
            filter
            filterElement={
              <div className="p-inputgroup">
                <InputNumber
                  value={filters.age.value ? filters.age.value[0] : null}
                  onChange={(e) => onFilterChange({ value: [e.value, filters.age.value ? filters.age.value[1] : null] }, 'age')}
                  placeholder="Min age"
                />
                <InputNumber
                  value={filters.age.value ? filters.age.value[1] : null}
                  onChange={(e) => onFilterChange({ value: [filters.age.value ? filters.age.value[0] : null, e.value] }, 'age')}
                  placeholder="Max age"
                />
              </div>
            }
          />
          <Column
            field="flatsCount"
            header="Number of Flats"
            filter
            filterElement={
              <div className="p-inputgroup">
                <InputNumber
                  value={filters.flatsCount.value ? filters.flatsCount.value[0] : null}
                  onChange={(e) => onFilterChange({ value: [e.value, filters.flatsCount.value ? filters.flatsCount.value[1] : null] }, 'flatsCount')}
                  placeholder="Min flats"
                />
                <InputNumber
                  value={filters.flatsCount.value ? filters.flatsCount.value[1] : null}
                  onChange={(e) => onFilterChange({ value: [filters.flatsCount.value ? filters.flatsCount.value[0] : null, e.value] }, 'flatsCount')}
                  placeholder="Max flats"
                />
              </div>
            }
          />
          <Column
            field="isAdmin"
            header="Is Admin"
            filter
            filterElement={
              <InputSwitch
                checked={filters.isAdmin.value}
                onChange={(e) => onFilterChange({ value: e.value }, 'isAdmin')}
              />
            }
            body={(rowData) => (rowData.role === 'admin' ? 'Yes' : 'No')}
          />
          <Column header="Actions" body={(rowData) => (
            <SplitButton
              label="Actions"
              model={[
                {
                  label: 'Edit',
                  icon: 'pi pi-pencil',
                  command: () => openUserProfile(rowData.id)
                },
                {
                  label: 'Delete',
                  icon: 'pi pi-trash',
                  command: async () => {
                    const userDoc = doc(db, 'users', rowData.id);
                    await deleteDoc(userDoc);
                    setUsers(users.filter(user => user.id !== rowData.id));
                    Swal.fire('Deleted!', 'User has been deleted.', 'success');
                  }
                }
              ]}
            />
          )} />
        </DataTable>
      </div>
    </div>
  );
};

export default AllUsers;