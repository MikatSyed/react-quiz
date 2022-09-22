import { useEffect, useState } from "react";
import {get, getDatabase,limitToFirst,orderByKey,query,ref, startAt} from "firebase/database"

export default function UseVideoList(page){
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(false);
    const [videos,setVideos] = useState([])
    const [hasMore,setHasMore] = useState(true)

    useEffect(()=>{
        async function getAllData(){
            const db = getDatabase()
            const videoRef = ref(db,"videos")
            const videoQuery = query(
                videoRef,
                orderByKey(),
                startAt("" + page),
                limitToFirst(8)
            );

            try{

            setError(false);
            setLoading(true);
            const snapshot = await get(videoQuery);
            // console.log(snapshot.val());
            setLoading(false);
            if(snapshot.exists()){
                setVideos((prevVideos)=> {
                    return [...prevVideos,...Object.values(snapshot.val())]
                });
            }else{
            setHasMore(false) 
            }

            }catch(err){
              setLoading(false)
              setError(true)
            }
        }
        setTimeout(()=>{
            getAllData()
        },100)
    },[page])

    return {
        loading,
        error,
        videos,
        hasMore
    }
}