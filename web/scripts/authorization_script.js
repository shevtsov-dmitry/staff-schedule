import {server_url} from "web/scripts/CONSTANTS"

const form = document.querySelector("#form-with-data");
let loginHeader = document.querySelector(".login-header");
let attemptsCounter = document.querySelector(".attempts-counter");
let iterator = 0;
// Function: send the form to the server for processing
form.addEventListener("submit", (event)=>{
    // blocking standard form execution
    event.preventDefault();
    const login = form.querySelector("#username").value;
    const password = form.querySelector("#password").value;
    const formData = {
        login: login,
        password: password
    }
    const url = `${server_url}/admin`;
    // send the data to the server for validation

    fetch(url,{
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response =>{
            if(!response.ok){
                throw new Error('Network response was not completed');
            }
            else return response.json();
        })
        .then(bool =>{ // utf's ✓ ❌
            console.log(`Response success from server: ${bool}`);
            if(bool){
                loginHeader.style.color = "green";
                loginHeader.textContent = `Login ✓`;
                setTimeout( ()=> {
                        window.location.href = "/html/admin_page.html";
                    }, 400
                )
            }
            else{
                // attempts ++
                attemptsCounter.style.display = "block";
                iterator++;
                attemptsCounter.textContent = `attempts: ${iterator}`;
                // header css change
                loginHeader.style.color = "red";
                loginHeader.textContent =  "Login ❌";
            }
        }) // xxxxxxxxxxxxxxx
        .catch(error =>{
            console.log("Error sending your request" +"\n" + error);
            attemptsCounter.style.display = "block";
            attemptsCounter.textContent = "Сервер недоступен.";
            attemptsCounter.style.color = "#9D0000";
        });

    console.log(formData) // xxxxxxxxxxxxxxx
    console.log(form.lastChild);
})
// console.log(loginHeader)