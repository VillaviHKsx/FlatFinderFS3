/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import '../styles/login.css';

const NewFlat = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    city: '',
    streetName: '',
    streetNumber: '',
    areaSize: '',
    hasAC: false,
    yearBuilt: '',
    rentPrice: '',
    dateAvailable: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.streetName) newErrors.streetName = 'Street Name is required';
    if (!formData.streetNumber || isNaN(Number(formData.streetNumber))) newErrors.streetNumber = 'Street Number must be a number';
    if (!formData.areaSize || isNaN(Number(formData.areaSize))) newErrors.areaSize = 'Area Size must be a number';
    if (!formData.yearBuilt || isNaN(Number(formData.yearBuilt))) newErrors.yearBuilt = 'Year Built must be a number';
    if (!formData.rentPrice || isNaN(Number(formData.rentPrice))) newErrors.rentPrice = 'Rent Price must be a number';
    if (!formData.dateAvailable) newErrors.dateAvailable = 'Date Available is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const flatCollection = collection(db, 'flats');
      await addDoc(flatCollection, {
        ...formData,
        streetNumber: Number(formData.streetNumber),
        areaSize: Number(formData.areaSize),
        yearBuilt: Number(formData.yearBuilt),
        rentPrice: Number(formData.rentPrice),
        dateAvailable: new Date(formData.dateAvailable),
      });
      Swal.fire({
        icon: 'success',
        title: 'Flat saved successfully',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/'); // Redirige a la página de inicio
    } catch (error) {
      console.error('Error saving flat:', error);
    }
  };

  const handleCancel = () => {
    navigate('/'); // Redirige a la página de inicio
  };

  return (
    <div className="login-container">
      <h1>New Flat</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="p-float-label">
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && <span>{errors.city}</span>}
        </div>

        <div className="p-float-label">
          <label>Street Name:</label>
          <input
            type="text"
            name="streetName"
            value={formData.streetName}
            onChange={handleChange}
          />
          {errors.streetName && <span>{errors.streetName}</span>}
        </div>

        <div className="p-float-label">
          <label>Street Number:</label>
          <input
            type="number"
            name="streetNumber"
            value={formData.streetNumber}
            onChange={handleChange}
          />
          {errors.streetNumber && <span>{errors.streetNumber}</span>}
        </div>

        <div className="p-float-label">
          <label>Area Size:</label>
          <input
            type="number"
            name="areaSize"
            value={formData.areaSize}
            onChange={handleChange}
          />
          {errors.areaSize && <span>{errors.areaSize}</span>}
        </div>

        <div className="p-float-label">
          <label>Has AC:</label>
          <input
            type="checkbox"
            name="hasAC"
            checked={formData.hasAC}
            onChange={handleChange}
          />
        </div>

        <div className="p-float-label">
          <label>Year Built:</label>
          <input
            type="number"
            name="yearBuilt"
            value={formData.yearBuilt}
            onChange={handleChange}
          />
          {errors.yearBuilt && <span>{errors.yearBuilt}</span>}
        </div>

        <div className="p-float-label">
          <label>Rent Price:</label>
          <input
            type="number"
            name="rentPrice"
            value={formData.rentPrice}
            onChange={handleChange}
          />
          {errors.rentPrice && <span>{errors.rentPrice}</span>}
        </div>

        <div className="p-float-label">
          <label>Date Available:</label>
          <input
            type="date"
            name="dateAvailable"
            value={formData.dateAvailable}
            onChange={handleChange}
          />
          {errors.dateAvailable && <span>{errors.dateAvailable}</span>}
        </div>

        <div className="button-group">
          <button type="submit">Save</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default NewFlat;  */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import '../styles/login.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const NewFlat = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    city: '',
    streetName: '',
    streetNumber: '',
    areaSize: '',
    hasAC: false,
    yearBuilt: '',
    rentPrice: '',
    dateAvailable: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.streetName) newErrors.streetName = 'Street Name is required';
    if (!formData.streetNumber || isNaN(Number(formData.streetNumber))) newErrors.streetNumber = 'Street Number must be a number';
    if (!formData.areaSize || isNaN(Number(formData.areaSize))) newErrors.areaSize = 'Area Size must be a number';
    if (!formData.yearBuilt || isNaN(Number(formData.yearBuilt))) newErrors.yearBuilt = 'Year Built must be a number';
    if (!formData.rentPrice || isNaN(Number(formData.rentPrice))) newErrors.rentPrice = 'Rent Price must be a number';
    if (!formData.dateAvailable) newErrors.dateAvailable = 'Date Available is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const flatCollection = collection(db, 'flats');
      await addDoc(flatCollection, {
        ...formData,
        streetNumber: Number(formData.streetNumber),
        areaSize: Number(formData.areaSize),
        yearBuilt: Number(formData.yearBuilt),
        rentPrice: Number(formData.rentPrice),
        dateAvailable: new Date(formData.dateAvailable),
      });
      Swal.fire({
        icon: 'success',
        title: 'Flat saved successfully',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/'); // Redirige a la página de inicio
    } catch (error) {
      console.error('Error saving flat:', error);
    }
  };

  const handleCancel = () => {
    navigate('/'); // Redirige a la página de inicio
  };

  return (
    <div className="login-container">
      <h1>New Flat</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="p-float-label">
          <InputText
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          <label htmlFor="city">City</label>
          {errors.city && <span>{errors.city}</span>}
        </div>

        <div className="p-float-label">
          <InputText
            id="streetName"
            name="streetName"
            value={formData.streetName}
            onChange={handleChange}
          />
          <label htmlFor="streetName">Street Name</label>
          {errors.streetName && <span>{errors.streetName}</span>}
        </div>

        <div className="p-float-label">
          <InputText
            id="streetNumber"
            name="streetNumber"
            value={formData.streetNumber}
            onChange={handleChange}
            type="number"
          />
          <label htmlFor="streetNumber">Street Number</label>
          {errors.streetNumber && <span>{errors.streetNumber}</span>}
        </div>

        <div className="p-float-label">
          <InputText
            id="areaSize"
            name="areaSize"
            value={formData.areaSize}
            onChange={handleChange}
            type="number"
          />
          <label htmlFor="areaSize">Area Size</label>
          {errors.areaSize && <span>{errors.areaSize}</span>}
        </div>

        <div className="p-float-label">
          <input
            id="hasAC"
            name="hasAC"
            type="checkbox"
            checked={formData.hasAC}
            onChange={handleChange}
          />
          <label htmlFor="hasAC">Has AC</label>
        </div>

        <div className="p-float-label">
          <InputText
            id="yearBuilt"
            name="yearBuilt"
            value={formData.yearBuilt}
            onChange={handleChange}
            type="number"
          />
          <label htmlFor="yearBuilt">Year Built</label>
          {errors.yearBuilt && <span>{errors.yearBuilt}</span>}
        </div>

        <div className="p-float-label">
          <InputText
            id="rentPrice"
            name="rentPrice"
            value={formData.rentPrice}
            onChange={handleChange}
            type="number"
          />
          <label htmlFor="rentPrice">Rent Price</label>
          {errors.rentPrice && <span>{errors.rentPrice}</span>}
        </div>

        <div className="p-float-label">
          <InputText
            id="dateAvailable"
            name="dateAvailable"
            value={formData.dateAvailable}
            onChange={handleChange}
            type="date"
          />
          {errors.dateAvailable && <span>{errors.dateAvailable}</span>}
        </div>

        <div className="button-group">
          <Button type="submit" label="Save" className="p-button-rounded p-button-success" />
          <Button
            type="button"
            label="Cancel"
            className="p-button-rounded p-button-outlined"
            onClick={handleCancel}
          />
        </div>
      </form>
    </div>
  );
};

export default NewFlat;