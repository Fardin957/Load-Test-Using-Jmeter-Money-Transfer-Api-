/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.88235294117646, "KoPercent": 0.11764705882352941};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9944117647058823, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET commission-listing"], "isController": false}, {"data": [1.0, 500, 1500, "GET transaction-details "], "isController": false}, {"data": [1.0, 500, 1500, "GET search-user-by-id"], "isController": false}, {"data": [1.0, 500, 1500, " GET balance-check"], "isController": false}, {"data": [1.0, 500, 1500, "POST send-money-customer-to-customer"], "isController": false}, {"data": [1.0, 500, 1500, "POST commission-create"], "isController": false}, {"data": [1.0, 500, 1500, "withdraw-customer-to-agent"], "isController": false}, {"data": [1.0, 500, 1500, "GET search-user-by-email"], "isController": false}, {"data": [1.0, 500, 1500, "POST payment-customer-to-merchant "], "isController": false}, {"data": [1.0, 500, 1500, "POST admin-create-virtual-money"], "isController": false}, {"data": [1.0, 500, 1500, "GET system-virtual-balance"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.945, 500, 1500, "POST login"], "isController": false}, {"data": [0.96, 500, 1500, " POST user-create"], "isController": false}, {"data": [1.0, 500, 1500, " POST deposit-system-to-agent"], "isController": false}, {"data": [1.0, 500, 1500, " GET transaction-history"], "isController": false}, {"data": [1.0, 500, 1500, "GET user-list"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1700, 2, 0.11764705882352941, 114.11411764705892, 0, 1088, 74.5, 366.9000000000001, 431.9499999999998, 498.98, 27.961446100200664, 37.283507604074146, 15.991624544598507], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET commission-listing", 100, 0, 0.0, 79.00999999999999, 57, 151, 78.0, 92.0, 100.79999999999995, 150.7799999999999, 1.7574383578495985, 7.113849602818931, 1.094966476863324], "isController": false}, {"data": ["GET transaction-details ", 100, 0, 0.0, 64.08000000000003, 50, 128, 61.0, 79.9, 91.69999999999993, 127.8099999999999, 1.7484962931878585, 1.0654899286613513, 0.9835291649181703], "isController": false}, {"data": ["GET search-user-by-id", 100, 0, 0.0, 65.10000000000001, 52, 177, 61.5, 75.0, 85.79999999999995, 176.69999999999985, 1.709927841045108, 1.0520063865804863, 0.8583036233370952], "isController": false}, {"data": [" GET balance-check", 100, 0, 0.0, 66.08000000000001, 52, 319, 62.0, 77.0, 91.84999999999997, 316.8899999999989, 1.7099863201094392, 0.5601708116022572, 0.970216847640219], "isController": false}, {"data": ["POST send-money-customer-to-customer", 100, 0, 0.0, 90.91, 66, 162, 89.5, 100.0, 127.0999999999998, 161.98, 1.7525718992621673, 0.6058695823621164, 1.213450660719606], "isController": false}, {"data": ["POST commission-create", 100, 0, 0.0, 84.74, 66, 160, 82.0, 98.60000000000002, 110.94999999999999, 159.76999999999987, 1.7586746627741334, 0.857010406957317, 1.3241583642566963], "isController": false}, {"data": ["withdraw-customer-to-agent", 100, 0, 0.0, 82.09000000000003, 64, 116, 79.5, 97.9, 107.94999999999999, 115.94999999999997, 1.7514055029160902, 0.5934596498064697, 1.2143534248734609], "isController": false}, {"data": ["GET search-user-by-email", 100, 0, 0.0, 64.22000000000001, 51, 236, 60.0, 73.9, 95.5499999999999, 235.1899999999996, 1.710483553700631, 0.689872761404649, 0.8903200528539418], "isController": false}, {"data": ["POST payment-customer-to-merchant ", 100, 0, 0.0, 92.36000000000001, 69, 158, 91.5, 99.0, 106.84999999999997, 157.76999999999987, 1.7550325558539113, 0.6136101129363449, 1.211726579090542], "isController": false}, {"data": ["POST admin-create-virtual-money", 100, 0, 0.0, 76.41999999999999, 60, 256, 72.0, 87.80000000000001, 102.84999999999997, 255.07999999999953, 1.7601605266400295, 0.6067740877968071, 1.2255805229436925], "isController": false}, {"data": ["GET system-virtual-balance", 100, 0, 0.0, 67.75999999999996, 52, 195, 62.0, 85.0, 93.94999999999999, 194.32999999999964, 1.7622076937987912, 0.5644571519199253, 1.0686825955557122], "isController": false}, {"data": ["Debug Sampler", 100, 0, 0.0, 0.12000000000000005, 0, 4, 0.0, 0.0, 1.0, 3.9699999999999847, 1.7525718992621673, 1.4063704893180744, 0.0], "isController": false}, {"data": ["POST login", 100, 0, 0.0, 471.1400000000001, 388, 1088, 444.5, 555.0000000000002, 696.649999999999, 1086.5199999999993, 1.6788946157849671, 1.1411236841663448, 0.46235183755015696], "isController": false}, {"data": [" POST user-create", 100, 2, 2.0, 393.31000000000006, 63, 869, 382.5, 459.9000000000001, 496.84999999999997, 866.6699999999988, 1.7359604201024217, 0.874218817810954, 1.3425382182536238], "isController": false}, {"data": [" POST deposit-system-to-agent", 100, 0, 0.0, 79.54, 63, 155, 74.0, 99.60000000000002, 124.1499999999998, 155.0, 1.7506083363968978, 0.6086099294504841, 1.2069623881798925], "isController": false}, {"data": [" GET transaction-history", 100, 0, 0.0, 83.49999999999996, 62, 269, 79.5, 100.40000000000003, 122.39999999999986, 267.9899999999995, 1.746846941271006, 11.726835990724242, 1.01671950878664], "isController": false}, {"data": ["GET user-list", 100, 0, 0.0, 79.56, 58, 452, 71.0, 86.9, 127.6499999999997, 450.1399999999991, 1.7097816608819054, 9.286151463145655, 0.8465422871749277], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["422/Unprocessable Content", 2, 100.0, 0.11764705882352941], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1700, 2, "422/Unprocessable Content", 2, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [" POST user-create", 100, 2, "422/Unprocessable Content", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
