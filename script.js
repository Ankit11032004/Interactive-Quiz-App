document.addEventListener('DOMContentLoaded', function() {
    const quizData = [
        {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            answer: "Paris",
            hint: "Think of the Eiffel Tower's location."
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            answer: "Mars",
            hint: "It's named after the Roman god of war."
        },
        {
            question: "What is the largest mammal on Earth?",
            options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
            answer: "Blue Whale",
            hint: "It lives in the ocean."
        },
        {
            question: "In which year did World War II end?",
            options: ["1943", "1945", "1950", "1939"],
            answer: "1945",
            hint: "It ended after 6 years of conflict."
        },
        {
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
            answer: "Leonardo da Vinci",
            hint: "He was an Italian Renaissance polymath."
        }
    ];

    const welcomeScreen = document.getElementById('welcome-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    const startBtn = document.getElementById('start-btn');
    const usernameInput = document.getElementById('username');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const currentQuestionDisplay = document.getElementById('current-question');
    const totalQuestionsDisplay = document.getElementById('total-questions-display');
    const progressBar = document.getElementById('progress-bar');
    const timeLeftDisplay = document.getElementById('time-left');
    const hintBtn = document.getElementById('hint-btn');
    const hintText = document.getElementById('hint-text');
    const resultTitle = document.getElementById('result-title');
    const scorePercentage = document.getElementById('score-percentage');
    const scoreDisplay = document.getElementById('score-display');
    const totalQuestionsResult = document.getElementById('total-questions-result');
    const feedback = document.getElementById('feedback');
    const answersSummary = document.getElementById('answers-summary');
    const retryBtn = document.getElementById('retry-btn');
    const newQuizBtn = document.getElementById('new-quiz-btn');

    let currentQuestionIndex = 0;
    let userAnswers = [];
    let score = 0;
    let timer;
    let timeLeft = 60;
    let quizStarted = false;
    let username = '';

    function initializeQuiz() {
        userAnswers = new Array(quizData.length).fill(null);
        currentQuestionIndex = 0;
        score = 0;
        timeLeft = 60;
        quizStarted = true;
        
        document.getElementById('total-questions').textContent = quizData.length;
        document.getElementById('total-questions-display').textContent = quizData.length;
        document.getElementById('total-questions-result').textContent = quizData.length;
        
        welcomeScreen.classList.add('d-none');
        quizScreen.classList.remove('d-none');
        resultsScreen.classList.add('d-none');
        
        startTimer();
        displayQuestion();
    }

    function displayQuestion() {
        const currentQuestion = quizData[currentQuestionIndex];
        questionText.textContent = currentQuestion.question;
        
        optionsContainer.innerHTML = '';
        currentQuestion.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            if (userAnswers[currentQuestionIndex] === index) {
                optionElement.classList.add('selected');
            }
            
            optionElement.innerHTML = `
                <input type="radio" name="option" id="option-${index}" value="${index}" 
                    ${userAnswers[currentQuestionIndex] === index ? 'checked' : ''}>
                <label for="option-${index}">${option}</label>
            `;
            
            optionElement.addEventListener('click', () => {
                document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
                optionElement.classList.add('selected');
                document.getElementById(`option-${index}`).checked = true;
                userAnswers[currentQuestionIndex] = index;
            });
            
            optionsContainer.appendChild(optionElement);
        });
        
        currentQuestionDisplay.textContent = currentQuestionIndex + 1;
        progressBar.style.width = `${((currentQuestionIndex + 1) / quizData.length) * 100}%`;
        
        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.classList.toggle('d-none', currentQuestionIndex === quizData.length - 1);
        submitBtn.classList.toggle('d-none', currentQuestionIndex !== quizData.length - 1);
        
        hintText.textContent = currentQuestion.hint;
        hintText.classList.add('d-none');
    }

    function startTimer() {
        clearInterval(timer);
        timeLeftDisplay.textContent = timeLeft;
        
        timer = setInterval(() => {
            timeLeft--;
            timeLeftDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                submitQuiz();
            }
        }, 1000);
    }

    function navigateToQuestion(index) {
        if (index >= 0 && index < quizData.length) {
            currentQuestionIndex = index;
            displayQuestion();
        }
    }

    function submitQuiz() {
        clearInterval(timer);
        quizStarted = false;
        
        score = 0;
        quizData.forEach((question, index) => {
            if (userAnswers[index] !== null && 
                question.options[userAnswers[index]] === question.answer) {
                score++;
            }
        });
        
        const percentage = Math.round((score / quizData.length) * 100);
        
        quizScreen.classList.add('d-none');
        resultsScreen.classList.remove('d-none');
        
        scorePercentage.textContent = percentage;
        scoreDisplay.textContent = score;
        
        if (percentage >= 80) {
            resultTitle.textContent = "Excellent Work!";
            feedback.textContent = "You have an outstanding knowledge of general facts!";
        } else if (percentage >= 60) {
            resultTitle.textContent = "Good Job!";
            feedback.textContent = "You have a good understanding, but there's room for improvement.";
        } else if (percentage >= 40) {
            resultTitle.textContent = "Not Bad!";
            feedback.textContent = "You know some things, but consider studying more.";
        } else {
            resultTitle.textContent = "Keep Trying!";
            feedback.textContent = "Don't worry, everyone starts somewhere. Try again!";
        }
        
        answersSummary.innerHTML = '';
        quizData.forEach((question, index) => {
            const answerItem = document.createElement('div');
            const isCorrect = userAnswers[index] !== null && 
                             question.options[userAnswers[index]] === question.answer;
            
            answerItem.classList.add('answer-item');
            if (isCorrect) {
                answerItem.classList.add('correct');
            } else {
                answerItem.classList.add('incorrect');
            }
            
            const userAnswer = userAnswers[index] !== null ? 
                question.options[userAnswers[index]] : "Not answered";
            const correctAnswer = question.answer;
            
            answerItem.innerHTML = `
                <div>
                    <strong>Q${index + 1}:</strong> ${question.question}<br>
                    <span>Your answer: ${userAnswer}</span>
                </div>
                <div class="answer-status">
                    ${isCorrect ? "Correct" : "Incorrect"}
                </div>
            `;
            
            answersSummary.appendChild(answerItem);
        });
    }

    startBtn.addEventListener('click', () => {
        username = usernameInput.value.trim();
        if (username === '') {
            alert('Please enter your name to start the quiz.');
            return;
        }
        initializeQuiz();
    });

    prevBtn.addEventListener('click', () => {
        navigateToQuestion(currentQuestionIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        navigateToQuestion(currentQuestionIndex + 1);
    });

    submitBtn.addEventListener('click', submitQuiz);

    hintBtn.addEventListener('click', () => {
        hintText.classList.toggle('d-none');
        hintBtn.textContent = hintText.classList.contains('d-none') ? 
            '<i class="fas fa-lightbulb"></i> Show Hint' : 
            '<i class="fas fa-eye-slash"></i> Hide Hint';
    });

    retryBtn.addEventListener('click', initializeQuiz);

    newQuizBtn.addEventListener('click', () => {
        welcomeScreen.classList.remove('d-none');
        quizScreen.classList.add('d-none');
        resultsScreen.classList.add('d-none');
        usernameInput.value = username;
    });
});