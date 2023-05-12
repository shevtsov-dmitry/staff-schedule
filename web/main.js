import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

const host = 'http://localhost:3000'

const container = document.querySelector('#example');
const add_row_btn = document.querySelector('.add-row')

fetch(`${host}/api/data`)
  .then(response => response.json())
  .then(data => {

  // create table from fetch data
  const hot = new Handsontable(container, {
    data: data,
    rowHeaders: true,
    colHeaders: true,
    height: 'auto',
    licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
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

});