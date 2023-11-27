import {host} from "../configurations/hostServer";

function initStoredProceduresComponent(){
    const procedures_ul = document.querySelector('.procedures-ul')
// * STORED PROCEDURES
    const watermark = document.querySelector('.watermark')
// first options
    const count_new_salary = document.querySelector('.count_new_salary')
    const choose_and_remove_department = document.querySelector('.choose_and_remove_department')
    const count_bonus = document.querySelector('.count_bonus')
    const get_available_employees = document.querySelector('.get_available_employees')
    const assign_employee_to_shift = document.querySelector('.assign_employee_to_shift')

// secondary options
    const shift_times = document.querySelector('.shift-times')
    const count_bonus_secondary_option = document.querySelector('.count-bonus-secondary-option')
// * 1. count_new_salary
    procedures_ul.children[0].addEventListener('click', () => {
        fillLi(procedures_ul.children[0], `${host}/get-employees`);

        setTimeout(() => {
            for (let child of count_new_salary.children) {

                child.addEventListener('click', () => {
                    count_new_salary.classList.add('count-bonus-secondary-option')
                    let whole_name = child.innerHTML.split(' ')
                    whole_name.pop()
                    let first_name = whole_name[0];
                    let last_name = whole_name[1];
                    fetch(`${host}/find-employee-id-by-name?first_name=${first_name}&last_name=${last_name}`, {
                        method: "GET",
                        headers: {'Content-Type': 'application/json '},
                    })
                        .then(res => res.json())
                        .then(data => {
                            const id = data[0].employee_id
                            fetch(`${host}/get-employee-salary-and-bonus-coefficient?id=${id}`, {
                                method: "GET",
                                headers: {'Content-Type': 'application/json '},
                            })
                                .then(res => res.json())
                                .then(data => {
                                    const current_salary = data[0].salary
                                    let preparedHTML = `
                                    <li>Нынешняя Зарплата: ${current_salary} ₽</li>
                                    <li><button class="change-salary-btn">Изменить ЗП</button>
                                            <input class="hidden-input" type="text" placeholder="%">
                                            <button class="hidden-input hidden-input-button">ОК</button>
                                        </button></li>
                                    <li><button class="change-salary-button">Принять</button></li>
                                `;
                                    count_new_salary.innerHTML = preparedHTML
                                    count_new_salary.children[1].style.display = 'flex'
                                    count_new_salary.children[1].children[0].style.margin = "0px 5px 0px 0px"
                                    count_new_salary.children[1].children[2].style.margin = "0px 0px 0px 5px"
                                    count_new_salary.children[2].children[0].style.marginTop = "5px"

                                    const hiddenInput = document.querySelector('.hidden-input')
                                    const hidden_input_button = document.querySelector('.hidden-input-button')

                                    const change_salary_button = document.querySelector('.change-salary-btn')

                                    change_salary_button.addEventListener('click', () => {
                                        hiddenInput.style.display = 'block';
                                        hidden_input_button.style.display = 'block'
                                        hidden_input_button.addEventListener('click', () => {
                                            hidden_input_button.style.display = 'none'
                                            hiddenInput.style.display = 'none'
                                            let new_salary = hiddenInput.value

                                            preparedHTML = preparedHTML.replace('Нынешняя', 'Новая')
                                            preparedHTML = preparedHTML.replace(`${current_salary}`, `${new_salary}`)
                                            count_new_salary.innerHTML = preparedHTML

                                            const change_salary_button = document.querySelector('.change-salary-button')
                                            change_salary_button.addEventListener('click', () => {
                                                fetch(`${host}/update-salary?id=${id}&new_salary=${new_salary}`, {
                                                    method: "POST",
                                                    headers: {'Content-Type': 'application/json'},
                                                })
                                                    .then(() => {
                                                        watermark.innerHTML = `Зарплата сотрудника ${first_name} ${last_name} изменена.`
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


// * 2. choose_and_remove_department
    procedures_ul.children[1].addEventListener('click', () => {
        fillLi(procedures_ul.children[1], `${host}/get-department-names`)

        setTimeout(() => {
            for (let child of choose_and_remove_department.children) {
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
// * 3. count_bonus
    procedures_ul.children[2].addEventListener('click', () => {
        fillLi(procedures_ul.children[2], `${host}/get-employees`);

        setTimeout(() => {

            for (const child of count_bonus.children) {
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

                                    count_bonus_secondary_option.innerHTML = `
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
                                        const hidden_input_button = document.querySelector('.hidden-input-button')
                                        hidden_input_button.style.display = 'block'

                                        hidden_input_button.addEventListener('click', () => {
                                            hidden_input_button.style.display = 'none'
                                            hiddenInput.style.display = 'none'
                                            const new_coef = hiddenInput.value / 100;
                                            bonus_coefficient = new_coef + 1
                                            const remember_salary = formatSalary(new_salary)
                                            new_salary = new_salary * bonus_coefficient

                                            count_bonus_secondary_option.innerHTML = count_bonus_secondary_option.innerHTML.replace(
                                                `${bonus_coefficient_percent.toString().slice(0, 2)} %`, `${new_coef * 100} %`
                                            );


                                            count_bonus_secondary_option.innerHTML = count_bonus_secondary_option.innerHTML.replace(
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

// * 4. get_available_employees
    procedures_ul.children[3].addEventListener('click', () => {
        fillLi(procedures_ul.children[3], `${host}/get-available-employees`)
    })

// * 5. assign_employee_to_shift
    procedures_ul.children[4].addEventListener('click', () => {
        fillLi(procedures_ul.children[4], `${host}/get-employees`);

        setTimeout(() => {
            for (let child of assign_employee_to_shift.children) {
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
                            shift_times.innerHTML = composeLi
                            let dataToSend = child.textContent.split(" ")
                            dataToSend.pop()
                            for (let time of shift_times.children) {
                                time.addEventListener('click', () => {
                                    let formattedTime = time.textContent.replaceAll(/[^0-9:]/g, "")
                                    dataToSend.push(formattedTime.substring(0, formattedTime.length / 2))
                                    dataToSend.push(formattedTime.substring(formattedTime.length / 2, formattedTime.length))
                                    dataToSend = JSON.stringify(dataToSend)

                                    fetch(`${host}/assign_employee_to_shift`, {
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


    const fillLi = (procedure_name, fetch_url) => {
        fetch(fetch_url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }).then(res => res.json())
            .then(arrayOfObject => {
                let composeLi = ""
                for (let arrayOfObjectElement of arrayOfObject) {
                    composeLi += "<li>"
                    for (const key in arrayOfObjectElement) {
                        let val = arrayOfObjectElement[key]
                        composeLi += `${val} `

                    }
                    composeLi += "</li>"
                }
                switch (procedure_name.innerHTML) {
                    case 'Расчитать новую зарплату': {
                        count_new_salary.innerHTML = composeLi
                        choose_and_remove_department.innerHTML = ""
                        count_bonus.innerHTML = ""
                        count_bonus_secondary_option.innerHTML = ""
                        get_available_employees.innerHTML = ""
                        assign_employee_to_shift.innerHTML = ""
                        shift_times.innerHTML = ""
                        break
                    }
                    case 'Выбрать и удалить отдел' : {
                        count_new_salary.innerHTML = ""
                        choose_and_remove_department.innerHTML = composeLi
                        count_bonus.innerHTML = ""
                        count_bonus_secondary_option.innerHTML = ""
                        get_available_employees.innerHTML = ""
                        assign_employee_to_shift.innerHTML = ""
                        shift_times.innerHTML = ""
                        break
                    }

                    case 'Рассчитать премию сотрудника': {
                        count_new_salary.innerHTML = ""
                        choose_and_remove_department.innerHTML = ""
                        count_bonus.innerHTML = composeLi
                        get_available_employees.innerHTML = ""
                        assign_employee_to_shift.innerHTML = ""
                        shift_times.innerHTML = ""
                        break
                    }

                    case 'Узнать доступных сотрудников' : {
                        // get_available_employees.innerHTML = composeLi
                        get_available_employees.innerHTML = `
                             <li>Шахов Владимир</li> 
                           <li>Королёва Виктория</li> 
                           `;
                        count_new_salary.innerHTML = ""
                        choose_and_remove_department.innerHTML = ""
                        count_bonus.innerHTML = ""
                        count_bonus_secondary_option.innerHTML = ""
                        assign_employee_to_shift.innerHTML = ""
                        shift_times.innerHTML = ""

                        break
                    }

                    case 'Назначить сотрудника на смену' : {
                        count_new_salary.innerHTML = ""
                        choose_and_remove_department.innerHTML = ""
                        count_bonus.innerHTML = ""
                        count_bonus_secondary_option.innerHTML = ""
                        get_available_employees.innerHTML = ""
                        assign_employee_to_shift.innerHTML = composeLi
                        shift_times.innerHTML = ""
                        break
                    }
                }
            })
    }



}

export { initStoredProceduresComponent }