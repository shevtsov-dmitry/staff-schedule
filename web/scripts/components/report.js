import Handsontable from "handsontable";
import {host} from "../configurations/hostServer";
import {
    choose_table_btn,
    placeholder_text,
    procedures_flex_view,
    show_procedures_button,
    table_names_list
} from "./table";

export function initReportComponent(){
    // compose report
    const reportComposeBtn = document.querySelector("#btn-report-employees-and-shifts")
    const reportTableDOM = document.querySelector('.report-table')
    const emailOperationsDiv = document.querySelector(".email-operations-div")
    const btnDownloadReport = document.querySelector('#download-report-btn')
    const ulDownloadFormats = document.querySelector('.ul-download-formats')
    const btnActivateTimer = document.querySelector("#btn-download-with-timer")
    const save_btn = document.querySelector('#save')

    let countTimesBtnDownloadReportClicked = 0
    btnDownloadReport.addEventListener('click', () => {
        countTimesBtnDownloadReportClicked++;
        if (countTimesBtnDownloadReportClicked < 2) {
            ulDownloadFormats.style.display = 'block'
        } else {
            ulDownloadFormats.style.display = 'none'
            countTimesBtnDownloadReportClicked = 0
        }
    })

    choose_table_btn.addEventListener('click', () => {
        placeholder_text.innerHTML = ""
        table_names_list.style.display = "flex"
    })

    show_procedures_button.addEventListener('click', () => {
        procedures_flex_view.style.display = 'flex'
    })



// this element needed for not to dupe report each time @reportComposeBtn pressed
    let reportBtnPressCounter = 0
    function displayAdditionalActionButtonsForReportBlock() {
        btnActivateTimer.style.display = 'block'
        emailOperationsDiv.style.display = 'flex'
    }
    reportComposeBtn.addEventListener('click', () => {
        // delete old table if pressed again
        if (reportBtnPressCounter === 1) {
            reportTableDOM.rootElement.style.display = 'none'
        }
        reportBtnPressCounter++

        displayAdditionalActionButtonsForReportBlock();

        fetch(`${host}/get-employees-names-and-their-shifts?time="09:00:00"`, {
            method: "GET",
            headers: {'Content-Type': 'application/json '},
        })
            .then(res => res.json())
            .then(data => {
                new Handsontable(reportTableDOM, {
                    data: data,
                    rowHeaders: true,
                    colHeaders: ["имя", "фамилия", "начало смены", "конец смены"],
                    height: 'auto',
                    licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
                })
                btnDownloadReport.style.display = "block"
            })
    })

    const downloadFile = (fileExtensionName) => {
        let url = "download-report-in-format?format="
        let fileName = ""
        if (fileExtensionName.includes("CSV")) {
            url += "csv"
            fileName = "отчет.csv"
        } else if (fileExtensionName.includes("TXT")) {
            url += "txt"
            fileName = "отчет.txt"

        } else if (fileExtensionName.includes("JSON")) {
            url += "json"
            fileName = "отчет.json"

        } else if (fileExtensionName.includes("XML")) {
            url += "xml"
            fileName = "отчет.xml"
        } else {
            url = ""
        }
        fetch(`${host}/${url}`, {
            method: "GET",
            headers: {'Content-Type': 'application/json '},
        })
            .then(res => res.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('File download failed:', error);
            });
    }

    for (let child of ulDownloadFormats.children) {
        child.addEventListener('click', () => {
            downloadFile(child.textContent)
        })
    }

// download with timer
    const timerInHtml = document.querySelector("#timer")

    let timesBtnActivateTimerWasClicked = 0
    btnActivateTimer.addEventListener("click", () => {
        if (timesBtnActivateTimerWasClicked < 1) {
            const updateEveryHowMuchSeconds = 15
            let countdown = updateEveryHowMuchSeconds
            setInterval(() => {
                updateCountdown()
            }, 1000);

            function updateCountdown() {
                timerInHtml.innerHTML = `${countdown}`;
                countdown--;
                if (countdown === -1) {
                    countdown = updateEveryHowMuchSeconds
                    downloadFile("XML")
                }
            }
        }
        timesBtnActivateTimerWasClicked++;

    })

    const mailStorage = document.querySelector('#storage-email-announcer')
    const mailSenderMessage = document.querySelector("#announce-message-on-email-send")
    const storageEmailAnnouncer = document.querySelector("#storage-email-announcer")
    const storageEmailShowBtn = document.querySelector("#storage-email-show-btn")
    const sendReportToEmailButton = document.querySelector("#send-report-to-email-btn")

    fetch(`${host}` + '/get-mail-storage')
        .then(response => response.text())
        .then(mailName => {
            mailStorage.textContent = mailName
        })

    function displayAndHideReceiverEmailAnnouncerOnClick() {
        if (storageEmailAnnouncer.style.display === "initial") {
            storageEmailAnnouncer.style.display = "none"
        } else {
            storageEmailAnnouncer.style.display = "initial"
        }
    }

    storageEmailShowBtn.addEventListener('click', () => {
        displayAndHideReceiverEmailAnnouncerOnClick();
    })

    function temporaryDisplayOperationStatusMessage(message) {
        mailSenderMessage.style.display = "initial"
        mailSenderMessage.textContent = message
        mailSenderMessage.addEventListener('click', ()=>{
            mailSenderMessage.style.display = "none"
        })
    }

    sendReportToEmailButton.addEventListener("click", () => {
        fetch(`${host}` + "/send-email", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.text())
            .then(answer => {
                temporaryDisplayOperationStatusMessage(answer)
            })
    })

    const getEmailDataBtn = document.querySelector("#get-email-data-btn")
    const xmlReportArticle = document.querySelector("#xml-report")
    const jsonReportArticle = document.querySelector("#json-report")

    getEmailDataBtn.addEventListener('click', () => {

        const xmlPlaceholder = document.querySelector("#XML-placeholder")
        const jsonPlaceholder = document.querySelector("#JSON-placeholder")
        xmlPlaceholder.style.display = "initial"
        jsonPlaceholder.style.display = "initial"
        fetch(`${host}` + "/get-data-from-email")
            .then(response => response.json())
            .then(data => {
                xmlReportArticle.innerText = stringifyXML(data.xml);
                jsonReportArticle.innerHTML = JSON.stringify(data.json)
            })
    })

    function stringifyXML(rawXML) {
        let string = rawXML
        string = string.replace("?>", "?>\n")
        string = string.replace("<root>", "<root>\n\t")
        string = string.replace("</shift_start_time>", "</shift_start_time>\n\t")
        string = string.replace("</shift_end_time>", "</shift_end_time>\n\t")
        string = string.replaceAll("</assigned_employee_list>", "</assigned_employee_list>\n\t")
        string = string.substring(0, string.length - 8)
        string += "</root>"
        return string
    }
}
