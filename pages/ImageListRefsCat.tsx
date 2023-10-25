import { categoryStorage } from '@/models/FirebaseConfig';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import React, { useEffect, useState } from 'react'

const ImageList = ({title}:{title:string}) => {
  const [imageList,setImageList] = useState<string[]>([]);
  const imageListRef = ref(categoryStorage,title);

  useEffect(()=>{
    setImageList([]);
    const seenUrls = new Set<string>();
    listAll(imageListRef).then((response:any) => {
        const newImageUrls:string[] = [];
        response.items.forEach((item:any) => {
            getDownloadURL(item).then((url:any) => {
                if(!seenUrls.has(url)){
                    seenUrls.add(url);
                    newImageUrls.push(url);
                    setImageList((prev:any) => [...prev,url]);
                }
            });
        });
    });

    return () => {}

  },[title])

  return (
    <div>
        {imageList.map((url,index) => (
            <div className='flex justify-center' key={index}>
                <img src={url} alt="image" key={index} style={{
                height:'8em',
                width:"auto",
            }}/>
            </div>
        ))}
    </div>
  )
}

export default ImageList