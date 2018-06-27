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
var WORK_MODE_OUT = 5;
var WORK_MODE_IN = 6;
var WORK_MODE_OUT_THIS = 7;
var WORK_MODE_IN_THIS = 8;
var COMMON_TASK_CODE = "00000000-00";

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
	
	//默认任务编号
	$("#planId").val(COMMON_TASK_CODE);
	$("#orderId").val("1");

    //查找全部数据
    SearchAll();
}

/**
 * 查找全部数据
 */
function SearchAll()
{
    //向后台发送服务请求和数据
    $.post("json/storageInfo!findAll.action",
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
            var dataList=$(data.storageInfoList);
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
    if($("#btncondition").text()=="仓库编码"){
        item="depotId";
    }
    else if($("#btncondition").text()=="储位编码"){
        item="storageId";
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
    else if($("#btncondition").text()=="箱号"){
        item="boxCode";
    }
    else if($("#btncondition").text()=="箱内数量"){
        item="realInBox";
    }
    else if($("#btncondition").text()=="装配批次"){
        item="manufactureOrder";
    }

    //向后台发送服务请求和数据
    $.post("json/storageInfo!findItems.action",
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
            var dataList=$(data.storageInfoList);
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
    //txtHtml +="<td><input type='checkbox' name='sonChecked'/></td>";
	currentPage = parseInt($("#Pagination option:selected").html());
    txtHtml +="<td>"+(i+1+(currentPage-1)*10)+"</td>";
    txtHtml +="<td>"+isnull(value.dyId)+"</td>";
    txtHtml +="<td>"+isnull(value.dySpecId)+"</td>";
    //txtHtml +="<td>"+isnull(value.specNum)+"</td>";
    txtHtml +="<td>"+isnull(value.boxCode)+"</td>";
    txtHtml +="<td>"+isnull(value.realInBox)+"</td>";
    txtHtml +="<td>"+isnull(value.unit)+"</td>";
    txtHtml +="<td>"+isnull(value.depotId)+"</td>";
	if(value.depotArea != null){
		txtHtml +="<td>"+value.depotArea.gridX+"-"+value.depotArea.gridY+"-"+value.depotArea.gridZ+"</td>";
	}
	else{
		txtHtml +="<td></td>";		
	}
    txtHtml +="<td>"+isnull(value.manufactureOrder)+"</td>";
    txtHtml +="<td id='"+value.id+"'>";
    txtHtml +="<a style='margin-left:10px;' title='日常出库' href='javascript:void(0)' onclick='OnOutThisOne("+ value.id +")'>出库</a>";
    txtHtml +="<a style='margin-left:10px;' title='日常入库' href='javascript:void(0)' onclick='OnInThisOne("+ value.id +")'>入库</a>";
    txtHtml +="<a class='glyphicon glyphicon-pencil' style='margin-left:10px;' title='修改' href='javascript:void(0)' onclick='OnUpdate("+ value.id +")'></a>";
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
    $.post("json/storageInfo!delete.action",
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
    $.post("json/storageInfo!deleteItems.action",
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
 * 按下日常入库按钮，弹出日常入库页面
 *
 */
function OnIn()
{
    //添加工作模式
    gWorkMode = WORK_MODE_ADD;
    setControlsStatus(WORK_MODE_ADD);

    $("#modaldialog").modal("show");
    $("#planId").val(COMMON_TASK_CODE);
    $("#depotId").val("");
    $("#storageId").val("");
    $("#dyId").val("");
    $("#orderId").val("1");
    $("#dySpecId").val("");
    $("#specNum").val("");
    $("#boxCode").val("");
    $("#numPerBox").val("");
    $("#realInBox").val("");
    $("#unit").val("");
    $("#manufactureOrder").val("");
    $("#actionMan").val("");
}

/**
 * 按下日常出库按钮，弹出日常出库页面
 *
 */
function OnOut()
{
    //添加工作模式
    gWorkMode = WORK_MODE_OUT;
    setControlsStatus(WORK_MODE_OUT);

    $("#modaldialog").modal("show");
    $("#planId").val(COMMON_TASK_CODE);
    $("#depotId").val("");
    $("#storageId").val("");
    $("#dyId").val("");
    $("#orderId").val("1");
    $("#dySpecId").val("");
    $("#specNum").val("");
    $("#boxCode").val("");
    $("#numPerBox").val("");
    $("#realInBox").val("");
    $("#unit").val("");
    $("#manufactureOrder").val("");
    $("#actionMan").val("");
}

/**
 * 按下操作栏入库按钮，弹出查看页面
 *
 */
function OnInThisOne(recId)
{
    gWorkMode = WORK_MODE_ADD;
    setControlsStatus(WORK_MODE_ADD)

    //向后台发送服务请求和数据
    $.post("json/storageInfo!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#depotId").val(data.storageInfo.depotId);
                $("#storageId").val(data.storageInfo.storageId);
                $("#dyId").val(data.storageInfo.dyId);
                $("#dySpecId").val(data.storageInfo.dySpecId);
                $("#specNum").val("");
                $("#boxCode").val(data.storageInfo.boxCode);
                $("#numPerBox").val(data.storageInfo.numPerBox);
                $("#realInBox").val(data.storageInfo.realInBox);
                $("#unit").val(data.storageInfo.unit);
                $("#manufactureOrder").val(data.storageInfo.manufactureOrder);
				
				$("#dyId").attr("disabled", true);
				$("#dySpecId").attr("disabled", true);
				$("#boxCode").attr("disabled", true);
				$("#realInBox").attr("disabled", true);
				$("#unit").attr("disabled", true);
				$("#manufactureOrder").attr("disabled", true);
				$("#depotId").attr("disabled", true);
				$("#storageId").attr("disabled", true);
				
                $("#modaldialog").modal("show");
            }
            else{
                alert(data.msg);
            }
        });
}

/**
 * 按下操作栏出库按钮，弹出查看页面
 *
 */
function OnOutThisOne(recId)
{
    gWorkMode = WORK_MODE_OUT;
    setControlsStatus(WORK_MODE_OUT)

    //向后台发送服务请求和数据
    $.post("json/storageInfo!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#depotId").val(data.storageInfo.depotId);
                $("#storageId").val(data.storageInfo.storageId);
                $("#dyId").val(data.storageInfo.dyId);
                $("#dySpecId").val(data.storageInfo.dySpecId);
                $("#specNum").val("");
                $("#boxCode").val(data.storageInfo.boxCode);
                $("#numPerBox").val(data.storageInfo.numPerBox);
                $("#realInBox").val(data.storageInfo.realInBox);
                $("#unit").val(data.storageInfo.unit);
                $("#manufactureOrder").val(data.storageInfo.manufactureOrder);
				
				$("#dyId").attr("disabled", true);
				$("#dySpecId").attr("disabled", true);
				$("#boxCode").attr("disabled", true);
				$("#realInBox").attr("disabled", true);
				$("#unit").attr("disabled", true);
				$("#manufactureOrder").attr("disabled", true);
				$("#depotId").attr("disabled", true);
				$("#storageId").attr("disabled", true);
				
                $("#modaldialog").modal("show");
            }
            else{
                alert(data.msg);
            }
        });
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
    $.post("json/storageInfo!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#depotId").val(data.storageInfo.depotId);
                $("#storageId").val(data.storageInfo.storageId);
                $("#dyId").val(data.storageInfo.dyId);
                $("#dySpecId").val(data.storageInfo.dySpecId);
                //$("#specNum").val(data.storageInfo.specNum);
                $("#boxCode").val(data.storageInfo.boxCode);
                $("#numPerBox").val(data.storageInfo.numPerBox);
                $("#realInBox").val(data.storageInfo.realInBox);
                $("#unit").val(data.storageInfo.unit);
                $("#manufactureOrder").val(data.storageInfo.manufactureOrder);
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
    $.post("json/storageInfo!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#depotId").val(data.storageInfo.depotId);
                $("#storageId").val(data.storageInfo.storageId);
                $("#dyId").val(data.storageInfo.dyId);
                $("#dySpecId").val(data.storageInfo.dySpecId);
                $("#specNum").val(data.storageInfo.specNum);
                $("#boxCode").val(data.storageInfo.boxCode);
                $("#numPerBox").val(data.storageInfo.numPerBox);
                $("#realInBox").val(data.storageInfo.realInBox);
                $("#unit").val(data.storageInfo.unit);
                $("#manufactureOrder").val(data.storageInfo.manufactureOrder);
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

    if($("#dyId").val() == ""){
    	alert("弹药编码不能为空");
    	$("#dyId").focus();
    	return;
    }

    if($("#dySpecId").val() == ""){
    	alert("弹药规格不能为空");
    	$("#dySpecId").focus();
    	return;
    }

    if($("#specNum").val() == ""){
    	alert("规格数量不能为空");
    	$("#specNum").focus();
    	return;
    }
    
    if($("#boxCode").val() == ""){
    	alert("箱号不能为空");
    	$("#boxCode").focus();
    	return;
    }

    if(!isValidInteger($("#specNum").val())){
    	alert("规格数量必须是整数");
    	$("#specNum").focus();
    	return;
    }

    if(!isValidInteger($("#numPerBox").val())){
    	alert("每箱数量必须是整数");
    	$("#numPerBox").focus();
    	return;
    }

    if(!isValidInteger($("#realInBox").val())){
    	alert("箱内数量必须是整数");
    	$("#realInBox").focus();
    	return;
    }
	
	//出库数量检查
	if(gWorkMode == WORK_MODE_OUT){
		var outNum = parseInt($("#specNum").val(),10);
		var inBoxNum = parseInt($("#realInBox").val(),10);
		if(outNum > inBoxNum){
			alert("出库数量不能超过箱内数量");
			$("#specNum").focus();
			return;
		}
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
    else if(gWorkMode == WORK_MODE_OUT){
    	OutOne();
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
            depotId:$("#depotId").val(),
            storageId:$("#storageId").val(),
            dyId:$("#dyId").val(),
            orderId:$("#orderId").val(),
            dySpecId:$("#dySpecId").val(),
            specNum:$("#specNum").val(),
            boxCode:$("#boxCode").val(),
            numPerBox:$("#numPerBox").val(),
            realInBox:$("#realInBox").val(),
            unit:$("#unit").val(),
            manufactureOrder:$("#manufactureOrder").val(),
            actionMan:$("#actionMan").val(),
        },
        function(data){
            if(data.actionStatus == "ok"){
            	alert(data.msg);
				$("#modaldialog").modal("hide");
                OnSearch();
            }
            else{
                alert(data.msg);
            }
        });
}

