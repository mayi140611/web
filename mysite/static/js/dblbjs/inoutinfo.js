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

    //查找全部数据
    SearchAll();
}

/**
 * 查找全部数据
 */
function SearchAll()
{
    //向后台发送服务请求和数据
    $.post("json/inOutInfo!findAll.action",
        {
            optionCode:"getAll"
        },
        function(data){

            if(data.actionStatus!="ok"){
                alert(data.msg);
                return;
            }
            $("#tblist_body").html("");

            // 创建分页
            var dataList=$(data.inOutInfoList);
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
    if($("#btncondition").text()=="任务编号"){
        item="planId";
    }
    else if($("#btncondition").text()=="波次号"){
        item="orderId";
    }
    else if($("#btncondition").text()=="弹药规格"){
        item="dySpecId";
    }
    else if($("#btncondition").text()=="规格数量"){
        item="specNum";
    }
    else if($("#btncondition").text()=="箱号"){
        item="boxCode";
    }
    else if($("#btncondition").text()=="单位"){
        item="unit";
    }
    else if($("#btncondition").text()=="出入库标识"){
        item="actionType";
		if(value == "入" || value == "入库"){
			value = "1";
		}
		else if(value == "出" || value == "出库"){
			value = "0";
		}
		else if(value == "库"){
			value = "";
		}
    }
    else if($("#btncondition").text()=="出入库时间"){
        item="actionTime";
    }
    else if($("#btncondition").text()=="人员姓名"){
        item="actionMan";
    }

    //向后台发送服务请求和数据
    $.post("json/inOutInfo!findItems.action",
        {
            optionCode:"getAll",
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
            var dataList=$(data.inOutInfoList);
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
    txtHtml +="<td>"+value.planId+"</td>";
    txtHtml +="<td>"+value.orderId+"</td>";
    txtHtml +="<td>"+value.dySpecId+"</td>";
    txtHtml +="<td>"+value.specNum+"</td>";
    txtHtml +="<td>"+value.boxCode+"</td>";
    txtHtml +="<td>"+value.unit+"</td>";
	
	var actionTypeText="";
	if(value.actionType == "0"){
		actionTypeText="出库";
	}
	else if(value.actionType == "1"){
		actionTypeText="入库";
	}
    txtHtml +="<td>"+actionTypeText+"</td>";
	
    txtHtml +="<td>"+value.actionTime.replace("T"," ")+"</td>";
    txtHtml +="<td>"+value.actionMan+"</td>";
    txtHtml +="<td id='"+value.id+"'>";
    txtHtml +="<a class='glyphicon glyphicon-search' style='margin-left:10px;' title='查看' href='javascript:void(0)' onclick='OnView("+ value.id +")'></a>";
    txtHtml +="</td>";
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
    $.post("json/inOutInfo!delete.action",
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
    $.post("json/inOutInfo!deleteItems.action",
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
    $.post("json/inOutInfo!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#planId").val(data.inOutInfo.planId);
                $("#orderId").val(data.inOutInfo.orderId);
                $("#dySpecId").val(data.inOutInfo.dySpecId);
                $("#specNum").val(data.inOutInfo.specNum);
                $("#boxCode").val(data.inOutInfo.boxCode);
                $("#unit").val(data.inOutInfo.unit);
                $("#actionType").val(data.inOutInfo.actionType);
                $("#actionTime").val(data.inOutInfo.actionTime.replace("T"," "));
                $("#actionMan").val(data.inOutInfo.actionMan);
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
    $.post("json/inOutInfo!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#planId").val(data.inOutInfo.planId);
                $("#orderId").val(data.inOutInfo.orderId);
                $("#dySpecId").val(data.inOutInfo.dySpecId);
                $("#specNum").val(data.inOutInfo.specNum);
                $("#boxCode").val(data.inOutInfo.boxCode);
                $("#unit").val(data.inOutInfo.unit);
                $("#actionType").val(data.inOutInfo.actionType);
                $("#actionTime").val(data.inOutInfo.actionTime.substr(0,10));
                $("#actionMan").val(data.inOutInfo.actionMan);
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

    if(!isValidDate($("#actionTime").val())){
    	alert("出入库时间必须是日期");
    	$("#actionTime").focus();
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
    $.post("json/inOutInfo!save.action",
        {
            optionCode:"addnew",
            planId:$("#planId").val(),
            orderId:$("#orderId").val(),
            dySpecId:$("#dySpecId").val(),
            specNum:$("#specNum").val(),
            boxCode:$("#boxCode").val(),
            unit:$("#unit").val(),
            actionType:$("#actionType").val(),
            actionTime:$("#actionTime").val(),
            actionMan:$("#actionMan").val(),
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
    $.post("json/inOutInfo!update.action",
        {
            optionCode:"update",
            id:gCurId,
            planId:$("#planId").val(),
            orderId:$("#orderId").val(),
            dySpecId:$("#dySpecId").val(),
            specNum:$("#specNum").val(),
            boxCode:$("#boxCode").val(),
            unit:$("#unit").val(),
            actionType:$("#actionType").val(),
            actionTime:$("#actionTime").val(),
            actionMan:$("#actionMan").val(),
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
	$("#dySpecId").val("");
	$("#specNum").val("");
	$("#boxCode").val("");
	$("#unit").val("");
	$("#actionType").val("");
	$("#actionTime").val("");
	$("#actionMan").val("");
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
		$("#dySpecId").attr("disabled",false);
		$("#specNum").attr("disabled",false);
		$("#boxCode").attr("disabled",false);
		$("#unit").attr("disabled",false);
		$("#actionType").attr("disabled",false);
		$("#actionTime").attr("disabled",false);
		$("#actionMan").attr("disabled",false);
        $("#btnsave").text("保存");
		$("#modaltitle").text("添加出入库信息");
	}
    else if(workMode == WORK_MODE_UPDATE){
		$("#planId").attr("disabled",false);
		$("#orderId").attr("disabled",false);
		$("#dySpecId").attr("disabled",false);
		$("#specNum").attr("disabled",false);
		$("#boxCode").attr("disabled",false);
		$("#unit").attr("disabled",false);
		$("#actionType").attr("disabled",false);
		$("#actionTime").attr("disabled",false);
		$("#actionMan").attr("disabled",false);
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改出入库信息");
    }
    else if(workMode == WORK_MODE_VIEW){
		$("#planId").attr("disabled",true);
		$("#orderId").attr("disabled",true);
		$("#dySpecId").attr("disabled",true);
		$("#specNum").attr("disabled",true);
		$("#boxCode").attr("disabled",true);
		$("#unit").attr("disabled",true);
		$("#actionType").attr("disabled",true);
		$("#actionTime").attr("disabled",true);
		$("#actionMan").attr("disabled",true);
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看出入库信息");
    }
}
