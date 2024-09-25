const username=new URLSearchParams(location.search).get("name");
const userDetails=JSON.parse(localStorage.getItem(username));
let maxScore=userDetails.score.sort((a,b)=>b-a)[0];
if(!maxScore)
    maxScore=0;
let score, modeRun, secondPlay, secondsLeft,timeGame=180, lifePoints;
let timerPlay, timerEnd,timerDrop, positionMario,baseTopMario=61;
let backgroundSound=new Audio("../sound/backgroundMp4.mp3"),jumpSound=new Audio("../sound/jumpSound.wav");
function Position(top, right,scale) {
    this.top = top;
    this.right = right;
    this.scale=scale;

}
function Character(name,timeIn,position){
    this.name=name;
    this.timeIn=timeIn;
    this.position=position;
}
function CharacterKind(name,src,audio,score){
    this.name=name;
    this.src=src;
    this.audio=audio;
    this.score=score;
}
const chracterKinds=[
    new CharacterKind("mashroom","../img/4HV6.gif",new Audio("../sound/power-up.wav"),100),
    new CharacterKind("quesMark","../img/Uf9O.gif",new Audio("../sound/star.wav"),5),
    new CharacterKind("turtle","../img/5OUO (1).gif",new Audio("../sound/power-down.wav"),-100),
    new CharacterKind("coin","../img/coin.gif",new Audio("../sound/coin.wav"),10),
    new CharacterKind("enemyMashroom","../img/enemyMashroom.gif",new Audio('../sound/enemy.WAV'),-100),
    new CharacterKind("palace","../img/palace.png",new Audio('../sound/stage-clear.wav'),200)
    ];
let character = [
    new Character("mashroom", 0,new Position(79, 0,50)),
    new Character("quesMark", 0,new Position(20, 50,100)),
    new Character("turtle", 0,new Position(74, 20,50)),
    new Character("coin", 0,new Position(25, 30,20)),
    new Character("enemyMashroom", 5,new Position(35, 0,60)),
    new Character("quesMark", 2,new Position(20, 50,100)),
    new Character("quesMark", 4,new Position(20, 50,100)),
    new Character("turtle", 8,new Position(74, 0,50)),
    new Character("coin", 18,new Position(50, 0,20)),
    new Character("enemyMashroom", 21,new Position(25, 0,60)),
    new Character("turtle",24,new Position(74, 20,50)),
    new Character("coin", 30,new Position(40, 0,20)),
    new Character("quesMark", 35,new Position(45, 0,100)),
    new Character("quesMark", 37,new Position(45, 0,100)),
    new Character("mashroom", 40,new Position(79, 0,50)),
    new Character("enemyMashroom", 48,new Position(30, 0,60)),
    new Character("coin", 55,new Position(35, 0,20)),
    new Character("coin", 58,new Position(35, 0,20)),
    new Character("coin", 61,new Position(35, 0,20)),
    new Character("mashroom", 100,new Position(79, 0,50)),
    new Character("mashroom", 70,new Position(79, 0,50)),
    new Character("enemyMashroom", 73,new Position(35, 0,60)),
    new Character("quesMark", 76,new Position(20, 50,100)),
    new Character("turtle", 82,new Position(74, 20,50)),
    new Character("coin", 88,new Position(25, 30,20)),
    new Character("quesMark", 94,new Position(20, 50,100)),
    new Character("quesMark", 96,new Position(20, 50,100)),
    new Character("turtle", 98,new Position(74, 0,50)),
    new Character("enemyMashroom", 101,new Position(25, 0,60)),
    new Character("coin", 104,new Position(50, 0,20)),
    new Character("turtle", 110,new Position(74, 0,50)),
    new Character("coin",116,new Position(40, 0,20)),
    new Character("enemyMashroom", 118,new Position(30, 0,60)),
    new Character("mashroom", 134,new Position(79, 0,50)),
    new Character("enemyMashroom", 137,new Position(25, 0,60)),
    new Character("coin", 140,new Position(35, 0,20)),
    new Character("coin", 144,new Position(35, 0,20)),
    new Character("coin", 148,new Position(35, 0,20)),
    new Character("coin", 152,new Position(35, 0,20)),
    new Character("turtle", 166,new Position(74, 0,50)),
    new Character("quesMark", 167,new Position(20, 50,100)),
    new Character("quesMark", 169,new Position(20, 50,100)),
    new Character("quesMark", 171,new Position(20, 50,100)),
    new Character("quesMark", 173,new Position(20, 50,100)),
    new Character("turtle", 180,new Position(74, 20,50)),
    new Character("coin", 190,new Position(25, 30,20)),
    new Character("coin", 195,new Position(25, 30,20)),
    new Character("coin", 200,new Position(25, 30,20)),
    new Character("quesMark", 205,new Position(20, 50,100)),
    new Character("quesMark", 210,new Position(20, 50,100)),
    

]

character=[...character,...character.map((ch,i)=>{
    const newCh={...ch};
    newCh.position={...ch.position};
    newCh.timeIn+=220;
    newCh.id+=i+200;
    return newCh;
})];

character.push(new Character("palace",460,new Position(12,-100,40)));
character=character.map((ch,i)=>{
    ch.id=ch.name+i;
    let kindInd=chracterKinds.findIndex(k=>
        Object.values(k).includes(ch.name)
    ) 
    return {...ch,...chracterKinds[kindInd]}
})


