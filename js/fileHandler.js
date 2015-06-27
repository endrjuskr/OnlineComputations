function setFileHandler() {
    $("#fileLoader").change(function (evt) {
        handleFileSelect(evt);
    });
}

function handleFileSelect(evt) {
    var file = evt.target.files[0];

    if (!file.name.match('(.*).net')) {
        alert("We only accept PAJEK format.");
        return;
    }

    //initialize file reader
    var reader = new FileReader();
    reader.onload = (function (theFile) {
        return function (e) {
            var graphData = processData(e.target.result);
            globalGraph = new GraphMgr(graphData);
            globalGraph.draw(hideStartContent);
            hideTooltips();
            if (window._statusManager) {
                window._statusManager.next();
            }
        };
    })(file);
    reader.readAsText(file);
}

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var lines = new Array();
    var edge;
    var nodes = new Array();
    var params = allTextLines[0].split(" ");
    var nodesCount = parseInt(params[params.length - 1]);

    for (var i = 1; i <= nodesCount; ++i) {
        params = allTextLines[i].split(" ");
        var j = 0;
        while (params[j].length == 0) ++j;
        nodes.push([params[j], 1]);
    }

    for (var i = nodesCount + 2; i < allTextLines.length; ++i) {
        if (allTextLines[i].length == 0) {
            continue;
        }
        edge = allTextLines[i].split(' ');
        var j = 0;
        while (edge[j].length == 0) ++j;
        var k = j + 1;
        while (edge[k].length == 0) ++k;
        lines.push([edge[j].trim(), edge[k].trim()]);
    }

    var paramList = new Array();

    var nodesDataJson = getNodesDataAsJSON(nodes);
    var edgesDataJson = getEdgesDataAsJSON(lines);

    return {graph: {nodes: nodesDataJson, edges: edgesDataJson}, params: paramList};
}

function getNodesDataAsJSON(nodes) {
    var nodesDataJSON = [];
    for (var j = 0; j < nodes.length; ++j) {
        nodesDataJSON.push({data: {id: nodes[j][0], weight: nodes[j][1]}});
    }

    return nodesDataJSON;
}

function getEdgesDataAsJSON(lines) {
    var edgesDataJSON = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];
        edgesDataJSON.push({data: {id: "e" + i.toString(), source: line[0], target: line[1]}});
    }
    return edgesDataJSON;
}

