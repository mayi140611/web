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
//全局变量：缓存此任务号
var gPlanId = "";
//全局变量：缓存此任务状态
var gPlanState = 0;

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
						
					//查找全部数据
					SearchAll();
					
				}
				else{
					alert("没有设定当前任务！");
					window.location.href="left.action?val=persontasklist";
					return;		
				}
			});
}

/**
 * 查找全部数据
 */
function SearchAll()
{
    //向后台发送服务请求和数据
    $.post("json/dyGoing!findItemByPlanId.action",
        {
            optionCode:"getAll",
			planId:gPlanId
        },
        function(data){

            if(data.actionStatus!="ok"){
                alert(data.msg);
                return;
            }
            $("#tblist_body").html("");

            // 创建分页
            var dataList=$(data.dyGoingVOList);
            if(dataList.length ==0){
                $("#Pagination").css("display","none");
                return;
            }
            else{
                $("#Pagination").css("display","");
            }
            $("#Pagination").pagination(dataList.length, {
                callback: function(page_index, jq){
                    $("#tblist_body").html("");
                    dataList.slice(page_index*10,(page_index+1)*10).each(tableBuild);
                    return false;
                },
            });
     });
}

/**
 * 查找数据，根据查找条件
 */
function OnSearch() {

    //条件检查
    var value=$("#txtSearch").val();
    if($("#btncondition").text()=="查找条件"){
        if(value == ""){
            SearchAll();
        }
        else {
            alert("请选择具体查找条件！");
        }
        return;
    }

    //根据查找条件得到Item
    var item = ""
    if($("#btncondition").text()=="波次号"){
        item="orderId";
    }
    else if($("#btncondition").text()=="弹药编码"){
        item="dyId";
    }
    else if($("#btncondition").text()=="弹药规格"){
        item="dySpecId";
    }
    else if($("#btncondition").text()=="规格数量"){
        item="specNum";
    }
    else if($("#btncondition").text()=="仓库编码"){
        item="depotId";
    }
    else if($("#btncondition").text()=="单位"){
        item="unit";
    }

    //向后台发送服务请求和数据
    $.post("json/dyGoing!findGoingByPlanIdAndItem.action",
        {
            optionCode:"getAll",
			planId:gPlanId,
            item:item,
            value:value
        },
        function(data){

            if(data.actionStatus!="ok"){
                alert(data.msg);
                return;
            }
            $("#tblist_body").html("");

            // 创建分页
            var dataList=$(data.dyGoingVOList);
            if(dataList.length ==0){
                $("#Pagination").css("display","none");
                return;
            }
            else{
                $("#Pagination").css("display","");
            }
            $("#Pagination").pagination(dataList.length, {
                callback: function(page_index, jq){
                    $("#tblist_body").html("");
                    dataList.slice(page_index*10,(page_index+1)*10).each(tableBuild);
                    return false;
                },
            });
        });
}

/**
 * 显示查找到的数据
 */
function tableBuild(i,value){

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
    txtHtml +="<tr id='"+value.id+"' style='"+ trstyle + "'>";
	currentPage = parseInt($("#Pagination option:selected").html());
    txtHtml +="<td>"+(i+1+(currentPage-1)*10)+"</td>";
    txtHtml +="<td>"+value.orderId+"</td>";
    txtHtml +="<td>"+value.dyId+"</td>";
    txtHtml +="<td>"+value.dySpecId+"</td>";
	
	var specNum=0;
	if(value.specNum != null){
		specNum = value.specNum;
	}
	txtHtml +="<td>"+specNum+"</td>";		
	
	if(value.storedNum == null){
		txtHtml +="<td>0</td>";				
	}
	else{
		if(value.storedNum > specNum){
			txtHtml +="<td style='color:red;'>"+value.storedNum+"</td>";								
		}
		else{
			txtHtml +="<td>"+value.storedNum+"</td>";					
		}
	}
	
    txtHtml +="<td>"+value.unit+"</td>";
	
	//进度条
	var goPercent = Math.round(value.storedNum / value.specNum * 10000) / 100.00 + "%";
	var txtTemp = "<div class='progress'><div class='progress-bar' role='progressbar' aria-valuenow='60' aria-valuemin='0' aria-valuemax='100' style='width:";
	txtTemp += goPercent+"'>";
	txtTemp += "<p class='text-right'>";
	txtTemp += goPercent+"</p></div></div>";
	
	txtHtml +="<td style='vertical-align:middle;'>"+txtTemp+"</td>";
    txtHtml +="</tr>";

    $("#tblist_body").append(txtHtml);
}

/**
 * 按下操作列中删除按钮，删除对应记录
 *
 */
function OnDeleteOne(recId)
{
    //删除确认信息
    if(!confirm("确定要删除选中的数据吗？")){
        return;
    }

    //向后台发送服务请求和数据
    $.post("json/dyGoing!delete.action",
        {
            optionCode:"delone",
            id:recId
        },
        function(data){
            if(data.actionStatus!="ok"){
                alert(data.msg);
                return;
            }
            OnSearch();
        });
}

/**
 * 按下删除按钮，执行删除操作
 *
 */
