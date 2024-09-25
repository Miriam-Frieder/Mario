
const initMario = () => {
    const mario = document.createElement("img");
    mario.src = "../img/WQ1I-unscreen.gif";
    mario.alt = "mario runing";
    mario.id = "mario";
    mario.style.position = "absolute";
    positionMario = {
        top: baseTopMario,
        right: 60
    }
    mario.style.top = positionMario.top + "vh";
    mario.style.right = positionMario.right + "vw";
    mario.style.scale = "50%";
    document.querySelector("body").prepend(mario);
}

const updateStorage = (finalScore) => {
    userDetails.score.unshift(finalScore);
    localStorage.setItem(username, JSON.stringify(userDetails));

}

const printGameDetails = (textPrint, lastGame0, lastGame1, lastGame2, ...arrS) => {

    const whiteScreen = document.createElement("div");
    whiteScreen.style.width = 100 + "%";
    whiteScreen.style.height = 100 + "%";
    whiteScreen.style.backgroundColor = `rgba(255,255,255,0.5)`;
    whiteScreen.style.position = "absolute";
    whiteScreen.style.zIndex = "100";
    document.querySelector("body").prepend(whiteScreen);
    const title = document.createElement("h2");
    title.innerText = textPrint;
    title.style.textAlign = "center";
    title.style.fontSize = 100 + "px";
    whiteScreen.append(title);
    const finalScore = score + 100 * lifePoints;
    let lGames = ``;
    if (lastGame1)
        lGames += lastGame1;
    if (lastGame2)
        lGames += `, ${lastGame2}`;
    const scoreP = document.createElement("p");
    scoreP.innerHTML = `<p>
    time over: ${timeGame - secondsLeft} <br>
    score: ${finalScore} <br> 
    max score:  ${maxScore} <br>
    last games score: ${lGames}
</p>`
    scoreP.style.textAlign = 'center';
    whiteScreen.append(scoreP);
    updateStorage(finalScore);

}

const updatePoints = () => {
    document.querySelector("#score").innerText = score + "$";
    document.querySelector("#life").innerText = "X" + lifePoints;

}
const init = () => {
    initMario();
    document.querySelector("#name").innerText = username;
    document.querySelector("#maxScore").innerText = maxScore + "$";
    score = 0;
    modeRun = false;
    secondPlay = 0;
    secondsLeft = timeGame;
    lifePoints = 0;
    updatePoints(score, lifePoints);
    const startBtn = document.querySelector("#play");
    startBtn.onclick = () => {
        startBtn.disabled = true;
        newGame();
    }
}

const stopGame = (m_src, m_top) => {
    clearInterval(timerEnd);
    clearInterval(timerPlay);
    clearInterval(timerDrop);
    const mario = document.querySelector("#mario");
    mario.src = m_src;
    mario.style.top = m_top + "vh";
    mario.style.scale = "50%";
    const body = document.querySelector("body");
    body.removeEventListener("keydown", jump);
    body.removeEventListener("keydown", move);
    body.removeEventListener("keyup", stop);
    backgroundSound.pause();
}

const win = () => {

    stopGame(`../img/jump.gif`, 55);
    setTimeout(() => {
        printGameDetails("Bravo!!!", ...userDetails.score);
    }, 5000);

}

const gameOver = function () {
    new Audio('../sound/gameover.wav').play();
    stopGame(`../img/sleep.gif`, 72);
    printGameDetails("game over", ...userDetails.score);


}

const newGame = () => {
    timerEnd = setInterval(() => {
        secondsLeft--;
        if (secondsLeft == 0) {
            gameOver();

        }
    }, 1000);
    const body = document.querySelector("body");
    body.addEventListener("keydown", jump);
    body.addEventListener("keydown", move);
    body.addEventListener("keyup", stop);
    backgroundSound.play();
    updateScreen();
}

const calculatePoints = (characterCrashed) => {
    characterObj = character.find(ch => ch.id == characterCrashed.id);
    characterObj.audio.play();
    if (characterObj.id.indexOf("palace") != -1) {
        score += characterObj.score;
        win();
        return;
    }
    if (characterObj.score < 0) {
        if (lifePoints == 0) {
            gameOver();
            return;
        }
        lifePoints--;
        characterCrashed.classList.remove("onScreen");

    }
    else {
        characterCrashed.style.display = "none";
        characterCrashed.classList.remove("onScreen");
        score += characterObj.score;
        if (score >= 100) {
            score -= 100;
            lifePoints++;
        }
    }
    updatePoints();
}

const checkCrashed = () => {
    const chOnScreen = Array.from(document.querySelectorAll(".onScreen"));
    const marioPos = document.querySelector("#mario").getBoundingClientRect();
    chOnScreen.forEach(ch => {
        const chPos = ch.getBoundingClientRect();
        if (chPos.bottom > marioPos.top && chPos.top < marioPos.bottom && chPos.left < marioPos.right - 100 && chPos.right > marioPos.left + 100) {
            calculatePoints(ch);
        }
    })
}

const jump = (e) => {
    if (e.key === "ArrowUp") {
        jumpSound.play();
        if (positionMario.top != baseTopMario)
            clearInterval(timerDrop);
        positionMario.top--;
        document.querySelector("#mario").style.top = positionMario.top + "%";
        if (!modeRun) {
            checkCrashed();
        }
    }
}
const move = (e) => {
    if (e.key === "ArrowRight" && !modeRun) {

        timerPlay = setInterval(() => {


            secondPlay++;
            updateScreen();
        }, 100);
        modeRun = true;
    }
}

const stop = (e) => {
    if (e.key === "ArrowUp") {
        const mario = document.querySelector("#mario");

        timerDrop = setInterval(() => {
            positionMario.top++;
            mario.style.top = positionMario.top + "%";
            if (!modeRun) {
                checkCrashed();
            }
            if (positionMario.top == baseTopMario)
                clearInterval(timerDrop);
        }, 10);
    }
    else if (e.key === "ArrowRight") {
        clearInterval(timerPlay);
        modeRun = false;
    }

}

const appear = (appearing) => {
    appearing.forEach(element => {

        let elementImg = document.createElement("img");
        elementImg.src = element.src;
        elementImg.id = element.id;
        elementImg.classList.add("onScreen");
        elementImg.style.position = "fixed";
        elementImg.style.top = element.position.top + "vh";
        elementImg.style.right = element.position.right + "vw";
        elementImg.style.scale = element.position.scale + "%";
        document.querySelector("body").prepend(elementImg);
    });
}

const updateScreen = () => {

    const appearing = character.filter(c => c.timeIn == secondPlay);
    if (appearing.length != 0)
        appear(appearing);

    const chOnScreen = character.filter(c => c.timeIn <= secondPlay && document.getElementById(c.id) != null);
    chOnScreen.forEach(ch => {
        ch.position.right++;
        document.getElementById(ch.id).style.right = ch.position.right + "%";

    });
    checkCrashed();

}

window.onload = init();