function saveResultsAsCSV() {

    var textToWrite = "Node,";
    for (var i = 0; i < ResultJSON.length - 1; ++i) {
        var centralityMethod = ResultJSON[i];
        textToWrite += centralityMethod.title + ",";
    }
    // last centrality name
    textToWrite += ResultJSON[ResultJSON.length - 1].title + "\n";

    //for every node
    for (var i = 0; i < ResultJSON[0].values.length; ++i) {
        //node key
        textToWrite += ResultJSON[0].values[i].key + ",";
        //for every centrality method
        for (var j = 0; j < ResultJSON.length - 1; ++j)
            textToWrite += ResultJSON[j].values[i].value + ",";
        // last centrality value for given node
        textToWrite += ResultJSON[ResultJSON.length - 1].values[i].value + "\n";
    }

    var textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
    var downloadLink = document.createElement("a");
    downloadLink.download = "result.csv";
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    else {
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
}

function saveResultsAsTex() {

    var textToWrite = "\\begin{tabular}{| l ";
	for (var i = 0; i < ResultJSON.length; ++i)
		textToWrite +="| l ";	
	textToWrite +="|}\n\\hline\n";
	textToWrite +="Node & ";
    for (var i = 0; i < ResultJSON.length - 1; ++i) {
        var centralityMethod = ResultJSON[i];
        textToWrite += centralityMethod.title + " & ";
    }
    textToWrite += ResultJSON[ResultJSON.length - 1].title + " \\\\\n\\hline\n";

    for (var i = 0; i < ResultJSON[0].values.length; ++i) {
        textToWrite += ResultJSON[0].values[i].key + " & ";
        for (var j = 0; j < ResultJSON.length - 1; ++j)
            textToWrite += ResultJSON[j].values[i].value + " & ";
        textToWrite += ResultJSON[ResultJSON.length - 1].values[i].value + " \\\\\n";
    }
	textToWrite += "\\hline\n\\end{tabular}\n";

    var textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
    var downloadLink = document.createElement("a");
    downloadLink.download = "table.tex";
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    else {
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
}

var graphs = ['*Vertices 34\r\n\
1 "1"\r\n\
2 "2"\r\n\
3 "3"\r\n\
4 "4"\r\n\
5 "5"\r\n\
6 "6"\r\n\
7 "7"\r\n\
8 "8"\r\n\
9 "9"\r\n\
10 "10"\r\n\
11 "11"\r\n\
12 "12"\r\n\
13 "13"\r\n\
14 "14"\r\n\
15 "15"\r\n\
16 "16"\r\n\
17 "17"\r\n\
18 "18"\r\n\
19 "19"\r\n\
20 "20"\r\n\
21 "21"\r\n\
22 "22"\r\n\
23 "23"\r\n\
24 "24"\r\n\
25 "25"\r\n\
26 "26"\r\n\
27 "27"\r\n\
28 "28"\r\n\
29 "29"\r\n\
30 "30"\r\n\
31 "31"\r\n\
32 "32"\r\n\
33 "33"\r\n\
34 "34"\r\n\
*Edges\r\n\
1 2\r\n\
1 3\r\n\
2 3\r\n\
1 4\r\n\
2 4\r\n\
3 4\r\n\
1 5\r\n\
1 6\r\n\
1 7\r\n\
5 7\r\n\
6 7\r\n\
1 8\r\n\
2 8\r\n\
3 8\r\n\
4 8\r\n\
1 9\r\n\
3 9\r\n\
3 10\r\n\
1 11\r\n\
5 11\r\n\
6 11\r\n\
1 12\r\n\
1 13\r\n\
4 13\r\n\
1 14\r\n\
2 14\r\n\
3 14\r\n\
4 14\r\n\
6 17\r\n\
7 17\r\n\
1 18\r\n\
2 18\r\n\
1 20\r\n\
2 20\r\n\
1 22\r\n\
2 22\r\n\
24 26\r\n\
25 26\r\n\
3 28\r\n\
24 28\r\n\
25 28\r\n\
3 29\r\n\
24 30\r\n\
27 30\r\n\
2 31\r\n\
9 31\r\n\
1 32\r\n\
25 32\r\n\
26 32\r\n\
29 32\r\n\
3 33\r\n\
9 33\r\n\
15 33\r\n\
16 33\r\n\
19 33\r\n\
21 33\r\n\
23 33\r\n\
24 33\r\n\
30 33\r\n\
31 33\r\n\
32 33\r\n\
9 34\r\n\
10 34\r\n\
14 34\r\n\
15 34\r\n\
16 34\r\n\
19 34\r\n\
20 34\r\n\
21 34\r\n\
23 34\r\n\
24 34\r\n\
27 34\r\n\
28 34\r\n\
29 34\r\n\
30 34\r\n\
31 34\r\n\
32 34\r\n\
33 34',
'*vertices 62\r\n\
 1 "Beak"\r\n\
 2 "Beescratch"\r\n\
 3 "Bumper"\r\n\
 4 "CCL"\r\n\
 5 "Cross"\r\n\
 6 "DN16"\r\n\
 7 "DN21"\r\n\
 8 "DN63"\r\n\
 9 "Double"\r\n\
 10 "Feather"\r\n\
 11 "Fish"\r\n\
 12 "Five"\r\n\
 13 "Fork"\r\n\
 14 "Gallatin"\r\n\
 15 "Grin"\r\n\
 16 "Haecksel"\r\n\
 17 "Hook"\r\n\
 18 "Jet"\r\n\
 19 "Jonah"\r\n\
 20 "Knit"\r\n\
 21 "Kringel"\r\n\
 22 "MN105"\r\n\
 23 "MN23"\r\n\
 24 "MN60"\r\n\
 25 "MN83"\r\n\
 26 "Mus"\r\n\
 27 "Notch"\r\n\
 28 "Number1"\r\n\
 29 "Oscar"\r\n\
 30 "Patchback"\r\n\
 31 "PL"\r\n\
 32 "Quasi"\r\n\
 33 "Ripplefluke"\r\n\
 34 "Scabs"\r\n\
 35 "Shmuddel"\r\n\
 36 "SMN5"\r\n\
 37 "SN100"\r\n\
 38 "SN4"\r\n\
 39 "SN63"\r\n\
 40 "SN89"\r\n\
 41 "SN9"\r\n\
 42 "SN90"\r\n\
 43 "SN96"\r\n\
 44 "Stripes"\r\n\
 45 "Thumper"\r\n\
 46 "Topless"\r\n\
 47 "TR120"\r\n\
 48 "TR77"\r\n\
 49 "TR82"\r\n\
 50 "TR88"\r\n\
 51 "TR99"\r\n\
 52 "Trigger"\r\n\
 53 "TSN103"\r\n\
 54 "TSN83"\r\n\
 55 "Upbang"\r\n\
 56 "Vau"\r\n\
 57 "Wave"\r\n\
 58 "Web"\r\n\
 59 "Whitetip"\r\n\
 60 "Zap"\r\n\
 61 "Zig"\r\n\
 62 "Zipfel"\r\n\
*edges\r\n\
9 4\r\n\
10 6\r\n\
10 7\r\n\
11 1\r\n\
11 3\r\n\
14 6\r\n\
14 7\r\n\
14 10\r\n\
15 1\r\n\
15 4\r\n\
16 1\r\n\
17 15\r\n\
18 2\r\n\
18 7\r\n\
18 10\r\n\
18 14\r\n\
19 16\r\n\
20 2\r\n\
20 8\r\n\
21 9\r\n\
21 17\r\n\
21 19\r\n\
22 19\r\n\
23 18\r\n\
25 15\r\n\
25 16\r\n\
25 19\r\n\
26 18\r\n\
27 2\r\n\
27 26\r\n\
28 2\r\n\
28 8\r\n\
28 18\r\n\
28 26\r\n\
28 27\r\n\
29 2\r\n\
29 9\r\n\
29 21\r\n\
30 11\r\n\
30 19\r\n\
30 22\r\n\
30 25\r\n\
31 8\r\n\
31 20\r\n\
31 29\r\n\
32 18\r\n\
33 10\r\n\
33 14\r\n\
34 13\r\n\
34 15\r\n\
34 17\r\n\
34 22\r\n\
35 15\r\n\
35 34\r\n\
36 30\r\n\
37 2\r\n\
37 21\r\n\
37 24\r\n\
38 9\r\n\
38 15\r\n\
38 17\r\n\
38 22\r\n\
38 34\r\n\
38 35\r\n\
38 37\r\n\
39 15\r\n\
39 17\r\n\
39 21\r\n\
39 34\r\n\
40 37\r\n\
41 1\r\n\
41 8\r\n\
41 15\r\n\
41 16\r\n\
41 34\r\n\
41 37\r\n\
41 38\r\n\
42 2\r\n\
42 10\r\n\
42 14\r\n\
43 1\r\n\
43 3\r\n\
43 11\r\n\
43 31\r\n\
44 15\r\n\
44 30\r\n\
44 34\r\n\
44 38\r\n\
44 39\r\n\
45 3\r\n\
45 21\r\n\
45 35\r\n\
45 39\r\n\
46 9\r\n\
46 16\r\n\
46 19\r\n\
46 22\r\n\
46 24\r\n\
46 25\r\n\
46 30\r\n\
46 38\r\n\
47 44\r\n\
48 1\r\n\
48 11\r\n\
48 21\r\n\
48 29\r\n\
48 31\r\n\
48 43\r\n\
50 35\r\n\
50 47\r\n\
51 15\r\n\
51 17\r\n\
51 21\r\n\
51 34\r\n\
51 43\r\n\
51 46\r\n\
52 5\r\n\
52 12\r\n\
52 19\r\n\
52 22\r\n\
52 24\r\n\
52 25\r\n\
52 30\r\n\
52 46\r\n\
52 51\r\n\
53 15\r\n\
53 30\r\n\
53 39\r\n\
53 41\r\n\
54 44\r\n\
55 2\r\n\
55 7\r\n\
55 8\r\n\
55 14\r\n\
55 20\r\n\
55 42\r\n\
56 16\r\n\
56 52\r\n\
57 6\r\n\
57 7\r\n\
58 6\r\n\
58 7\r\n\
58 10\r\n\
58 14\r\n\
58 18\r\n\
58 40\r\n\
58 42\r\n\
58 49\r\n\
58 55\r\n\
59 39\r\n\
60 4\r\n\
60 9\r\n\
60 16\r\n\
60 37\r\n\
60 46\r\n\
61 33\r\n\
62 3\r\n\
62 38\r\n\
62 54\r\n\
',
'*Vertices    77\r\n\
       1 "Myriel"\r\n\
       2 "Napoleon"\r\n\
       3 "MlleBaptistine"\r\n\
       4 "MmeMagloire"\r\n\
       5 "CountessDeLo"\r\n\
       6 "Geborand"\r\n\
       7 "Champtercier"\r\n\
       8 "Cravatte"\r\n\
       9 "Count"\r\n\
      10 "OldMan"\r\n\
      11 "Labarre"\r\n\
      12 "Valjean"\r\n\
      13 "Marguerite"\r\n\
      14 "MmeDeR"\r\n\
      15 "Isabeau"\r\n\
      16 "Gervais"\r\n\
      17 "Tholomyes"\r\n\
      18 "Listolier"\r\n\
      19 "Fameuil"\r\n\
      20 "Blacheville"\r\n\
      21 "Favourite"\r\n\
      22 "Dahlia"\r\n\
      23 "Zephine"\r\n\
      24 "Fantine"\r\n\
      25 "MmeThenardier"\r\n\
      26 "Thenardier"\r\n\
      27 "Cosette"\r\n\
      28 "Javert"\r\n\
      29 "Fauchelevent"\r\n\
      30 "Bamatabois"\r\n\
      31 "Perpetue"\r\n\
      32 "Simplice"\r\n\
      33 "Scaufflaire"\r\n\
      34 "Woman1"\r\n\
      35 "Judge"\r\n\
      36 "Champmathieu"\r\n\
      37 "Brevet"\r\n\
      38 "Chenildieu"\r\n\
      39 "Cochepaille"\r\n\
      40 "Pontmercy"\r\n\
      41 "Boulatruelle"\r\n\
      42 "Eponine"\r\n\
      43 "Anzelma"\r\n\
      44 "Woman2"\r\n\
      45 "MotherInnocent"\r\n\
      46 "Gribier"\r\n\
      47 "Jondrette"\r\n\
      48 "MmeBurgon"\r\n\
      49 "Gavroche"\r\n\
      50 "Gillenormand"\r\n\
      51 "Magnon"\r\n\
      52 "MlleGillenormand"\r\n\
      53 "MmePontmercy"\r\n\
      54 "MlleVaubois"\r\n\
      55 "LtGillenormand"\r\n\
      56 "Marius"\r\n\
      57 "BaronessT"\r\n\
      58 "Mabeuf"\r\n\
      59 "Enjolras"\r\n\
      60 "Combeferre"\r\n\
      61 "Prouvaire"\r\n\
      62 "Feuilly"\r\n\
      63 "Courfeyrac"\r\n\
      64 "Bahorel"\r\n\
      65 "Bossuet"\r\n\
      66 "Joly"\r\n\
      67 "Grantaire"\r\n\
      68 "MotherPlutarch"\r\n\
      69 "Gueulemer"\r\n\
      70 "Babet"\r\n\
      71 "Claquesous"\r\n\
      72 "Montparnasse"\r\n\
      73 "Toussaint"\r\n\
      74 "Child1"\r\n\
      75 "Child2"\r\n\
      76 "Brujon"\r\n\
      77 "MmeHucheloup"\r\n\
*Edges\r\n\
   1   77    1\r\n\
   2   77    1\r\n\
   3   77    1\r\n\
   3    2    1\r\n\
   4   77    1\r\n\
   5   77    1\r\n\
   6   77    1\r\n\
   7   77    1\r\n\
   8   77    1\r\n\
   9   77    1\r\n\
  11   10    1\r\n\
  11    3    1\r\n\
  11    2    1\r\n\
  11   77    1\r\n\
  12   11    1\r\n\
  13   11    1\r\n\
  14   11    1\r\n\
  15   11    1\r\n\
  17   16    1\r\n\
  18   16    1\r\n\
  18   17    1\r\n\
  19   16    1\r\n\
  19   17    1\r\n\
  19   18    1\r\n\
  20   16    1\r\n\
  20   17    1\r\n\
  20   18    1\r\n\
  20   19    1\r\n\
  21   16    1\r\n\
  21   17    1\r\n\
  21   18    1\r\n\
  21   19    1\r\n\
  21   20    1\r\n\
  22   16    1\r\n\
  22   17    1\r\n\
  22   18    1\r\n\
  22   19    1\r\n\
  22   20    1\r\n\
  22   21    1\r\n\
  23   16    1\r\n\
  23   17    1\r\n\
  23   18    1\r\n\
  23   19    1\r\n\
  23   20    1\r\n\
  23   21    1\r\n\
  23   22    1\r\n\
  23   12    1\r\n\
  23   11    1\r\n\
  24   23    1\r\n\
  24   11    1\r\n\
  25   24    1\r\n\
  25   23    1\r\n\
  25   11    1\r\n\
  26   24    1\r\n\
  26   11    1\r\n\
  26   16    1\r\n\
  26   25    1\r\n\
  27   11    1\r\n\
  27   23    1\r\n\
  27   25    1\r\n\
  27   24    1\r\n\
  27   26    1\r\n\
  28   11    1\r\n\
  28   27    1\r\n\
  29   23    1\r\n\
  29   27    1\r\n\
  29   11    1\r\n\
  30   23    1\r\n\
  31   30    1\r\n\
  31   11    1\r\n\
  31   23    1\r\n\
  31   27    1\r\n\
  32   11    1\r\n\
  33   11    1\r\n\
  33   27    1\r\n\
  34   11    1\r\n\
  34   29    1\r\n\
  35   11    1\r\n\
  35   34    1\r\n\
  35   29    1\r\n\
  36   34    1\r\n\
  36   35    1\r\n\
  36   11    1\r\n\
  36   29    1\r\n\
  37   34    1\r\n\
  37   35    1\r\n\
  37   36    1\r\n\
  37   11    1\r\n\
  37   29    1\r\n\
  38   34    1\r\n\
  38   35    1\r\n\
  38   36    1\r\n\
  38   37    1\r\n\
  38   11    1\r\n\
  38   29    1\r\n\
  39   25    1\r\n\
  40   25    1\r\n\
  41   24    1\r\n\
  41   25    1\r\n\
  42   41    1\r\n\
  42   25    1\r\n\
  42   24    1\r\n\
  43   11    1\r\n\
  43   26    1\r\n\
  43   27    1\r\n\
  44   28    1\r\n\
  44   11    1\r\n\
  45   28    1\r\n\
  47   46    1\r\n\
  48   47    1\r\n\
  48   25    1\r\n\
  48   27    1\r\n\
  48   11    1\r\n\
  49   26    1\r\n\
  49   11    1\r\n\
  50   49    1\r\n\
  50   24    1\r\n\
  51   49    1\r\n\
  51   26    1\r\n\
  51   11    1\r\n\
  52   51    1\r\n\
  52   39    1\r\n\
  53   51    1\r\n\
  54   51    1\r\n\
  54   49    1\r\n\
  54   26    1\r\n\
  55   51    1\r\n\
  55   49    1\r\n\
  55   39    1\r\n\
  55   54    1\r\n\
  55   26    1\r\n\
  55   11    1\r\n\
  55   16    1\r\n\
  55   25    1\r\n\
  55   41    1\r\n\
  55   48    1\r\n\
  56   49    1\r\n\
  56   55    1\r\n\
  57   55    1\r\n\
  57   41    1\r\n\
  57   48    1\r\n\
  58   55    1\r\n\
  58   48    1\r\n\
  58   27    1\r\n\
  58   57    1\r\n\
  58   11    1\r\n\
  59   58    1\r\n\
  59   55    1\r\n\
  59   48    1\r\n\
  59   57    1\r\n\
  60   48    1\r\n\
  60   58    1\r\n\
  60   59    1\r\n\
  61   48    1\r\n\
  61   58    1\r\n\
  61   60    1\r\n\
  61   59    1\r\n\
  61   57    1\r\n\
  61   55    1\r\n\
  62   55    1\r\n\
  62   58    1\r\n\
  62   59    1\r\n\
  62   48    1\r\n\
  62   57    1\r\n\
  62   41    1\r\n\
  62   61    1\r\n\
  62   60    1\r\n\
  63   59    1\r\n\
  63   48    1\r\n\
  63   62    1\r\n\
  63   57    1\r\n\
  63   58    1\r\n\
  63   61    1\r\n\
  63   60    1\r\n\
  63   55    1\r\n\
  64   55    1\r\n\
  64   62    1\r\n\
  64   48    1\r\n\
  64   63    1\r\n\
  64   58    1\r\n\
  64   61    1\r\n\
  64   60    1\r\n\
  64   59    1\r\n\
  64   57    1\r\n\
  64   11    1\r\n\
  65   63    1\r\n\
  65   64    1\r\n\
  65   48    1\r\n\
  65   62    1\r\n\
  65   58    1\r\n\
  65   61    1\r\n\
  65   60    1\r\n\
  65   59    1\r\n\
  65   57    1\r\n\
  65   55    1\r\n\
  66   64    1\r\n\
  66   58    1\r\n\
  66   59    1\r\n\
  66   62    1\r\n\
  66   65    1\r\n\
  66   48    1\r\n\
  66   63    1\r\n\
  66   61    1\r\n\
  66   60    1\r\n\
  67   57    1\r\n\
  68   25    1\r\n\
  68   11    1\r\n\
  68   24    1\r\n\
  68   27    1\r\n\
  68   48    1\r\n\
  68   41    1\r\n\
  69   25    1\r\n\
  69   68    1\r\n\
  69   11    1\r\n\
  69   24    1\r\n\
  69   27    1\r\n\
  69   48    1\r\n\
  69   41    1\r\n\
  70   25    1\r\n\
  70   69    1\r\n\
  70   68    1\r\n\
  70   11    1\r\n\
  70   24    1\r\n\
  70   27    1\r\n\
  70   41    1\r\n\
  70   58    1\r\n\
  71   27    1\r\n\
  71   69    1\r\n\
  71   68    1\r\n\
  71   70    1\r\n\
  71   11    1\r\n\
  71   48    1\r\n\
  71   41    1\r\n\
  71   25    1\r\n\
  72   26    1\r\n\
  72   27    1\r\n\
  72   11    1\r\n\
  73   48    1\r\n\
  74   48    1\r\n\
  74   73    1\r\n\
  75   69    1\r\n\
  75   68    1\r\n\
  75   25    1\r\n\
  75   48    1\r\n\
  75   41    1\r\n\
  75   70    1\r\n\
  75   71    1\r\n\
  76   64    1\r\n\
  76   65    1\r\n\
  76   66    1\r\n\
  76   63    1\r\n\
  76   62    1\r\n\
  76   48    1\r\n\
  76   58    1\r\n\
',
    '*Vertices    0\r\n\
*Edges\r\n\
'
]