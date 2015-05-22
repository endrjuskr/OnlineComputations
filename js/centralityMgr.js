var testData = [
    {
        title: "metoda1",
        values: [
            {
                key: "a",
                value: "12"
            },
            {
                key: "b",
                value: "22"
            }
        ]
    },

    {
        title: "metoda2",
        values: [
            {
                key: "b",
                value: "122"
            },
            {
                key: "c",
                value: "32"
            }
        ]
    }
];

function getResultTable(resultDataJSON) {

    resultDataJSON = testData;
    var tableHTML = "";
    for (var i = 0; i < resultDataJSON.length; ++i) {
        var centralityMethod = resultDataJSON[i];
        tableHTML += "<table>";
        tableHTML += "<caption>" + centralityMethod.title + "</caption>";
        for (var j = 0; j < centralityMethod.values.length; ++j) {
            var centralityResult = centralityMethod.values[j];
            tableHTML += "<tr>";
            tableHTML += "<td>" + centralityResult.key + "</td>";
            tableHTML += "<td>" + centralityResult.value + "</td>";
            tableHTML += "</tr>"
        }
        tableHTML += "</table>";
    }

    $("#resultTable").html(tableHTML);
}