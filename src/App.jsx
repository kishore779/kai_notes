import { useState, useCallback } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import TopBar from './components/TopBar'
import Header from './components/Header'
import FileUpload from './components/FileUpload'
import Dashboard from './components/Dashboard'
import RoomView from './components/RoomView'
import './index.css'

function AppContent() {
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRoomJoined = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  if (selectedRoom) {
    return <RoomView room={selectedRoom} onBack={() => setSelectedRoom(null)} />
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <Header onRoomJoined={handleRoomJoined} />
      <FileUpload />
      <Dashboard key={refreshKey} onRoomSelect={setSelectedRoom} />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
