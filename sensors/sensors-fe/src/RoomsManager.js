import React, { useEffect, useState, createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import { backendRootUri } from './index';

const RoomsContext = createContext();
let ROOMS_URI ='';

const RoomsManager = () => {
  ROOMS_URI = backendRootUri + '/rooms';
  return(
  <GetRooms>
    <div>
      <h1>Rooms Manager</h1>
      <RoomsTable />
      <NewRoom />
      <Link to="/">Back to home</Link>
    </div>
  </GetRooms>
);
};

export default RoomsManager;


const GetRooms = ({ children }) => {
  const [rooms, setRooms] = useState([]);

  async function fetchData() {
    try {
      const response = await fetch(ROOMS_URI);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("Data: ", data);
      setRooms(data);
    } catch (error) {
      console.error('Error fetching data:', error.message);

    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <RoomsContext.Provider value={{ rooms, fetchData }}>
      {children}
    </RoomsContext.Provider>
  );
}

const RoomsTable = () => {
  const { rooms,  fetchData} = useContext(RoomsContext);
  const [popups, setPopups] = useState([]);

  function openPopup(id, name, bluetooth) {
    setPopups([...popups, { id, name, bluetooth }]);
  };

  function closePopup(id) {
    setPopups(popups.filter((popup) => popup.id !== id));
  };

  async function deleteRoom(id) {
    const url = ROOMS_URI + '/' + id;
    console.log("URI to delete: ", url)
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await String;
      console.log('Response from server:', data);
      fetchData();
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  return (
    <div>
      <table border="0" cellPadding="0">
        <tbody>
          <tr key="head">
            <th>Name</th>
            <th>ID</th>
          </tr>
          {rooms.map(room => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>{room.bluetoothName}</td>
              <td className="icon-item icon-edit" onClick={() => openPopup(room.id, room.name, room.bluetoothName)}><div className="fas fa-edit"></div></td>
              <td className="icon-item" onClick={() => deleteRoom(room.id)}><div className="fas fa-trash-alt"></div></td>
            </tr>
          ))}
        </tbody>
      </table>
      {popups.map((popup) => (
        <UpdateForm
          key={popup.id}
          id={popup.id}
          name={popup.name}
          bluetoothName={popup.bluetooth}
          onClose={closePopup}
        />
      ))}
    </div>
  );
}

const NewRoom = () => {
  const { fetchData } = useContext(RoomsContext);
  const [name, setName] = useState('');
  const [bluetoothName, setBluetoothName] = useState('');
  const url = ROOMS_URI + '/newRoom';

  async function postNewRoom(e) {
    e.preventDefault();
    console.log('Form submitted with:', { Name: name, Bluetooth: bluetoothName });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          bluetoothName: bluetoothName,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      fetchData();
      setName("");
      setBluetoothName("")
    } catch (error) {
      console.error('Error:', error.message);
    }

  };

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      // Trigger form submission when the "Enter" key is pressed
      if (name !== '' && bluetoothName !== '') {
        postNewRoom(e);
      }
    }
  };

  return (
    <div>
      <h4>New Room</h4>
      <form onSubmit={postNewRoom}>
        <div className="form-row">
          <label>
            Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="form-row">
          <label>
            BluetoothName:
          </label>
          <input
            type="text"
            value={bluetoothName}
            onChange={(e) => setBluetoothName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button disabled={(bluetoothName === '' || name === '')} type="submit">Add</button>
      </form>
    </div>
  );
}

const UpdateForm = ({ id, name, bluetoothName, onClose }) => {
  const [updatedName, setUpdatedName] = useState(name);
  const [updatedBluetoothName, setUpdatedBluetoothName] = useState(bluetoothName);
  const { fetchData } = useContext(RoomsContext);

  async function updateRoom(e) {
    e.preventDefault();
    const url = ROOMS_URI +'/' + id;
    fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: updatedName,
        bluetoothName: updatedBluetoothName,
      })
    }).then((response) => {
      if (response.ok) {
        console.log("update successful! Item {} updated successfully!", response.json());
        fetchData();
      }
    }).catch((error) => console.error('Error updating item:', error));
    onClose(id);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      if (updatedName !== '' && updatedBluetoothName !== '') {
        updateRoom(e);
      }
    }
  };

  return (
    <div>
      <h4>Edit Room</h4>
      <form>
        <div className="form-row">
          <label>
            Name:
          </label>
          <input
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="form-row">
          <label>
            BluetoothName:
          </label>
          <input
            type="text"
            value={updatedBluetoothName}
            onChange={(e) => setUpdatedBluetoothName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button disabled={!(updatedBluetoothName && updatedName)} onClick={(e) => updateRoom(e)}>UPDATE</button>
      </form>
      <button onClick={() => onClose(id)}>Close</button>
    </div>
  )
}



