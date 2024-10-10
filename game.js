import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCm55CBur1PhCrfQ2qtmhBFf2pDJlzTuLY",
  authDomain: "simon-game-ed43b.firebaseapp.com",
  projectId: "simon-game-ed43b",
  storageBucket: "simon-game-ed43b.appspot.com",
  messagingSenderId: "179398917387",
  appId: "1:179398917387:web:5498dbb3bc7f6872a5f60e",
  databaseURL: "https://simon-game-ed43b-default-rtdb.firebaseio.com/" // Firebase Realtime Database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

var buttonColor = ["green", "red", "yellow", "blue"];
var randomChosenColour = [];
var start = 0;
var level = 0;
var gameIsStart = false;
var highScore = 0; // Initialize high score

// Fetch high score from Firebase and display it on the page
function getHighScore() {
  const dbRef = ref(database);
  get(child(dbRef, "highScore")).then((snapshot) => {
    if (snapshot.exists()) {
      highScore = snapshot.val();
      document.getElementById("high-score").textContent = "High Score: " + highScore;
    } else {
      console.log("No high score available");
    }
  }).catch((error) => {
    console.error("Error fetching high score:", error);
  });
}

// Save new high score to Firebase
function saveHighScore(newHighScore) {
  set(ref(database, 'highScore'), newHighScore).then(() => {
    console.log("High score saved successfully!");
  }).catch((error) => {
    console.error("Error saving high score:", error);
  });
}

// Detect if the screen is small (likely a mobile device)
if ($(window).width() <= 1000) {
    // Start game on touch/click event for mobile devices
    $("h1").click(function () {
        if (!gameIsStart) {
            gameIsStart = true;

            setTimeout(function () {
                newGame();
            }, 1000);
        }
    });
} else {
  $(document).keypress(function () {
    if (!gameIsStart) {
      gameIsStart = true;
      newGame();
    }
  });
}

function newGame() {
  level = 0;
  start = 0;
  randomChosenColour = [];
  nextSequence();
}

function nextSequence() {
  level++;
  start = 0;
  changeHeading("Level " + level);
  var randomNumber = Math.round(Math.random() * 3);
  randomChosenColour.push(buttonColor[randomNumber]);
  $("#" + buttonColor[randomNumber]).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(buttonColor[randomNumber]);
}

function addAnimation(userButtonPressId) {
  $("#" + userButtonPressId).addClass("pressed");
  setTimeout(function () {
    $("#" + userButtonPressId).removeClass("pressed");
  }, 100);
}

function playSound(soundName) {
  var audio = new Audio("./sound/" + soundName + ".mp3");
  audio.play();
}

function changeHeading(newHeading) {
  $("h1").text(newHeading);
}

// Handle user button click
$(".btn").click(function () {
  if (gameIsStart) {
    var userButtonPressId = $(this).attr("id");
    addAnimation(userButtonPressId);
    if (userButtonPressId === (randomChosenColour[start])) {
      playSound(userButtonPressId);
      start++;
      if (start === level) {
        setTimeout(function () {
          nextSequence();
        }, 1000);
      }
    } else {
      playSound("wrong");
      gameIsStart = false;
      $("body").addClass("game-over");

      // Check if the current level is higher than the previous high score
      if (level > highScore) {
        highScore = level;
        saveHighScore(highScore); // Save the new high score
        changeHeading("New High Score: " + highScore + "Game Over, Press Any Key to Restart");
      } else {
        changeHeading("Game Over, Press Any Key to Restart");
      }

      setTimeout(function () {
        $("body").removeClass("game-over");
      }, 100);
    }
  }
});

// Fetch high score when the page loads
$(document).ready(function () {
  getHighScore(); // Fetch high score on page load
});
