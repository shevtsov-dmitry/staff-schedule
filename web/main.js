import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

const host = 'http://localhost:3000'

const container = document.querySelector('#example');
const save_btn = document.querySelector('#save')
const add_row_btn = document.querySelector('.add-row')
const remove_row_btn = document.querySelector('.remove-row')

fetch(`${host}/api/data`)
  .then(response => response.json())
  .then(data => {

  // create table from fetch data
  let hot = new Handsontable(container, {
    data: data,
    rowHeaders: true,
    colHeaders: true,
    height: 'auto',
    licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
  });

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

    location.reload()
  })

});

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

function deleteSelectedRows(hot){
  let selectedRows = hot.getSelected()
  console.log(selectedRows)
  // // Extract the start and end row indexes from the selected rows object
  // var startRow = selectedRows[0];
  // var endRow = selectedRows[2];

  // // Calculate the number of rows to delete
  // var numRows = endRow - startRow + 1;

  // // Call the alter() method to delete the selected rows
  // hot.alter('remove_row', startRow, numRows);
}

