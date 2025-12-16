// import './App.css';

import React, { useRef, useEffect, useState } from 'react';
import MediasoupConnector from './components/MediasoupConnector';

// List of rooms for demonstration; in real use, this could be dynamic

const IFRAME_ORIGIN = 'http://localhost:4443';

function App() {
  const [rooms, setRooms] = useState([{ roomId: 'everyone', title: 'Everyone room' }]);
  // Refs for each iframe, mapped by roomId
  const iframeRefs = useRef({});

  // Send message to a specific iframe by roomId
  const sendMessageToRoom = (roomId, type = 'FROM_HOST', message) => {
    const iframe = iframeRefs.current[roomId];
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type, payload: message }, '*');
    }
  };

  // Listen for messages from iframes
  useEffect(() => {
    function handleMessage(event) {
      // Optionally, check event.origin for security
      // if (event.origin !== IFRAME_ORIGIN) return;

      if (event.data && event.data.type === 'REQUEST_TOKEN') {
        if (event.data.payload && event.data.payload.roomId) {
          sendMessageToRoom(event.data.payload.roomId, 'RESPONSE_TOKEN', { token: 'secure-token' });
        }
      }

      if (event.data?.type === 'P2P_CONNECTION' && event.data.payload?.roomId === 'everyone') {
        const newRoomId = event.data.payload.newRoomIdForP2P?.newRoomId;
        if (newRoomId) {
          setRooms((prevRooms) => {
            // Avoid duplicates
            if (prevRooms.find((room) => room.roomId === newRoomId)) {
              return prevRooms;
            }
            return [...prevRooms, { roomId: newRoomId, title: `P2P Room ${newRoomId}` }];
          });
        }
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <h1>Mediasoup Radio Page</h1>
      <hr />
      {rooms.map(({ roomId, title }) => (
        <div key={roomId} style={{ marginBottom: '2rem', width: '100%' }}>
          <h3>
            Room <span style={{ color: 'green' }}>{roomId}</span>
          </h3>
          <MediasoupConnector
            ref={(el) => {
              iframeRefs.current[roomId] = el;
            }}
            roomId={roomId}
            style={{ width: '100%' }}
            title={title}
          />
        </div>
      ))}
    </div>
  );
}

export default App;
