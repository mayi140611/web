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
    $.post("json/dyType!findAll.action",
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
            var dataList=$(data.dyTypeList);
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
    if($("#btncondition").text()=="弹药类型编号"){
        item="typeCode";
    }
    else if($("#btncondition").text()=="弹药类型说明"){
        item="typeDesc";
    }

    //向后台发送服务请求和数据
    $.post("json/dyType!findItems.action",
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
            var dataList=$(data.dyTypeList);
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

    var trclass="";

    var txtHtml = "";
    txtHtml +="<tr id='"+value.id+"' class='"+ trclass + "'>";
    txtHtml +="<td><input type='checkbox' name='sonChecked'/></td>";
	currentPage = parseInt($("#Pagination option:selected").html());
    txtHtml +="<td>"+(i+1+(currentPage-1)*10)+"</td>";
    txtHtml +="<td>"+value.typeCode+"</td>";
    txtHtml +="<td>"+value.typeDesc+"</td>";
    txtHtml +="<td id='"+value.id+"'>";
	txtHtml +="<a class='btndetail' href='javascript:void(0)' data-toggle='modal' data-keyboard='false' data-backdrop='static' onclick='OnView("+ value.id +")'>查看</a>";
    txtHtml +="|<a class='btnupdate' href='javascript:void(0)' data-toggle='modal' data-keyboard='false' data-backdrop='static' onclick='OnUpdate("+ value.id +")'>修改</a>";
    txtHtml +="|<a class='' href='javascript:void(0)' data-toggle='modal' data-keyboard='false' data-backdrop='static' onclick='OnDelOne("+ value.id +")'>删除</a>";
    txtHtml +="</td>";
    txtHtml +="<td id='"+value.id+"'>";
    txtHtml +="<a class='glyphicon glyphicon-pencil' style='margin-left:10px;' title='修改' href='javascript:void(0)' data-toggle='modal' data-keyboard='false' data-backdrop='static' onclick='OnUpdate("+ value.id +")'></a>";
    txtHtml +="<a class='glyphicon glyphicon-remove' style='margin-left:10px;color:red;' title='删除' href='#' data-toggle='modal' data-keyboard='false' data-backdrop='static' onclick='OnUpdate("+ value.id +")'></a>";
    txtHtml +="<a class='glyphicon glyphicon-search' style='margin-left:10px;' title='查看' href='javascript:void(0)' data-toggle='modal' data-keyboard='false' data-backdrop='static' onclick='OnView("+ value.id +")'></a>";
    txtHtml +="<a class='glyphicon glyphicon-flag' style='margin-left:15px;' title='设为当前任务' href='#' data-toggle='modal' data-keyboard='false' data-backdrop='static' onclick='OnUpdate("+ value.id +")'></a>";
    txtHtml +="</td>";
    txtHtml +="<td id='"+value.id+"'>";
    txtHtml +="<button class='btn btn-warning btn-sm glyphicon glyphicon-pencil' title='修改' style='margin-left:10px;heigth:60%;' data-toggle='modal' data-keyboard='false' data-backdrop='static' onclick='OnUpdate("+ value.id +")'></button>";
    txtHtml +="<button class='btn btn-info btn-sm glyphicon glyphicon-search' style='margin-left:10px;' data-toggle='modal' data-keyboard='false' data-backdrop='static' onclick='OnView("+ value.id +")'></button>";
    txtHtml +="<button class='btn btn-danger btn-sm glyphicon glyphicon-remove' style='margin-left:10px;' data-toggle='modal' data-keyboard='false' data-backdrop='static' onclick='OnView("+ value.id +")'></button>";
    txtHtml +="<button class='glyphicon glyphicon-flag' style='margin-left:10px;color:red;' data-toggle='modal' data-keyboard='false' data-backdrop='static' onclick='OnUpdate("+ value.id +")'></button>";
    txtHtml +="<button class='glyphicon glyphicon-pencil' style='margin-left:10px;' data-toggle='modal' data-keyboard='false' data-backdrop='static' onclick='OnUpdate("+ value.id +")'></button>";
    txtHtml +="<button class='glyphicon glyphicon-search' style='margin-left:10px;' data-toggle='modal' data-keyboard='false' data-backdrop='static' onclick='OnView("+ value.id +")'></button>";
    txtHtml +="<button class='glyphicon glyphicon-flag' style='margin-left:10px;' data-toggle='modal' data-keyboard='false' data-backdrop='static' onclick='OnUpdate("+ value.id +")'></button>";
    txtHtml +="</td>";
    txtHtml +="</tr>";

    $("#tblist_body").append(txtHtml);
}


/**
 * 按下操作列中删除按钮，删除对应记录
 *
 */
function OnDelOne(recId)
{

    //删除确认信息
    if(!confirm("确定要删除选中的数据吗？")){
        return;
    }

    //向后台发送服务请求和数据
    $.post("json/dyType!delete.action",
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
    $.post("json/dyType!deleteItems.action",
        {
            optionCode:"deleteItems",
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
    $.post("json/dyType!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#typeCode").val(data.dyType.typeCode);
                $("#typeDesc").val(data.dyType.typeDesc);
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
    $.post("json/dyType!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#typeCode").val(data.dyType.typeCode);
                $("#typeDesc").val(data.dyType.typeDesc);
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
    if($("#typeCode").val() == ""){
    	alert("弹药类型编号不能为空");
    	$("#typeCode").focus();
    	return;
    }

    if($("#typeDesc").val() == ""){
    	alert("弹药类型说明不能为空");
    	$("#typeDesc").focus();
    	return;
    }

    if(!isValidInteger($("#typeCode").val())){
    	alert("弹药类型编号必须是整数");
    	$("#typeCode").focus();
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
    $.post("json/dyType!save.action",
        {
            optionCode:"addnew",
            typeCode:$("#typeCode").val(),
            typeDesc:$("#typeDesc").val(),
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
    $.post("json/dyType!update.action",
        {
            optionCode:"update",
            id:gCurId,
            typeCode:$("#typeCode").val(),
            typeDesc:$("#typeDesc").val(),
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
	$("#typeCode").val("");
	$("#typeDesc").val("");
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
		$("#typeCode").attr("disabled",false);
		$("#typeDesc").attr("disabled",false);
        $("#btnsave").text("保存");
		$("#modaltitle").text("添加巡检信息");
	}
    else if(workMode == WORK_MODE_UPDATE){
		$("#typeCode").attr("disabled",true);
		$("#typeDesc").attr("disabled",false);
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改巡检信息");
    }
    else if(workMode == WORK_MODE_VIEW){
		$("#typeCode").attr("disabled",true);
		$("#typeDesc").attr("disabled",true);
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看巡检信息");
    }
}
