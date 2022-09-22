import { useEffect, useState } from "react";
import {get, getDatabase,orderByKey,query,ref} from "firebase/database"

export default function UseQuestion(videoID){
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(false);
    const [questions,setQuestions] = useState([])

    useEffect(()=>{
        async function fetchQuestion(){
            const db = getDatabase()
            const quizRef = ref(db,"quiz/" + videoID + "/questions")
            const quizQuery = query(quizRef,orderByKey());

            try{
            setError(false);
            setLoading(true);
            const snapshot = await get(quizQuery);
            // console.log(snapshot.val());

            setLoading(false);
            if(snapshot.exists()){
                setQuestions((prevQuestions)=> {
                    return [...prevQuestions,...Object.values(snapshot.val())]
                });
            }

            }catch(err){
              setLoading(false)
              setError(true)
            }
        }
       fetchQuestion()
    },[videoID])

    return {
        loading,
        error,
        questions
    }
}