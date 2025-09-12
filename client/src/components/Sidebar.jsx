import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import moment from 'moment'
import axios from 'axios'
import toast from 'react-hot-toast'

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    backendUrl,
    chats,
    setSelectedChat,
    user,
    navigate,
    logout,
    createNewChat,
    setChats,
    fetchUserChats,
    token
  } = useAppContext()

  const [search, setSearch] = useState('')
  const [loadingNewChat, setLoadingNewChat] = useState(false)

  const deleteChat = async (e, chatId) => {
    try {
      e.stopPropagation()
      const confirmDelete = window.confirm('Click OK to delete chat.')
      if (!confirmDelete) return

      const { data } = await axios.post(
        `${backendUrl}/api/chat/delete`,
        { chatId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setChats(prev => prev.filter(chat => chat?._id !== chatId))
        await fetchUserChats()
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleNewChat = async () => {
    try {
      setLoadingNewChat(true)
      await createNewChat()
      await fetchUserChats() 
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoadingNewChat(false)
    }
  }

  return (
    <div
      className={`flex flex-col h-screen min-w-72 p-5
        bg-gradient-to-b from-gray-900 to-black
        border-r border-gray-700 text-gray-200
        transition-all duration-500 max-md:absolute left-0 z-10
        ${!isMenuOpen && 'max-md:-translate-x-full'}`}
    >
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        className='cursor-pointer flex items-center justify-center gap-3'
      >
        <img src={assets.logo} alt="Logo" className='w-full max-w-10' />
        <p className='text-xl font-semibold text-white'>SeraphAI</p>
      </div>

      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        disabled={loadingNewChat}
        className={`flex justify-center items-center w-full py-2 mt-10
          text-white text-sm rounded-md shadow-md
          ${loadingNewChat
            ? 'bg-gray-700 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-indigo-500 hover:opacity-90'}`}
      >
        {loadingNewChat ? 'Creating Chat...' : '+ New Chat'}
      </button>

      {/* Search Input */}
      <div className='flex items-center gap-2 p-3 mt-4 border border-gray-700 rounded-md bg-gray-800'>
        <img className='w-4 opacity-70' src={assets.search_icon} alt="Search" />
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className='outline-none text-sm placeholder:text-gray-400 bg-transparent flex-1 text-gray-200'
          placeholder='Search Conversations'
          type="text"
        />
      </div>

      {/* Chats List */}
      {chats?.length > 0 && <p className='mt-4 text-sm text-gray-400'>Recent Chats</p>}
      <div className='flex-1 overflow-y-scroll mt-3 text-sm space-y-3'>
        {chats
          ?.filter(chat => {
            if (!chat) return false
            if (chat.messages && chat.messages.length > 0) {
              return chat.messages[0]?.content?.toLowerCase().includes(search.toLowerCase())
            } else if (chat.name) {
              return chat.name.toLowerCase().includes(search.toLowerCase())
            }
            return false
          })
          .map(chat => (
            <div
              onClick={() => { navigate('/'); setSelectedChat(chat); setIsMenuOpen(false) }}
              key={chat._id}
              className='p-2 px-4 bg-gray-800/50 border border-gray-700
                rounded-md cursor-pointer flex justify-between group
                hover:bg-gray-800 transition-all'
            >
              <div>
                <p className='truncate w-full text-gray-200'>
                  {chat.messages?.length > 0
                    ? chat.messages[0].content.slice(0, 32)
                    : chat.name || 'Untitled Chat'}
                </p>
                <p className='text-xs text-gray-500'>
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>
              <img
                onClick={(e) => toast.promise(deleteChat(e, chat._id), { loading: 'Deleting..' })}
                src={assets.bin_icon}
                className='hidden group-hover:block w-4 cursor-pointer opacity-70 hover:opacity-100'
                alt="Delete"
              />
            </div>
          ))}
      </div>

      {/* Community Section */}
      <div
        onClick={() => { navigate('/community'); setIsMenuOpen(false) }}
        className='flex items-center gap-2 p-3 mt-4 border border-gray-700 rounded-md cursor-pointer hover:bg-gray-800 transition-all'
      >
        <img src={assets.gallery_icon} className='w-4.5 opacity-80' alt="Community" />
        <div className='flex flex-col text-sm'>
          <p>Community Images</p>
        </div>
      </div>

      {/* Credits Section */}
      <div
        onClick={() => { navigate('/credits'); setIsMenuOpen(false) }}
        className='flex items-center gap-2 p-3 mt-4 border border-gray-700 rounded-md cursor-pointer hover:bg-gray-800 transition-all'
      >
        <img src={assets.diamond_icon} className='w-4.5 invert opacity-80' alt="Credits" />
        <div className='flex flex-col text-sm'>
          <p>Credits: {user?.credits}</p>
          <p className='text-xs text-gray-400'>Purchase Credits to use SeraphAI</p>
        </div>
      </div>

      {/* User Section */}
      <div className="flex items-center justify-between gap-3 p-3 mt-4 border border-gray-700 rounded-md cursor-pointer group hover:bg-gray-800 transition-all">
        <div className="flex items-center gap-3">
          <img src={assets.user_icon} className="w-7 rounded-full" alt="User" />
          <p className="text-sm text-gray-200 truncate">
            {user ? user.name : "Login to your account"}
          </p>
        </div>
        {user && (
          <img
            onClick={() => logout()}
            src={assets.logout_icon}
            className="h-5 cursor-pointer hidden group-hover:block opacity-80 hover:opacity-100"
            alt="Logout"
          />
        )}
      </div>

      {/* Mobile Close Button */}
      <img
        onClick={() => setIsMenuOpen(false)}
        src={assets.close_icon}
        className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden invert'
        alt="Close"
      />
    </div>
  )
}

export default Sidebar
