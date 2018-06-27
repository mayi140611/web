$(document).ready(OnLoad);
$(window).resize(OnSize);

function OnLoad() {
    $("#option a").each(function (i, b) {
        $(b).click(function () {
            var info = $(b).text();
            $("#condition").text(info);
        });
    });

    $("#checkedAll").click(function () {
        if (this.checked) {
            $("#t1 [name=sonChecked]").prop("checked", true);

        } else {
            $("#t1 [name=sonChecked]").prop("checked", false);
        }
        $("[name=sonChecked]:checkbox").click(function () {
            var flag = true;
            $("[name=sonChecked]:checkbox").each(function () {
                if (!this.checked) {
                    flag = false;
                }
            });
            $("#checkedAll").prop("checked", flag);
        });
    });
}

function OnSize() {
}

function OnScan() {

    var scanCode = Array();
    scanCode.push("708-20170606-01");
    scanCode.push("708-20170606-02");
    scanCode.push("708-20170606-03");
    scanCode.push("708-20170606-04");
    scanCode.push("708-20170606-05");
    scanCode.push("708-20170606-06");
    scanCode.push("708-20170606-07");

    var randomIndex = parseInt(Math.random() * 7, 10);
    var strCode = scanCode[randomIndex];

    alert(strCode);

    ScanCode(strCode);
}

function OnScanOut() {

    var scanCode = Array();
    scanCode.push("708-20170606-01");
    scanCode.push("708-20170606-02");
    scanCode.push("708-20170606-03");
    scanCode.push("708-20170606-04");
    scanCode.push("708-20170606-05");
    scanCode.push("708-20170606-06");
    scanCode.push("708-20170606-07");

    var randomIndex = parseInt(Math.random() * 7, 10);
    var strCode = scanCode[randomIndex];

    alert(strCode);

    ScanCodeOut(strCode);
}

function HandCode() {

    var strCode = $("#inScanCode")[0].value;
    ScanCode(strCode);
}

function ScanCode(strCode){

    $.post("json/goodsList!findItemByCode.action",
        {
            goodsId: strCode,
            planId: "20170606"
        },
        function (data) {

            //check scanned item in table, if same spec, increment num, else add new tr(table row)
            var bSameSpecIn = false;
            var rows = $("#ammo_body").find("tr");

            for(var i=0; i<rows.length; i++){
                var tds = rows.eq(i).children();
                var specId = tds.eq(4).text();
                if(specId == data.goodsList.munitionSpec.munitionSpecId) {
                    var specNum = parseInt(tds.eq(6).text(), 10);
                    tds.eq(6).text(specNum + 1);
                    bSameSpecIn = true;
                    break;
                }
            }

            var i = rows.length;
            if (!bSameSpecIn) {		//Add new row
                var txtHtml = "";
                txtHtml += '<tr>';
                txtHtml += '<td><input type="checkbox" checked /></td>';
                txtHtml += '<td>' + (i + 1) + '</td>';
                txtHtml += '<td>' + data.goodsList.planId + '</td>';
                txtHtml += '<td>' + data.goodsList.goodsId + '</td>';
                txtHtml += '<td>' + data.goodsList.munitionSpec.munitionSpecId + '</td>';
                txtHtml += '<td>' + data.goodsList.munitionSpec.munitionSpecName + '</td>';
                txtHtml += '<td>1</td>';
                txtHtml += '<td>' + data.goodsList.unit + '</td>';
                txtHtml += '<td>' + data.goodsList.depotId + '</td>';
                txtHtml += '<td>' + data.goodsList.storageId + '</td>';
                txtHtml += "<td>待入库</td>";
                txtHtml += "<td><a href='#lookmodal' data-toggle='modal' data-keyboard='false' data-backdrop='static'>取消</a>";
                txtHtml += "|<a  href='#changemodal' data-toggle='modal' data-keyboard='false' data-backdrop='static'>修改</a>";
                txtHtml += "</td>";
                txtHtml += "</tr>";
                $("#ammo_body").append(txtHtml);
            }
        });
}


