import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import moment from 'moment'

const Sidebar = ({ iseMenuOpen, setIsMenuOpen }) => {

    const { chats, setSelectedChat, user, navigate } = useAppContext()

    const [search, setSearch] = useState('')

    return (
        <div className={`flex flex-col h-screen min-w-72 p-5 dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#89609F]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-10 ${!iseMenuOpen && 'max-md:-translate-x-full'}`}>
            <div onClick={() => navigate('/')} className='cursor-pointer flex items-center justify-center gap-3'>
                <img src={assets.logo} alt="" className='w-full max-w-10' />
                <p className='text-xl font-medium text-slate-300'>SeraphAI</p>
            </div>

            <button className='flex justify-center items-center w-full py-2 mt-10 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-sm rounded-md cursor-pointer'>
                <span className='mr-2 text-xl'>+</span>New Chat
            </button>

            <div className='flex items-center gap-2 p-3 mt-4 border border-white/20 rounded-md'>
                <img className='w-4 ' src={assets.search_icon} alt="" />
                <input onChange={(e) => setSearch(e.target.value)} value={search} className='outline-none text-xs placeholder:text-gray-400' placeholder='Search Conversations' type="text" />
            </div>

            {
                chats.length > 0 && <p className='mt-4 text-sm'>Recent Chats</p>
            }
            <div className='flex-1 overflow-y-scroll mt-3 text-sm space-y-3'>
                {
                    chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase().includes(search.toLowerCase())).map((chat) => (
                        <div key={chat._id} className='p-2 px-4 bg-[#57317C]/10 border border-gray-300 rounded-md cursor-pointer flex justify-between group'>
                            <div>
                                <p className='truncate w-full'>{chat.messages.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name}</p>
                                <p className='text-xs text-gray-400'>{moment(chat.updatedAt).fromNow()}</p>
                            </div>
                            <img src={assets.bin_icon} className='hidden group-hover:block w-4 cursor-pointer ' alt="" />
                        </div>
                    ))
                }
            </div>

            <div onClick={() => navigate('/community')} className='flex items-center gap-2 p-3 mt-4 border border-gray-300 rounded-md cursor-pointer hover:scale-105 transition-all duration-300'>
                <img src={assets.gallery_icon} className='w-4.5' alt="" />
                <div className='flex flex-col text-sm'>
                    <p>Community Images</p>
                </div>
            </div>

            <div onClick={() => navigate('/credits')} className='flex items-center gap-2 p-3 mt-4 border border-gray-300 rounded-md cursor-pointer hover:scale-105 transition-all duration-300'>
                <img src={assets.diamond_icon} className='w-4.5 invert' alt="" />
                <div className='flex flex-col text-sm'>
                    <p>Credits:{user?.credits}</p>
                    <p></p>
                    <p className='text-xs text-gray-400'>Purchase Credits to use SeraphAI</p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 p-3 mt-4 border border-gray-300 rounded-md cursor-pointer group">
                <div className="flex items-center gap-3">
                    <img src={assets.user_icon} className="w-7 rounded-full" alt="User" />
                    <p className="text-sm text-primary truncate">
                        {user ? user.name : "Login to your account"}
                    </p>
                </div>

                {user && (
                    <img
                        src={assets.logout_icon}
                        className="h-5 cursor-pointer hidden group-hover:block"
                        alt="Logout"
                    />
                )}
            </div>

            <img onClick={() => setIsMenuOpen(false)} src={assets.close_icon} className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden ' alt="" />

        </div>
    )
}

export default Sidebar