/**
 * 执行出库（post添加请求和数据到后台）
 */
function OutOne()
{
    //向后台发送服务请求和数据
    $.post("json/inOutInfo!out.action",
        {
            optionCode:"addnew",
            planId:$("#planId").val(),
            depotId:$("#depotId").val(),
            storageId:$("#storageId").val(),
            dyId:$("#dyId").val(),
            orderId:$("#orderId").val(),
            dySpecId:$("#dySpecId").val(),
            specNum:$("#specNum").val(),
            boxCode:$("#boxCode").val(),
            numPerBox:$("#numPerBox").val(),
            realInBox:$("#realInBox").val(),
            unit:$("#unit").val(),
            manufactureOrder:$("#manufactureOrder").val(),
            actionMan:$("#actionMan").val(),
        },
        function(data){
            if(data.actionStatus == "ok"){
            	alert(data.msg);
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
    $.post("json/storageInfo!update.action",
        {
            optionCode:"update",
            id:gCurId,
            depotId:$("#depotId").val(),
            storageId:$("#storageId").val(),
            dyId:$("#dyId").val(),
            dySpecId:$("#dySpecId").val(),
            specNum:$("#specNum").val(),
            boxCode:$("#boxCode").val(),
            numPerBox:$("#numPerBox").val(),
            realInBox:$("#realInBox").val(),
            unit:$("#unit").val(),
            manufactureOrder:$("#manufactureOrder").val(),
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
	$("#storageId").val("");
	$("#dyId").val("");
	$("#dySpecId").val("");
	$("#specNum").val("");
	$("#boxCode").val("");
	$("#numPerBox").val("");
	$("#realInBox").val("");
	$("#unit").val("");
	$("#manufactureOrder").val("");
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
        $(".renwubianhao").css("display","block");
        $(".bocihao").css("display","block");
        $(".renyuanxingming").css("display","block");
		$("#planId").attr("disabled",false);
		$("#depotId").attr("disabled",false);
		$("#storageId").attr("disabled",false);
		$("#dyId").attr("disabled",false);
		$("#orderId").attr("disabled",false);	
		$("#dySpecId").attr("disabled",false);
		$("#specNum").attr("disabled",false);
		$("#boxCode").attr("disabled",false);
		$("#numPerBox").attr("disabled",false);
		$("#realInBox").attr("disabled",false);
		$("#unit").attr("disabled",false);
		$("#manufactureOrder").attr("disabled",false);
		$("#actionMan").attr("disabled",false);
		$("#guigeshuliang").text("入库数量");
        $("#btnsave").text("入库");
		$("#modaltitle").text("弹药日常入库");
	}
	else if(workMode == WORK_MODE_OUT){
        $(".renwubianhao").css("display","block");
        $(".bocihao").css("display","block");
        $(".renyuanxingming").css("display","block");
		$("#planId").attr("disabled",false);
		$("#depotId").attr("disabled",false);
		$("#storageId").attr("disabled",false);
		$("#dyId").attr("disabled",false);
		$("#orderId").attr("disabled",false);	
		$("#dySpecId").attr("disabled",false);
		$("#specNum").attr("disabled",false);
		$("#boxCode").attr("disabled",false);
		$("#numPerBox").attr("disabled",false);
		$("#realInBox").attr("disabled",false);
		$("#unit").attr("disabled",false);
		$("#manufactureOrder").attr("disabled",false);
		$("#actionMan").attr("disabled",false);
		$("#guigeshuliang").text("出库数量");
        $("#btnsave").text("出库");
        $("#modaltitle").text("弹药日常出库");
        
    }	
    else if(workMode == WORK_MODE_UPDATE){
    	$("#planId").attr("disabled",true);
		$("#depotId").attr("disabled",false);
		$("#storageId").attr("disabled",false);
		$("#dyId").attr("disabled",true);
		$("#orderId").attr("disabled",true);	
		$("#dySpecId").attr("disabled",true);
		$("#specNum").attr("disabled",false);
		$("#boxCode").attr("disabled",true);
		$("#numPerBox").attr("disabled",false);
		$("#realInBox").attr("disabled",true);
		$("#unit").attr("disabled",false);
		$("#manufactureOrder").attr("disabled",false);
		$("#actionMan").attr("disabled",false);
		$("#guigeshuliang").text("规格数量");
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改库存信息");
        $(".renwubianhao").css("display","none");
        $(".bocihao").css("display","none");
        $(".renyuanxingming").css("display","none");
    }
    else if(workMode == WORK_MODE_VIEW){
    	$("#planId").attr("disabled",true);
		$("#depotId").attr("disabled",true);
		$("#storageId").attr("disabled",true);
		$("#dyId").attr("disabled",true);
		$("#orderId").attr("disabled",true);	
		$("#dySpecId").attr("disabled",true);
		$("#specNum").attr("disabled",true);
		$("#boxCode").attr("disabled",true);
		$("#numPerBox").attr("disabled",true);
		$("#realInBox").attr("disabled",true);
		$("#unit").attr("disabled",true);
		$("#manufactureOrder").attr("disabled",true);
		$("#actionMan").attr("disabled",true);
        $(".renwubianhao").css("display","none");
        $(".bocihao").css("display","none");
        $(".renyuanxingming").css("display","none");
        $("#guigeshuliang").text("规格数量");
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看库存信息");
    }
}
