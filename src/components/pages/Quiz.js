import { useLayoutEffect, useReducer, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import UseQuestion from "../../hooks/UseQuestion";
import Answers from "../Answers";
import MiniPlayer from "../MiniPlayer";
import ProgressBar from "../ProgressBar";
import _ from "lodash";
import { useAuth } from './../../contexts/authContext';
import { getDatabase, ref, set } from "firebase/database";


const initialState = null;

const reducer = (state, action) => {
  
  switch (action.type) {
    case "questions":
      // console.log(action.value);
      action.value.forEach((question) => {
        // console.log("a",question);
        question.options.forEach((option) => {
          // console.log("b",option);
          option.checked = false;
        });
      });
      return action.value;
    case "answer":
      
      const questions = _.cloneDeep(state);
      // console.log("c", questions);
      questions[action.questionID].options[action.optionIndex].checked =
        action.value;
      // console.log("d",questions);
      return questions;
    default:
      return state;
  }
};


export default function Quiz() {
  const [currentQuestion,setCurrentQuestion] = useState(0)
  // console.log(currentQuestion);
  const {id} = useParams()
  const {loading,error,questions} = UseQuestion(id)
  // console.log(questions);
  const [qna,dispatch] = useReducer(reducer,initialState)
  // console.log("q",qna);
  const { currentUser } = useAuth();
  // console.log(currentUser);
  const history = useHistory();
  const { location } = history;
  const { state } = location;
  const { videoTitle } = state;

  useLayoutEffect(()=>{
    dispatch({
      type: "questions",
      value : questions
    })
  },[questions])

  function handleAnswerChange(e, index) {
    dispatch({
      type: "answer",
      questionID: currentQuestion,
      optionIndex: index,
      value: e.target.checked,
    });
  }

  // handle next button to get the next question
  function nextQuestion(){
    
    if(currentQuestion <= questions.length){
      // console.log("next clicked");
      setCurrentQuestion((prevCurrent) => prevCurrent + 1);
    }
  }

  // handle prev button to get the next question
  function prevQuestion(){
    if(currentQuestion >= 1 && currentQuestion <= questions.length){
      setCurrentQuestion(preState => preState - 1)
    }
  }
// calculate percentage of progress
const percentage =
questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

//handle submit 
async function handleSubmit(){
  const {uid} = currentUser;
  const db = getDatabase();
  const resultRef = ref(db, `result/${uid}`);

  await set(resultRef, {
    [id]: qna,
  });

  history.push({
    pathname: `/result/${id}`,
    state: {
      qna,
    },
  });
}
  return (
    <>
      {loading && <div>Loading ...</div>}
      {error && <div>There was an error!</div>}
      {!loading && !error && qna && qna.length > 0 && (
        <>
      <h1>{qna[currentQuestion].title}</h1>
      <h4>Question can have multiple answers</h4>
      <Answers input options={qna[currentQuestion].options}
            handleChange={handleAnswerChange} />

      <ProgressBar  
      next={nextQuestion}
      prev={prevQuestion}
      progress={percentage}
      submit={handleSubmit}
       />
      <MiniPlayer id={id} title={videoTitle}/>
   
       </>
      )}
    </>
  );
}
