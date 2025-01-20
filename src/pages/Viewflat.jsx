import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { doc, getDoc, collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { SplitButton } from 'primereact/splitbutton';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Fieldset } from 'primereact/fieldset';
import { Avatar } from 'primereact/avatar';
import { Dialog } from 'primereact/dialog';
import Header from '../components/Header';
import '../styles/login.css';

const ViewFlat = () => {
  const { user, logout } = useContext(AuthContext);
  const { flatId } = useParams();
  const navigate = useNavigate();
  const [flat, setFlat] = useState(null);
  const [owner, setOwner] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showMessagesDialog, setShowMessagesDialog] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    const fetchFlat = async () => {
      try {
        const flatDoc = doc(db, 'flats', flatId);
        const flatSnapshot = await getDoc(flatDoc);
        if (flatSnapshot.exists()) {
          const flatData = flatSnapshot.data();
          setFlat(flatData);

          // Fetch owner data
          const ownerDoc = doc(db, 'users', flatData.ownerId);
          const ownerSnapshot = await getDoc(ownerDoc);
          if (ownerSnapshot.exists()) {
            setOwner(ownerSnapshot.data());
          }
        }
      } catch (error) {
        console.error('Error fetching flat:', error);
      }
    };

    fetchFlat();
  }, [flatId]);

  const formatDate = (date) => {
    if (!date) return '';
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return new Date(date.seconds * 1000).toLocaleDateString();
  };

  const sendMessage = async () => {
    if (!message.trim()) {
      toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Message content is required', life: 3000 });
      return;
    }

    try {
      const messagesCollection = collection(db, 'messages');
      await addDoc(messagesCollection, {
        flatId,
        ownerId: flat.ownerId,
        senderId: user.uid,
        senderName: `${user.firstName} ${user.lastName}`,
        senderEmail: user.email,
        senderAvatar: user.avatarUrl, // Assuming avatarUrl is stored in user context
        content: message,
        timestamp: Timestamp.now()
      });
      setMessage('');
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Message sent successfully', life: 3000 });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error sending message', life: 3000 });
    }
  };

  const fetchMessages = async () => {
    try {
      const messagesCollection = collection(db, 'messages');
      const q = query(messagesCollection, where('flatId', '==', flatId));
      const messagesSnapshot = await getDocs(q);
      const messagesData = messagesSnapshot.docs.map((doc) => doc.data());
      if (messagesData.length > 0) {
        setMessages(messagesData);
        setShowMessagesDialog(true);
      } else {
        toast.current.show({ severity: 'info', summary: 'No Messages', detail: 'There are no messages for this flat.', life: 3000 });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error fetching messages', life: 3000 });
    }
  };

  const editFlat = (flatId) => {
    navigate(`/edit-flat/${flatId}`);
  };

  const actionTemplate = (rowData) => {
    const items = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => editFlat(rowData.id)
      },
      {
        label: 'Messages',
        icon: 'pi pi-envelope',
        command: fetchMessages
      },
    ];

    return (
      <SplitButton icon="pi pi-cog" model={items} className="p-button-primary" />
    );
  };

  const legendTemplate = (message) => {
    return (
      <div className="flex align-items-center gap-2 px-2">
        <Avatar image={message.senderAvatar || '/images/avatar/default.png'} shape="circle" />
        <span className="font-bold">{message.senderName}</span>
      </div>
    );
  };

  return (
    <div>
      <Header user={user} onLogout={logout} />
      <div className="view-flat-container">
        {flat && (
          <DataTable value={[flat]}>
            <Column field="city" header="City" />
            <Column field="streetName" header="Street Name" />
            <Column field="streetNumber" header="Street Number" />
            <Column field="areaSize" header="Area Size" />
            <Column field="hasAC" header="Has AC" body={(rowData) => (rowData.hasAC ? 'Yes' : 'No')} />
            <Column field="yearBuilt" header="Year Built" />
            <Column field="rentPrice" header="Rent Price" />
            <Column field="dateAvailable" header="Date Available" body={(rowData) => formatDate(rowData.dateAvailable)} />
            {owner && (
              <Column field="ownerName" header="Owner Full Name" body={() => `${owner.firstName} ${owner.lastName}`} />
            )}
            {flat && flat.ownerId === user.uid && (
              <Column header="Actions" body={actionTemplate} />
            )}
          </DataTable>
        )}
        {flat && flat.ownerId !== user.uid && (
          <div className="message-container">
            <h3>Send a message to the owner</h3>
            <InputTextarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              cols={30}
              placeholder="Type your message here..."
            />
            <Button label="Send Message" icon="pi pi-send" className="p-button-primary" onClick={sendMessage} />
          </div>
        )}
        <Dialog header="Messages" visible={showMessagesDialog} style={{ width: '50vw' }} onHide={() => setShowMessagesDialog(false)}>
          {messages.length > 0 && (
            <div className="messages-container">
              {messages.map((msg, index) => (
                <Fieldset key={index} legend={legendTemplate(msg)}>
                  <p><strong>Email:</strong> {msg.senderEmail}</p>
                  <p><strong>Message:</strong> {msg.content}</p>
                  <p><strong>Timestamp:</strong> {formatDate(msg.timestamp)}</p>
                </Fieldset>
              ))}
            </div>
          )}
        </Dialog>
        <Toast ref={toast} />
      </div>
    </div>
  );
};

export default ViewFlat;