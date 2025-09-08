import moment from "moment"
import { assets } from "../assets/assets"
import Markdown from 'react-markdown'
import { useEffect } from "react"
import Prism from 'prismjs'

const Message = ({ message }) => {

  useEffect(() => {
    Prism.highlightAll()
  }, [message.content])

  return (
    <div className=''>
      {
        message.role === 'user' ? (
          <div className='flex items-start justify-end my-4 gap-2'>
            <div className='flex flex-col gap-2 p-2 px-4  border text-black bg-violet-200 rounded-md max-w-2xl'>
              <p className='text-sm '>{message.content}</p>
              <span className="text-xs text-gray-400">{moment(message.timestamp).fromNow()}</span>
            </div>
            <img src={assets.user_icon} className="w-8 rounded-full" alt="" />
          </div>
        ) : (
          <div className="inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-gray-200 text-black border border-[#80609F]/30 rounded-md my-4">
            {
              message.isImage ? (
                <img src={message.content} className="w-full max-w-md mt-2 rounded-md" />
              ) : (
                <div className="text-sm reset-tw">
                  <Markdown>{message.content}</Markdown>
                </div>
              )
            }
            <span className="text-xs text-gray-400">{moment(message.timestamp).fromNow()}</span>
          </div>
        )
      }
    </div>
  )
}

export default Message
