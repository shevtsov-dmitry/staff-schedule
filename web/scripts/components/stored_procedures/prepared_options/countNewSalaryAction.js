import {host} from "../../../configurations/HOST_SERVER";
import {countNewSalary, fillLi, proceduresUl, watermark} from "../storedProcedures";

let firstName = ""
let lastName = ""

export function countNewSalaryAction() {
    proceduresUl.children[0].addEventListener('click', async () => {
        await fillLi(proceduresUl.children[0], `${host}/get-employees`);
        for (let child of countNewSalary.children) {
            child.addEventListener('click', async () => {
                await executeAsyncFormCreationEnvironment(child);
            })
        }

    })
}

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
    hiddenOKButton.addEventListener('click', async () => {
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