function OnDelete()
{
    var nToDel = 0;
    var toDelIds = "";
    var trs = $("#tblist_body").children();
    for(var i=0; i<trs.length; i++){
        var tds = trs.eq(i).children();
        //checkbox
        if(tds.eq(0).children().eq(0).prop("checked")){
            toDelIds += trs.eq(i).prop("id")+",";
            nToDel++;
        }
    }

    //没有要删除时，返回
    if(nToDel ==0){
        return;
    }

    //删除确认信息
    if(!confirm("确定要删除选中的数据吗？")){
        return;
    }

    //执行删除（多条记录）
    //向后台发送服务请求和数据
    $.post("json/dyGoing!deleteItems.action",
        {
            optionCode:"deleteitems",
            toDelIds:toDelIds
        },
        function(data){
            if(data.actionStatus!="ok"){
                alert(data.msg);
                return;
            }
            $("#checkedAll").prop("checked",false);
            OnSearch();
        });
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
    $.post("json/dyGoing!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#planId").val(data.dyGoing.planId);
                $("#orderId").val(data.dyGoing.orderId);
                $("#dyId").val(data.dyGoing.dyId);
                $("#dySpecId").val(data.dyGoing.dySpecId);
                $("#specNum").val(data.dyGoing.specNum);
                $("#boxCode").val(data.dyGoing.boxCode);
                $("#numInBox").val(data.dyGoing.numInBox);
                $("#depotId").val(data.dyGoing.depotId);
                $("#storageId").val(data.dyGoing.storageId);
                $("#unit").val(data.dyGoing.unit);
                $("#storeTime").val(data.dyGoing.storeTime.substr(0,10));
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
function OnUpdate(recId)
{
    gWorkMode = WORK_MODE_UPDATE;
    setControlsStatus(WORK_MODE_UPDATE);

    //向后台发送服务请求和数据
    $.post("json/dyGoing!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#planId").val(data.dyGoing.planId);
                $("#orderId").val(data.dyGoing.orderId);
                $("#dyId").val(data.dyGoing.dyId);
                $("#dySpecId").val(data.dyGoing.dySpecId);
                $("#specNum").val(data.dyGoing.specNum);
                $("#boxCode").val(data.dyGoing.boxCode);
                $("#numInBox").val(data.dyGoing.numInBox);
                $("#depotId").val(data.dyGoing.depotId);
                $("#storageId").val(data.dyGoing.storageId);
                $("#unit").val(data.dyGoing.unit);
                $("#storeTime").val(data.dyGoing.storeTime.substr(0,10));
                $("#modaldialog").modal("show");
                gCurId = recId;
            }
            else{
                alert(data.msg);
            }
        });

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

    if(!isValidInteger($("#numInBox").val())){
    	alert("箱内数量必须是整数");
    	$("#numInBox").focus();
    	return;
    }

    if(!isValidDate($("#storeTime").val())){
    	alert("出入库时间必须是日期");
    	$("#storeTime").focus();
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
    $.post("json/dyGoing!save.action",
        {
            optionCode:"addnew",
            planId:$("#planId").val(),
            orderId:$("#orderId").val(),
            dyId:$("#dyId").val(),
            dySpecId:$("#dySpecId").val(),
            specNum:$("#specNum").val(),
            boxCode:$("#boxCode").val(),
            numInBox:$("#numInBox").val(),
            depotId:$("#depotId").val(),
            storageId:$("#storageId").val(),
            unit:$("#unit").val(),
            storeTime:$("#storeTime").val(),
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
 * 执行修改（post更新请求和数据到后台）
 */
function Update()
{
    //向后台发送服务请求和数据
    $.post("json/dyGoing!update.action",
        {
            optionCode:"update",
            id:gCurId,
            planId:$("#planId").val(),
            orderId:$("#orderId").val(),
            dyId:$("#dyId").val(),
            dySpecId:$("#dySpecId").val(),
            specNum:$("#specNum").val(),
            boxCode:$("#boxCode").val(),
            numInBox:$("#numInBox").val(),
            depotId:$("#depotId").val(),
            storageId:$("#storageId").val(),
            unit:$("#unit").val(),
            storeTime:$("#storeTime").val(),
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
	$("#numInBox").val("");
	$("#depotId").val("");
	$("#storageId").val("");
	$("#unit").val("");
	$("#storeTime").val("");
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
		$("#planId").attr("disabled",false);
		$("#orderId").attr("disabled",false);
		$("#dyId").attr("disabled",false);
		$("#dySpecId").attr("disabled",false);
		$("#specNum").attr("disabled",false);
		$("#boxCode").attr("disabled",false);
		$("#numInBox").attr("disabled",false);
		$("#depotId").attr("disabled",false);
		$("#storageId").attr("disabled",false);
		$("#unit").attr("disabled",false);
		$("#storeTime").attr("disabled",false);
        $("#btnsave").text("保存");
		$("#modaltitle").text("添加进度状况");
	}
    else if(workMode == WORK_MODE_UPDATE){
		$("#planId").attr("disabled",false);
		$("#orderId").attr("disabled",false);
		$("#dyId").attr("disabled",false);
		$("#dySpecId").attr("disabled",false);
		$("#specNum").attr("disabled",false);
		$("#boxCode").attr("disabled",false);
		$("#numInBox").attr("disabled",false);
		$("#depotId").attr("disabled",false);
		$("#storageId").attr("disabled",false);
		$("#unit").attr("disabled",false);
		$("#storeTime").attr("disabled",false);
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改进度状况");
    }
    else if(workMode == WORK_MODE_VIEW){
		$("#planId").attr("disabled",true);
		$("#orderId").attr("disabled",true);
		$("#dyId").attr("disabled",true);
		$("#dySpecId").attr("disabled",true);
		$("#specNum").attr("disabled",true);
		$("#boxCode").attr("disabled",true);
		$("#numInBox").attr("disabled",true);
		$("#depotId").attr("disabled",true);
		$("#storageId").attr("disabled",true);
		$("#unit").attr("disabled",true);
		$("#storeTime").attr("disabled",true);
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看进度状况");
    }
}
