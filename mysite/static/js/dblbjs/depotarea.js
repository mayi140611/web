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
	
	//查找仓库信息
	SearchDepotInfo();
}

/**
 * 查找全部数据
 */
function SearchAll()
{
    //向后台发送服务请求和数据
    $.post("json/depotArea!findAll.action",
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
            var dataList=$(data.depotAreaList);
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
    if($("#btncondition").text()=="排"){
        item="gridX";
    }
    else if($("#btncondition").text()=="列"){
        item="gridY";
    }
    else if($("#btncondition").text()=="层"){
        item="gridZ";
    }
    else if($("#btncondition").text()=="仓库编号"){
        item="storageNo";
    }
    else if($("#btncondition").text()=="仓库名称"){
        item="storageName";
    }
    else if($("#btncondition").text()=="分区编号"){
        item="areaNo";
    }
    else if($("#btncondition").text()=="分区名称"){
        item="areaName";
    }

    //向后台发送服务请求和数据
    $.post("json/depotArea!findItems.action",
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
            var dataList=$(data.depotAreaList);
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
    txtHtml +="<td>"+value.gridX+"</td>";
    txtHtml +="<td>"+value.gridY+"</td>";
    txtHtml +="<td>"+value.gridZ+"</td>";
    txtHtml +="<td>"+value.storageNo+"</td>";
    txtHtml +="<td>"+value.storageName+"</td>";
    txtHtml +="<td>"+value.areaNo+"</td>";
    txtHtml +="<td>"+value.areaName+"</td>";
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
    $.post("json/depotArea!delete.action",
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
    $.post("json/depotArea!deleteItems.action",
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
 * 查找仓库信息
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
			
            $("#storageNo").html("");
			var txtHtml="";
			
			for(var i=0; i<data.depotInfoList.length; i++){
				txtHtml +="<option name='" + data.depotInfoList[i].depotName +"'>" + data.depotInfoList[i].depotId +"</option>";				
			}
			$("#storageNo").append(txtHtml);
			OnSelectDepot();
			
     });		
}

/**
 * 选择编号，获得名称
 *
 */
function OnSelectDepot()
{
	var selCode = $("#storageNo").val();
	$("#storageNo option").each(function(i, opt){
		if($(opt).text() == selCode){
			$("#storageName").val($(opt).attr("name"));
			return;
		}
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
	$("#storageNo option").eq(0).attr("selected",true);
	OnSelectDepot();
	
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
    $.post("json/depotArea!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#gridX").val(data.depotArea.gridX);
                $("#gridY").val(data.depotArea.gridY);
                $("#gridZ").val(data.depotArea.gridZ);
                $("#storageNo").val(data.depotArea.storageNo);
                $("#storageName").val(data.depotArea.storageName);
                $("#areaNo").val(data.depotArea.areaNo);
                $("#areaName").val(data.depotArea.areaName);
                $("#areaColor").val(data.depotArea.areaColor);
                $("#remark").val(data.depotArea.remark);
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
    $.post("json/depotArea!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#gridX").val(data.depotArea.gridX);
                $("#gridY").val(data.depotArea.gridY);
                $("#gridZ").val(data.depotArea.gridZ);
                $("#storageNo").val(data.depotArea.storageNo);
                $("#storageName").val(data.depotArea.storageName);
                $("#areaNo").val(data.depotArea.areaNo);
                $("#areaName").val(data.depotArea.areaName);
                $("#areaColor").val(data.depotArea.areaColor);
                $("#remark").val(data.depotArea.remark);
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
    if($("#storageNo").val() == ""){
    	alert("仓库编号不能为空");
    	$("#storageNo").focus();
    	return;
    }

    if($("#storageName").val() == ""){
    	alert("仓库名称不能为空");
    	$("#storageName").focus();
    	return;
    }

    if(!isValidInteger($("#gridX").val())){
    	alert("排必须是整数");
    	$("#gridX").focus();
    	return;
    }

    if(!isValidInteger($("#gridY").val())){
    	alert("列必须是整数");
    	$("#gridY").focus();
    	return;
    }

    if(!isValidInteger($("#gridZ").val())){
    	alert("层必须是整数");
    	$("#gridZ").focus();
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
    $.post("json/depotArea!save.action",
        {
            optionCode:"addnew",
            gridX:$("#gridX").val(),
            gridY:$("#gridY").val(),
            gridZ:$("#gridZ").val(),
            storageNo:$("#storageNo").val(),
            storageName:$("#storageName").val(),
            areaNo:$("#areaNo").val(),
            areaName:$("#areaName").val(),
            areaColor:$("#areaColor").val(),
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
    $.post("json/depotArea!update.action",
        {
            optionCode:"update",
            id:gCurId,
            gridX:$("#gridX").val(),
            gridY:$("#gridY").val(),
            gridZ:$("#gridZ").val(),
            storageNo:$("#storageNo").val(),
            storageName:$("#storageName").val(),
            areaNo:$("#areaNo").val(),
            areaName:$("#areaName").val(),
            areaColor:$("#areaColor").val(),
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
	$("#gridX").val("");
	$("#gridY").val("");
	$("#gridZ").val("");
	//$("#storageNo").val("");
	$("#storageName").val("");
	$("#areaNo").val("");
	$("#areaName").val("");
	$("#areaColor").val("");
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
		$("#gridX").attr("disabled",false);
		$("#gridY").attr("disabled",false);
		$("#gridZ").attr("disabled",false);
		$("#storageNo").attr("disabled",false);
		$("#storageName").attr("disabled",true);
		$("#areaNo").attr("disabled",false);
		$("#areaName").attr("disabled",false);
		$("#areaColor").attr("disabled",false);
		$("#remark").attr("disabled",false);
        $("#btnsave").text("保存");
		$("#modaltitle").text("添加储位信息");
	}
    else if(workMode == WORK_MODE_UPDATE){
		$("#gridX").attr("disabled",false);
		$("#gridY").attr("disabled",false);
		$("#gridZ").attr("disabled",false);
		$("#storageNo").attr("disabled",false);
		$("#storageName").attr("disabled",true);
		$("#areaNo").attr("disabled",false);
		$("#areaName").attr("disabled",false);
		$("#areaColor").attr("disabled",false);
		$("#remark").attr("disabled",false);
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改储位信息");
    }
    else if(workMode == WORK_MODE_VIEW){
		$("#gridX").attr("disabled",true);
		$("#gridY").attr("disabled",true);
		$("#gridZ").attr("disabled",true);
		$("#storageNo").attr("disabled",true);
		$("#storageName").attr("disabled",true);
		$("#areaNo").attr("disabled",true);
		$("#areaName").attr("disabled",true);
		$("#areaColor").attr("disabled",true);
		$("#remark").attr("disabled",true);
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看储位信息");
    }
}
