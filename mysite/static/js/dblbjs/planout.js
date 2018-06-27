/**
 * Js文件（DBLB）
 *Author:上海中船船舶设计技术国家工程研究中心有限公司
 *
 */
$(document).ready(OnLoad);

//工作模式（增、改、查、删）
var WORK_MODE_ADD = 1;
var WORK_MODE_UPDATE = 2;
var WORK_MODE_VIEW = 3;
var WORK_MODE_DELETE = 4;

//全局变量：缓存当前操作记录的id
var gCurId  = 0;
//全局变量：缓存当前操作模式
var gWorkMode = 0;
//全局变量：缓存此任务波次号
var gOrderIds = "";
//全局变量：缓存此任务号
var gPlanId = "";

var scanCodeArr = Array();


/**
 * 文档Ready，加载处理
 */
function OnLoad() {

    //查找条件事件处理
    $("#optionSearch a").each(function (i, b) {
        $(b).click(function () {
            var info = $(b).text();
            $("#btncondition").html(info+"<span class='caret'></span>");
        });
    });

    //列表选择框事件处理
    $("#checkedAll").click(function () {
        if (this.checked) {
            $("#tblinfo [name=sonChecked]").prop("checked", true);

        } else {
            $("#tblinfo [name=sonChecked]").prop("checked", false);
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
		
	
	//获取当前任务和状态信息
	getCurrentTaskState();

}

/**
 * 获取当前任务和状态信息
 *
 */
function getCurrentTaskState(){
	
	//通过Session值设置topbar
	$.post("json/plan!getItemsInSession.action",
			{
			},
			function(data){
				if(data.PLAN_ID!=null && data.PLAN_STATE!=null){
					gPlanId = data.PLAN_ID;
					if(data.PLAN_STATE == "7"){
						alert("当前任务已经完成！");
						window.location.href="left.action?val=persontasklist";
						return;								
					}
					else if(data.PLAN_STATE == "8"){
						alert("当前任务已经取消！");
						window.location.href="left.action?val=persontasklist";
						return;								
					}					
						
					//查找波次（上舰）
					SearchOrderInfo("1");
					
				}
				else{
					alert("没有设定当前任务！");
					window.location.href="left.action?val=persontasklist";
					return;		
				}
			});
}

/**
 * 查找波次号
 *
 */
function SearchOrderInfo(taskType){
	
	//查找波次信息
    $.post("json/orderList!findOrderByType.action",
        {
            optionCode:"getOrderInfo",
			planId:gPlanId,
			taskType:taskType
        },
        function(data){

            if(data.actionStatus!="ok"){
                alert("没有离舰波次任务11！");
				window.location.href="left.action?val=orderlist";
                return;
            }
			
			gOrderIds = "";
            $("#orderId").html("");
			var txtHtml="";
			
			for(var i=0; i<data.orderListList.length; i++){
				txtHtml +="<option value='" + data.orderListList[i].orderId +"'>" + data.orderListList[i].orderId +"</option>";	
				gOrderIds += "," + data.orderListList[i].orderId;
			}
			gOrderIds = gOrderIds.substring(1);
			$("#orderId").append(txtHtml);
			
			$("#planId").val(data.planId);

			//查找全部数据,仅仅测试用
			OnSearchAllCode("0");
			
     });		
	
}

/**
 * 查找所有箱码（模拟测试用）
 */
function OnSearchAllCode(taskType) {
	
	//仅仅测试用
    $.post("json/planInOut!findAllBoxWithOrder.action",
        {
            optionCode:"getAll",
			planId:gPlanId,
			toOrderIds:"1,3"
        },
        function(data){

            if(data.actionStatus!="ok"){
                alert(data.msg);
                return;
            }
            $("#tblist_body").html("");

            // 创建分页
            var dataList=$(data.dyListList);
			dataList.each(RandomCodeArray)	
     });

}
function RandomCodeArray(i, value){
	
	if(value.boxCode != null && value.boxCode != ""){
		scanCodeArr.push(value.boxCode);			
	}
}

/**
 * 手动输入扫描条码，查找对应数据
 */
function OnHandCode(){
    var strCode = $("#inScanCode").val()
	
	if(strCode == ""){
		return;
	}
	
    SearchByBoxCode(strCode);	
}

/**
 * 扫描条码，查找对应数据
 */
function OnScanCode() {
	
	var randomIndex = parseInt(Math.random() * scanCodeArr.length, 10);
    var strCode = scanCodeArr[randomIndex];

    alert(strCode);

    SearchByBoxCode(strCode);
}

/**
 * 从后台查找对应条码数据
 */
function SearchByBoxCode(strCode){
	
	//多次扫码Check
	var rows = $("#tblist_body").find("tr");
	for(var i=0; i<rows.length; i++){
		var tds = rows.eq(i).children();
		var boxCode = tds.eq(5).text();
		if(strCode == boxCode) {
			return;
		}
	}

    $.post("json/planInOut!findBoxInListAndStore.action",
        {
            boxCode: strCode,
			planId:gPlanId,
			toOrderIds:"1,3"
        },
        function (data) {
			
            if(data.actionStatus!="ok"){
                alert(data.msg +", 计划中不含此规格弹药！");
                return;
            }

            //check scanned item in table, if same spec, increment num, else add new tr(table row)
            var bSameSpecIn = false;

            var i = rows.length;
            if (!bSameSpecIn) {		//Add new row

				var trstyle="";
				if (i % 2 == 1)
				{
					trstyle = "background: #EFEFEF;";
				}
				else
				{
					trstyle = "background: #f5f5f5;";
				}
				
				var txtHtml = "";				
				txtHtml +="<tr id='"+data.dyList.id+"' style='"+ trstyle + "'>";
				txtHtml +="<td><input type='checkbox' name='sonChecked'/></td>";
				txtHtml +="<td>"+(i+1)+"</td>";
				//txtHtml +="<td>"+data.dyList.orderId+"</td>";
				txtHtml +="<td>"+gOrderIds.substring(0,1)+"</td>";
				txtHtml +="<td>"+data.dyList.dyId+"</td>";
				txtHtml +="<td>"+data.dyList.dySpecId+"</td>";
				txtHtml +="<td>"+data.dyList.boxCode+"</td>";
				txtHtml +="<td>"+data.dyList.numInBox+"</td>";
				
				txtHtml +="<td>"+data.dyList.depotId+"</td>";				
				if(data.dyList.depotArea != null){
					txtHtml +="<td id='" + data.dyList.depotArea.id + "'>"+data.dyList.depotArea.gridX+"-"+data.dyList.depotArea.gridY+"-"+data.dyList.depotArea.gridZ+"</td>";
				}
				else{
					txtHtml +="<td id='0'></td>";		
				}
				txtHtml +="<td>"+data.dyList.unit+"</td>";
				txtHtml +="<td id='"+data.dyList.id+"'>";
				txtHtml +="<a class='glyphicon glyphicon-pencil' style='margin-left:10px;' title='修改' href='javascript:void(0)' onclick='OnUpdate(this)'></a>";
				txtHtml +="<a class='glyphicon glyphicon-remove' style='margin-left:10px;' title='取消' href='javascript:void(0)' onclick='OnCancel(this)'></a>";
				txtHtml +="</td>";
				txtHtml +="</tr>";
                $("#tblist_body").append(txtHtml);
            }
        });
}

/**
 * 执行出库，写数据到数据库
 */
function OnCabinIn(){
	
    var nToIncabin = 0;
    var toIncabinIds = "";
	var rowsCabined = new Array();
    var trs = $("#tblist_body").children();
	var params = new Array();
	
    for(var i=0; i<trs.length; i++){
        var tds = trs.eq(i).children();
        //checkbox
        if(tds.eq(0).children().eq(0).prop("checked")){
            toIncabinIds += trs.eq(i).prop("id")+",";
            nToIncabin++;
			
			var param = new Object();
			param.planId=gPlanId;
			param.orderId=tds.eq(2).text();
			param.dyId=tds.eq(3).text();
			param.dySpecId=tds.eq(4).text();
			param.specNum=0;
			param.boxCode=tds.eq(5).text();
			param.boxNum=0;
			param.numInBox=tds.eq(6).text();
			param.depotId=tds.eq(7).text();
			param.storageId=tds.eq(8).prop("id");
			param.unit=tds.eq(9).text();
			params.push(param);
			rowsCabined.push(i);
        }
    }
	
    //没有要入库时，返回
    if(nToIncabin ==0){
        return;
    }
	var jsonParam = JSON.stringify(params);			
	//向后台发送服务请求和数据
	$.post("json/planInOut!outCabinOneByOne.action",
		{
			optionCode:"outCabinOneByOne",
			param:jsonParam
		},
		function(data){

			if(data.actionStatus == "ok"){
				
				var iRow = rowsCabined.pop();
				while(iRow != null){
					trs.remove(iRow);
					iRow = rowsCabined.pop();
				}
				
			}
			else{
				alert(data.msg);
			}
		});

}

/**
 * 按下取消按钮，取消对应记录
 *
 */
function OnCancel(thisObj)
{
    //确认信息
    if(!confirm("确定要取消此数据吗？")){
        return;
    }

	//$(thisObj).parent().parent().parent().html();
	
	//多次扫码Check
	var rows = $("#tblist_body").find("tr");
	//$(thisObj).parent().parent().remove();
	
	var iRowNum = parseInt($(thisObj).parent().parent().children().eq(1).text(),10)-1;
	rows.eq(iRowNum).remove();
	
	for(var i=iRowNum; i<rows.length; i++){
		var tds = rows.eq(i).children();
		tds.eq(1).text(parseInt(tds.eq(1).text())-1);
	}
}


/**
 * 按下添加按钮，弹出添加页面
 *
 */
function OnAddNew()
{
    //添加工作模式
    gWorkMode = WORK_MODE_ADD;
    setControlsStatus(WORK_MODE_ADD);

    $("#modaldialog").modal("show");
}

/**
 * 按下查看按钮，弹出查看页面
 *
 */
function OnView(recId)
{
    gWorkMode = WORK_MODE_VIEW;
    setControlsStatus(WORK_MODE_VIEW)

    //向后台发送服务请求和数据
    $.post("json/planIn!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#planId").val(data.planIn.planId);
                $("#orderId").val(data.planIn.orderId);
                $("#dyId").val(data.planIn.dyId);
                $("#dySpecId").val(data.planIn.dySpecId);
                $("#specNum").val(data.planIn.specNum);
                $("#boxCode").val(data.planIn.boxCode);
                $("#boxNum").val(data.planIn.boxNum);
                $("#numInBox").val(data.planIn.numInBox);
                $("#depotId").val(data.planIn.depotId);
                $("#storageId").val(data.planIn.storageId);
                $("#unit").val(data.planIn.unit);
                $("#modaldialog").modal("show");
            }
            else{
                alert(data.msg);
            }
        });
}

