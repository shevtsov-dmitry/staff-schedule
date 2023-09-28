const {Parser} = require("@json2csv/plainjs");

function downloadCSVReport(app, client){
    app.get('/get-csv-report', (req, res) => {
        const QUERY = "SELECT * FROM show_employees_shifts"
        client.query(QUERY, (err, result) => {

            // parse JSON database data into CSV
            const opts = {};
            const parser = new Parser(opts);
            const csv = parser.parse(result.rows);

            // Set the headers to indicate it's a CSV file download
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="report.csv"');

            // Send the CSV data as the response
            res.send(csv);
        })

    })
}

module.exports = {downloadCSVReport}