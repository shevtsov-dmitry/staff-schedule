import {host} from "../configurations/HOST_SERVER";
import {formatDateToRULocale, parseTableNameToRussian, translateColumnNameIntoRussian} from "../utils/rusification";
import Handsontable from "handsontable";

const placeholderTable = document.querySelector('.placeholder-table')
const placeholderText = document.querySelector('.placeholder-text')
const placeholderHot = new Handsontable(placeholderTable, {
    data: [['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '']],
    rowHeaders: true,
    colHeaders: true,
    height: 'auto',
    licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
})


const tableNamesList = document.querySelector('.table-names-list')
const container = document.querySelector('#table');
const hot = new Handsontable(container, {
    data: [],
    rowHeaders: false,
    colHeaders: false,
    height: 'auto',
    licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
});

let engTableNames = []
let rusTableNames = []

function fillTableNames(data) {
    for (const key in data) {
        if (!Object.hasOwn(data, key)) {
            break
        }
        const element = data[key];
        let engTableName = element.table_name
        let russianTableName = parseTableNameToRussian(engTableName)
        engTableNames.push(engTableName)
        rusTableNames.push(russianTableName)
    }
    rusTableNames.forEach(name => tableNamesList.innerHTML += `<li>${name}</li>`)
}

function defineClickedHeaderTableName(name) {
    placeholderHot.rootElement.style.display = 'none'
    return engTableNames[rusTableNames.indexOf(name.textContent)]
}

export async function initTableNamesHeader() {
    return new Promise((resolve) => {
        tableNamesList.innerHTML = "";
        fetch(`${host}/get-table-names`, {
            method: "GET",
            headers: {'Content-Type': 'application/json '},
        })
            .then(response => response.json())
            .then(data => {
                fillTableNames(data);
                resolve();
            })
    })
}

let chosenTable = ""

const chooseTableBtn = document.querySelector('.choose-table')
const saveBtn = document.querySelector('#save')
const addRowBtn = document.querySelector('.add-row')
const removeRowBtn = document.querySelector('.remove-row')

chooseTableBtn.addEventListener('click', () => {
    placeholderText.innerHTML = ""
    tableNamesList.style.display = "flex"
})
addRowBtn.addEventListener('click', () => {
    hot.alter('insert_row_below', hot.countRows())
})
removeRowBtn.addEventListener('click', () => {
    hot.alter('remove_row', hot.countRows() - 1)
})

saveBtn.addEventListener('click', () => {
    let object = hot.getData()
    object.push([chosenTable])
    fetch(`${host}/save-table`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(object)
    }).then(() => location.reload())
})

async function constructTable() {
    async function setTableColumnsAndContent(data) {
        formatDateToRULocale(data)
        let columns = []
        await getColumnNames().then(arr => columns = arr)
        hot.updateSettings({
            data: data,
            colHeaders: columns
        })
    }

    fetch(`${host}/get-all-data-from-table?table=${chosenTable}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => response.json())
        .then(async data => setTableColumnsAndContent(data));
}

function getColumnNames() {
    return new Promise(resolve => {
        fetch(`${host}/get-column-names?table=${chosenTable}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json '},
        })
            .then(response => response.json())
            .then(arr => {
                arr = arr.map(col => translateColumnNameIntoRussian(col))
                resolve(arr)
            })
    })
}


function createTableOnHeaderNameChoose() {
    for (const name of tableNamesList.children) {
        name.addEventListener('click', async () => {
            chosenTable = await defineClickedHeaderTableName(name)
            await constructTable()
        })
    }
}

export async function initTable() {
    await initTableNamesHeader()
    createTableOnHeaderNameChoose();
}