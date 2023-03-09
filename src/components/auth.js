import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // console.log(auth?.currentUser?.email);

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input
        placeholder='Email'
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <input
        placeholder='Password'
        type='password'
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button onClick={signIn}>Sign In</button>
      <br />
      <button onClick={signInWithGoogle}>Sign In with Google</button>
      <br />
      <button onClick={logOut}>Log Out</button>
    </div>
  );
};
