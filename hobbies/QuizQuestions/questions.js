document.addEventListener("DOMContentLoaded", function(){
    updateQuestion();
    
});

const questions = [
    "How do you prefer to spend your free time?",
    "Which of these activities sounds most appealing to you?",
    "Do you prefer activities that are:",
    "How much time are you willing to dedicate to a new hobby each week?",
    "Do you prefer indoor or outdoor hobbies?",
    "Do you enjoy learning new skills or do you prefer hobbies you're already familiar with?",
    "What is your budget for a new hobby?",
    "Do you prefer solo activities or group activities?",
    "What are your goals for starting a new hobby?",
    "How flexible are you with your hobby schedule?"
];

const answers = [
    [
        "Outdoors, exploring nature", 
        "Creating things with my hands", 
        "Learning something new", 
        "Playing or listening to music", 
        "Socializing with friends or meeting new people", 
        "Playing video games or board games", 
        "Reading books, articles, or watching documentaries", 
        "Staying active through sports or fitness", 
        "Relaxing and unwinding at home"
    ],
    [
        "Painting or drawing", 
        "Hiking or camping", 
        "Playing an instrument", 
        "Cooking or baking", 
        "Coding or building apps", 
        "Gardening", 
        "Playing team sports (e.g., soccer, basketball, volleyball)", 
        "Writing (stories, poetry, journaling)", 
        "DIY crafts or home improvement"
    ],
    [
        "Active and physical", 
        "Calm and relaxing", 
        "Creative and artistic", 
        "Technical and logical", 
        "Social and engaging", 
        "Independent and solitary"
    ],
    [
        "Less than 1 hour", 
        "1-3 hours", 
        "4-6 hours", 
        "7+ hours"
    ],
    [
        "Indoor", 
        "Outdoor", 
        "No preference"
    ],
    [
        "I love learning new skills!", 
        "I prefer hobbies I already know.", 
        "A mix of both."
    ],
    [
        "Free or low-cost hobbies", 
        "Moderate spending (up to $100 initially)", 
        "I'm willing to invest more if it's something I love"
    ],
    [
        "Solo", 
        "Group", 
        "Both"
    ],
    [
        "Relax and relieve stress", 
        "Meet new people", 
        "Get physically fit", 
        "Learn a new skill or improve an existing one", 
        "Make or create something tangible", 
        "Earn extra income or turn it into a side hustle", 
        "Just to have fun!"
    ],
    [
        "I prefer hobbies with a regular schedule (e.g., weekly classes, team practices).", 
        "I like hobbies I can pick up whenever I have time.", 
        "A mix of both works for me."
    ]
];

// for updating the question, answer, and question number on the html page
function updateQuestion() {
    const title = document.querySelector(".title");
    const but = document.querySelector(".nextQue");
    const answer = document.querySelector("#answers");
    const question = document.querySelector("#questions");
    question.style.padding = "20px";
    question.style.fontSize = "24px";
    let queNum = 1;
    title.innerHTML = "Question " + queNum + ":";
    question.innerHTML = questions[queNum - 1];
    //TODO: figure out how to make the answers into radio buttons
    answer.innerHTML = answers[queNum - 1];
    but.addEventListener("click", function() {
        queNum = queNum + 1;
        if (queNum > questions.length) {
            queNum = 10;
        }
        title.innerHTML = "Question " + queNum + ":";
        question.innerHTML = questions[queNum - 1];
        answer.innerHTML = answers[queNum - 1];
    });
    
}