import { useState, useRef } from 'react'
import { 
  ArrowLeft, Search, Upload, FileText, MoreVertical, 
  MessageSquare, HelpCircle, UserPlus, Sparkles, Brain,
  Send, Trophy, Copy, Check, Mail
} from 'lucide-react'

// Demo files data
const demoFiles = [
  { id: '1', name: 'Chapter 1 Notes.pdf', size: 245000, type: 'application/pdf', uploadedByName: 'Alex', uploadedAt: new Date().toISOString() },
  { id: '2', name: 'Study Guide.docx', size: 128000, type: 'application/docx', uploadedByName: 'Sarah', uploadedAt: new Date().toISOString() }
]

export default function RoomView({ room, onBack }) {
  const [activeTab, setActiveTab] = useState('chat')
  const [files, setFiles] = useState(demoFiles)
  const [searchQuery, setSearchQuery] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    // Simulate upload
    await new Promise(r => setTimeout(r, 1000))
    
    const newFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedByName: 'You',
      uploadedAt: new Date().toISOString()
    }
    setFiles(prev => [newFile, ...prev])
    setUploading(false)
  }

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const tabs = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'quiz', icon: HelpCircle, label: 'Quiz' },
    { id: 'invite', icon: UserPlus, label: 'Invite' }
  ]

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Room header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-semibold">{room.name}</h2>
            <p className="text-sm text-gray-400">Code: {room.code}</p>
          </div>
        </div>

        {/* File management */}
        <div className="p-4 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="input-glass w-full pl-10"
              />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.txt,.doc,.docx,.ppt,.pptx"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-primary flex items-center gap-2"
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload size={18} />
              )}
              Upload
            </button>
          </div>
        </div>

        {/* Files list */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>No files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFiles.map(file => (
                <FileCard key={file.id} file={file} roomId={room.id} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 transition-colors
                ${activeTab === tab.id ? 'text-violet-400 border-b-2 border-violet-400' : 'text-gray-400 hover:text-white'}`}
            >
              <tab.icon size={18} />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chat' && <ChatPanel roomId={room.id} />}
          {activeTab === 'quiz' && <QuizPanel roomId={room.id} />}
          {activeTab === 'invite' && <InvitePanel room={room} />}
        </div>
      </div>
    </div>
  )
}

function FileCard({ file, roomId }) {
  const [showMenu, setShowMenu] = useState(false)
  const [aiLoading, setAiLoading] = useState('')

  const handleGenerateSummary = async () => {
    setAiLoading('summary')
    await new Promise(r => setTimeout(r, 2000))
    alert('Summary generated!')
    setAiLoading('')
    setShowMenu(false)
  }

  const handleGenerateQuiz = async () => {
    setAiLoading('quiz')
    await new Promise(r => setTimeout(r, 2000))
    alert('Quiz generated!')
    setAiLoading('')
    setShowMenu(false)
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="glass-card flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-violet-500/20 rounded-lg">
          <FileText size={20} className="text-violet-400" />
        </div>
        <div>
          <p className="font-medium">{file.name}</p>
          <p className="text-sm text-gray-400">
            {formatFileSize(file.size)} • {file.uploadedByName}
          </p>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-white/10 rounded-lg"
        >
          <MoreVertical size={18} />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-48 glass-card p-2 z-10 animate-slide-in">
            <button
              onClick={handleGenerateSummary}
              disabled={aiLoading !== ''}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg text-left"
            >
              {aiLoading === 'summary' ? (
                <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles size={16} className="text-violet-400" />
              )}
              Summarize
            </button>
            <button
              onClick={handleGenerateQuiz}
              disabled={aiLoading !== ''}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg text-left"
            >
              {aiLoading === 'quiz' ? (
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Brain size={16} className="text-cyan-400" />
              )}
              Generate Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ChatPanel({ roomId }) {
  const [messages, setMessages] = useState([
    { id: '1', content: 'Hey everyone! Ready to study?', sender: 'other', senderName: 'Alex', timestamp: new Date().toISOString() },
    { id: '2', content: 'Yes! Let\'s go over chapter 3', sender: 'other', senderName: 'Sarah', timestamp: new Date().toISOString() }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    // Simulate sending
    await new Promise(r => setTimeout(r, 300))
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'me',
      senderName: 'You',
      timestamp: new Date().toISOString()
    }])
    setNewMessage('')
    setSending(false)
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No messages yet</p>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-2xl ${
                msg.sender === 'me' 
                  ? 'bg-violet-600 rounded-br-md' 
                  : 'glass rounded-bl-md'
              }`}>
                {msg.sender !== 'me' && (
                  <p className="text-xs text-violet-300 mb-1">{msg.senderName}</p>
                )}
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="input-glass flex-1"
          />
          <button type="submit" disabled={sending} className="btn-primary p-3">
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  )
}

