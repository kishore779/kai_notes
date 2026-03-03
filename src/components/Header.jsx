import { useState } from 'react'
import { Plus, LogIn, X, Copy, Check } from 'lucide-react'

export default function Header({ onRoomJoined }) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [roomId, setRoomId] = useState('')
  const [createdRoomId, setCreatedRoomId] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleCreateRoom = async (e) => {
    e.preventDefault()
    if (!roomName.trim()) return

    setLoading(true)
    setError('')
    
    // Simulate room creation (local demo)
    await new Promise(r => setTimeout(r, 500))
    const roomCode = generateRoomCode()
    setCreatedRoomId(roomCode)
    setRoomName('')
    onRoomJoined?.()
    setLoading(false)
  }

  const handleJoinRoom = async (e) => {
    e.preventDefault()
    if (!roomId.trim()) return

    setLoading(true)
    setError('')

    // Simulate room join (local demo)
    await new Promise(r => setTimeout(r, 500))
    setShowJoinModal(false)
    setRoomId('')
    onRoomJoined?.()
    setLoading(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdRoomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 p-6">
        <h1 className="text-2xl font-bold gradient-text">Study Rooms</h1>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Create Room
          </button>
          <button
            onClick={() => setShowJoinModal(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <LogIn size={18} />
            Join Room
          </button>
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Create New Room</h2>
              <button
                onClick={() => { setShowCreateModal(false); setCreatedRoomId(''); setError('') }}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {createdRoomId ? (
              <div className="text-center">
                <p className="text-gray-400 mb-4">Room created successfully!</p>
                <div className="flex items-center justify-center gap-2 p-4 glass rounded-xl mb-4">
                  <span className="text-2xl font-mono font-bold tracking-widest">{createdRoomId}</span>
                  <button onClick={copyToClipboard} className="p-2 hover:bg-white/10 rounded-lg">
                    {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                  </button>
                </div>
                <p className="text-sm text-gray-400">Share this code with others to join</p>
                <button
                  onClick={() => { setShowCreateModal(false); setCreatedRoomId('') }}
                  className="btn-primary mt-4"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateRoom}>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Room name"
                  className="input-glass w-full mb-4"
                  autoFocus
                />
                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Room'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Join Room</h2>
              <button
                onClick={() => { setShowJoinModal(false); setError('') }}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleJoinRoom}>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                placeholder="Enter room code"
                className="input-glass w-full mb-4 font-mono tracking-widest text-center uppercase"
                maxLength={6}
                autoFocus
              />
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Joining...' : 'Join Room'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