/**
 * 按下修改按钮，弹出修改页面
 *
 */
function OnUpdate(thisObj)
{
    gWorkMode = WORK_MODE_UPDATE;
    setControlsStatus(WORK_MODE_UPDATE);
	
    //读取本行数据
	var tds = $(thisObj).parent().parent().children();
	$("#rowNum").val(tds.eq(1).text());
	$("#orderId").val(tds.eq(2).text());
	$("#dyId").val(tds.eq(3).text());
	$("#dySpecId").val(tds.eq(4).text());
	//$("#specNum").val(data.planIn.specNum);
	$("#boxCode").val(tds.eq(5).text());
	//$("#boxNum").val(data.planIn.boxNum);
	$("#numInBox").val(tds.eq(6).text());
	$("#depotId").val(tds.eq(7).text());
	$("#storageId").val(tds.eq(8).text());
	$("#unit").val(tds.eq(9).text());
	$("#modaldialog").modal("show");
}

/**
 * 按下保存按钮
 */
function OnSave()
{
    //输入合法性检查
    if(!isValidInteger($("#orderId").val())){
    	alert("波次号必须是整数");
    	$("#orderId").focus();
    	return;
    }

    if(!isValidInteger($("#specNum").val())){
    	alert("规格数量必须是整数");
    	$("#specNum").focus();
    	return;
    }

    if(!isValidInteger($("#boxNum").val())){
    	alert("箱数必须是整数");
    	$("#boxNum").focus();
    	return;
    }

    if(!isValidInteger($("#numInBox").val())){
    	alert("箱内数量必须是整数");
    	$("#numInBox").focus();
    	return;
    }


	if(gWorkMode == WORK_MODE_ADD){
		AddNew();
	}
    else if(gWorkMode == WORK_MODE_UPDATE){
        Update();
    }
    else if(gWorkMode == WORK_MODE_VIEW){
        $("#modaldialog").modal("hide");
    }

}

