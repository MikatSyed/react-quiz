import { useHistory, useParams } from "react-router-dom";
import Analysis from "../Analysis";
import Summary from "../Summary";
import UseAnswer from "../../hooks/UseAnswer";
import _ from 'lodash'

export default function Result() {
  const { id } = useParams();
  const { location } = useHistory();
  const {state} = location;
  const {qna} = state;

  const { loading,error,answers} = UseAnswer(id)
  // console.log(answers);

  function scoreCalculate (){
    let score = 0;
    
    answers.forEach((questions,index1)=>{
      let correctIndexes = [];
      let checkedIndexes = [];

      questions.options.forEach((option,index2)=>{
       if(option.correct) {
        correctIndexes.push(index2);
        // console.log('p',correctIndexes);
       }
       if(qna[index1].options[index2].checked) {
        checkedIndexes.push(index2);
        // console.log('m',checkedIndexes);
        option.checked = true;
       }
      })
      if(_.isEqual(correctIndexes,checkedIndexes)){
        score += 5;
      }
    })
    return score;
  }
  const userScore = scoreCalculate()

  return (
    <>
    {loading && <div>Loading ...</div>}
    {error && <div>There was an error!</div>}
    {answers && answers.length > 0 &&(
      <>
      <Summary  score={userScore} noq = {answers.length}/>
      <Analysis  answers={answers}/>
      </>
    )}
    </>
  );
}
