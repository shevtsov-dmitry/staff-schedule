import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

const container = document.querySelector('#example');

const save_btn = document.querySelector('#save')

fetch('http://localhost:3000/api/data')
  .then(response => response.json())
  .then(data => {
    const hot = new Handsontable(container, {
      data: data,
      rowHeaders: true,
      colHeaders: true,
      height: 'auto',
      licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
    });
  });