/**
 * 执行添加（post添加请求和数据到后台）
 */
function AddNew()
{
    //向后台发送服务请求和数据
    $.post("json/planIn!save.action",
        {
            optionCode:"addnew",
            planId:$("#planId").val(),
            orderId:$("#orderId").val(),
            dyId:$("#dyId").val(),
            dySpecId:$("#dySpecId").val(),
            specNum:$("#specNum").val(),
            boxCode:$("#boxCode").val(),
            boxNum:$("#boxNum").val(),
            numInBox:$("#numInBox").val(),
            depotId:$("#depotId").val(),
            storageId:$("#storageId").val(),
            unit:$("#unit").val(),
        },
        function(data){

            if(data.actionStatus == "ok"){
				$("#modaldialog").modal("hide");
                OnSearch();
            }
            else{
                alert(data.msg);
            }
        });
}

/**
 * 执行修改
 */
function Update()
{
    更新本行数据
	var iRowNum = parseInt($("#rowNum").val())-1;
	var rows = $("#tblist_body").find("tr");
	var tds = rows.eq(iRowNum);
	tds.eq(6).text($("#numInBox").val());
	tds.eq(7).text($("#depotId").val());
	tds.eq(8).text($("#storageId").val());
	tds.eq(9).text($("#unit").val());
}

