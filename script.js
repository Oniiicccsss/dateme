// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBabAvSYljBP_TRkJ0UVP17efDX2gIU_8Y",
    authDomain: "landiannaminnichrysel.firebaseapp.com",
    databaseURL: "https://landiannaminnichrysel-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "landiannaminnichrysel",
    storageBucket: "landiannaminnichrysel.appspot.com",
    messagingSenderId: "369465652054",
    appId: "1:369465652054:web:5014372e7fdc9113be9cf7"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// References to the questions and answers nodes in the database
const questionsRef = db.ref("questions");
const answersRef = db.ref("answers");
const userAnswersRef = answersRef.child("user1");

let currentQuestion = 0;
let userAnswers = {};

// Function to display the next question
function displayNextQuestion() {
  // Get the current question from the database
  get(child(questionsRef, currentQuestion)).then((snapshot) => {
    if (snapshot.exists()) {
      const question = snapshot.val();
      // Display the question in the HTML
      $(".question").html(question);
      // Increment the current question index
      currentQuestion++;
    } else {
      console.log("No more questions.");
    }
  }).catch((error) => {
    console.error(error);
  });
}

// Function to handle the user's answer
function handleAnswer(answer) {
  // Save the user's answer to the database
  set(child(userAnswersRef, currentQuestion - 1), answer).then(() => {
    // Display the next question
    displayNextQuestion();
  }).catch((error) => {
    console.error("Error saving answer:", error);
  });
}

// Function to handle the user's date and time selection
function handleDateTimeSelection() {
  const dateTime = $("#dateTimeInput").val();  // Get user's selected date and time
  set(child(userAnswersRef, "dateTime"), dateTime).then(() => {
    displayNextQuestion();
  }).catch((error) => {
    console.error("Error saving dateTime:", error);
  });
}

// Function to handle the user's food selection
function handleFoodSelection() {
  const food = $(".food-image.selected").attr("alt");  // Get the selected food item
  set(child(userAnswersRef, "food"), food).then(() => {
    displayFinalMessage();
  }).catch((error) => {
    console.error("Error saving food selection:", error);
  });
}

// Function to display the final message
function displayFinalMessage() {
  get(userAnswersRef).then((snapshot) => {
    if (snapshot.exists()) {
      const answers = snapshot.val();
      // Display the final message based on the user's answers
      $("#finalMessage").html(`You chose to hang out on ${answers.dateTime} and eat ${answers.food}!`);
      // Show the kissing gif
      $("#kissingGif").show();
    } else {
      console.log("No answers available.");
    }
  }).catch((error) => {
    console.error("Error fetching user answers:", error);
  });
}

// Event listeners for buttons and actions
$(".btn-yes").on("click", function() {
  handleAnswer("yes");
});

$(".btn-no").on("click", function() {
  handleAnswer("no");
});

$("#confirmDateBtn").on("click", function() {
  handleDateTimeSelection();
});

$("#chooseFoodBtn").on("click", function() {
  handleFoodSelection();
});

// Initialize the app by displaying the first question
displayNextQuestion();
