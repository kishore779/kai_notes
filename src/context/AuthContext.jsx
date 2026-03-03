import { createContext, useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data())
        }
      } else {
        setUserData(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signup = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      email,
      displayName,
      notifications: [],
      joinedRooms: [],
      createdAt: new Date().toISOString()
    })
    return result
  }

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const userDoc = await getDoc(doc(db, 'users', result.user.uid))
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        notifications: [],
        joinedRooms: [],
        createdAt: new Date().toISOString()
      })
    }
    return result
  }

  const logout = () => signOut(auth)

  const addNotification = async (notification) => {
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), {
        notifications: arrayUnion({
          ...notification,
          id: Date.now(),
          read: false,
          createdAt: new Date().toISOString()
        })
      })
    }
  }

  const clearNotification = async (notificationId) => {
    if (user && userData) {
      const updatedNotifications = userData.notifications.filter(n => n.id !== notificationId)
      await updateDoc(doc(db, 'users', user.uid), {
        notifications: updatedNotifications
      })
    }
  }

  const value = {
    user,
    userData,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    addNotification,
    clearNotification
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
