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

    //初期化处理
    var today = new Date();
    new DatePicker('checkDate',
        {
            inputId : 'checkDate',
            className : 'date-picker-wp',
            seprator : '-'
        }).fillInput(today.getFullYear(), today.getMonth() + 1, today.getDate());

    //查找全部数据
    SearchAll();
}

/**
 * 查找全部数据
 */
function SearchAll()
{
    //向后台发送服务请求和数据
    $.post("json/dailyCheck!findAll.action",
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
            var dataList=$(data.dailyCheckList);
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
    if($("#btncondition").text()=="巡检日期"){
        item="checkDate";
    }
    else if($("#btncondition").text()=="巡检人员"){
        item="checkMan";
    }
    else if($("#btncondition").text()=="巡检状况"){
        item="checkStatus";
		if(value == "异" || value == "异常"){
			value = "1";
		}
		else if(value == "正" || value == "正常"){
			value = "0";
		}
		else if(value == "常"){
			value = "";
		}
    }
    else if($("#btncondition").text()=="状况描述"){
        item="checkDesc";
    }
    else if($("#btncondition").text()=="处理意见"){
        item="dealDesc";
    }
    else if($("#btncondition").text()=="责任人"){
        item="dealMan";
    }

    //向后台发送服务请求和数据
    $.post("json/dailyCheck!findItems.action",
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
            var dataList=$(data.dailyCheckList);
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
	currentPage = parseInt($("#Pagination option:selected").html());

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
    txtHtml +="<td><input type='checkbox' name='sonChecked'/></td>";
    txtHtml +="<td>"+(i+1+(currentPage-1)*10)+"</td>";
    txtHtml +="<td>"+value.checkDate.substr(0,10)+"</td>";
    txtHtml +="<td>"+value.checkMan+"</td>";
    txtHtml +="<td>"+getDailyCheckStateText(value.checkStatus)+"</td>";
    txtHtml +="<td>"+value.checkDesc+"</td>";
    txtHtml +="<td>"+value.dealDesc+"</td>";
    txtHtml +="<td>"+value.dealMan+"</td>";
    txtHtml +="<td id='"+value.id+"'>";
    txtHtml +="<a class='glyphicon glyphicon-pencil' style='margin-left:10px;' title='修改' href='javascript:void(0)' onclick='OnUpdate("+ value.id +")'></a>";
    txtHtml +="<a class='glyphicon glyphicon-remove' style='margin-left:10px;' title='删除' href='javascript:void(0)' onclick='OnDeleteOne("+ value.id +")'></a>";
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
    $.post("json/dailyCheck!delete.action",
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
    $.post("json/dailyCheck!deleteItems.action",
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
    $.post("json/dailyCheck!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#checkDate").val(data.dailyCheck.checkDate.substr(0,10));
                $("#checkMan").val(data.dailyCheck.checkMan);
                $("#checkStatus").val(data.dailyCheck.checkStatus);
                $("#checkDesc").val(data.dailyCheck.checkDesc);
                $("#dealDesc").val(data.dailyCheck.dealDesc);
                $("#dealMan").val(data.dailyCheck.dealMan);
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
    $.post("json/dailyCheck!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#checkDate").val(data.dailyCheck.checkDate.substr(0,10));
                $("#checkMan").val(data.dailyCheck.checkMan);
                $("#checkStatus").val(data.dailyCheck.checkStatus);
                $("#checkDesc").val(data.dailyCheck.checkDesc);
                $("#dealDesc").val(data.dailyCheck.dealDesc);
                $("#dealMan").val(data.dailyCheck.dealMan);
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
    if(!isValidDate($("#checkDate").val())){
    	alert("巡检日期必须是日期");
    	$("#checkDate").focus();
    	return;
    }

	if($("#checkStatus").val() == 1 && $("#checkDesc").val() == ""){
    	alert("请对异常状况进行描述！");
    	$("#checkDesc").focus();
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
//	alert($("#checkDesc").val());
    //向后台发送服务请求和数据
    $.post("json/dailyCheck!save.action",
        {
            optionCode:"addnew",
            checkDate:$("#checkDate").val(),
            checkMan:$("#checkMan").val(),
            checkStatus:$("#checkStatus").val(),
            checkDesc:$("#checkDesc").val(),
            dealDesc:$("#dealDesc").val(),
            dealMan:$("#dealMan").val(),
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
    $.post("json/dailyCheck!update.action",
        {
            optionCode:"update",
            id:gCurId,
            checkDate:$("#checkDate").val(),
            checkMan:$("#checkMan").val(),
            checkStatus:$("#checkStatus").val(),
            checkDesc:$("#checkDesc").val(),
            dealDesc:$("#dealDesc").val(),
            dealMan:$("#dealMan").val(),
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
	//$("#checkDate").val("");
	$("#checkMan").val("");
	//$("#checkStatus").val("");
	$("#checkDesc").text("");
	$("#dealDesc").val("");
	$("#dealMan").val("");
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
		$("#checkDate").attr("disabled",false);
		$("#checkMan").attr("disabled",false);
		$("#checkStatus").attr("disabled",false);
		$("#checkDesc").attr("disabled",false);
		$("#dealDesc").attr("disabled",false);
		$("#dealMan").attr("disabled",false);
        $("#btnsave").text("保存");
		$("#modaltitle").text("添加日常巡检");
	}
    else if(workMode == WORK_MODE_UPDATE){
		$("#checkDate").attr("disabled",false);
		$("#checkMan").attr("disabled",false);
		$("#checkStatus").attr("disabled",false);
		$("#checkDesc").attr("disabled",false);
		$("#dealDesc").attr("disabled",false);
		$("#dealMan").attr("disabled",false);
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改日常巡检");
    }
    else if(workMode == WORK_MODE_VIEW){
		$("#checkDate").attr("disabled",true);
		$("#checkMan").attr("disabled",true);
		$("#checkStatus").attr("disabled",true);
		$("#checkDesc").attr("disabled",true);
		$("#dealDesc").attr("disabled",true);
		$("#dealMan").attr("disabled",true);
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看日常巡检");
    }
}

/**
 * 获取巡检状况文本
 * 2017-9-6 by wqs
 *
 */
function getDailyCheckStateText(dailyStateFlag)
{
	switch(dailyStateFlag){
		case "0":
			return "正常";
		case "1":
			return "异常";
		default:
			return "正常";
	}
}  


function exec(command){
	
	var wsh = new ActiveXObject("WScript.Shell");
	if(wsh){
		wsh.Run(command);
	}
	
	wsh=null;
}