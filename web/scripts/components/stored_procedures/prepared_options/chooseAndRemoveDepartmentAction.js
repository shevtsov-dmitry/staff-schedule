import {host} from "../../../configurations/HOST_SERVER";
import {chooseAndRemoveDepartment, fillLi, proceduresUl} from "../storedProcedures";

export function chooseAndRemoveDepartmentAction(){
    proceduresUl.children[1].addEventListener('click', () => {
        fillLi(proceduresUl.children[1], `${host}/get-department-names`)

        setTimeout(() => {
            for (let child of chooseAndRemoveDepartment.children) {
                child.addEventListener('click', () => {
                    const id = child.innerHTML.replaceAll(/[^\d]/g, "")
                    fetch(`${host}/delete-dep?id=${id}`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({id: id})
                    }).then(() => {
                    })
                })
            }
        }, 200)
    })
}