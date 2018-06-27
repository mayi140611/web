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
    $.post("json/staffOrderInfo!findAll.action",
        {
            optionCode:"getAll"
        },
        function(data){

            if(data.actionStatus!="ok"){
                alert(data.msg);
                return;
            }
            $("#tblist_body").html("");
            $("#orderNo").html("波次 "+data.orderId+" 信息")
            // 创建分页
            var dataList=$(data.staffOrderInfoList);
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
    else if($("#btncondition").text()=="装备类型"){
        item="goodsType";
    }
    else if($("#btncondition").text()=="装备名称"){
        item="goodsName";
    }
    else if($("#btncondition").text()=="装备数量"){
        item="goodsNum";
    }
    else if($("#btncondition").text()=="人员数量"){
        item="staffNum";
    }

    if(item=="goodsType"){ 
    	if(value=="飞机"){value="0"}
    	else if (value=="陆战装备"){value="1"}
    }
    
    //向后台发送服务请求和数据
    $.post("json/staffOrderInfo!findItems.action",
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
            var dataList=$(data.staffOrderInfoList);
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
    
    if(value.goodsType=="6"){
    	value.goodsType="留舰人员";
    }
    else if(value.goodsType=="4"){
    	value.goodsType="需离舰人员";
    }
    else if(value.goodsType=="0"){
    	value.goodsType="飞机";
    }
    else if(value.goodsType=="5"){
    	value.goodsType="登陆艇";
    }
    else if(value.goodsType=="8"){
    	value.goodsType="两栖运输车";
    }

    var txtHtml = "";
    txtHtml +="<tr id='"+value.id+"' style='"+ trstyle + "'>";
	currentPage = parseInt($("#Pagination option:selected").html());
//    txtHtml +="<td>"+(i+1+(currentPage-1)*10)+"</td>";
//    txtHtml +="<td>"+isnull(value.orderId)+"</td>";
//    txtHtml +="<td>"+isnull(value.goodsType)+"</td>";
//    txtHtml +="<td>"+isnull(value.goodsName)+"</td>";
//    txtHtml +="<td>"+isnull(value.staffNum)+"</td>";
//    txtHtml +="<td>"+isnull(value.goodsNum)+"</td>";
//    txtHtml +="</tr>";
	 txtHtml +="<td>"+(i+1+(currentPage-1)*10)+"</td>";
	    txtHtml +="<td>"+isnull(value.goodsNum)+"</td>";
	    txtHtml +="<td>"+isnull(value.goodsType)+"</td>";
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
    $.post("json/staffOrderInfo!delete.action",
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
    $.post("json/staffOrderInfo!deleteItems.action",
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
    $.post("json/staffOrderInfo!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#orderId").val(data.staffOrderInfo.orderId);
                $("#goodsType").val(data.staffOrderInfo.goodsType);
                $("#goodsName").val(data.staffOrderInfo.goodsName);
                $("#goodsNum").val(data.staffOrderInfo.goodsNum);
                $("#staffNum").val(data.staffOrderInfo.staffNum);
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
    $.post("json/staffOrderInfo!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#orderId").val(data.staffOrderInfo.orderId);
                $("#goodsType").val(data.staffOrderInfo.goodsType);
                $("#goodsName").val(data.staffOrderInfo.goodsName);
                $("#goodsNum").val(data.staffOrderInfo.goodsNum);
                $("#staffNum").val(data.staffOrderInfo.staffNum);
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
    $.post("json/staffOrderInfo!save.action",
        {
            optionCode:"addnew",
            orderId:$("#orderId").val(),
            goodsType:$("#goodsType").val(),
            goodsName:$("#goodsName").val(),
            goodsNum:$("#goodsNum").val(),
            staffNum:$("#staffNum").val(),
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
    $.post("json/staffOrderInfo!update.action",
        {
            optionCode:"update",
            id:gCurId,
            orderId:$("#orderId").val(),
            goodsType:$("#goodsType").val(),
            goodsName:$("#goodsName").val(),
            goodsNum:$("#goodsNum").val(),
            staffNum:$("#staffNum").val(),
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
	$("#orderId").val("");
	$("#goodsType").val("");
	$("#goodsName").val("");
	$("#goodsNum").val("");
	$("#staffNum").val("");
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
		$("#orderId").attr("disabled",false);
		$("#goodsType").attr("disabled",false);
		$("#goodsName").attr("disabled",false);
		$("#goodsNum").attr("disabled",false);
		$("#staffNum").attr("disabled",false);
        $("#btnsave").text("保存");
		$("#modaltitle").text("添加波次信息");
	}
    else if(workMode == WORK_MODE_UPDATE){
		$("#orderId").attr("disabled",false);
		$("#goodsType").attr("disabled",false);
		$("#goodsName").attr("disabled",false);
		$("#goodsNum").attr("disabled",false);
		$("#staffNum").attr("disabled",false);
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改波次信息");
    }
    else if(workMode == WORK_MODE_VIEW){
		$("#orderId").attr("disabled",true);
		$("#goodsType").attr("disabled",true);
		$("#goodsName").attr("disabled",true);
		$("#goodsNum").attr("disabled",true);
		$("#staffNum").attr("disabled",true);
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看波次信息");
    }
}
