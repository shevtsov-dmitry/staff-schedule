import {host} from "../configurations/HOST_SERVER";

const form = document.querySelector("#form-with-data");
let loginHeader = document.querySelector(".login-header");
let attemptsCounter = document.querySelector(".attempts-counter");
let iterator = 0;
form.addEventListener("submit", (event)=>{
    event.preventDefault();
    const login = form.querySelector("#username").value;
    const password = form.querySelector("#password").value;
    const formData = {
        login: login,
        password: password
    }
    const url = `${host}/verify-admin`;
    fetch(url,{
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(formData) // JS object -> JSON
        })
        .then(response =>{
            if(!response.ok){
                throw new Error(
                    'Network response was not completed'
                );
            }
            else return response.json();
        })
        .then(bool =>{
            console.log(`Response success from server: ${bool}`);
            if(bool){
                loginHeader.style.color = "green";
                loginHeader.textContent = `Авторизация ✓`;
                setTimeout( ()=> {
                        window.location.href = "/staff-schedule.html";
                    }, 350
                )
            } else{
                attemptsCounter.style.display = "block";
                iterator++;
                attemptsCounter.textContent = `количество попыток: ${iterator}`;
                loginHeader.style.color = "red";
                loginHeader.textContent =  "Авторизация ❌";
            }
        })
        .catch(err =>{
            console.log("Error sending your request" + "\n" + err);
            attemptsCounter.style.display = "block";
            attemptsCounter.textContent = "Сервер недоступен.";
            attemptsCounter.style.color = "#9D0000";
        });

})
