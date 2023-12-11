const nodemailer = require('nodemailer');
const axios = require('axios');
const {MAIL_CREDENTIALS} = require("../../configurations/MAIL_CREDENTIALS");

async function getXMLAndJSONReports() {
    const url = 'http://localhost:3000/download-report-in-format';
    const axiosResponseJSON = await axios.get(url + '?format=json');
    const JSONData = axiosResponseJSON.data
    const axiosResponseXML = await axios.get(url + '?format=xml')
    const XMLData = axiosResponseXML.data
    return [JSONData, XMLData]
}

function sendEmail (app){
    app.post('/send-email', async (req, res) => {
        const reports = await getXMLAndJSONReports();
        const transporter = nodemailer.createTransport({
            host: 'smtp.rambler.ru',
            port: 465,
            secure: true, // use SSL | true for 465, false for other ports
            auth: {
                user: MAIL_CREDENTIALS.MAIL,
                pass: MAIL_CREDENTIALS.PASSWORD
            }
        });

        const mailOptions = {
            from: MAIL_CREDENTIALS.MAIL,
            to: MAIL_CREDENTIALS.MAIL,
            subject: 'Отчёт по сменам сотрудников.',
            attachments: [
                {  filename: 'Отчёт.json',
                    content: JSON.stringify(reports[0]),
                    contentType: 'text/json'
                },
                {
                    filename: 'Отчёт.xml',
                    content: reports[1],
                    contentType: 'text/xml'
                }
            ]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send("Произошла ошибка при отправке письма на почту " +
                    `${MAIL_CREDENTIALS.MAIL}` + ".\n\n Подробности: " + error.toString());
            }
            res.status(200).send(`Email c отчётами был успешно отправлен на почту ${MAIL_CREDENTIALS.MAIL}`);
        })
    });
}
module.exports = {sendEmail}