import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'

const Chatbox = () => {

  const { selectedChat } = useAppContext()

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('text')

  const [isPublished, setIsPublished] = useState(false)

  const conrainerRef = useRef(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    // handle send here...
  }

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages)
    }
  }, [selectedChat])

  useEffect(()=>{
    if(conrainerRef.current){
      conrainerRef.current.scrollTo({
        top: conrainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  },[messages])

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-32 max-md:mt-14 2xl:pr-40">

      {/* Messages */}
      <div ref={conrainerRef} className="flex-1 mb-5 overflow-y-auto">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
            <img src={assets.logo} alt="App Logo" className="w-full max-w-20" />
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400">
              Ask Me Anything.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {loading && (
          <div className="mt-2 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:0ms]" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:150ms]" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:300ms]" />
          </div>
        )}
      </div>

      {mode === 'image' && (
        <label className='inline-flex items-center mb-3 gap-2 text-sm mx-auto'>
          <p className=' cursor-pointer text-xs'>Publish generated image to Community</p>
          <input onChange={(e) => setIsPublished(e.target.checked)} type="checkbox" className='cursor-pointer' checked={isPublished} name="" id="" />
        </label>
      )}

      {/* Input */}
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 p-2 border border-gray-700 rounded-lg bg-gray-900"
      >
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="text-sm px-2 py-1 rounded  text-gray-200 outline-none w-18"
        >
          <option className='bg-gray-600 text-white ' value="text">Text</option>
          <option className='bg-gray-600 text-white' value="image">Image</option>
        </select>
        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder="Type your prompt here..."
          required
          className="flex-1 text-sm px-3 py-2 text-gray-200 rounded outline-none"
        />
        <button type="submit" disabled={loading}>
          <img
            className="w-8 cursor-pointer"
            src={loading ? assets.stop_icon : assets.send_icon}
            alt={loading ? "Stop" : "Send"}
          />
        </button>
      </form>
    </div>
  )
}

export default Chatbox
