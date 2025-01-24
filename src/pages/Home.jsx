import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import Header from '../components/Header';
import '../styles/login.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [flats, setFlats] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: { value: null, matchMode: 'contains' },
    rentPrice: { value: null, matchMode: 'between' },
    areaSize: { value: null, matchMode: 'between' },
  });
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlatsAndFavorites = async () => {
      try {
        const flatsCollection = collection(db, 'flats');
        const usersCollection = collection(db, 'users');
        const flatsSnapshot = await getDocs(flatsCollection);
        const usersSnapshot = await getDocs(usersCollection);

        const flatsData = flatsSnapshot.docs.map((doc) => {
          const flatData = doc.data();
          // Convertir dateAvailable a un objeto Date si es necesario
          if (flatData.dateAvailable && flatData.dateAvailable.seconds) {
            flatData.dateAvailable = new Date(flatData.dateAvailable.seconds * 1000);
          }
          return { id: doc.id, ...flatData };
        });

        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        // Obtener los favoritos del usuario actual
        const userFavoritesCollection = collection(db, `flatfavorite`);
        const userFavoritesSnapshot = await getDocs(userFavoritesCollection);
        const userFavoritesData = userFavoritesSnapshot.docs.reduce((acc, doc) => {
          const favoriteData = doc.data();
          if (favoriteData.userId === user.uid) {
            acc[favoriteData.id] = true;
          }
          return acc;
        }, {});

        // Combinar los datos de los flats con los datos de los usuarios y los favoritos del usuario
        const combinedData = flatsData.map((flat) => {
          const owner = usersData.find((user) => user.id === flat.ownerId);
          return {
            ...flat,
            ownerName: owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown',
            ownerEmail: owner ? owner.email : 'Unknown',
            isFavorite: userFavoritesData[flat.id] || false
          };
        });

        setFlats(combinedData);
      } catch (error) {
        console.error('Error fetching flats and favorites:', error);
      }
    };

    if (user) {
      fetchFlatsAndFavorites();
    }
  }, [user]);

  const formatDate = (date) => {
    if (!date) return '';
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return new Date(date.seconds * 1000).toLocaleDateString();
  };

  const handleFavoriteChange = async (flat, value) => {
    try {
      const flatDoc = doc(db, 'flats', flat.id);
      await setDoc(flatDoc, { ...flat, isFavorite: value }, { merge: true });
      setFlats((prevFlats) =>
        prevFlats.map((f) =>
          f.id === flat.id ? { ...f, isFavorite: value } : f
        )
      );

      const flatFavoriteDoc = doc(db, `flatfavorite/${user.uid}_${flat.id}`);
      if (value) {
        await setDoc(flatFavoriteDoc, { ...flat, userId: user.uid });
      } else {
        await deleteDoc(flatFavoriteDoc);
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const favoriteTemplate = (rowData) => {
    return (
      <InputSwitch
        checked={rowData.isFavorite}
        onChange={(e) => handleFavoriteChange(rowData, e.value)}
      />
    );
  };

  const openFlat = (flatId) => {
    navigate(`/view-flat/${flatId}`);
  };

  const actionTemplate = (rowData) => {
    return (
      <Button
        label="Open"
        icon="pi pi-external-link"
        className="p-button-primary"
        onClick={() => openFlat(rowData.id)}
      />
    );
  };

  const onFilterChange = (e, field) => {
    const value = e.target.value;
    const newFilters = { ...filters };
    newFilters[field].value = value;
    setFilters(newFilters);
  };

  return (
    <div>
      <Header user={user} onLogout={logout} />
      <div className="home-container">
        <DataTable
          value={flats}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 20]}
          filters={filters}
          filterDisplay="menu"
        >
          <Column
            field="city"
            header="City"
            sortable
            filter
            filterElement={
              showFilters && (
                <InputText
                  value={filters.city.value}
                  onChange={(e) => onFilterChange(e, 'city')}
                  placeholder="Search by city"
                />
              )
            }
          />
          <Column field="streetName" header="Street Name" />
          <Column field="streetNumber" header="Street Number" />
          <Column
            field="areaSize"
            header="Area Size"
            sortable
            filter
            filterElement={
              showFilters && (
                <div className="p-inputgroup">
                  <InputNumber
                    value={filters.areaSize.value ? filters.areaSize.value[0] : null}
                    onChange={(e) => onFilterChange({ target: { value: [e.value, filters.areaSize.value ? filters.areaSize.value[1] : null] } }, 'areaSize')}
                    placeholder="Min size"
                  />
                  <InputNumber
                    value={filters.areaSize.value ? filters.areaSize.value[1] : null}
                    onChange={(e) => onFilterChange({ target: { value: [filters.areaSize.value ? filters.areaSize.value[0] : null, e.value] } }, 'areaSize')}
                    placeholder="Max size"
                  />
                </div>
              )
            }
          />
          <Column
            field="hasAC"
            header="Has AC"
            body={(rowData) => (rowData.hasAC ? 'Yes' : 'No')}
          />
          <Column field="yearBuilt" header="Year Built" />
          <Column
            field="rentPrice"
            header="Rent Price"
            sortable
            filter
            filterElement={
              showFilters && (
                <div className="p-inputgroup">
                  <InputNumber
                    value={filters.rentPrice.value ? filters.rentPrice.value[0] : null}
                    onChange={(e) => onFilterChange({ target: { value: [e.value, filters.rentPrice.value ? filters.rentPrice.value[1] : null] } }, 'rentPrice')}
                    placeholder="Min price"
                  />
                  <InputNumber
                    value={filters.rentPrice.value ? filters.rentPrice.value[1] : null}
                    onChange={(e) => onFilterChange({ target: { value: [filters.rentPrice.value ? filters.rentPrice.value[0] : null, e.value] } }, 'rentPrice')}
                    placeholder="Max price"
                  />
                </div>
              )
            }
          />
          <Column
            field="dateAvailable"
            header="Date Available"
            body={(rowData) => formatDate(rowData.dateAvailable)}
          />
          <Column field="ownerName" header="Owner Full Name" />
          <Column field="ownerEmail" header="Owner Email" />
          <Column header="Favorite" body={favoriteTemplate} />
          <Column header="Actions" body={actionTemplate} />
        </DataTable>
      </div>
    </div>
  );
};

export default Home;