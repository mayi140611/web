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
//全局变量：缓存当前操作模式
var gOrderId = 0;

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
    $.post("json/orderDetail!findDyWithOrder.action",
        {
            optionCode:"getAll"
        },
        function(data){

            if(data.actionStatus!="ok"){
                alert(data.msg);
                return;
            }
            $("#tblist_body").html("");

			gOrderId = data.orderId;
            // 创建分页
            var dataList=$(data.orderDetailList);
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
        item="planOrderDetailListId";
    }
    else if($("#btncondition").text()=="清单类型"){
        item="goodsType";
    }
    else if($("#btncondition").text()=="弹药编码"){
        item="goodsId";
    }
    else if($("#btncondition").text()=="弹药名称"){
        item="goodsName";
    }
    else if($("#btncondition").text()=="总量"){
        item="goodsNum";
    }
    else if($("#btncondition").text()=="单位"){
        item="unit";
    }

    //向后台发送服务请求和数据
    $.post("json/orderDetail!findItems.action",
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
            var dataList=$(data.orderDetailList);
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
    txtHtml +="<td>"+gOrderId+"</td>";
    txtHtml +="<td>"+isnull(value.goodsType)+"</td>";
    txtHtml +="<td>"+isnull(value.goodsId)+"</td>";
    txtHtml +="<td>"+isnull(value.goodsName)+"</td>";
    txtHtml +="<td>"+isnull(value.goodsNum)+"</td>";
    txtHtml +="<td>"+isnull(value.unit)+"</td>";
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
    $.post("json/orderDetail!delete.action",
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
    $.post("json/orderDetail!deleteItems.action",
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
 * 按下查看按钮，显示任务详情
 *
 */
function OnView(recId)
{
    gWorkMode = WORK_MODE_VIEW;
    setControlsStatus(WORK_MODE_VIEW)
	
	//1-将OrderId写入Session
	
	//2-启动详情页面

    //向后台发送服务请求和数据
    $.post("json/orderDetail!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#planOrderDetailListId").val(data.orderDetail.planOrderDetailListId);
                $("#goodsType").val(data.orderDetail.goodsType);
                $("#goodsId").val(data.orderDetail.goodsId);
                $("#goodsName").val(data.orderDetail.goodsName);
                $("#goodsNum").val(data.orderDetail.goodsNum);
                $("#unit").val(data.orderDetail.unit);
                $("#remark").val(data.orderDetail.remark);
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
    $.post("json/orderDetail!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#planOrderDetailListId").val(data.orderDetail.planOrderDetailListId);
                $("#goodsType").val(data.orderDetail.goodsType);
                $("#goodsId").val(data.orderDetail.goodsId);
                $("#goodsName").val(data.orderDetail.goodsName);
                $("#goodsNum").val(data.orderDetail.goodsNum);
                $("#unit").val(data.orderDetail.unit);
                $("#remark").val(data.orderDetail.remark);
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
    if(!isValidInteger($("#goodsNum").val())){
    	alert("总量必须是整数");
    	$("#goodsNum").focus();
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
    $.post("json/orderDetail!save.action",
        {
            optionCode:"addnew",
            planOrderDetailListId:$("#planOrderDetailListId").val(),
            goodsType:$("#goodsType").val(),
            goodsId:$("#goodsId").val(),
            goodsName:$("#goodsName").val(),
            goodsNum:$("#goodsNum").val(),
            unit:$("#unit").val(),
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
    $.post("json/orderDetail!update.action",
        {
            optionCode:"update",
            id:gCurId,
            planOrderDetailListId:$("#planOrderDetailListId").val(),
            goodsType:$("#goodsType").val(),
            goodsId:$("#goodsId").val(),
            goodsName:$("#goodsName").val(),
            goodsNum:$("#goodsNum").val(),
            unit:$("#unit").val(),
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
	$("#planOrderDetailListId").val("");
	$("#goodsType").val("");
	$("#goodsId").val("");
	$("#goodsName").val("");
	$("#goodsNum").val("");
	$("#unit").val("");
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
		$("#planOrderDetailListId").attr("disabled",false);
		$("#goodsType").attr("disabled",false);
		$("#goodsId").attr("disabled",false);
		$("#goodsName").attr("disabled",false);
		$("#goodsNum").attr("disabled",false);
		$("#unit").attr("disabled",false);
		$("#remark").attr("disabled",false);
        $("#btnsave").text("保存");
		$("#modaltitle").text("添加波次信息");
	}
    else if(workMode == WORK_MODE_UPDATE){
		$("#planOrderDetailListId").attr("disabled",true);
		$("#goodsType").attr("disabled",false);
		$("#goodsId").attr("disabled",false);
		$("#goodsName").attr("disabled",false);
		$("#goodsNum").attr("disabled",false);
		$("#unit").attr("disabled",false);
		$("#remark").attr("disabled",false);
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改波次信息");
    }
    else if(workMode == WORK_MODE_VIEW){
		$("#planOrderDetailListId").attr("disabled",true);
		$("#goodsType").attr("disabled",true);
		$("#goodsId").attr("disabled",true);
		$("#goodsName").attr("disabled",true);
		$("#goodsNum").attr("disabled",true);
		$("#unit").attr("disabled",true);
		$("#remark").attr("disabled",true);
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看波次信息");
    }
}
