import React, { Component } from "react"
import "./App.scss"

const heartburn = require("./heartburn.json")

class App extends Component {
  state = {
    bookingButton: false,
    currentAnswer: null,
    currentQuestionId: heartburn.questions[0].id,
    currentQuestionIndex: 0,
    finalResult: false,
    nextQuestionId: null,
    outcomeId: null,
    patientScore: 0,
    progress: 100 / (heartburn.questions.length + 1),
    scoreToAdd: 0
  }
  
  handleNextClick = () => {
    const {
      nextQuestionId,
      outcomeId,
      patientScore,
      progress,
      scoreToAdd
    } = this.state
    
    
    const NumOfQuestions = (heartburn.questions.length + 1)
    let nextQuestionIndex
    
    if (outcomeId === null) {
      nextQuestionIndex = heartburn.questions.findIndex(question => question.id === `${nextQuestionId}`)
      this.setState({
        progress: progress + (100 / NumOfQuestions)
      })
    } else {
      nextQuestionIndex = heartburn.outcomes.findIndex(outcome => outcome.id === `${outcomeId}`)
      this.setState({
        finalResult: true,
        progress: 100
      })
    }
    
    this.setState({
      currentAnswer: null,
      currentQuestionIndex: nextQuestionIndex,
      patientScore: patientScore + scoreToAdd,
      scoreToAdd: 0
    })
  }
  
  handleAnswerChange = event => {
    const answer = event.target.value  
  
    this.setState({
      currentAnswer: answer
    }, () => {
      
      const question = heartburn.questions[this.state.currentQuestionIndex]
      const answerIndex = question.answers.findIndex(answer => answer.id === `${this.state.currentAnswer}`)
      const { score } = question.answers[answerIndex]
      
      let nextQuestion
      let outcomeId = null
      const nextFiltered = question.next.filter(answer => answer.answered === `${this.state.currentAnswer}`) 

      if (this.state.currentQuestionIndex === heartburn.questions.length - 1)
       {
        if (this.state.patientScore < question.next[0].max_score) {
          outcomeId = question.next[0].outcome
        } else if (this.state.patientScore < question.next[1].max_score) {
          outcomeId = question.next[1].outcome
        } else {
          outcomeId = question.next[2].outcome
        }
      } else {
        if (nextFiltered.length > 0) {
          nextQuestion = nextFiltered[0].next_question
        } else {
          nextQuestion = question.next[0].next_question
        }
      }
      
      this.setState({
        nextQuestionId: nextQuestion,
        outcomeId: outcomeId,
        scoreToAdd: score
      })
    })
  }
  
  render() {
    const { finalResult } = this.state
    const currentQuestion = heartburn.questions[this.state.currentQuestionIndex]
    const outcome = heartburn.outcomes[this.state.currentQuestionIndex]
    console.log(finalResult)
    
    return (
      <div className="wrapper">
      
        <div className="question-wrapper">
          <div className="question-header">
            <button className="button-back">
              <img src="icons/ic-arrow-left-green.svg" alt="Left arrow"/>
            </button>
            <h1>Heartburn Checker</h1>
            <div className="question-progress">
              <div className="progress-bar" style={{width: `${this.state.progress}%`}} />
            </div>
          </div>
          <div className="question-body">
            {finalResult ?
              (
                <h2>{outcome.text}</h2>
              )
              :
              (
                <h2>{currentQuestion.question_text}</h2>
              )
            }
            <div className="gray-bar" />
            
            {finalResult ?
              (
                <button className={outcome.show_booking_button ? "action-button" : "hide"}>
                  Book a meeting
                </button>
              )
              :
              (
                <div>
                  <input
                    id="answer1"
                    type="radio"
                    value={currentQuestion.answers[0].id}
                    checked={this.state.currentAnswer === currentQuestion.answers[0].id}
                    onChange={this.handleAnswerChange} />
                  <label htmlFor="answer1">{currentQuestion.answers[0].label}</label>
            
                  <input
                    id="answer2"
                    type="radio"
                    value={currentQuestion.answers[1].id}
                    checked={this.state.currentAnswer === currentQuestion.answers[1].id}
                    onChange={this.handleAnswerChange} />
                  <label htmlFor="answer2">{currentQuestion.answers[1].label}</label>
                </div>
              )
            }
            
          </div>
          
          <div className="question-footer">
            {finalResult ?
              (<a href="#" className="start-link">Back to the start screen</a>)
              :
              (
                <button
                  className="action-button"
                  onClick={this.handleNextClick}
                  onKeyPress={this.handleNextClick}>
                  Next
                </button>
              )
            }
            
          </div>
          
        </div>
        
      </div>
    )
  }
}

export default App
