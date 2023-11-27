import {host} from "../configurations/hostServer";
import {parseTableNameToRussian, translateColumnNameIntoRussian} from "../utils/rusification";
import Handsontable from "handsontable";
import {formatDateToRULocale} from "../utils/formatDateToRULocale";

export async function initTable(){
    await main();

}

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
export const choose_table_btn = document.querySelector('.choose-table')
export const placeholder_text = document.querySelector('.placeholder-text')
export const table_names_list = document.querySelector('.table-names-list')
export const show_procedures_button = document.querySelector('.use-procedure')
export const procedures_flex_view = document.querySelector('.procedures-flex-view')
const container = document.querySelector('#table');
const hot = new Handsontable(container, {
    data: [],
    rowHeaders: false,
    colHeaders: false,
    height: 'auto',
    licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
});

export async function main() {
    // 1. get all table names
    table_names_list.innerHTML = "";
    fetch(`${host}/get-table-names`, {
        method: "GET",
        headers: {'Content-Type': 'application/json '},
    })
        .then(response => response.json())
        .then(data => {

            let engTableNames = []
            let rusTableNames = []

            // *2. show received data as list
            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    const element = data[key];
                    let engTableName = element.table_name
                    // parse each table name to russian lang respectively
                    let russianTableName = parseTableNameToRussian(engTableName)
                    // fill arrays respectively
                    engTableNames.push(engTableName)
                    rusTableNames.push(russianTableName)
                    table_names_list.innerHTML += `<li>${russianTableName}</li>`
                }
            }

            for (const name of table_names_list.children) {

                name.addEventListener('click', () => {
                    placeholder_hot.rootElement.style.display = 'none'
                    const russianWordIndex = rusTableNames.indexOf(name.textContent)
                    if (russianWordIndex !== -1) {
                        constructTable(engTableNames[russianWordIndex])
                    } else {
                        console.log("didn't find eng version of table name:" + " " + name.textContent)
                    }
                })
            }
        })

}

const add_row_btn = document.querySelector('.add-row')
const remove_row_btn = document.querySelector('.remove-row')

async function constructTable(table_name) {
    fetch(`${host}/get-all-data-from-table?table=${table_name}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => response.json())
        .then(async data => {
            await getColumnNames(table_name)
                .then(col_names_array => {
                    formatDateToRULocale(data);
                    setTimeout(() => {
                        hot.updateSettings({
                            data: data,
                            colHeaders: col_names_array
                        })
                    }, 200);
                })
            await addEmptyRow(table_name)
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

            remove_row_btn.addEventListener('click', () => {
                hot.alter('remove_row', hot.countRows() - 1)
            })
        });
}

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
                    let element = column_names_response[key];
                    element = translateColumnNameIntoRussian(element)
                    column_names.push(element)
                } else throw new Error(`Object does not have property ${key}`)
            }
        })
    return column_names
}