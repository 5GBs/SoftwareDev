/*let hobbyData = [];
let alerted = 0;

function loadCSV() {
    fetch("Hobby_Combinations.csv")
        .then(response => response.text())
        .then(csvText => {
            hobbyData = Papa.parse(csvText, {header: true}).data;
            console.log("CSV Loaded: ", hobbyData);
        }).catch(error => console.error("Error loading CSV: ", error));
}
*/

document.addEventListener("DOMContentLoaded", function(){
    updateQuestion();
});

// All of the questions for the quiz
const questions = [
    "How do you prefer to spend your free time?",
    "Which of these activities sounds most appealing to you?",
    "You prefer activities that are:",
    "How much time are you willing to dedicate to a new hobby each week?",
    "Do you prefer indoor or outdoor hobbies?",
    "Do you enjoy learning new skills or do you prefer hobbies you're already familiar with?",
    "What is your budget for a new hobby?",
    "Do you prefer solo activities or group activities?",
    "What are your goals for starting a new hobby?",
    "How flexible are you with your hobby schedule?"
];

// All of the answers for the quiz
const answers = [
    [
        "Gardening or spending time in nature", 
        "Creating art, crafts, or DIY projects", 
        "Exploring the outdoors through hiking or camping", 
        "Playing or making music", 
        "Solving puzzles, coding, or working with technology"
    ],
    [
        "Growing and caring for plants", 
        "Painting, drawing, or sculpting", 
        "Hiking, camping, or outdoor adventures", 
        "Playing an instrument or composing music", 
        "Coding, programming, or designing apps"
    ],
    [
        "Hands-on and connected to nature", 
        "Expressive and creative", 
        "Active and adventurous", 
        "Musical and rhythmic",
        "Logical and technical"
    ],
    [
        "Less than 1 hour", 
        "1-3 hours", 
        "4-6 hours", 
        "7+ hours",
        "As much time as possible!"
    ],
    [
        "Mostly outdoor, working with plants or nature", 
        "Indoor, focused on artistic projects", 
        "Outdoor, exploring and staying active",
        "Indoor, playing or creating music",
        "Indoor, working on coding or tech-related activities"
    ],
    [
        "I love learning about gardening and plants!", 
        "I enjoy improving my artistic skills.", 
        "I want to explore new outdoor activities.",
        "I’d love to learn a new instrument or musical technique.",
        "I enjoy expanding my technical knowledge."
    ],
    [
        "Free or low-cost, like home gardening", 
        "Some investment for art supplies or tools", 
        "Moderate spending for outdoor gear",
        "Willing to invest in a musical instrument or lessons",
        "Open to spending on tech and software tools"
    ],
    [
        "Solo, tending to plants or a garden", 
        "Either, I like working on art alone or in a class", 
        "Group, I enjoy outdoor adventures with others",
        "Either, I like playing music alone or in a band",
        "Solo, I prefer working on coding or tech projects alone"
    ],
    [
        "To relax and enjoy nature", 
        "To express creativity and improve artistic skills", 
        "To stay active and explore the outdoors", 
        "To develop musical skills and enjoy playing music", 
        "To improve problem-solving and technical abilities"
    ],
    [
        "I enjoy scheduled gardening routines", 
        "I like setting aside specific times for creative work", 
        "I prefer spontaneous outdoor adventures",
        "I enjoy structured practice for learning an instrument",
        "I like flexible time for coding or technical projects"
    ]
];

// Updated as the user presses the next question button and holds the index of their choice
const userChoices = [0, 0, 0, 0, 0];

// For updating the question, answer, and question number on the html page
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

    //TODO: FORMAT THE RADIO BUTTONS

    makeRadios(answers, queNum);
    
    but.addEventListener("click", function() {
        let textToCompare = checkRadios();
        for (let i = 0; i < answers[queNum-1].length; i++) {
            if (answers[queNum - 1][i] === textToCompare) {
                userChoices[i]++;
                break;
            }
        }
        answer.innerHTML = "";
        queNum = queNum + 1;

        if (queNum == 10) {
            but.style.backgroundColor = "tan";
            but.innerHTML = "Finish Quiz!";
            but.addEventListener("click", submitAndRedirect);
            
        }
        if (queNum > questions.length) {
            queNum = 10;
        }

        title.innerHTML = "Question " + queNum + ":";
        question.innerHTML = questions[queNum - 1];
        makeRadios(answers, queNum);

        console.log(userChoices);
    });
    
}

// Makes the radio buttons with the answer choices attached to them
function makeRadios(answers, queNum) {
    const answerLoc = document.querySelector("#answers");

    for (let i = 0; i < answers[queNum - 1].length; i++) {
        const radios = document.createElement("input");
        const labels = document.createElement("label");

        radios.setAttribute("type", "radio");
        radios.setAttribute("id", i);
        radios.setAttribute("name", "question" + queNum); 
        radios.value = i;
        

        labels.setAttribute("for", i);
        labels.textContent = answers[queNum - 1][i];

        answerLoc.appendChild(radios);
        answerLoc.appendChild(labels);
        answerLoc.appendChild(document.createElement("br"));
    }
}

// See which radio button is checked and get the value associated with it for the results
function checkRadios() {
    const radios = document.querySelectorAll("input[type='radio']");
    let labelText = "";
    for (const radio of radios) {
        if (radio.checked) {
            labelText = document.querySelector(`label[for="${radio.value}"]`).textContent;
            break;
        }
    }
    return labelText;
}

function displayResults() {
    let max = 0;
    let index = 0;
    let choice = "";
    for (let i = 0; i < userChoices.length; i++) {
        if (userChoices[i] > max) {
            max = userChoices[i];
            index = i;
        }
    }
    switch (index) {
        case 0:
            choice = "Gardening";
            break;
        case 1:
            choice = "Art";
            break;
        case 2:
            choice = "Hiking";
            break;
        case 3:
            choice = "Music";
            break;
        case 4:
            choice = "Coding";
            break;
    }
    return choice;
}

function submitAndRedirect() {
    let hobby = displayResults();

    fetch("/submit-hobby", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ hobby })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        window.location.href = `Results-Events.html?hobby=${hobby}`;
    })
    .catch(err => console.error("Error submitting hobby:", err));
}