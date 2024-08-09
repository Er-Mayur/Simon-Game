var buttonColor = ["green", "red", "yellow", "blue"];
var randomChosenColour = [];
var start = 0;
var level = 0;
var gameIsStart = false;

// keyboad input to start
$(document).keypress(function (event) {
    if (!gameIsStart) {
        gameIsStart = true;
        newGame();
    }
});

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
    var audio = new Audio("./sounds/" + soundName + ".mp3");
    audio.play();
}

function changeHeading(newHeading) {
    $("h1").text(newHeading);
}

// user button click
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
        }

        else {
            playSound("wrong");
            gameIsStart = false;
            $("body").addClass("game-over");
            setTimeout(function () {
                changeHeading("Game Over, Press Any Key to Restart");
                $("body").removeClass("game-over");
            }, 100);
        }
    }
});
