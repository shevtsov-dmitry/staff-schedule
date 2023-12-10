const Imap = require('imap');
const {MAIL_CREDENTIALS} = require("../../configurations/MAIL_CREDENTIALS");
const simpleParser = require('mailparser').simpleParser;

function getReportFromEmail(app) {
    const imap = new Imap({
        user: MAIL_CREDENTIALS.MAIL,
        password: MAIL_CREDENTIALS.PASSWORD,
        host: 'imap.rambler.ru',
        port: 993,
        tls: true,
        tlsOptions: {
            rejectUnauthorized: false,
        },
    });

    app.get("/get-data-from-email", (req, res) => {
        respondWithTopMailData(req, res);
    })

    function respondWithTopMailData(req, res) {
        function openInbox(cb) {
            imap.openBox('INBOX', true, cb);
        }

        imap.once('ready', () => {
            openInbox((err, box) => {
                if (err) res.send("Произошла ошибка: " + err);
                findResultsAndProceed(imap, res);
            });
        });
        printAdditionalLogInfo(imap);
        imap.connect();
    }
}

function findResultsAndProceed(imap, res) {
    imap.search(['ALL'], (searchErr, results) => {
        if (searchErr) throw searchErr;
        const latestEmail = results[results.length - 1];
        const fetch = imap.fetch(latestEmail, {bodies: ''});
        fetchOnMessage(fetch, res);
        fetch.once('end', () => {
            imap.end();
        });
    });
}

function composeBufferAnswer(stream, res) {
    let buffer = '';
    stream.on('data', (chunk) => {
        buffer += chunk.toString('utf8');
    });
    stream.once('end', () => {
        simpleParser(buffer, (parseErr, mail) => {
            if (parseErr) res.send("Произошла ошибка: " + parseErr)
            const answer = parseAnswer(mail);
            res.send(answer)
        });
    });
}

function fetchOnMessage(fetch, res) {
    fetch.on('message', (msg, seqno) => {
        msg.on('body', (stream, info) => {
            composeBufferAnswer(stream, res);
        });
    });
}

function parseAnswer(mail) {
    const jsonAttachment = mail.attachments.find((attachment) =>
        attachment.contentType.includes('json')
    );
    const xmlAttachment = mail.attachments.find((attachment) =>
        attachment.contentType.includes('xml')
    );
    const jsonData = JSON.parse(jsonAttachment.content.toString());
    const xmlData = xmlAttachment.content.toString();
    return {
        subject: mail.subject,
        from: mail.from.text,
        text: mail.text,
        html: mail.html,
        json: jsonData,
        xml: xmlData
    }
}

function printAdditionalLogInfo(imap) {
    imap.once('error', function (err) {
        console.log(err);
    });
    imap.once('end', function () {
        console.log('Connection ended');
    });
}


module.exports = {getReportFromEmail}