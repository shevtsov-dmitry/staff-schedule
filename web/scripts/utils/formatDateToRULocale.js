export function formatDateToRULocale(data) {
    // Format date from redundant long UTC
    let chosenTableNames = []
    for (const obj in data[0]) {
        chosenTableNames.push(obj);
    }
    if (chosenTableNames.includes('employee_id')
        && chosenTableNames[0] === 'employee_id'
        && !chosenTableNames.includes('shift_schedule_id')) {
        for (let dataKey in data) {
            data[dataKey].hire_date = data[dataKey].hire_date.replace("T21:00:00.000Z", "")
        }
    }
    chosenTableNames = []
}