import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

const host = 'http://localhost:3000'

const container = document.querySelector('#example');
const save_btn = document.querySelector('#save')
const add_row_btn = document.querySelector('.add-row')
const remove_row_btn = document.querySelector('.remove-row')

await retrieveAllDataFromTable()

async function retrieveAllDataFromTable(){
  fetch(`${host}/api/data`)
  .then(response => response.json())
  .then(async data => {
  
  // create table from fetch data
  let hot = new Handsontable(container, {
    data: data,
    rowHeaders: false,
    colHeaders: [],
    height: 'auto',
    licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
  });

  getColumnNames().then(col_names_array => {
    hot.updateSettings({
      colHeaders: col_names_array
    })
  })
  // preset send all data from table
  // save_btn.addEventListener('click',()=>{
  //   console.log(hot.getData())
  //   const data = hot.getData()
  //   const xhr = new XMLHttpRequest()
  //   xhr.open('POST', 'http://localhost:3000/saveData')
  //   xhr.setRequestHeader('Content-Type', 'application/json')
  //   xhr.send(JSON.stringify(data))
  // })

  // REMOVE selected rows
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

// add new empty row
add_row_btn.addEventListener('click',()=>{
  fetch(`${host}/add-empty-row`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  location.reload()
});

// get column names
async function getColumnNames(){
  let columns_names_array = []
  fetch(`${host}/get-column-names`,{
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


