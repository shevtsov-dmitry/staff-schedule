import 'handsontable/dist/handsontable.full.min.css';
import {initStoredProceduresComponent} from "./components/stored_procedures/storedProcedures";
import {initReportComponent} from "./components/report";
import {initTable} from "./components/table";

await initTable()
await initStoredProceduresComponent()
await initReportComponent()