/**
 * 清空输入内容
 */
function clearContents()
{
	$("#planId").val("");
	$("#orderId").val("");
	$("#dyId").val("");
	$("#dySpecId").val("");
	$("#specNum").val("");
	$("#boxCode").val("");
	$("#boxNum").val("");
	$("#numInBox").val("");
	$("#depotId").val("");
	$("#storageId").val("");
	$("#unit").val("");
}

/**
 * 设置编辑页面控件状态
 *
 */
function setControlsStatus(workMode)
{
    //清空内容
    clearContents();

    //设置空间状态（可用/不可用）
	if(workMode == WORK_MODE_ADD){
		$("#rowNum").attr("disabled",true);
		$("#orderId").attr("disabled",true);
		$("#dyId").attr("disabled",true);
		$("#dySpecId").attr("disabled",true);
		$("#specNum").attr("disabled",true);
		$("#boxCode").attr("disabled",true);
		$("#boxNum").attr("disabled",false);
		$("#numInBox").attr("disabled",false);
		$("#depotId").attr("disabled",false);
		$("#storageId").attr("disabled",false);
		$("#unit").attr("disabled",false);
        $("#btnsave").text("保存");
		$("#modaltitle").text("添加计划入库");
	}
    else if(workMode == WORK_MODE_UPDATE){
		$("#rowNum").attr("disabled",true);
		$("#orderId").attr("disabled",true);
		$("#dyId").attr("disabled",true);
		$("#dySpecId").attr("disabled",true);
		$("#specNum").attr("disabled",true);
		$("#boxCode").attr("disabled",true);
		$("#boxNum").attr("disabled",false);
		$("#numInBox").attr("disabled",false);
		$("#depotId").attr("disabled",false);
		$("#storageId").attr("disabled",false);
		$("#unit").attr("disabled",false);
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改计划入库");
    }
    else if(workMode == WORK_MODE_VIEW){
		$("#rowNum").attr("disabled",true);
		$("#orderId").attr("disabled",true);
		$("#dyId").attr("disabled",true);
		$("#dySpecId").attr("disabled",true);
		$("#specNum").attr("disabled",true);
		$("#boxCode").attr("disabled",true);
		$("#boxNum").attr("disabled",true);
		$("#numInBox").attr("disabled",true);
		$("#depotId").attr("disabled",true);
		$("#storageId").attr("disabled",true);
		$("#unit").attr("disabled",true);
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看计划入库");
    }
}
