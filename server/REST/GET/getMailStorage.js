const {MAIL_CREDENTIALS} = require("../../configurations/MAIL_CREDENTIALS");

function getMailStorage(app){
    app.get("/get-mail-storage", (req, res)=> {
        res.send(MAIL_CREDENTIALS.MAIL)
    })
}
module.exports = {getMailStorage}