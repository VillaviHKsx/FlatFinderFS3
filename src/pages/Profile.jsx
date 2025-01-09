import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Header from '../components/Header';
import UpdateDialog from '../pages/UpdateDialog';
import '../styles/login.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId || user.uid));
        if (userDoc.exists()) {
          setProfileData(userDoc.data());
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId, user.uid]);

  const handleEdit = () => {
    setIsDialogVisible(true);
  };

  if (!profileData) {
    return <p>Loading...</p>;
  }

  const isEditable = user.uid === (userId || user.uid) || user.role === 'admin';

  return (
    <div>
      <Header user={user} onLogout={logout} />
      <div className="profile-container">
        <DataTable value={[profileData]}>
          <Column field="firstName" header="First Name" />
          <Column field="lastName" header="Last Name" />
          <Column field="email" header="Email" />
          <Column field="birthDate" header="Birth Date" />
          {isEditable && (
            <Column
              header="Actions"
              body={() => (
                <Button label="Edit" icon="pi pi-pencil" onClick={handleEdit} />
              )}
            />
          )}
        </DataTable>
      </div>
      <UpdateDialog visible={isDialogVisible} onHide={() => setIsDialogVisible(false)} />
    </div>
  );
};

export default Profile;