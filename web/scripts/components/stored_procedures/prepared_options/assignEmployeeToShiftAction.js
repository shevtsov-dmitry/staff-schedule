import {host} from "../../../configurations/HOST_SERVER";
import {assignEmployeeToShift, fillLi, proceduresUl, shiftTimes, watermark} from "../storedProcedures";

function composeQuery(child, time) {
    const fullName = child.textContent.split(" ")
    const first_name = fullName[0]
    const last_name = fullName[1]
    const formattedTime = time.textContent.replaceAll(/[^0-9:]/g, "")
    const shift_start_time = formattedTime.substring(0, formattedTime.length / 2)
    const shift_end_time = formattedTime.substring(formattedTime.length / 2, formattedTime.length)
    return `${host}/assign_employee_to_shift?first_name=${first_name}&last_name=${last_name}` +
        `&shift_start_time=${shift_start_time}&shift_end_time=${shift_end_time}`;
}

function composeLiDOM(arrayOfObject) {
    let composeLi = ""
    for (let arrayOfObjectElement of arrayOfObject) {
        composeLi += "<li>"
        const keys = Object.keys(arrayOfObjectElement)
        composeLi += "С " + arrayOfObjectElement[keys[0]] + " "
        composeLi += "до " + arrayOfObjectElement[keys[1]]
        composeLi += "</li>"
    }
    return composeLi;
}

function showWatermark(answer) {
    watermark.innerHTML = answer.answer
    setTimeout(() => {
        watermark.innerHTML = ""
    }, 3000)
}

function getShiftTimes(child) {
    return new Promise(resolve => {
        child.addEventListener('click', () => {
            fetch(`${host}/get-shifts-time`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(shiftTimesData => resolve(shiftTimesData))
        })
    })
}

function changeEmployeeShift(time, child) {
    time.addEventListener('click', () => {
        const query = composeQuery(child, time);
        fetch(query, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(answer => showWatermark(answer))
    })
}

function showShiftTimesDOM() {
    for (let child of assignEmployeeToShift.children) {
        let shiftTimesData = ""
        getShiftTimes(child)
            .then(data => shiftTimesData = data)
            .then(() => {
                shiftTimes.innerHTML = composeLiDOM(shiftTimesData)
                for (let time of shiftTimes.children) {
                    changeEmployeeShift(time, child);
                }
            })
    }
}

export function assignEmployeeToShiftAction() {
    proceduresUl.children[4].addEventListener('click', async () => {
        await fillLi(proceduresUl.children[4], `${host}/get-employees`)
            .then(()=> showShiftTimesDOM())
    })
}