function ScanCodeOut(strCode){

    $.post("json/goodsList!findItemByCode.action",
        {
            goodsId: strCode,
            planId: "20170606"
        },
        function (data) {

            //check scanned item in table, if same spec, increment num, else add new tr(table row)
            var bSameSpecIn = false;
            var rows = $("#ammo_body").find("tr");

            for(var i=0; i<rows.length; i++){
                var tds = rows.eq(i).children();
                var specId = tds.eq(4).text();
                if(specId == data.goodsList.munitionSpec.munitionSpecId) {
                    var specNum = parseInt(tds.eq(6).text(), 10);
                    tds.eq(6).text(specNum + 1);
                    bSameSpecIn = true;
                    break;
                }
            }

            var i = rows.length;
            if (!bSameSpecIn) {		//Add new row
                var txtHtml = "";
                txtHtml += '<tr>';
                txtHtml += '<td><input type="checkbox" checked /></td>';
                txtHtml += '<td>' + (i + 1) + '</td>';
                txtHtml += '<td>' + data.goodsList.planId + '</td>';
                txtHtml += '<td>' + data.goodsList.goodsId + '</td>';
                txtHtml += '<td>' + data.goodsList.munitionSpec.munitionSpecId + '</td>';
                txtHtml += '<td>' + data.goodsList.munitionSpec.munitionSpecName + '</td>';
                txtHtml += '<td>1</td>';
                txtHtml += '<td>' + data.goodsList.unit + '</td>';
                txtHtml += '<td>' + data.goodsList.depotId + '</td>';
                txtHtml += '<td>' + data.goodsList.storageId + '</td>';
                txtHtml += "<td>待出库</td>";
                txtHtml += "<td><a href='#lookmodal' data-toggle='modal' data-keyboard='false' data-backdrop='static'>取消</a>";
                txtHtml += "|<a  href='#changemodal' data-toggle='modal' data-keyboard='false' data-backdrop='static'>修改</a>";
                txtHtml += "</td>";
                txtHtml += "</tr>";
                $("#ammo_body").append(txtHtml);
            }
        });
}

function OnCabinIn(){

    var records = Array();
    var params = new Object();
    var munitionSpec= new Object();
    munitionSpec.munitionSpecId="";

    params.planId="";
    params.goodsId="";
    params.specId="";
    //params.munitionSpec=munitionSpec;
    params.unit="";
    params.depotId="";
    params.storageId="";
    params.orderId="";
    params.goodsType="";

    var rows = $("#ammo_body").find("tr");
    for(var i=0; i<rows.length; i++){
        var tds = rows.eq(i).children();
        if(tds.eq(0).children().eq(0)[0].value == "on"){
            params.planId=tds.eq(2).text();
            params.goodsId=tds.eq(3).text();
            params.specId=tds.eq(4).text();
            //munitionSpec.munitionSpecId=tds.eq(4).text();
            //params.munitionSpec=munitionSpec;
            params.specNum=parseInt(tds.eq(6).text(), 10);
            params.unit=tds.eq(7).text();
            params.depotId=tds.eq(8).text();
            params.storageId=tds.eq(9).text();
            params.orderId="";
            params.goodsType="";
            //records.push(params);

            $.post("json/goodsList!inCabinOne.action",
                {
                    planId: params.planId,
                    goodsId:params.goodsId,
                    specId:params.specId,
                    specNum:params.specNum,
                    unit:params.unit,
                    depotId:params.depotId,
                    storageId:params.storageId
                },
                function (data) {
                    if(data.actionStatus == "ok"){
                        //alert("incabin is ok");
                    }
                });
        }
    }
    // var paramsString=JSON.stringify(records);
    //
    // $.post("json/goodsList!inCabin.action",
    //     {
    //         //goodsListList: records
    //         //planId: "20170606"
    //         goingList: paramsString
    //     },
    //     function (data) {
    //         if(data.actionStatus == "ok"){
    //             alert("incabin is ok");
    //         }
    //     });
}
