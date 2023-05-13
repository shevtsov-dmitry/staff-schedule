import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

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
const table_names_list = document.querySelector('.table-names-list')

async function main(){

  // *1. get all table names
  table_names_list.innerHTML = "";
  fetch(`${host}/get-table-names`, {
    method: "GET",
    headers: {'Content-Type' : 'application/json '},
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
      name.addEventListener('click', ()=> {
        constructTable(name.textContent)
      })
    }
    
  })
}

const save_btn = document.querySelector('#save')
const add_row_btn = document.querySelector('.add-row')
const remove_row_btn = document.querySelector('.remove-row')

async function constructTable(table_name){
  fetch(`${host}/get-all-data-from-table?table=${table_name}`,{
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  })
  .then(response => response.json())
  .then(async data => {
  // TODO fix hardcoded "department table"
  await getColumnNames(table_name)
  .then(col_names_array => {
    // add data and column headers to table
    setTimeout(() => {
      hot.updateSettings({
        data: data,
        colHeaders: col_names_array
      })  
    }, 200);
    
  })
  // TODO save all, which was chanded by user in table
  // preset send all data from table
  // save_btn.addEventListener('click',()=>{
  //   const data = hot.getData()
  //   const xhr = new XMLHttpRequest()
  //   xhr.open('POST', 'http://localhost:3000/saveData')
  //   xhr.setRequestHeader('Content-Type', 'application/json')
  //   xhr.send(JSON.stringify(data))
  // })

  // * REMOVE selected rows
  let selectedRows = [];
  remove_row_btn.addEventListener("mouseenter",  () => {
    selectedRows = hot.getSelected()
  });
  remove_row_btn.addEventListener('click', ()=>{
    deleteSelectedRows(selectedRows)
    location.reload()
  })
});
}

function deleteSelectedRows(selectedRows){
  // define and send two id values. between them content will be removed 
  let start_row = selectedRows[0][0]
  let end_row = selectedRows[0][2]
  let id_value_start = hot.getDataAtCell(start_row,0)
  let id_value_end = hot.getDataAtCell(end_row,0)
  let array_to_send = [id_value_start,id_value_end]

  fetch(`${host}/delete-selected-rows`,{
    method: 'POST',
    headers: {'Content-Type' : 'application/json '},
    body: JSON.stringify(array_to_send)
  })
}

// add new empty row
async function addEmptyRow(table_name){
  add_row_btn.addEventListener('click',()=>{
    fetch(`${host}/add-empty-row?table=${table_name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    hot.alter('insert_row_below', hot.countRows())
  });
}

// get column names
async function getColumnNames(table_name){
  let columns_names_array = []
  fetch(`${host}/get-column-names?table=${table_name}`,{
    method: 'GET',
    headers: {'Content-Type' : 'application/json '},
  })
  .then(response => response.json())
  .then(columns_names_object => {
    for (const key in columns_names_object) {
      if (Object.hasOwnProperty.call(columns_names_object, key)) {
        const element = columns_names_object[key];
        columns_names_array.push(element.column_name)
      }
      else throw new Error(`Object does not have property ${key}`)
    }
  })
  return columns_names_array
}


await main()