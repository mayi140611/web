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
//全局变量：缓存此任务波次号
var gOrderIds = "";
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
					if(data.PLAN_STATE == "7" || data.PLAN_STATE == "8"){
						$("#btnaddnew").css("display", "none");							
						$("#btndel").css("display", "none");
						$("#lblstorage").css("display", "none");							
						gPlanState = 7;
					}
					else {
						$("#btnaddnew").css("display", "");							
						$("#btndel").css("display", "");							
						$("#lblstorage").css("display", "");							
						gPlanState = 0;
					}					
							
					//查找波次（离舰）
					SearchOrderInfo("1");
					
					//查找名称信息
					SearchMunitionInfo();
					
				}
				else{
					alert("没有设定当前任务！");
					window.location.href="left.action?val=persontasklist";
					return;		
				}
			});
}

/**
 * 查找波次号
 *
 */
function SearchOrderInfo(taskType){
	
	//查找波次信息
    $.post("json/orderList!findOrderByType.action",
        {
            optionCode:"getOrderInfo",
			planId:gPlanId,
			taskType:taskType
        },
        function(data){

            if(data.actionStatus!="ok"){
                alert("没有离舰波次任务！");
				window.location.href="left.action?val=dyorderlist";
                return;
            }
			gOrderIds = "";
            $("#orderId").html("");
			var txtHtml="";
			
			for(var i=0; i<data.orderListList.length; i++){
				txtHtml +="<option value='" + data.orderListList[i].orderId +"'>" + data.orderListList[i].orderId +"</option>";	
				gOrderIds += "," + data.orderListList[i].orderId;
			}
			gOrderIds = gOrderIds.substring(1);
			$("#orderId").append(txtHtml);
			
			$("#planId").val(data.planId);

			//查找全部数据
			SearchAll();
			
     });		
	
}

/**
 * 查找全部数据
 */
