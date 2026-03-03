import { useState } from 'react'
import { Users, FileText, ArrowRight } from 'lucide-react'

// Demo rooms data
const demoRooms = [
  { id: '1', name: 'Biology Study Group', code: 'BIO101', members: ['guest'], files: ['notes.pdf', 'slides.pptx'] },
  { id: '2', name: 'Math Calculus', code: 'MATH201', members: ['guest', 'user2'], files: ['formulas.pdf'] },
  { id: '3', name: 'History 101', code: 'HIST100', members: ['guest'], files: [] }
]

export default function Dashboard({ onRoomSelect }) {
  const [rooms, setRooms] = useState(demoRooms)
  const [loading, setLoading] = useState(false)

  // Demo mode - rooms are already loaded

  if (loading) {
    return (
      <div className="px-6 py-8">
        <h2 className="text-xl font-semibold mb-6">Joined Classrooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card animate-pulse">
              <div className="h-6 bg-white/10 rounded w-3/4 mb-4" />
              <div className="h-4 bg-white/10 rounded w-1/2 mb-2" />
              <div className="h-4 bg-white/10 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-4">
      <h2 className="text-xl font-semibold mb-6">Joined Classrooms</h2>
      
      {rooms.length === 0 ? (
        <div className="glass-card text-center py-12">
          <Users size={48} className="mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400 mb-2">No rooms joined yet</p>
          <p className="text-sm text-gray-500">Create or join a room to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map(room => (
            <RoomCard key={room.id} room={room} onClick={() => onRoomSelect(room)} />
          ))}
        </div>
      )}
    </div>
  )
}

function RoomCard({ room, onClick }) {
  const memberCount = room.members?.length || 0
  const fileCount = room.files?.length || 0

  return (
    <div
      onClick={onClick}
      className="glass-card cursor-pointer hover:bg-white/10 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-xl">
          <Users size={24} className="text-violet-400" />
        </div>
        <ArrowRight size={20} className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
      </div>
      
      <h3 className="font-semibold text-lg mb-2">{room.name}</h3>
      
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span className="flex items-center gap-1">
          <Users size={14} />
          {memberCount} member{memberCount !== 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1">
          <FileText size={14} />
          {fileCount} file{fileCount !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10">
        <span className="text-xs text-gray-500 font-mono bg-white/5 px-2 py-1 rounded">
          Code: {room.code}
        </span>
      </div>
    </div>
  )
}
