import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import Swal from 'sweetalert2';
import '../styles/login.css';

const NewFlat = ({ visible, onHide }) => {
  const [formData, setFormData] = useState({
    city: '',
    streetName: '',
    streetNumber: '',
    areaSize: '',
    hasAC: false,
    yearBuilt: '',
    rentPrice: '',
    dateAvailable: null
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'flats'), formData);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Flat created successfully',
      });
      onHide();
      navigate('/my-flats');
    } catch (error) {
      console.error('Error creating flat:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error creating flat',
      });
    }
  };

  return (
    <Dialog header="New Flat" visible={visible} style={{ width: '50vw' }} onHide={onHide}>
      <form onSubmit={handleSubmit}>
        <div className="p-field">
          <label htmlFor="city">City: </label>
          <InputText id="city" name="city" value={formData.city} onChange={handleInputChange} />
        </div>
        <div className="p-field">
          <label htmlFor="streetName">Street Name: </label>
          <InputText id="streetName" name="streetName" value={formData.streetName} onChange={handleInputChange} />
        </div>
        <div className="p-field">
          <label htmlFor="streetNumber">Street Number: </label>
          <InputNumber id="streetNumber" name="streetNumber" value={formData.streetNumber} onValueChange={handleInputChange} />
        </div>
        <div className="p-field">
          <label htmlFor="areaSize">Area Size: </label>
          <InputNumber id="areaSize" name="areaSize" value={formData.areaSize} onValueChange={handleInputChange} />
        </div>
        <div className="p-field-checkbox">
        <label htmlFor="hasAC">Has AC: </label>
          <Checkbox inputId="hasAC" name="hasAC" checked={formData.hasAC} onChange={handleCheckboxChange} />
        </div>
        <div className="p-field">
          <label htmlFor="yearBuilt">Year Built: </label>
          <InputNumber id="yearBuilt" name="yearBuilt" value={formData.yearBuilt} onValueChange={handleInputChange} />
        </div>
        <div className="p-field">
          <label htmlFor="rentPrice">Rent Price: </label>
          <InputNumber id="rentPrice" name="rentPrice" value={formData.rentPrice} onValueChange={handleInputChange} />
        </div>
        <div className="p-field">
          <label htmlFor="dateAvailable">Date Available: </label>
          <Calendar id="dateAvailable" name="dateAvailable" value={formData.dateAvailable} onChange={handleInputChange} showIcon />
        </div>
        <Button label="Create Flat" icon="pi pi-check" type="submit" />
      </form>
    </Dialog>
  );
};

export default NewFlat;