function QuizPanel({ roomId }) {
  const [quizzes, setQuizzes] = useState([
    { id: 1, title: 'Biology Basics', questions: 10, topScore: 95 },
    { id: 2, title: 'Chemistry 101', questions: 15, topScore: 88 }
  ])
  const [leaderboard, setLeaderboard] = useState([
    { name: 'Alex', score: 950, rank: 1 },
    { name: 'Sarah', score: 820, rank: 2 },
    { name: 'Mike', score: 780, rank: 3 }
  ])

  return (
    <div className="p-4 overflow-y-auto h-full">
      <h3 className="font-semibold mb-4">Available Quizzes</h3>
      
      {quizzes.length === 0 ? (
        <div className="text-center text-gray-400 py-6">
          <HelpCircle size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No quizzes available</p>
          <p className="text-xs mt-1">Generate quizzes from uploaded files</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="glass p-4 rounded-xl hover:bg-white/10 cursor-pointer transition-all">
              <h4 className="font-medium">{quiz.title}</h4>
              <p className="text-sm text-gray-400">{quiz.questions} questions</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-green-400">Best: {quiz.topScore}%</span>
                <button className="text-sm text-violet-400 hover:text-violet-300">Start</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Trophy size={18} className="text-yellow-400" />
        Leaderboard
      </h3>
      
      <div className="space-y-2">
        {leaderboard.map(entry => (
          <div key={entry.rank} className="flex items-center gap-3 glass p-3 rounded-xl">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
              ${entry.rank === 1 ? 'bg-yellow-500' : entry.rank === 2 ? 'bg-gray-400' : 'bg-orange-600'}`}>
              {entry.rank}
            </span>
            <span className="flex-1">{entry.name}</span>
            <span className="text-violet-400 font-mono">{entry.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function InvitePanel({ room }) {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(room.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInvite = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setSending(true)
    // Simulate sending invite
    await new Promise(r => setTimeout(r, 1000))
    
    // In production, this would trigger a Cloud Function to send email
    // and add notification to the recipient's user document
    
    setSent(true)
    setEmail('')
    setSending(false)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">Invite Members</h3>

      {/* Room Code */}
      <div className="glass p-4 rounded-xl mb-6">
        <p className="text-sm text-gray-400 mb-2">Room Code</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-mono font-bold tracking-widest">{room.code}</span>
          <button onClick={copyCode} className="p-2 hover:bg-white/10 rounded-lg">
            {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
          </button>
        </div>
      </div>

      {/* Email Invite */}
      <div className="glass p-4 rounded-xl">
        <p className="text-sm text-gray-400 mb-3">Send Email Invite</p>
        <form onSubmit={handleInvite}>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="input-glass flex-1"
            />
            <button type="submit" disabled={sending} className="btn-primary p-3">
              {sending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Mail size={18} />
              )}
            </button>
          </div>
        </form>
        
        {sent && (
          <p className="text-green-400 text-sm mt-3 flex items-center gap-2">
            <Check size={16} />
            Invitation sent!
          </p>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Members who join will have access to all room materials
      </p>
    </div>
  )
}
