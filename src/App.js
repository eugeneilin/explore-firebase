import { useState, useEffect } from 'react';
import { Auth } from './components/auth';
import { db, auth, storage } from './config/firebase';
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import './App.css';

function App() {
  const [songList, setSongList] = useState([]);

  // New Song States
  const [newSongTitle, setNewSongTitle] = useState('');
  const [newSongComposer, setNewSongComposer] = useState('');
  const [newSongNeedsConductor, setNewSongNeedsConductor] = useState(true);
  const [newSongLastConductedBy, setNewSongLastConductedBy] = useState('');
  const [newSongLastSungOn, setNewSongLastSungOn] = useState(0);

  // Update Title State
  const [updatedTitle, setUpdatedTitle] = useState('');

  // File Upload State
  const [fileUpload, setFileUpload] = useState(null);

  const songCollectionRef = collection(db, 'songs');

  const getSongList = async () => {
    try {
      const data = await getDocs(songCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setSongList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getSongList();
  }, []);

  const onSubmitSong = async () => {
    try {
      await addDoc(songCollectionRef, {
        title: newSongTitle,
        composer: newSongComposer,
        lastConductedBy: newSongLastConductedBy,
        lastSungOn: newSongLastSungOn,
        needsConductor: newSongNeedsConductor,
        userId: auth?.currentUser?.uid,
      });

      getSongList();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSong = async (id) => {
    const songDoc = doc(db, 'songs', id);
    await deleteDoc(songDoc);
    getSongList();
  };

  const updateSongTitle = async (id) => {
    const songDoc = doc(db, 'songs', id);
    await updateDoc(songDoc, { title: updatedTitle });
    getSongList();
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='App'>
      <h1>Explore Firebase</h1>
      <Auth />

      {/* Add New Song */}
      <div>
        <input placeholder='Song Title' onChange={(e) => setNewSongTitle(e.target.value)} />
        <input placeholder='Composer' onChange={(e) => setNewSongComposer(e.target.value)} />
        <input
          placeholder='Last Conducted By'
          onChange={(e) => setNewSongLastConductedBy(e.target.value)}
        />
        <input
          placeholder='Last Sung'
          type='number'
          onChange={(e) => {
            setNewSongLastSungOn(Number(e.target.value));
          }}
        />
        <input
          id='needsConductor'
          type='checkbox'
          checked={newSongNeedsConductor}
          onChange={(e) => {
            setNewSongNeedsConductor(e.target.checked);
          }}
        />
        <label htmlFor='needsConductor'>Needs Conductor?</label>
        <button onClick={onSubmitSong}>Submit Song</button>
      </div>

      {/* Display Song List */}
      <div>
        {songList.map((song) => (
          <div>
            <h2>{song.title}</h2>
            <p>Composer: {song.composer}</p>
            <p style={{ display: !song.needsConductor ? 'none' : 'block' }}>
              Needs conductor {song.needsConductor}
            </p>
            <p>Last conducted by: {song.lastConductedBy}</p>
            <p>Last sung on: {song.lastSungOn}</p>

            <button
              onClick={() => {
                deleteSong(song.id);
              }}
            >
              Delete Song
            </button>

            <input placeholder='Edited Title' onChange={(e) => setUpdatedTitle(e.target.value)} />
            <button onClick={() => updateSongTitle(song.id)}>Update Title</button>

            <hr />
          </div>
        ))}
      </div>

      <div>
        <input type='file' onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload</button>
      </div>
    </div>
  );
}

export default App;
