import 'handsontable/dist/handsontable.full.min.css';
import {initStoredProceduresComponent} from "./components/stored_procedures";
import {initReportComponent} from "./components/report";
import {initTable} from "./components/table";

await initTable()
initStoredProceduresComponent()
initReportComponent()