function SearchAll()
{
    //向后台发送服务请求和数据
    $.post("json/dyList!findAllandStorenumWithOrder.action",
        {
            optionCode:"getAll",
			planId:gPlanId,
			toOrderIds:gOrderIds
        },
        function(data){

            if(data.actionStatus!="ok"){
                alert(data.msg);
                return;
            }
            $("#tblist_body").html("");

            // 创建分页
            var dataList=$(data.dyDyRemoveVOList);
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
 * 查找名称编号
 *
 */
 function SearchMunitionInfo()
{
	//查找名称信息
    $.post("json/munitionInfo!findAll.action",
        {
            optionCode:"getMunitionInfo"
        },
        function(data){

            if(data.actionStatus!="ok"){
                alert(data.msg);
                return;
            }
			
            $("#dyId").html("");
			var txtHtml="";
			
			for(var i=0; i<data.munitionInfoList.length; i++){
				txtHtml +="<option value='" + data.munitionInfoList[i].munitionId +"'>" + data.munitionInfoList[i].munitionId +"</option>";				
			}
			$("#dyId").append(txtHtml);
			
     });		
}

/**
 * 查找仓库编号
 *
 */
 function SearchDepotInfo()
{
	//查找仓库信息
    $.post("json/depotInfo!findAll.action",
        {
            optionCode:"getDepotInfo"
        },
        function(data){

            if(data.actionStatus!="ok"){
                alert(data.msg);
                return;
            }
			
            $("#depotId").html("");
			var txtHtml="";
			
			for(var i=0; i<data.depotInfoList.length; i++){
				txtHtml +="<option value='" + data.depotInfoList[i].depotId +"'>" + data.depotInfoList[i].depotId +"</option>";				
			}
			$("#depotId").append(txtHtml);
			
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
    else if($("#btncondition").text()=="箱条码"){
        item="boxCode";
    }
    else if($("#btncondition").text()=="箱数"){
        item="boxNum";
    }
    else if($("#btncondition").text()=="箱内数量"){
        item="numInBox";
    }
    else if($("#btncondition").text()=="仓库编码"){
        item="depotId";
    }
    else if($("#btncondition").text()=="库位编码"){
        item="storageId";
    }
    else if($("#btncondition").text()=="单位"){
        item="unit";
    }

    //向后台发送服务请求和数据
    $.post("json/dyList!findAllandStorenumWithOrder.action",
        {
            optionCode:"getAll",
			planId:gPlanId,
			toOrderIds:gOrderIds,
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
            var dataList=$(data.dyDyRemoveVOList);
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
	var rowId = 0;
	if(value.id != null){
		rowId = value.id;
	}
	
	if(value.id != null){
		txtHtml +="<tr id='"+rowId+"' style='"+ trstyle + "'>";
		txtHtml +="<td><input type='checkbox' name='sonChecked'/></td>";
		currentPage = parseInt($("#Pagination option:selected").html());
	    txtHtml +="<td>"+(i+1+(currentPage-1)*10)+"</td>";
		txtHtml +="<td>"+value.orderId+"</td>";
		txtHtml +="<td>"+value.dyId+"</td>";
		txtHtml +="<td>"+value.dySpecId+"</td>";
		txtHtml +="<td>"+value.storeNum+"</td>";
		txtHtml +="<td>"+value.specNum+"</td>";
		txtHtml +="<td>"+value.unit+"</td>";
		txtHtml +="<td id='"+rowId+"'>";
		if(gPlanState != 7){
			txtHtml +="<a class='glyphicon glyphicon-pencil' style='margin-left:10px;' title='修改' href='javascript:void(0)' onclick='OnUpdate("+ rowId +"," + value.storeNum + ")'></a>";
			txtHtml +="<a class='glyphicon glyphicon-remove' style='margin-left:10px;' title='删除' href='javascript:void(0)' onclick='OnDeleteOne("+ rowId +")'></a>";
		}
		//txtHtml +="<a class='glyphicon glyphicon-search' style='margin-left:10px;' title='查看' href='javascript:void(0)' onclick='OnView("+ rowId +")'></a>";
		txtHtml +="</td>";
		txtHtml +="</tr>";			
	}
	else if(gPlanState != 7){
		if($("#chkstorage").prop("checked")){
			txtOption = $("#orderId").html();
			
			txtHtml +="<tr id='"+rowId+"' style='"+ trstyle + "'>";
			//txtHtml +="<td><input type='checkbox' name='sonChecked' disabled /></td>";
			txtHtml +="<td></td>";
			txtHtml +="<td>"+(i+1)+"</td>";
			txtHtml +="<td><select>"+txtOption+"</select></td>";
			txtHtml +="<td>"+value.dyId+"</td>";
			txtHtml +="<td>"+value.dySpecId+"</td>";
			txtHtml +="<td>"+value.storeNum+"</td>";
			txtHtml +="<td><input type='text'></td>";
			txtHtml +="<td>"+value.unit+"</td>";
			txtHtml +="<td id='"+rowId+"'>";
			txtHtml +="<a class='glyphicon glyphicon-ok' style='margin-left:10px;' title='确认添加' href='javascript:void(0)' onclick='OnConfirmAdd(this)'></a>";
			txtHtml +="<a class='glyphicon glyphicon-erase' style='margin-left:10px;' title='清理' href='javascript:void(0)' onclick='OnErase(this)'></a>";
			txtHtml +="</td>";
			txtHtml +="</tr>";			
		}
	}
	
	if(txtHtml != ""){
		$("#tblist_body").append(txtHtml);		
	}
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
    $.post("json/dyList!delete.action",
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
 * 按下操作列中清除按钮，清除出库数量
 *
 */
function OnErase(thisObj)
{
	var tds = $(thisObj).parent().parent().children();
	tds.eq(6).children().eq(0).val("");
}


/**
 * 按下操作列中确认按钮，保存出库数量
 *
 */
function OnConfirmAdd(thisObj)
{
	var thistr = $(thisObj).parent().parent();
	var myid = thistr.prop("id");
	var tds = thistr.children();

	//输入检查
	var specNumObj = tds.eq(6).children().eq(0);
	var specNum = specNumObj.val();
	if(specNum == "" || specNum == null){
		alert("出库数量不能为空");
		specNumObj.focus();
		return;
	}

    if(!isValidInteger(specNumObj.val())){
    	alert("出库数量必须是整数");
    	$("#specNum").focus();
    	return;
    }
		
	if(specNum == "0"){
		alert("出库数量必须大于0");
		specNumObj.focus();
		return;
	}
	
	var storeNum = parseInt(tds.eq(5).text(), 10);
	if(parseInt(specNum,10) > storeNum){
		alert("出库数量不能大于库存数量");
		specNumObj.focus();
		return;
	}	
	
	if(myid == "0"){					//添加
		//向后台发送服务请求和数据
		$.post("json/dyList!save.action",
			{
				optionCode:"addnew",
				planId:gPlanId,
				orderId:tds.eq(2).children().eq(0).val(),
				dyId:tds.eq(3).text(),
				dySpecId:tds.eq(4).text(),
				specNum:tds.eq(6).children().eq(0).val(),
				boxCode:"",
				boxNum:0,
				numInBox:0,
				depotId:"",
				storageId:0,
				unit:tds.eq(7).text()
			},
			function(data){

				if(data.actionStatus == "ok"){
					OnSearch();
				}
				else{
					alert(data.msg);
				}
			});		
	}
	else{								//更新		
	}
	
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
    $.post("json/dyList!deleteItems.action",
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
	$("#orderId option").eq(0).attr("selected",true);
	$("#dyId option").eq(0).attr("selected",true);
	$("#depotId option").eq(0).attr("selected",true);
	
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
    $.post("json/dyList!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#planId").val(data.dyList.planId);
                $("#orderId").val(data.dyList.orderId);
                $("#dyId").val(data.dyList.dyId);
                $("#dySpecId").val(data.dyList.dySpecId);
                $("#specNum").val(data.dyList.specNum);
                $("#boxCode").val(data.dyList.boxCode);
                $("#boxNum").val(data.dyList.boxNum);
                $("#numInBox").val(data.dyList.numInBox);
                $("#depotId").val(data.dyList.depotId);
                $("#storageId").val(data.dyList.storageId);
                $("#unit").val(data.dyList.unit);
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
function OnUpdate(recId, storeNum)
{
    gWorkMode = WORK_MODE_UPDATE;
    setControlsStatus(WORK_MODE_UPDATE);

    //向后台发送服务请求和数据
    $.post("json/dyList!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#planId").val(data.dyList.planId);
                $("#orderId").val(data.dyList.orderId);
                $("#dyId").val(data.dyList.dyId);
                $("#dySpecId").val(data.dyList.dySpecId);
                $("#specNum").val(data.dyList.specNum);
                $("#storeNum").val(""+storeNum);
                //$("#boxCode").val(data.dyList.boxCode);
                //$("#boxNum").val(data.dyList.boxNum);
                //$("#numInBox").val(data.dyList.numInBox);
                //$("#depotId").val(data.dyList.depotId);
                //$("#storageId").val(data.dyList.storageId);
                $("#unit").val(data.dyList.unit);
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
    if($("#planId").val() == ""){
    	alert("任务编号不能为空");
    	$("#planId").focus();
    	return;
    }

    if($("#orderId").val() == ""){
    	alert("波次号不能为空");
    	$("#orderId").focus();
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
    	alert("出库数量不能为空");
    	$("#specNum").focus();
    	return;
    }

    if(!isValidInteger($("#orderId").val())){
    	alert("波次号必须是整数");
    	$("#orderId").focus();
    	return;
    }

    if(!isValidInteger($("#specNum").val())){
    	alert("出库数量必须是整数");
    	$("#specNum").focus();
    	return;
    }
	
	var specNum = parseInt($("#specNum").val(),10);
	if(specNum == 0){
    	alert("出库数量必须大于0");
    	$("#specNum").focus();
    	return;		
	}
	
	var storeNum = 0;
	if($("#storeNum").val() != ""){
		storeNum = parseInt($("#storeNum").val(),10);
		if(specNum > storeNum){
			alert("出库数量不能大于库存数量");
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

}

/**
 * 执行添加（post添加请求和数据到后台）
 */
function AddNew()
{
    //向后台发送服务请求和数据
    $.post("json/dyList!save.action",
        {
            optionCode:"addnew",
            planId:$("#planId").val(),
            orderId:$("#orderId").val(),
            dyId:$("#dyId").val(),
            dySpecId:$("#dySpecId").val(),
            specNum:$("#specNum").val(),
            boxCode:"",
            boxNum:0,
            numInBox:0,
            depotId:"",
            storageId:"",
            unit:$("#unit").val(),
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
    $.post("json/dyList!update.action",
        {
            optionCode:"update",
            id:gCurId,
            planId:$("#planId").val(),
            orderId:$("#orderId").val(),
            dyId:$("#dyId").val(),
            dySpecId:$("#dySpecId").val(),
            specNum:$("#specNum").val(),
            //boxCode:$("#boxCode").val(),
            //boxNum:$("#boxNum").val(),
            //numInBox:$("#numInBox").val(),
            //depotId:$("#depotId").val(),
            //storageId:$("#storageId").val(),
            unit:$("#unit").val(),
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
	//$("#planId").val("");
	//$("#orderId").val("");
	//$("#dyId").val("");
	$("#dySpecId").val("");
	$("#specNum").val("");
	$("#boxCode").val("");
	$("#boxNum").val("");
	$("#numInBox").val("");
	//$("#depotId").val("");
	$("#storageId").val("");
	$("#unit").val("");
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
		$("#planId").attr("disabled",true);
		$("#orderId").attr("disabled",false);
		$("#dyId").attr("disabled",false);
		$("#dySpecId").attr("disabled",false);
		$("#specNum").attr("disabled",false);
		$("#boxCode").attr("disabled",false);
		$("#boxNum").attr("disabled",false);
		$("#numInBox").attr("disabled",false);
		$("#depotId").attr("disabled",false);
		$("#storageId").attr("disabled",false);
		$("#unit").attr("disabled",false);
        $("#btnsave").text("保存");
		$("#modaltitle").text("添加弹药计划");
	}
    else if(workMode == WORK_MODE_UPDATE){
		$("#planId").attr("disabled",true);
		$("#orderId").attr("disabled",true);
		$("#dyId").attr("disabled",false);
		$("#dySpecId").attr("disabled",false);
		$("#specNum").attr("disabled",false);
		$("#boxCode").attr("disabled",false);
		$("#boxNum").attr("disabled",false);
		$("#numInBox").attr("disabled",false);
		$("#depotId").attr("disabled",false);
		$("#storageId").attr("disabled",false);
		$("#unit").attr("disabled",false);
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改弹药计划");
    }
    else if(workMode == WORK_MODE_VIEW){
		$("#planId").attr("disabled",true);
		$("#orderId").attr("disabled",true);
		$("#dyId").attr("disabled",true);
		$("#dySpecId").attr("disabled",true);
		$("#specNum").attr("disabled",true);
		$("#boxCode").attr("disabled",true);
		$("#boxNum").attr("disabled",true);
		$("#numInBox").attr("disabled",true);
		$("#depotId").attr("disabled",true);
		$("#storageId").attr("disabled",true);
		$("#unit").attr("disabled",true);
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看弹药计划");
    }
}
