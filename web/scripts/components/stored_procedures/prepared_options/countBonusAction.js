import {host} from "../../../configurations/HOST_SERVER";
import {countBonus, countBonusSecondaryOption, fillLi, proceduresUl, watermark} from "../storedProcedures";

export function countBonusAction(){
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
                                    if (bonus_coefficient === '1.00') bonus_coefficient = '1.10'
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
}