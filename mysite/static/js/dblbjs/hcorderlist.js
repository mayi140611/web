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

function RoleSet(){
	 var resourceids=rid.split(","); 
		$("[readable]").each(function(){   
			if(resourceids.indexOf($(this).attr("readable"))<0){  
				$(this).css("display","none"); 
			}
		});
    var f=false;
    $("[readable='td'] a").each(function(){
    	if($(this).css("display")=="none"){ 
    		f=f||false; 
    	}
    	else{
    		f=f||true; 
    	}
    });
    if(!f){
    	$("#control").css("display","none");
    	$("[readable='td']").css("display","none");
    }
    if(f){
    	$("#control").css("display","");
    	$("[readable='td']").css("display","");
    }
}

/**
 * 查找全部数据
 */
function SearchAll()
{
    //向后台发送服务请求和数据
    $.post("json/orderList!findAll.action",
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
            var dataList=$(data.orderListList);
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
            RoleSet();
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
    else if($("#btncondition").text()=="任务类型"){
        item="taskType";
    }
    else if($("#btncondition").text()=="指挥员"){
        item="planCommander";
    }
    else if($("#btncondition").text()=="预计开始时间"){
        item="planBeginDate";
    }
    else if($("#btncondition").text()=="预计持续时间"){
        item="planLastDate";
    }
    else if($("#btncondition").text()=="作业区域"){
        item="planWorkArea";
    }

    //向后台发送服务请求和数据
    $.post("json/orderList!findItems.action",
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
            var dataList=$(data.orderListList);
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
            RoleSet();
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
    txtHtml +="<td>"+getTaskTypeText(value.taskType)+"</td>";
    txtHtml +="<td>"+value.planCommander+"</td>";
    txtHtml +="<td>"+value.planBeginDate+"</td>";
    txtHtml +="<td>"+value.planLastDate+"</td>";
    txtHtml +="<td>"+value.planWorkArea+"</td>";
    txtHtml +="<td readable='td' id='"+value.id+"'>";
    txtHtml +="<a class='glyphicon glyphicon-search' readable='223' style='margin-left:15px;' title='任务详情' href='#' data-toggle='modal' data-keyboard='false' data-backdrop='static' onclick='OnView(&quot;"+ value.orderId +"&quot;)'></a>";
    txtHtml +="</td>";
    txtHtml +="</tr>";

    $("#tblist_body").append(txtHtml);
}

function OnSetCurrentOrder(orderId){
	$.post("json/orderList!setCurrentOrder.action",
			{
				orderId:orderId
			},		
			function(data){
				$("#currentOrder").text(orderId);
				alert(data.msg);
			}
	);
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
    $.post("json/orderList!delete.action",
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
    $.post("json/orderList!deleteItems.action",
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
function OnView(orderId)
{	
    gWorkMode = WORK_MODE_VIEW;
    setControlsStatus(WORK_MODE_VIEW)
    $.post("json/orderList!setCurrentOrder.action",
		{
			orderId:orderId
		},		
		function(data){
			
			if(data.actionStatus != "ok"){
				alert(data.msg);
				return;
			}
			//2-启动详情页面
			window.location.href="left.action?val=hcstafforderinfo";				
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
    $.post("json/orderList!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#planId").val(data.orderList.planId);
                $("#orderId").val(data.orderList.orderId);
                $("#taskType").val(data.orderList.taskType);
                $("#planCommander").val(data.orderList.planCommander);
                $("#planBeginDate").val(data.orderList.planBeginDate);
                $("#planLastDate").val(data.orderList.planLastDate);
                $("#planWorkArea").val(data.orderList.planWorkArea);
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

    if(!isValidInteger($("#planBeginDate").val())){
    	alert("预计开始时间必须是整数");
    	$("#planBeginDate").focus();
    	return;
    }

    if(!isValidInteger($("#planLastDate").val())){
    	alert("预计持续时间必须是整数");
    	$("#planLastDate").focus();
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
    $.post("json/orderList!save.action",
        {
            optionCode:"addnew",
            planId:$("#planId").val(),
            orderId:$("#orderId").val(),
            taskType:$("#taskType").val(),
            planCommander:$("#planCommander").val(),
            planBeginDate:$("#planBeginDate").val(),
            planLastDate:$("#planLastDate").val(),
            planWorkArea:$("#planWorkArea").val(),
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
    $.post("json/orderList!update.action",
        {
            optionCode:"update",
            id:gCurId,
            planId:$("#planId").val(),
            orderId:$("#orderId").val(),
            taskType:$("#taskType").val(),
            planCommander:$("#planCommander").val(),
            planBeginDate:$("#planBeginDate").val(),
            planLastDate:$("#planLastDate").val(),
            planWorkArea:$("#planWorkArea").val(),
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
	$("#taskType").val("");
	$("#planCommander").val("");
	$("#planBeginDate").val("");
	$("#planLastDate").val("");
	$("#planWorkArea").val("");
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
		$("#taskType").attr("disabled",false);
		$("#planCommander").attr("disabled",false);
		$("#planBeginDate").attr("disabled",false);
		$("#planLastDate").attr("disabled",false);
		$("#planWorkArea").attr("disabled",false);
        $("#btnsave").text("保存");
		$("#modaltitle").text("添加波次信息");
	}
    else if(workMode == WORK_MODE_UPDATE){
		$("#planId").attr("disabled",false);
		$("#orderId").attr("disabled",false);
		$("#taskType").attr("disabled",false);
		$("#planCommander").attr("disabled",false);
		$("#planBeginDate").attr("disabled",false);
		$("#planLastDate").attr("disabled",false);
		$("#planWorkArea").attr("disabled",false);
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改波次信息");
    }
    else if(workMode == WORK_MODE_VIEW){
		$("#planId").attr("disabled",true);
		$("#orderId").attr("disabled",true);
		$("#taskType").attr("disabled",true);
		$("#planCommander").attr("disabled",true);
		$("#planBeginDate").attr("disabled",true);
		$("#planLastDate").attr("disabled",true);
		$("#planWorkArea").attr("disabled",true);
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看波次信息");
    }
}

/**
 * 获取任务类型文本
 * 2017-8-14 by wqs
 *
 */
function getTaskTypeText(taskTypeFlag)
{
	switch(taskTypeFlag){
		case "0":
			return "上舰";
		case "1":
			return "离舰";
		default:
			return "其他";		
	}
}
