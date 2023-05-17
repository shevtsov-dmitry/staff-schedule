import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

// * placeholder table 
const placeholder_table = document.querySelector('.placeholder-table')
let placeholder_hot = new Handsontable(placeholder_table, {
  data: [['','','','','','','',''],
         ['','','','','','','',''],
         ['','','','','','','','']],
  rowHeaders: true,
  colHeaders: true,
  height: 'auto',
  licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
})
const choose_table_btn = document.querySelector('.choose-table')
const placeholder_text = document.querySelector('.placeholder-text')
const table_names_list = document.querySelector('.table-names-list')

choose_table_btn.addEventListener('click', ()=>{
  placeholder_text.innerHTML = ""
  table_names_list.style.display = "flex"
})

// show stored procedures
const show_procedures_button = document.querySelector('.use-procedure')
const procedures_ul = document.querySelector('.procedures-ul')
show_procedures_button.addEventListener('click', ()=>{
  procedures_ul.style.display = 'initial'
})


// * actual table 
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
  // *1. get all table names
  table_names_list.innerHTML = "";
  fetch(`${host}/get-table-names`, {
    method: "GET",
    headers: { 'Content-Type': 'application/json ' },
  })
    .then(response => response.json())
    .then(data => {

      // *2. show recieved data as list
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

async function constructTable(table_name) {
  fetch(`${host}/get-all-data-from-table?table=${table_name}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .then(async data => {
      await getColumnNames(table_name)
        .then(col_names_array => {
          console.log(col_names_array)
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
      // TODO save all, which was chanded by user in table
      // preset send all data from table
      // save_btn.addEventListener('click',()=>{
      //   const data = hot.getData()
      //   const xhr = new XMLHttpRequest()
      //   xhr.open('POST', 'http://localhost:3000/saveData')
      //   xhr.setRequestHeader('Content-Type', 'application/json')
      //   xhr.send(JSON.stringify(data))
      // })

      // * ADD new empty row
      async function addEmptyRow(table_name) {
        add_row_btn.addEventListener('click', () => {
          fetch(`${host}/add-empty-row?table=${table_name}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          hot.alter('insert_row_below', hot.countRows())
        });
      }
      // * REMOVE selected rows
      let selectedRows = [];
      remove_row_btn.addEventListener("mouseenter", () => {
        selectedRows = hot.getSelected()
      });
      remove_row_btn.addEventListener('click', () => {
        deleteSelectedRows(selectedRows)
        location.reload()
      })
    });
}

function deleteSelectedRows(selectedRows) {
  // define and send two id values. between them content will be removed 
  let start_row = selectedRows[0][0]
  let end_row = selectedRows[0][2]
  let id_value_start = hot.getDataAtCell(start_row, 0)
  let id_value_end = hot.getDataAtCell(end_row, 0)
  let array_to_send = [id_value_start, id_value_end]

  fetch(`${host}/delete-selected-rows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json ' },
    body: JSON.stringify(array_to_send)
  })
}

// get column names
async function getColumnNames(table_name) {
  let column_names = [];
  fetch(`${host}/get-column-names?table=${table_name}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json ' },
  })
    .then(response => response.json())
    .then(column_names_response => {
      for (const key in column_names_response) {
        if (Object.hasOwnProperty.call(column_names_response, key)) {
          const element = column_names_response[key];
          column_names.push(element)
        }
        else throw new Error(`Object does not have property ${key}`)
      }
    })
    return column_names
}

await main()