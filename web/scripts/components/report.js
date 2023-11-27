import Handsontable from "handsontable";
import {host} from "../configurations/HOST_SERVER";

const btnDownloadReport = document.querySelector('#download-report-btn')
const btnActivateTimer = document.querySelector("#btn-download-with-timer")

function email() {
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
        const condition = storageEmailAnnouncer.style.display === "initial"
        storageEmailAnnouncer.style.display = condition ? "none" : "initial"
    }

    storageEmailShowBtn.addEventListener('click', () => {
        displayAndHideReceiverEmailAnnouncerOnClick();
    })

    function displayOperationStatusMessage(message) {
        const hideOnClick = () => mailSenderMessage.addEventListener('click', () => {
            mailSenderMessage.style.display = "none"
        })

        mailSenderMessage.style.display = "initial"
        mailSenderMessage.textContent = message
        hideOnClick();

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
                displayOperationStatusMessage(answer)
            })
    })

    const getEmailDataBtn = document.querySelector("#get-email-data-btn")
    const xmlReportArticle = document.querySelector("#xml-report")
    const jsonReportArticle = document.querySelector("#json-report")

    getEmailDataBtn.addEventListener('click', () => {
        displayContentNameHeaders();
        fetch(`${host}` + "/get-data-from-email")
            .then(response => response.json())
            .then(data => {
                xmlReportArticle.innerText = stringifyXML(data.xml);
                jsonReportArticle.innerHTML = JSON.stringify(data.json)
            })
        function displayContentNameHeaders() {
            const xmlPlaceholder = document.querySelector("#XML-placeholder")
            const jsonPlaceholder = document.querySelector("#JSON-placeholder")
            xmlPlaceholder.style.display = "initial"
            jsonPlaceholder.style.display = "initial"
        }
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

function downloadReport() {
    const ulDownloadFormats = document.querySelector('.ul-download-formats')

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
}

function displayAdditionalActionButtonsForReportBlock() {
    const emailOperationsDiv = document.querySelector(".email-operations-div")
    btnActivateTimer.style.display = 'block'
    emailOperationsDiv.style.display = 'flex'
}

function fetchShiftScheduleReport(reportTableDOM) {
    function createNewReportTable(data) {
        return new Handsontable(reportTableDOM, {
            data: data,
            rowHeaders: true,
            colHeaders: ["имя", "фамилия", "начало смены", "конец смены"],
            height: 'auto',
            licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
        })
    }

    fetch(`${host}/get-employees-names-and-their-shifts?time="09:00:00"`, {
        method: "GET",
        headers: {'Content-Type': 'application/json '},
    })
        .then(res => res.json())
        .then(data => {
            createNewReportTable(data);
            btnDownloadReport.style.display = "block"
        })
}

function displayReport() {
    const reportTableDOM = document.querySelector('.report-table')
    const reportComposeBtn = document.querySelector("#btn-report-employees-and-shifts")

    let isReportBtnPressedOnce = false
    reportComposeBtn.addEventListener('click', () => {
        if(!isReportBtnPressedOnce){
            fetchShiftScheduleReport(reportTableDOM)
        }
        displayAdditionalActionButtonsForReportBlock();
        isReportBtnPressedOnce = true
    })
}

export async function initReportComponent() {
    displayReport();
    downloadReport();
    email();
}
