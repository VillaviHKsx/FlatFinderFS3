import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import Swal from 'sweetalert2';
import '../styles/login.css';

const EditFlat = ({ visible, onHide }) => {
  const { user } = useContext(AuthContext);
  const { flatId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    city: '',
    streetName: '',
    streetNumber: '',
    areaSize: '',
    hasAC: false,
    yearBuilt: '',
    rentPrice: '',
    dateAvailable: null,
  });

  useEffect(() => {
    const fetchFlat = async () => {
      try {
        const flatDoc = doc(db, 'flats', flatId);
        const flatSnapshot = await getDoc(flatDoc);
        if (flatSnapshot.exists()) {
          const flatData = flatSnapshot.data();
          setFormData({
            city: flatData.city,
            streetName: flatData.streetName,
            streetNumber: flatData.streetNumber,
            areaSize: flatData.areaSize,
            hasAC: flatData.hasAC,
            yearBuilt: flatData.yearBuilt,
            rentPrice: flatData.rentPrice,
            dateAvailable: flatData.dateAvailable ? new Date(flatData.dateAvailable.seconds * 1000) : null,
          });
        }
      } catch (error) {
        console.error('Error fetching flat:', error);
      }
    };

    fetchFlat();
  }, [flatId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const flatDoc = doc(db, 'flats', flatId);
      await updateDoc(flatDoc, {
        city: formData.city,
        streetName: formData.streetName,
        streetNumber: formData.streetNumber,
        areaSize: formData.areaSize,
        hasAC: formData.hasAC,
        yearBuilt: formData.yearBuilt,
        rentPrice: formData.rentPrice,
        dateAvailable: formData.dateAvailable,
      });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Flat updated successfully',
        backdrop: true,
      });
      navigate('/my-flats');
    } catch (error) {
      console.error('Error updating flat:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error updating flat',
        backdrop: true,
      });
    }
  };

  return (
    <Dialog header="Edit Flat" visible={true} style={{ width: '50vw' }} onHide={() => navigate('/my-flats')}>
      <form onSubmit={handleSubmit}>
        <div className="p-field">
          <label htmlFor="city">City: </label>
          <InputText id="city" name="city" value={formData.city} onChange={handleChange} />
        </div>
        <div className="p-field">
          <label htmlFor="streetName">Street Name: </label>
          <InputText id="streetName" name="streetName" value={formData.streetName} onChange={handleChange} />
        </div>
        <div className="p-field">
          <label htmlFor="streetNumber">Street Number: </label>
          <InputText id="streetNumber" name="streetNumber" value={formData.streetNumber} onChange={handleChange} />
        </div>
        <div className="p-field">
          <label htmlFor="areaSize">Area Size: </label>
          <InputNumber id="areaSize" name="areaSize" value={formData.areaSize} onValueChange={(e) => handleChange({ target: { name: 'areaSize', value: e.value } })} />
        </div>
        <div className="p-field">
          <label htmlFor="hasAC">Has AC: </label>
          <Checkbox id="hasAC" name="hasAC" checked={formData.hasAC} onChange={handleChange} />
        </div>
        <div className="p-field">
          <label htmlFor="yearBuilt">Year Built: </label>
          <InputNumber id="yearBuilt" name="yearBuilt" value={formData.yearBuilt} onValueChange={(e) => handleChange({ target: { name: 'yearBuilt', value: e.value } })} />
        </div>
        <div className="p-field">
          <label htmlFor="rentPrice">Rent Price: </label>
          <InputNumber id="rentPrice" name="rentPrice" value={formData.rentPrice} onValueChange={(e) => handleChange({ target: { name: 'rentPrice', value: e.value } })} />
        </div>
        <div className="p-field">
          <label htmlFor="dateAvailable">Date Available: </label>
          <InputText id="dateAvailable" name="dateAvailable" type="date" value={formData.dateAvailable ? formData.dateAvailable.toISOString().split('T')[0] : ''} onChange={handleChange} />
        </div>
        <Button label="Update" icon="pi pi-check" type="submit" />
      </form>
    </Dialog>
  );
};

export default EditFlat;