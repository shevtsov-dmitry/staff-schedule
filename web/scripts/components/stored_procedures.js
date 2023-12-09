import {host} from "../configurations/HOST_SERVER";

const useProcedureBtn = document.querySelector(".use-procedure")
const divDisplayRegulator = document.querySelector('.procedures-flex-view')

const proceduresUl = document.querySelector('.procedures-ul')
// * STORED PROCEDURES
const watermark = document.querySelector('.watermark')
// first options
const countNewSalary = document.querySelector('.count_new_salary')
const chooseAndRemoveDepartment = document.querySelector('.choose_and_remove_department')
const countBonus = document.querySelector('.count_bonus')
const getAvailableEmployees = document.querySelector('.get_available_employees')
const assignEmployeeToShift = document.querySelector('.assign_employee_to_shift')
// secondary options
const shiftTimes = document.querySelector('.shift-times')
const countBonusSecondaryOption = document.querySelector('.count-bonus-secondary-option')

const allOptions = [countNewSalary, chooseAndRemoveDepartment, countBonus, getAvailableEmployees,
    assignEmployeeToShift, shiftTimes, countBonusSecondaryOption]

export function initStoredProceduresComponent() {
    useProcedureBtn.addEventListener('click', () => {
        divDisplayRegulator.style.display = "flex"
    })
    countNewSalaryAction()
}

