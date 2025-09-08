import React, { useEffect, useState } from 'react'
import { dummyPublishedImages } from '../assets/assets';
import Loading from './Loading';

const Community = () => {

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    setImages(dummyPublishedImages);
    setLoading(false);
  }

  useEffect(() => {
    fetchImages()
  }, [])

  if (loading) return <Loading />

  return (
    <div className='p-6 pt-12 xs:px-12 2xl:px-20 w-full mx-auto h-full overflow-y-scroll'>
      <h2 className='text-xl font-semibold mb-6 text-gray-300 '>Community Images</h2>

      {
        images.length > 0 ? (
          <div className='flex flex-wrap max-sm:justify-center gap-5'>
            {
              images.map((item, index) => (
                <a href={item.imageUrl} key={index} target='_blank' className='relative group block rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300'>
                  <img src={item.imageUrl} className='w-full h-40 md:h-50 2xl:h-62 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out' alt="" />
                  <p className='absolute bottom-0 right-0 text-xs bg-black/50 backdrop-blur text-white px-4 py-1 rounded-tl-xl opacity-0 group-hover:opacity-100 transition duration-300'>{item.userName}</p>
                </a>
              ))
            }
          </div>
        ) : (
          <p className=''>No images Available</p>
        )
      }
    </div>
  )
}

export default Community
