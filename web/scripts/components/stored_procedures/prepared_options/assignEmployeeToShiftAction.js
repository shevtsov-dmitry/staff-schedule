import {host} from "../../../configurations/HOST_SERVER";
import {assignEmployeeToShift, fillLi, proceduresUl, shiftTimes, watermark} from "../storedProcedures";

export function assignEmployeeToShiftAction() {
    proceduresUl.children[4].addEventListener('click', () => {
        fillLi(proceduresUl.children[4], `${host}/get-employees`);

        setTimeout(() => {
            for (let child of assignEmployeeToShift.children) {
                child.addEventListener('click', () => {
                    fetch(`${host}/get-shifts-time`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                        .then(arrayOfObject => {
                            let composeLi = ""
                            for (let arrayOfObjectElement of arrayOfObject) {
                                composeLi += "<li>"
                                const keys = Object.keys(arrayOfObjectElement)
                                composeLi += "С " + arrayOfObjectElement[keys[0]] + " "
                                composeLi += "до " + arrayOfObjectElement[keys[1]]
                                composeLi += "</li>"
                            }
                            shiftTimes.innerHTML = composeLi
                            let dataToSend = child.textContent.split(" ")
                            dataToSend.pop()
                            for (let time of shiftTimes.children) {
                                time.addEventListener('click', () => {
                                    let formattedTime = time.textContent.replaceAll(/[^0-9:]/g, "")
                                    dataToSend.push(formattedTime.substring(0, formattedTime.length / 2))
                                    dataToSend.push(formattedTime.substring(formattedTime.length / 2, formattedTime.length))
                                    dataToSend = JSON.stringify(dataToSend)

                                    fetch(`${host}/assignEmployeeToShift`, {
                                        method: "POST",
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: dataToSend
                                    }).then(res => res.json())
                                        .then(answer => {
                                            watermark.innerHTML = answer.answer
                                            setTimeout(() => {
                                                watermark.innerHTML = ""
                                            }, 3000)
                                        })
                                })
                            }
                        })
                })
            }
        }, 150)
    })
}