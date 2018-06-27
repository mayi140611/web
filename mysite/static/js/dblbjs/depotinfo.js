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
    $.post("json/depotInfo!findAll.action",
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
            var dataList=$(data.depotInfoList);
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
//            dyRoleSet();
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
    if($("#btncondition").text()=="仓库编码"){
        item="depotId";
    }
    else if($("#btncondition").text()=="仓库名称"){
        item="depotName";
    }
    else if($("#btncondition").text()=="所属甲板"){
        item="floor";
    }
    else if($("#btncondition").text()=="门牌号"){
        item="depotCode";
    }
    else if($("#btncondition").text()=="仓库类型"){
        item="depotType";
    }
    else if($("#btncondition").text()=="备注"){
        item="remark";
    }

    //向后台发送服务请求和数据
    $.post("json/depotInfo!findItems.action",
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
            var dataList=$(data.depotInfoList);
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
//            dyRoleSet();
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
    txtHtml +="<tr id='"+value.depotId+"' style='"+ trstyle + "'>";
    txtHtml +="<td><input type='checkbox' name='sonChecked'/></td>";
    txtHtml +="<td>"+(i+1+(currentPage-1)*10)+"</td>";
    txtHtml +="<td>"+value.depotId+"</td>";
    txtHtml +="<td>"+value.depotName+"</td>";
    txtHtml +="<td>"+value.floor+"</td>";
    txtHtml +="<td>"+value.depotCode+"</td>";
    txtHtml +="<td>"+getDepotTypeText(value.depotType)+"</td>";
    txtHtml +="<td>"+value.remark+"</td>";
    txtHtml +="<td  id='"+value.depotId+"'>";
    txtHtml +="<a class='glyphicon glyphicon-pencil'  style='margin-left:10px;' title='修改' href='javascript:void(0)' onclick='OnUpdate(&quot;"+ value.depotId +"&quot;)'></a>";
    txtHtml +="<a class='glyphicon glyphicon-remove'  style='margin-left:10px;' title='删除' href='javascript:void(0)' onclick='OnDeleteOne(&quot;"+ value.depotId +"&quot;)'></a>";
    txtHtml +="<a class='glyphicon glyphicon-search'  style='margin-left:10px;' title='查看' href='javascript:void(0)' onclick='OnView(&quot;"+ value.depotId +"&quot;)'></a>";
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
    $.post("json/depotInfo!delete.action",
        {
            optionCode:"delone",
            depotId:recId
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
    $.post("json/depotInfo!deleteItems.action",
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
    $.post("json/depotInfo!findItemById.action",
        {
            optionCode:"view",
            depotId:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#depotId").val(data.depotInfo.depotId);
                $("#depotName").val(data.depotInfo.depotName);
                $("#floor").val(data.depotInfo.floor);
                $("#depotCode").val(data.depotInfo.depotCode);
                $("#depotType").val(data.depotInfo.depotType);
                $("#depotKind").val(data.depotInfo.depotKind);
                $("#depotPic").val(data.depotInfo.depotPic);
                $("#remark").val(data.depotInfo.remark);
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
    $.post("json/depotInfo!findItemById.action",
        {
            optionCode:"view",
            depotId:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#depotId").val(data.depotInfo.depotId);
                $("#depotName").val(data.depotInfo.depotName);
                $("#floor").val(data.depotInfo.floor);
                $("#depotCode").val(data.depotInfo.depotCode);
                $("#depotType").val(data.depotInfo.depotType);
                $("#depotKind").val(data.depotInfo.depotKind);
                $("#depotPic").val(data.depotInfo.depotPic);
                $("#remark").val(data.depotInfo.remark);
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
    if($("#depotId").val() == ""){
    	alert("仓库编码不能为空");
    	$("#depotId").focus();
    	return;
    }

    if($("#depotName").val() == ""){
    	alert("仓库名称不能为空");
    	$("#depotName").focus();
    	return;
    }

    if($("#depotType").val() == ""){
    	alert("仓库类型不能为空");
    	$("#depotType").focus();
    	return;
    }

    if(!isValidInteger($("#depotType").val())){
    	alert("仓库类型必须是整数");
    	$("#depotType").focus();
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
    $.post("json/depotInfo!save.action",
        {
            optionCode:"addnew",
            depotId:$("#depotId").val(),
            depotName:$("#depotName").val(),
            floor:$("#floor").val(),
            depotCode:$("#depotCode").val(),
            depotType:$("#depotType").val(),
            depotKind:$("#depotKind").val(),
            depotPic:$("#depotPic").val(),
            remark:$("#remark").val(),
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
    $.post("json/depotInfo!update.action",
        {
            optionCode:"update",
            depotId:$("#depotId").val(),
            depotName:$("#depotName").val(),
            floor:$("#floor").val(),
            depotCode:$("#depotCode").val(),
            depotType:$("#depotType").val(),
            depotKind:$("#depotKind").val(),
            depotPic:$("#depotPic").val(),
            remark:$("#remark").val(),
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
	$("#depotId").val("");
	$("#depotName").val("");
	$("#floor").val("");
	$("#depotCode").val("");
	//$("#depotType").val("");
	$("#depotKind").val("");
	$("#depotPic").val("");
	$("#remark").val("");
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
		$("#depotId").attr("disabled",false);
		$("#depotName").attr("disabled",false);
		$("#floor").attr("disabled",false);
		$("#depotCode").attr("disabled",false);
		$("#depotType").attr("disabled",false);
		$("#depotKind").attr("disabled",false);
		$("#depotPic").attr("disabled",false);
		$("#remark").attr("disabled",false);
        $("#btnsave").text("保存");
		$("#modaltitle").text("添加仓库信息");
	}
    else if(workMode == WORK_MODE_UPDATE){
		$("#depotId").attr("disabled",false);
		$("#depotName").attr("disabled",false);
		$("#floor").attr("disabled",false);
		$("#depotCode").attr("disabled",false);
		$("#depotType").attr("disabled",false);
		$("#depotKind").attr("disabled",false);
		$("#depotPic").attr("disabled",false);
		$("#remark").attr("disabled",false);
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改仓库信息");
    }
    else if(workMode == WORK_MODE_VIEW){
		$("#depotId").attr("disabled",true);
		$("#depotName").attr("disabled",true);
		$("#floor").attr("disabled",true);
		$("#depotCode").attr("disabled",true);
		$("#depotType").attr("disabled",true);
		$("#depotKind").attr("disabled",true);
		$("#depotPic").attr("disabled",true);
		$("#remark").attr("disabled",true);
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看仓库信息");
    }
}


/**
 * 取得仓库类型文字
 *
 */
function getDepotTypeText(depotTypeFlag)
{
	switch(depotTypeFlag){
		case 0:
			return "登保部门仓库";
		case 1:
			return "陆战部队弹药库";
		case 2:
			return "陆战部队物资库";
		case 3:
			return "重型武器仓";
		case 4:
			return "器材仓";
		case 5:
			return "辅油仓";
		case 6:
			return "装载仓";
		default:
			return "其他"
	}
}
