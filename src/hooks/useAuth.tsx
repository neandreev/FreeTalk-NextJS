import { useState, useEffect, useContext, createContext } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

firebase.initializeApp({
  apiKey: 'AIzaSyAudkAgWP66xM7S38SC2D-Ls75YzLmeZ3s',
  authDomain: 'freetalk2022.firebaseapp.com',
  databaseURL: 'https://freetalk2022-default-rtdb.firebaseio.com',
  projectId: 'freetalk2022',
  storageBucket: 'freetalk2022.appspot.com',
  messagingSenderId: '1003236681631',
  appId: '1:1003236681631:web:1a2ec2c0e896b494a87faa',
});

export type User = firebase.User | null | false;

export interface authContext {
  user: User;
  signin: (email: string, password: string) => Promise<firebase.User | null>;
  signup: (email: string, password: string) => Promise<firebase.User | null>;
  signout: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<boolean>;
  confirmPasswordReset: (code: string, password: string) => Promise<boolean>;
}

const useProvideAuth = () => {
  const [user, setUser] = useState<User>(null);

  const signin = (email: string, password: string) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        setUser(response.user);
        return response.user;
      });
  };

  const signup = (email: string, password: string) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        setUser(response.user);
        return response.user;
      });
  };

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(false);
      });
  };

  const sendPasswordResetEmail = (email: string) => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true;
      });
  };

  const confirmPasswordReset = (code: string, password: string) => {
    return firebase
      .auth()
      .confirmPasswordReset(code, password)
      .then(() => {
        return true;
      });
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
  };
};

const AuthContext = createContext<authContext | null>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const ProvideAuth: React.FC = ({ children }) => {
  const auth = useProvideAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
