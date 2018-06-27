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
    $.post("json/munitionInfo!findAll.action",
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
            var dataList=$(data.munitionInfoList);
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
    if($("#btncondition").text()=="名称编码"){
        item="munitionId";
    }
    else if($("#btncondition").text()=="物资名称"){
        item="munitionName";
    }
    else if($("#btncondition").text()=="大类编码"){
        item="bigTypeId";
    }
    else if($("#btncondition").text()=="小类编码"){
        item="smallTypeId";
    }
    else if($("#btncondition").text()=="计量单位"){
        item="unit";
    }
    else if($("#btncondition").text()=="可用仓库"){
        item="usaDepot";
    }

    //向后台发送服务请求和数据
    $.post("json/munitionInfo!findItems.action",
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
            var dataList=$(data.munitionInfoList);
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
    txtHtml +="<tr id='"+value.munitionId+"' style='"+ trstyle + "'>";
    txtHtml +="<td><input type='checkbox' name='sonChecked'/></td>";
	currentPage = parseInt($("#Pagination option:selected").html());
    txtHtml +="<td>"+(i+1+(currentPage-1)*10)+"</td>";
    txtHtml +="<td>"+value.munitionId+"</td>";
    txtHtml +="<td>"+value.munitionName+"</td>";
    txtHtml +="<td>"+value.bigTypeId+"</td>";
    txtHtml +="<td>"+value.smallTypeId+"</td>";
    txtHtml +="<td>"+value.unit+"</td>";
    txtHtml +="<td>"+value.usaDepot+"</td>";
    txtHtml +="<td id='"+value.munitionId+"'>";
    txtHtml +="<a class='glyphicon glyphicon-pencil' style='margin-left:10px;' title='修改' href='javascript:void(0)' onclick='OnUpdate(&quot;"+ value.munitionId +"&quot;)'></a>";
    txtHtml +="<a class='glyphicon glyphicon-remove' style='margin-left:10px;' title='删除' href='javascript:void(0)' onclick='OnDeleteOne(&quot;"+ value.munitionId +"&quot;)'></a>";
    txtHtml +="<a class='glyphicon glyphicon-search' style='margin-left:10px;' title='查看' href='javascript:void(0)' onclick='OnView(&quot;"+ value.munitionId +"&quot;)'></a>";
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
    $.post("json/munitionInfo!delete.action",
        {
            optionCode:"delone",
            munitionId:recId
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
    $.post("json/munitionInfo!deleteItems.action",
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
    $.post("json/munitionInfo!findItemById.action",
        {
            optionCode:"view",
            munitionId:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#munitionId").val(data.munitionInfo.munitionId);
                $("#munitionName").val(data.munitionInfo.munitionName);
                $("#bigTypeId").val(data.munitionInfo.bigTypeId);
                $("#smallTypeId").val(data.munitionInfo.smallTypeId);
                $("#unit").val(data.munitionInfo.unit);
                $("#depotKind").val(data.munitionInfo.depotKind);
                $("#usaDepot").val(data.munitionInfo.usaDepot);
                $("#shortcut").val(data.munitionInfo.shortcut);
                $("#orderNum").val(data.munitionInfo.orderNum);
                $("#remark").val(data.munitionInfo.remark);
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
    $.post("json/munitionInfo!findItemById.action",
        {
            optionCode:"view",
            munitionId:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#munitionId").val(data.munitionInfo.munitionId);
                $("#munitionName").val(data.munitionInfo.munitionName);
                $("#bigTypeId").val(data.munitionInfo.bigTypeId);
                $("#smallTypeId").val(data.munitionInfo.smallTypeId);
                $("#unit").val(data.munitionInfo.unit);
                $("#depotKind").val(data.munitionInfo.depotKind);
                $("#usaDepot").val(data.munitionInfo.usaDepot);
                $("#shortcut").val(data.munitionInfo.shortcut);
                $("#orderNum").val(data.munitionInfo.orderNum);
                $("#remark").val(data.munitionInfo.remark);
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
    if($("#munitionId").val() == ""){
    	alert("名称编码不能为空");
    	$("#munitionId").focus();
    	return;
    }

    if($("#munitionName").val() == ""){
    	alert("物资名称不能为空");
    	$("#munitionName").focus();
    	return;
    }

    if($("#bigTypeId").val() == ""){
    	alert("大类编码不能为空");
    	$("#bigTypeId").focus();
    	return;
    }

    if($("#smallTypeId").val() == ""){
    	alert("小类编码不能为空");
    	$("#smallTypeId").focus();
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
    $.post("json/munitionInfo!save.action",
        {
            optionCode:"addnew",
            munitionId:$("#munitionId").val(),
            munitionName:$("#munitionName").val(),
            bigTypeId:$("#bigTypeId").val(),
            smallTypeId:$("#smallTypeId").val(),
            unit:$("#unit").val(),
            depotKind:$("#depotKind").val(),
            usaDepot:$("#usaDepot").val(),
            shortcut:$("#shortcut").val(),
            orderNum:$("#orderNum").val(),
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
    $.post("json/munitionInfo!update.action",
        {
            optionCode:"update",
            munitionId:$("#munitionId").val(),
            munitionName:$("#munitionName").val(),
            bigTypeId:$("#bigTypeId").val(),
            smallTypeId:$("#smallTypeId").val(),
            unit:$("#unit").val(),
            depotKind:$("#depotKind").val(),
            usaDepot:$("#usaDepot").val(),
            shortcut:$("#shortcut").val(),
            orderNum:$("#orderNum").val(),
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
	$("#munitionId").val("");
	$("#munitionName").val("");
	$("#bigTypeId").val("");
	$("#smallTypeId").val("");
	$("#unit").val("");
	$("#depotKind").val("");
	$("#usaDepot").val("");
	$("#shortcut").val("");
	$("#orderNum").val("");
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
		$("#munitionId").attr("disabled",false);
		$("#munitionName").attr("disabled",false);
		$("#bigTypeId").attr("disabled",false);
		$("#smallTypeId").attr("disabled",false);
		$("#unit").attr("disabled",false);
		$("#depotKind").attr("disabled",false);
		$("#usaDepot").attr("disabled",false);
		$("#shortcut").attr("disabled",false);
		$("#orderNum").attr("disabled",false);
		$("#remark").attr("disabled",false);
        $("#btnsave").text("保存");
		$("#modaltitle").text("添加名称信息");
	}
    else if(workMode == WORK_MODE_UPDATE){
		$("#munitionId").attr("disabled",true);
		$("#munitionName").attr("disabled",false);
		$("#bigTypeId").attr("disabled",false);
		$("#smallTypeId").attr("disabled",false);
		$("#unit").attr("disabled",false);
		$("#depotKind").attr("disabled",false);
		$("#usaDepot").attr("disabled",false);
		$("#shortcut").attr("disabled",false);
		$("#orderNum").attr("disabled",false);
		$("#remark").attr("disabled",false);
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改名称信息");
    }
    else if(workMode == WORK_MODE_VIEW){
		$("#munitionId").attr("disabled",true);
		$("#munitionName").attr("disabled",true);
		$("#bigTypeId").attr("disabled",true);
		$("#smallTypeId").attr("disabled",true);
		$("#unit").attr("disabled",true);
		$("#depotKind").attr("disabled",true);
		$("#usaDepot").attr("disabled",true);
		$("#shortcut").attr("disabled",true);
		$("#orderNum").attr("disabled",true);
		$("#remark").attr("disabled",true);
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看名称信息");
    }
}
