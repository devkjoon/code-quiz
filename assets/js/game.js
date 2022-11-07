const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBarFull = document.querySelector('#progressBarFull');
const timer = document.querySelector('#time-left')

let currentQuestion = {}
let acceptingAnswers = true
let score = 0
let questionCounter = 0
let availableQuestions = []
let time = 40

let questions = [
    {
        question: "JavaScript is an _____ language?",
        choice1: "Object-Oriented",
        choice2: "Object-Based",
        choice3: "Procedural",
        choice4: "None of the above",
        answer: 1,
    },
    {
        question: "Which of the following methods can be used to display data in some form using Javascript?",
        choice1: "document.write()",
        choice2: "console.log()",
        choice3: "window.alert()",
        choice4: "All of the above",
        answer: 4,
    },
    {
        question: "How do you stop an interval timer in JavaScript?",
        choice1: "clearInterval",
        choice2: "clearTimer",
        choice3: "intervalOver",
        choice4: "None of the above",
        answer: 1,
    },
    {
        question: "Which of the following keywords is used to define a variable in JavaScript?",
        choice1: "var",
        choice2: "let",
        choice3: "const",
        choice4: "All of the above",
        answer: 4,
    }
]

const SCORE_POINTS = 100
const MAX_QUESTIONS = 4
const TIMER_UP = 5
const TIMER_DOWN = 10

startGame = () => {
    questionCounter = 0
    score = 0
    availableQuestions = [...questions]
    getNewQuestion()
    countdown_start()
}

countdown_start = () => {
    time = 40
        const gameTimer = setInterval(function() {
            time--
            timer.textContent = "Time: " + time
            
            if (time <= 0) {
                clearInterval(gameTimer)
                localStorage.setItem('mostRecentScore', score)
                return window.location.assign("./end.html")
            }
        }, 1000)
}

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score)

        return window.location.assign("./end.html")
    }

    questionCounter++
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`
    // calculate what question we're on, correspond with the percentage we're currently at
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%`

    const questionsIndex = Math.floor(Math.random() * availableQuestions.length)
    currentQuestion = availableQuestions[questionsIndex]
    question.innerText = currentQuestion.question

    choices.forEach(choice => {
        const number = choice.dataset['number']
        choice.innerText = currentQuestion['choice' + number]
    })

    availableQuestions.splice(questionsIndex, 1)

    acceptingAnswers = true
}

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return

        acceptingAnswers = false
        const selectedChoice = e.target
        const selectedAnswer = selectedChoice.dataset['number']

        let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

        if(classToApply === 'correct') {
            incrementScore(SCORE_POINTS)
            incrementTime(TIMER_UP)
        }

        if(classToApply === 'incorrect') {
            decrementTime(TIMER_DOWN)
        }

        selectedChoice.parentElement.classList.add(classToApply)

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply)
            getNewQuestion()
        }, 1000)
    })
})

incrementScore = num => {
    score += num
    scoreText.innerText = score
}

incrementTime = num => {
    time += num
    timer.innerText = time
}

decrementTime = num => {
    time -= num
    timer.innerText = time
}

startGame()