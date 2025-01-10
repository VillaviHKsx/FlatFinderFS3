import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import Header from '../components/Header';

function UpdateProfile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birthDate, setBirthDate] = useState('');

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setEmail(user.email);
        }
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const user = auth.currentUser;

            // Reautenticar al usuario
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Actualizar la información del perfil en Firebase Authentication
            await updateProfile(user, {
                displayName: `${firstName} ${lastName}`,
            });

            // Actualizar la contraseña si se proporciona una nueva
            if (newPassword) {
                await updatePassword(user, newPassword);
            }

            // Actualizar la información del usuario en Firestore
            const userDoc = doc(db, 'users', user.uid);
            await updateDoc(userDoc, {
                firstName,
                lastName,
                birthDate,
            });

            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.code === 'auth/requires-recent-login') {
                alert('Please log in again to update your profile.');
            } else {
                alert('Error updating profile');
            }
        }
    };

    return (
        <div>
            <Header />
            <h1>Update Profile</h1>
            <form onSubmit={handleUpdateProfile}>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        readOnly
                    />
                </label>
                <br />
                <label>
                    Current Password:
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    First Name:
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Last Name:
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Birth Date:
                    <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    New Password:
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Confirm Password:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
}

export default UpdateProfile;
