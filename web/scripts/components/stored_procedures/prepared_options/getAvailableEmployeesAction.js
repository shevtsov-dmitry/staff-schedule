import {host} from "../../../configurations/HOST_SERVER";
import {fillLi, proceduresUl} from "../storedProcedures";

export function getAvailableEmployeesAction(){
    proceduresUl.children[3].addEventListener('click', () => {
        fillLi(proceduresUl.children[3], `${host}/get-available-employees`)
    })
}