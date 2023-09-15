const server_url = "http://localhost:3000"

const form = document.querySelector("#form-with-data");
let loginHeader = document.querySelector(".login-header");
let attemptsCounter = document.querySelector(".attempts-counter");
let iterator = 0;
// Function: send the form to the server for processing
form.addEventListener("submit", (event)=>{
    // block standard form execution
    event.preventDefault();
    // Get data from form
    const login = form.querySelector("#username").value;
    const password = form.querySelector("#password").value;
    const formData = {
        login: login,
        password: password
    }
    const url = `${server_url}/verify-admin`;
    // send data to the server for verification
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
        .then(bool =>{ // utf's ✓ ❌
            console.log(`Response success from server: ${bool}`);
            if(bool){
                loginHeader.style.color = "green";
                loginHeader.textContent = `Login ✓`;
                setTimeout( ()=> {
                        window.location.href = "/staff-schedule.html";
                    }, 350
                )
            } else{
                // attempts ++
                attemptsCounter.style.display = "block";
                iterator++;
                attemptsCounter.textContent = `attempts: ${iterator}`;
                // header css change
                loginHeader.style.color = "red";
                loginHeader.textContent =  "Login ❌";
            }
        }) // xxxxxxxxxxxxxxx
        .catch(err =>{
            console.log("Error sending your request" + "\n" + err);
            attemptsCounter.style.display = "block";
            attemptsCounter.textContent = "Сервер недоступен.";
            attemptsCounter.style.color = "#9D0000";
        });

})
