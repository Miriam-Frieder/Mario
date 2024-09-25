

document.querySelector("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    let user = {
        name: document.querySelector("#name").value,
        password: document.querySelector("#password").value,
        score: []
    };
    
    if(user.name==""){
        const name=document.getElementById("name");
       name.style.borderColor = "red";
        name:after="dfvdf";
            return;
    }
    if (localStorage.getItem(`${user.name}`)==null) {
        console.log(user.name);
        localStorage.setItem(`${user.name}`,JSON.stringify(user));
    }
    else {
        console.log(user.password);
        let u = JSON.parse(localStorage.getItem(`${user.name}`));
        if(user.password!=u.password) {
            document.getElementById("password").style.borderColor = "red";
            return;
        }
        u.score = u.score.sort((a, b) => a - b);
        
    }
    location.href=`html/game.html?name=${user.name}`;
})


