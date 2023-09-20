import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

// placeholder table
const placeholder_table = document.querySelector('.placeholder-table')
let placeholder_hot = new Handsontable(placeholder_table, {
    data: [['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '']],
    rowHeaders: true,
    colHeaders: true,
    height: 'auto',
    licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
})
const choose_table_btn = document.querySelector('.choose-table')
const placeholder_text = document.querySelector('.placeholder-text')
const table_names_list = document.querySelector('.table-names-list')

choose_table_btn.addEventListener('click', () => {
    placeholder_text.innerHTML = ""
    table_names_list.style.display = "flex"
})

// show stored procedures
const show_procedures_button = document.querySelector('.use-procedure')
const procedures_ul = document.querySelector('.procedures-ul')
const procedures_flex_view = document.querySelector('.procedures-flex-view')
show_procedures_button.addEventListener('click', () => {
    procedures_flex_view.style.display = 'flex'
})


// actual table
const host = 'http://localhost:3000'

const container = document.querySelector('#table');
const hot = new Handsontable(container, {
    data: [],
    rowHeaders: false,
    colHeaders: false,
    height: 'auto',
    licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
});

// fill the list with values which will be chosen by user to display certain table

async function main() {
    // 1. get all table names
    table_names_list.innerHTML = "";
    fetch(`${host}/get-table-names`, {
        method: "GET",
        headers: {'Content-Type': 'application/json '},
    })
        .then(response => response.json())
        .then(data => {

            // *2. show received data as list
            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    const element = data[key];
                    table_names_list.innerHTML += `<li>${element.table_name}</li>`
                }
            }

            // *3. For each name add event listener to make action to run
            // *   function @constructTable(), which will create table,
            // *   fill it with data, show column names, make interactions
            // *   to add, delete, change rows and save it in database
            for (const name of table_names_list.children) {

                name.addEventListener('click', () => {
                    placeholder_hot.rootElement.style.display = 'none'
                    constructTable(name.textContent)
                })
            }


        })

}

const save_btn = document.querySelector('#save')
const add_row_btn = document.querySelector('.add-row')
const remove_row_btn = document.querySelector('.remove-row')

// function deleteSelectedRows(selectedRows) {
//     // define and send two id values. between them content will be removed
//     let start_row = selectedRows[0][0]
//     let end_row = selectedRows[0][2]
//     let id_value_start = hot.getDataAtCell(start_row, 0)
//     let id_value_end = hot.getDataAtCell(end_row, 0)
//     let array_to_send = [id_value_start, id_value_end]
//
//     fetch(`${host}/delete-selected-rows`, {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json '},
//         body: JSON.stringify(array_to_send)
//     })
// }

function fixDateIssue(data) {
    // Format date from redundant long UTC
    let chosenTableNames = []
    for (const obj in data[0]) {
        chosenTableNames.push(obj);
    }
    // for employee table
    if (chosenTableNames.includes('employee_id') && chosenTableNames[0] === 'employee_id') {
        for (let dataKey in data) {
            data[dataKey].hire_date = data[dataKey].hire_date.replace("T21:00:00.000Z", "")
        }
    }

    chosenTableNames = []
}


async function constructTable(table_name) {
    fetch(`${host}/get-all-data-from-table?table=${table_name}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => response.json())
        .then(async data => {
            await getColumnNames(table_name)
                .then(col_names_array => {

                    fixDateIssue(data);

                    // add data and column headers to table
                    setTimeout(() => {
                        hot.updateSettings({
                            data: data,
                            colHeaders: col_names_array
                        })
                    }, 200);
                })

            // @addEmptyRow() is event listener for button
            await addEmptyRow(table_name)

            // preset send all data from table
            save_btn.addEventListener('click', () => {
                let object = hot.getData()
                let singletonArray = []
                singletonArray.push(table_name)
                object.push(singletonArray)
                let dataToSend = JSON.stringify(object)
                fetch(`${host}/save-table`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: dataToSend

                }).then(() => location.reload())
                // console.log(hot.getData());

            })

            // * ADD new empty row
            async function addEmptyRow(table_name) {
                add_row_btn.addEventListener('click', () => {
                    fetch(`${host}/add-empty-rows?table=${table_name}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    hot.alter('insert_row_below', hot.countRows())
                });
            }

            // REMOVE row
            // let selectedRows = [];
            // remove_row_btn.addEventListener("mouseenter", () => {
            //   selectedRows = hot.getSelected()
            // });
            remove_row_btn.addEventListener('click', () => {
                hot.alter('remove_row', hot.countRows() - 1)
            })
        });
}

// get column names
async function getColumnNames(table_name) {
    let column_names = [];
    fetch(`${host}/get-column-names?table=${table_name}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json '},
    })
        .then(response => response.json())
        .then(column_names_response => {
            for (const key in column_names_response) {
                if (Object.hasOwnProperty.call(column_names_response, key)) {
                    const element = column_names_response[key];
                    column_names.push(element)
                } else throw new Error(`Object does not have property ${key}`)
            }
        })


    return column_names
}

await main()

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

                                change_salary_button.addEventListener('click', ()=>{
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
    // TODO set different fetch
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