// * 2. chooseAndRemoveDepartment
proceduresUl.children[1].addEventListener('click', () => {
    fillLi(proceduresUl.children[1], `${host}/get-department-names`)

    setTimeout(() => {
        for (let child of chooseAndRemoveDepartment.children) {
            child.addEventListener('click', () => {
                const id = child.innerHTML.replaceAll(/[^\d]/g, "")
                fetch(`${host}/delete-dep?id=${id}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id: id})
                }).then(() => {
                })
            })
        }
    }, 200)
})
// * 3. countBonus
proceduresUl.children[2].addEventListener('click', () => {
    fillLi(proceduresUl.children[2], `${host}/get-employees`);

    setTimeout(() => {

        for (const child of countBonus.children) {
            child.addEventListener('click', () => {
                let whole_name = child.innerHTML.split(" ")
                whole_name.pop()
                let first_name = whole_name[0];
                let last_name = whole_name[1];
                fetch(`${host}/find-employee-id-by-name?first_name=${first_name}&last_name=${last_name}`, {
                    method: "GET",
                    headers: {'Content-Type': 'application/json '},
                })
                    .then(res => res.json())
                    .then(data => {
                        let id = data[0].employee_id
                        fetch(`${host}/get-employee-salary-and-bonus-coefficient?id=${id}`, {
                            method: "GET",
                            headers: {'Content-Type': 'application/json'},
                        })
                            .then(res => res.json())
                            .then(data => {
                                const salary = data[0].salary
                                let bonus_coefficient = data[0].bonus_coefficient
                                if (bonus_coefficient == '1.00') bonus_coefficient = '1.10'
                                // parse to percentage
                                let bonus_coefficient_percent = bonus_coefficient - 1
                                bonus_coefficient_percent *= 100
                                let new_salary = salary * bonus_coefficient
                                const formatSalary = (salary) => {
                                    let string_salary = salary.toString()
                                    for (let i = 0; i < string_salary.length; i++) {
                                        if (string_salary.charAt(i) == '.') {
                                            string_salary = string_salary.slice(0, i)
                                            break
                                        }
                                    }
                                    return string_salary
                                }

                                countBonusSecondaryOption.innerHTML = `
                                    <li>Зарплата: ${formatSalary(salary)} ₽</li>
                                    <li>Заслуженная премия: ${bonus_coefficient_percent.toString().slice(0, 2)} %</li>
                                    <li>Итог: ${formatSalary(new_salary)} ₽</li>
                                    <li><button class="change-bonus-coeffiecient">Изменить коээфициент премии</button>
                                            <input class="hidden-input" type="text" placeholder="%">
                                            <button class="hidden-input hidden-input-button">ОК</button>
                                        </button></li>
                                    <li><button class="change-salary-button">Принять</button></li>
                                `;

                                const change_bonus_coefficient = document.querySelector('.change-bonus-coeffiecient')
                                change_bonus_coefficient.addEventListener('click', () => {
                                    const hiddenInput = document.querySelector('.hidden-input')
                                    hiddenInput.style.display = 'block';
                                    const hiddenInputButton = document.querySelector('.hidden-input-button')
                                    hiddenInputButton.style.display = 'block'

                                    hiddenInputButton.addEventListener('click', () => {
                                        hiddenInputButton.style.display = 'none'
                                        hiddenInput.style.display = 'none'
                                        const new_coef = hiddenInput.value / 100;
                                        bonus_coefficient = new_coef + 1
                                        const remember_salary = formatSalary(new_salary)
                                        new_salary = new_salary * bonus_coefficient

                                        countBonusSecondaryOption.innerHTML = countBonusSecondaryOption.innerHTML.replace(
                                            `${bonus_coefficient_percent.toString().slice(0, 2)} %`, `${new_coef * 100} %`
                                        );


                                        countBonusSecondaryOption.innerHTML = countBonusSecondaryOption.innerHTML.replace(
                                            `${remember_salary}`, `${formatSalary(new_salary)}`
                                        )

                                        const change_salary_button = document.querySelector('.change-salary-button')
                                        change_salary_button.addEventListener('click', () => {
                                            fetch(`${host}/change-employee-salary?employee_id=${id}&new_salary=${new_salary}`, {
                                                method: "POST",
                                                headers: {'Content-Type': 'application/json'},
                                            })
                                                .then(() => {
                                                    watermark.innerHTML = `Сотрудник ${child.innerHTML} получил премию в ${new_coef * 100} % 
                                                                            <br> в этом месяце его зарплата составила ${new_salary} ₽`

                                                    setTimeout(() => {
                                                        watermark.innerHTML = ''
                                                    }, 5000)
                                                })
                                        })
                                    })

                                })


                            })
                    })
            })

        }
    }, 200)
})

// * 4. getAvailableEmployees
proceduresUl.children[3].addEventListener('click', () => {
    fillLi(proceduresUl.children[3], `${host}/get-available-employees`)
})

// * 5. assignEmployeeToShift
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

function countNewSalaryAction() {

    let firstName = ""
    let lastName = ""

    function composeCurrentSalaryHtml(currentSalary) {
        return `<li>Нынешняя Зарплата: ${currentSalary} ₽</li>
                <li>
                    <div class="flex-view-in-salary">                    
                        <button class="change-salary-btn">Изменить ЗП</button>
                        <input class="hidden-input" type="text" placeholder="₽">
                        <button class="hidden-input hidden-input-button">ОК</button>
                    </div>
                </li>
                <li><button class="accept-salary-change-btn">Принять</button></li>`;
    }

    function displayWatermark() {
        watermark.innerHTML = `Зарплата сотрудника ${firstName} ${lastName} изменена.`
        setTimeout(() => {
            watermark.innerHTML = ''
        }, 4000)
    }

    function setNameFields(child) {
        const wholeName = child.innerHTML.split(' ')
        wholeName.pop()
        firstName = wholeName[0];
        lastName = wholeName[1];
    }

    async function findEmployeeIdByName() {
        return new Promise(resolve => {
            fetch(`${host}/find-employee-id-by-name?first_name=${firstName}&last_name=${lastName}`, {
                method: "GET",
                headers: {'Content-Type': 'application/json '},
            })
                .then(res => res.json())
                .then(data => resolve(data[0].employee_id));
        })
    }

    function composeChangedSalaryHtml(preparedHTML, currentSalary, newSalary) {
        preparedHTML = preparedHTML.replace('Нынешняя', 'Новая')
        return preparedHTML.replace(`${currentSalary}`, `${newSalary}`)
    }

    function getCurrentSalaryOfEmployee(id) {
        return new Promise(resolve => {
            fetch(`${host}/get-employee-salary-and-bonus-coefficient?id=${id}`, {
                method: "GET",
                headers: {'Content-Type': 'application/json '},
            })
                .then(res => res.json())
                .then(data => resolve(data[0].salary))
        })
    }

    function showChangeSalaryUI(changeSalaryButton, hiddenOKButton, hiddenInput,) {
        changeSalaryButton.addEventListener('click', () => {
            hiddenInput.style.display = 'block';
            hiddenOKButton.style.display = 'block'
        })
        hiddenOKButton.addEventListener('click', () => {
            hiddenOKButton.style.display = 'none'
            hiddenInput.style.display = 'none'
        })
    }

    function updateHtmlWithNewSalary(hiddenInput, preparedHTML, currentSalary) {
        let newSalary = ""
        newSalary = hiddenInput.value
        preparedHTML = composeChangedSalaryHtml(preparedHTML, currentSalary, newSalary);
        countNewSalary.innerHTML = preparedHTML
        return newSalary;
    }

    function updateSalaryOnClick(id, newSalary) {
        return new Promise(resolve => {
            const acceptSalaryChangeBtn = document.querySelector('.accept-salary-change-btn')
            acceptSalaryChangeBtn.addEventListener('click', () => {
                fetch(`${host}/update-salary?id=${id}&new_salary=${newSalary}`, {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                }).then(() => resolve())
            })
        })
    }

    async function createUpdateSalaryForm(preparedHTML, currentSalary, id) {
        const changeSalaryButton = document.querySelector('.change-salary-btn')
        const hiddenOKButton = document.querySelector('.hidden-input-button')
        const hiddenInput = document.querySelector('.hidden-input')
        showChangeSalaryUI(changeSalaryButton, hiddenOKButton, hiddenInput);
        hiddenOKButton.addEventListener('click', async ()=> {
            const newSalary = updateHtmlWithNewSalary(hiddenInput, preparedHTML, currentSalary);
            await updateSalaryOnClick(id, newSalary);
            displayWatermark()
        })
    }

    async function executeAsyncFormCreationEnvironment(child) {
        countNewSalary.classList.add('count-bonus-secondary-option')
        setNameFields(child);
        let id = -1
        await findEmployeeIdByName().then(foundId => id = foundId)
        let currentSalary = 0
        await getCurrentSalaryOfEmployee(id).then(salary => currentSalary = salary)
        let preparedHTML = composeCurrentSalaryHtml(currentSalary);
        countNewSalary.innerHTML = preparedHTML
        await createUpdateSalaryForm(preparedHTML, currentSalary, id);
    }

    proceduresUl.children[0].addEventListener('click', async () => {
        await fillLi(proceduresUl.children[0], `${host}/get-employees`);
        for (let child of countNewSalary.children) {
            child.addEventListener('click', async () => {
                await executeAsyncFormCreationEnvironment(child);
            })
        }

    })
}


async function fillLi(procedureDOM, fetchUrl) {
    return new Promise(resolve => {
        fetch(fetchUrl, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
            .then(res => res.json())
            .then(arrayOfObject => {
                let htmlContent = composeLi(arrayOfObject);
                insertContentInUl(htmlContent);
                resolve()
            })
    })

    function insertContentInUl(htmlContent) {
        let procedureName = procedureDOM.textContent
        allOptions.forEach(option => option.innerHTML = "")
        if (procedureName === 'Рассчитать новую зарплату') allOptions[0].innerHTML = htmlContent
        if (procedureName === 'Выбрать и удалить отдел') allOptions[1].innerHTML = htmlContent
        if (procedureName === 'Рассчитать премию сотрудника') allOptions[2].innerHTML = htmlContent
        if (procedureName === 'Узнать доступных сотрудников') allOptions[3].innerHTML = htmlContent
        if (procedureName === 'Назначить сотрудника на смену') allOptions[4].innerHTML = htmlContent
    }

    function composeLi(arrayOfObject) {
        let composedLi = ""
        for (let arrayOfObjectElement of arrayOfObject) {
            composedLi += "<li>"
            for (const key in arrayOfObjectElement) {
                let val = arrayOfObjectElement[key]
                composedLi += `${val} `
            }
            composedLi += "</li>"
        }
        return composedLi
    }


}