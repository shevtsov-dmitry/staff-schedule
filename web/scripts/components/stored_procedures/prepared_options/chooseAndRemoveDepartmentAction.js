import {host} from "../../../configurations/HOST_SERVER";
import {chooseAndRemoveDepartment, fillLi, proceduresUl} from "../storedProcedures";

function fetchRequestToDeleteDepartment(id) {
    return new Promise(resolve => {
        fetch(`${host}/delete-dep?id=${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id})
        }).then(()=>resolve())
    })
}

async function sendRequestToDeleteDepartment() {
    for (let child of chooseAndRemoveDepartment.children) {
        child.addEventListener('click', () => {
            const id = child.innerHTML.replaceAll(/[^\d]/g, "")
            fetchRequestToDeleteDepartment(id);
        })
    }
}

export function chooseAndRemoveDepartmentAction() {
    proceduresUl.children[1].addEventListener('click', async () => {
        await fillLi(proceduresUl.children[1], `${host}/get-department-names`)
        await sendRequestToDeleteDepartment();
    })
}