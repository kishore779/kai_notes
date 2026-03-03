import { useState, useRef } from 'react'
import { Upload, FileText, X, Sparkles, HelpCircle } from 'lucide-react'

export default function FileUpload({ roomId, onFileUploaded }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [showAIActions, setShowAIActions] = useState(false)
  const [aiLoading, setAiLoading] = useState('')
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      handleFileUpload(e.target.files[0])
    }
  }

  const handleFileUpload = async (file) => {
    if (!file) return

    setUploading(true)
    try {
      // Simulate upload for demo
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const uploadedFileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedBy: 'guest',
        uploadedAt: new Date().toISOString(),
        url: URL.createObjectURL(file)
      }

      setUploadedFile(uploadedFileData)
      setShowAIActions(true)
      onFileUploaded?.(uploadedFileData)
    } catch (error) {
      console.error('Upload failed:', error)
    }
    setUploading(false)
  }

  const handleGenerateSummary = async () => {
    setAiLoading('summary')
    // Simulate AI summary generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert('Summary generated! (In production, this would call an AI API)')
    setAiLoading('')
  }

  const handleTakeQuiz = async () => {
    setAiLoading('quiz')
    // Simulate quiz generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert('Quiz generated! (In production, this would call an AI API)')
    setAiLoading('')
  }

  const clearFile = () => {
    setUploadedFile(null)
    setShowAIActions(false)
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="px-6 pb-6">
      {!uploadedFile ? (
        <div
          className={`upload-zone text-center ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.txt,.doc,.docx,.ppt,.pptx"
          />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400">Uploading...</p>
            </div>
          ) : (
            <>
              <Upload size={40} className="mx-auto mb-4 text-violet-400" />
              <p className="text-lg font-medium mb-2">Upload Study Material</p>
              <p className="text-gray-400 text-sm">
                Drag and drop or click to upload PDF, DOC, TXT files
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="glass-card">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-violet-500/20 rounded-xl">
                <FileText size={24} className="text-violet-400" />
              </div>
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-gray-400">{formatFileSize(uploadedFile.size)}</p>
              </div>
            </div>
            <button onClick={clearFile} className="text-gray-400 hover:text-white p-1">
              <X size={20} />
            </button>
          </div>

          {showAIActions && (
            <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
              <button
                onClick={handleGenerateSummary}
                disabled={aiLoading !== ''}
                className="btn-primary flex items-center gap-2"
              >
                {aiLoading === 'summary' ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles size={18} />
                )}
                Generate Summary
              </button>
              <button
                onClick={handleTakeQuiz}
                disabled={aiLoading !== ''}
                className="btn-secondary flex items-center gap-2"
              >
                {aiLoading === 'quiz' ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <HelpCircle size={18} />
                )}
                Take Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
