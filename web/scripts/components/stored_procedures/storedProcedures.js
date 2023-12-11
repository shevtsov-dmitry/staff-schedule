import {countNewSalaryAction} from "./prepared_options/countNewSalaryAction";
import {assignEmployeeToShiftAction} from "./prepared_options/assignEmployeeToShiftAction";
import {countBonusAction} from "./prepared_options/countBonusAction";
import {chooseAndRemoveDepartmentAction} from "./prepared_options/chooseAndRemoveDepartmentAction";
import {getAvailableEmployeesAction} from "./prepared_options/getAvailableEmployeesAction";

export const useProcedureBtn = document.querySelector(".use-procedure")
export const divDisplayRegulator = document.querySelector('.procedures-flex-view')

export const proceduresUl = document.querySelector('.procedures-ul')
export const watermark = document.querySelector('.watermark')

// * STORED PROCEDURES
// first options
export const countNewSalary = document.querySelector('.count_new_salary')
export const chooseAndRemoveDepartment = document.querySelector('.choose_and_remove_department')
export const countBonus = document.querySelector('.count_bonus')
export const getAvailableEmployees = document.querySelector('.get_available_employees')
export const assignEmployeeToShift = document.querySelector('.assign_employee_to_shift')
// secondary options
export const shiftTimes = document.querySelector('.shift-times')
export const countBonusSecondaryOption = document.querySelector('.count-bonus-secondary-option')

const allOptions = [countNewSalary, chooseAndRemoveDepartment, countBonus, getAvailableEmployees,
    assignEmployeeToShift, shiftTimes, countBonusSecondaryOption]



const actionInnerHtmlHashMap = {
    'Рассчитать новую зарплату': 0,
    'Выбрать и удалить отдел': 1,
    'Рассчитать премию сотрудника': 2,
    'Узнать доступных сотрудников': 3,
    'Назначить сотрудника на смену': 4,
}

export function initStoredProceduresComponent() {
    useProcedureBtn.addEventListener('click', () => {
        divDisplayRegulator.style.display = "flex"
    })
    countNewSalaryAction()
    chooseAndRemoveDepartmentAction()
    countBonusAction()
    getAvailableEmployeesAction()
    assignEmployeeToShiftAction()
}

export async function fillLi(procedureDOM, fetchUrl) {
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
        allOptions[actionInnerHtmlHashMap[procedureName]].innerHTML = htmlContent
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