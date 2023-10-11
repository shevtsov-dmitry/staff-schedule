const {Parser} = require("@json2csv/plainjs");

function downloadTXTreport(app, client) {
    app.get('/get-txt-report', (req, res) => {
        const QUERY = 'SELECT * FROM show_employees_shifts';
        client.query(QUERY, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            // Convert the query result to an array of objects
            const data = result.rows;

            // Convert the data to a custom text format with "|" delimiters
            const textData = data.map((row) => {
                return `${row.first_name}|${row.last_name}|${row.shift_start_time}|${row.shift_end_time}`;
            }).join('\n');

            // Set the headers to indicate it's a text file download
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', 'attachment; filename="report.txt"');

            // Send the text data as the response
            res.send(textData);
        });
    });
}

module.exports = {downloadTXTreport}