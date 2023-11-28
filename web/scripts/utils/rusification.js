export function parseTableNameToRussian(tableName) {
    switch (tableName) {
        case 'job':
            tableName = 'рабочие вакансии'
            break
        case 'employee':
            tableName = 'сотрудники'
            break
        case 'location':
            tableName = 'местоположение'
            break
        case 'salary_record':
            tableName = 'финансы'
            break
        case 'shift_schedule':
            tableName = 'расписание смен'
            break
        case 'department':
            tableName = 'отдел'
            break
        case 'position':
            tableName = 'должность сотрудника'
            break
        case 'employee_shiftschedule':
            tableName = 'связь сотрудники-смены'
            break
        case 'admins':
            tableName = 'администраторы'
            break
    }
    return tableName;
}

export function translateColumnNameIntoRussian(element) {
    switch (element) {
        case 'login':
            element = 'логин';
            break;
        case 'password':
            element = 'пароль';
            break;
        case 'department_name':
            element = 'название';
            break;
        case 'department_budget':
            element = 'бюджет';
            break;
        case 'first_name':
            element = 'имя';
            break;
        case 'last_name':
            element = 'фамилия';
            break;
        case 'phone_number':
            element = 'номер телефона';
            break;
        case 'email':
            element = 'электронная почта';
            break;
        case 'hire_date':
            element = 'дата найма';
            break;
        case 'job_title':
            element = 'название';
            break;
        case 'job_description':
            element = 'описание';
            break;
        case 'job_requirements':
            element = 'требования';
            break;
        case 'location_name':
            element = 'название';
            break;
        case 'address_line_1':
            element = 'адрес';
            break;
        case 'address_line_2':
            element = 'дополнительный адрес';
            break;
        case 'city':
            element = 'город';
            break;
        case 'region':
            element = 'регион';
            break;
        case 'zip_code':
            element = 'почтовый код';
            break;
        case 'country':
            element = 'страна';
            break;
        case 'position_title':
            element = 'название';
            break;
        case 'position_description':
            element = 'описание';
            break;
        case 'required_hours_per_week':
            element = 'требуемое время работы';
            break;
        case 'salary':
            element = 'зарплата';
            break;
        case 'hourly_rate':
            element = 'почасовая ставка';
            break;
        case 'bonus_coefficient':
            element = 'надбавка';
            break;
        case 'shift_start_time':
            element = 'начало смены';
            break;
        case 'shift_end_time':
            element = 'конец смены';
            break;
    }
    return element;
}

export function formatDateToRULocale(data) {
    let chosenTableNames = []
    for (const obj in data[0]) {
        chosenTableNames.push(obj);
    }

    if (chosenTableNames.includes('employee_id')
        && chosenTableNames[0] === 'employee_id'
        && !chosenTableNames.includes('shift_schedule_id')) {
        for (let dataKey in data) {
            let rawString = data[dataKey].hire_date
            data[dataKey].hire_date = parseToRULocal(rawString)
        }
    }
}

function parseToRULocal(str) {
    str = str.replace("T21:00:00.000Z", "")
    str += str.substring(0, 4)
    str = str.slice(5, str.length)
    str = str.substring(3, 5) + "." + str
    return str.substring(0, 5) + "." + str.substring(str.length - 4, str.length)
}