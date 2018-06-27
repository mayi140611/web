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
	
	//查找名称信息
	SearchMunitionInfo();
}

/**
 * 查找全部数据
 */
function SearchAll()
{
    //向后台发送服务请求和数据
    $.post("json/munitionSpec!findAll.action",
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
            var dataList=$(data.munitionSpecList);
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
			
            $("#munitionId").html("");
			var txtHtml="";
			
			for(var i=0; i<data.munitionInfoList.length; i++){
				if(i == 0){
					txtHtml +="<option value='" + data.munitionInfoList[i].munitionId +"' selected>"  + data.munitionInfoList[i].munitionId + "(" + data.munitionInfoList[i].munitionName + ")</option>";								
				}
				else{
					txtHtml +="<option value='" + data.munitionInfoList[i].munitionId +"'>"  + data.munitionInfoList[i].munitionId + "(" + data.munitionInfoList[i].munitionName + ")</option>";									
				}
			}
			$("#munitionId").append(txtHtml);			
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
    if($("#btncondition").text()=="规格编码"){
        item="munitionSpecId";
    }
    else if($("#btncondition").text()=="规格名称"){
        item="munitionSpecName";
    }
    else if($("#btncondition").text()=="大类编码"){
        item="bigTypeId";
    }
    else if($("#btncondition").text()=="小类编码"){
        item="smallTypeId";
    }
    else if($("#btncondition").text()=="物资名称编码"){
        item="munitionId";
    }
    else if($("#btncondition").text()=="每件数量"){
        item="quantity";
    }
    else if($("#btncondition").text()=="单位"){
        item="unit";
    }
    else if($("#btncondition").text()=="重量（公斤）"){
        item="weight";
    }
    else if($("#btncondition").text()=="长度（毫米）"){
        item="length";
    }
    else if($("#btncondition").text()=="宽度（毫米）"){
        item="width";
    }
    else if($("#btncondition").text()=="高度（毫米）"){
        item="height";
    }

    //向后台发送服务请求和数据
    $.post("json/munitionSpec!findItems.action",
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
            var dataList=$(data.munitionSpecList);
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
    txtHtml +="<tr id='"+value.munitionSpecId+"' style='"+ trstyle + "'>";
    txtHtml +="<td><input type='checkbox' name='sonChecked'/></td>";
	currentPage = parseInt($("#Pagination option:selected").html());
    txtHtml +="<td>"+(i+1+(currentPage-1)*10)+"</td>";
    txtHtml +="<td>"+value.munitionSpecId+"</td>";
    txtHtml +="<td>"+value.munitionSpecName+"</td>";
    txtHtml +="<td>"+isnull(value.bigTypeId)+"</td>";
    txtHtml +="<td>"+isnull(value.smallTypeId)+"</td>";
    txtHtml +="<td>"+value.munitionId+"</td>";
	
	if(value.quantity == null){
		txtHtml +="<td></td>";
	}
	else{
		txtHtml +="<td>"+value.quantity+"</td>";
	}
    
    txtHtml +="<td>"+value.unit+"</td>";
	if(value.weight == null){
		txtHtml +="<td></td>";
	}
	else{
		txtHtml +="<td>"+value.weight+"</td>";
	}
	if(value.length == null){
		txtHtml +="<td></td>";
	}
	else{
		txtHtml +="<td>"+value.length+"</td>";
	}
	if(value.width == null){
		txtHtml +="<td></td>";
	}
	else{
		txtHtml +="<td>"+value.width+"</td>";
	}
	if(value.height == null){
		txtHtml +="<td></td>";
	}
	else{
		txtHtml +="<td>"+value.height+"</td>";
	}
    txtHtml +="<td id='"+value.munitionSpecId+"'>";
    txtHtml +="<a class='glyphicon glyphicon-pencil' style='margin-left:10px;' title='修改' href='javascript:void(0)' onclick='OnUpdate(&quot;"+ value.munitionSpecId +"&quot;)'></a>";
    txtHtml +="<a class='glyphicon glyphicon-remove' style='margin-left:10px;' title='删除' href='javascript:void(0)' onclick='OnDeleteOne(&quot;"+ value.munitionSpecId +"&quot;)'></a>";
    txtHtml +="<a class='glyphicon glyphicon-search' style='margin-left:10px;' title='查看' href='javascript:void(0)' onclick='OnView(&quot;"+ value.munitionSpecId +"&quot;)'></a>";
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
    $.post("json/munitionSpec!delete.action",
        {
            optionCode:"delone",
            munitionSpecId:recId
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
    $.post("json/munitionSpec!deleteItems.action",
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
    $.post("json/munitionSpec!findItemById.action",
        {
            optionCode:"view",
            munitionSpecId:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#munitionSpecId").val(data.munitionSpec.munitionSpecId);
                $("#munitionSpecName").val(data.munitionSpec.munitionSpecName);
                $("#bigTypeId").val(data.munitionSpec.bigTypeId);
                $("#smallTypeId").val(data.munitionSpec.smallTypeId);
                $("#munitionId").val(data.munitionSpec.munitionId);
                $("#quantity").val(data.munitionSpec.quantity);
                $("#unit").val(data.munitionSpec.unit);
                $("#weight").val(data.munitionSpec.weight);
                $("#length").val(data.munitionSpec.length);
                $("#width").val(data.munitionSpec.width);
                $("#height").val(data.munitionSpec.height);
                $("#remark").val(data.munitionSpec.remark);
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
    $.post("json/munitionSpec!findItemById.action",
        {
            optionCode:"view",
            munitionSpecId:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#munitionSpecId").val(data.munitionSpec.munitionSpecId);
                $("#munitionSpecName").val(data.munitionSpec.munitionSpecName);
                $("#bigTypeId").val(data.munitionSpec.bigTypeId);
                $("#smallTypeId").val(data.munitionSpec.smallTypeId);
                $("#munitionId").val(data.munitionSpec.munitionId);
                $("#quantity").val(data.munitionSpec.quantity);
                $("#unit").val(data.munitionSpec.unit);
                $("#weight").val(data.munitionSpec.weight);
                $("#length").val(data.munitionSpec.length);
                $("#width").val(data.munitionSpec.width);
                $("#height").val(data.munitionSpec.height);
                $("#remark").val(data.munitionSpec.remark);
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
    if($("#munitionSpecId").val() == ""){
    	alert("规格编码不能为空");
    	$("#munitionSpecId").focus();
    	return;
    }

    if($("#munitionSpecName").val() == ""){
    	alert("规格名称不能为空");
    	$("#munitionSpecName").focus();
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

    if($("#munitionId").val() == ""){
    	alert("物资名称编码不能为空");
    	$("#munitionId").focus();
    	return;
    }

    if(!isValidNumber($("#quantity").val())){
    	alert("每件数量必须是数值");
    	$("#quantity").focus();
    	return;
    }

    if(!isValidNumber($("#weight").val())){
    	alert("重量（公斤）必须是数值");
    	$("#weight").focus();
    	return;
    }

    if(!isValidNumber($("#length").val())){
    	alert("长度（毫米）必须是数值");
    	$("#length").focus();
    	return;
    }

    if(!isValidNumber($("#width").val())){
    	alert("宽度（毫米）必须是数值");
    	$("#width").focus();
    	return;
    }

    if(!isValidNumber($("#height").val())){
    	alert("高度（毫米）必须是数值");
    	$("#height").focus();
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
    $.post("json/munitionSpec!save.action",
        {
            optionCode:"addnew",
            munitionSpecId:$("#munitionSpecId").val(),
            munitionSpecName:$("#munitionSpecName").val(),
            bigTypeId:$("#bigTypeId").val(),
            smallTypeId:$("#smallTypeId").val(),
            munitionId:$("#munitionId").val(),
            quantity:$("#quantity").val(),
            unit:$("#unit").val(),
            weight:$("#weight").val(),
            length:$("#length").val(),
            width:$("#width").val(),
            height:$("#height").val(),
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
    $.post("json/munitionSpec!update.action",
        {
            optionCode:"update",
            munitionSpecId:$("#munitionSpecId").val(),
            munitionSpecName:$("#munitionSpecName").val(),
            bigTypeId:$("#bigTypeId").val(),
            smallTypeId:$("#smallTypeId").val(),
            munitionId:$("#munitionId").val(),
            quantity:$("#quantity").val(),
            unit:$("#unit").val(),
            weight:$("#weight").val(),
            length:$("#length").val(),
            width:$("#width").val(),
            height:$("#height").val(),
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
	$("#munitionSpecId").val("");
	$("#munitionSpecName").val("");
	$("#bigTypeId").val("");
	$("#smallTypeId").val("");
	//$("#munitionId").val("");
	$("#quantity").val("");
	$("#unit").val("");
	$("#weight").val("");
	$("#length").val("");
	$("#width").val("");
	$("#height").val("");
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
		$("#munitionSpecId").attr("disabled",false);
		$("#munitionSpecName").attr("disabled",false);
		$("#bigTypeId").attr("disabled",false);
		$("#smallTypeId").attr("disabled",false);
		$("#munitionId").attr("disabled",false);
		$("#quantity").attr("disabled",false);
		$("#unit").attr("disabled",false);
		$("#weight").attr("disabled",false);
		$("#length").attr("disabled",false);
		$("#width").attr("disabled",false);
		$("#height").attr("disabled",false);
		$("#remark").attr("disabled",false);
        $("#btnsave").text("保存");
		$("#modaltitle").text("添加物资规格");
	}
    else if(workMode == WORK_MODE_UPDATE){
		$("#munitionSpecId").attr("disabled",true);
		$("#munitionSpecName").attr("disabled",false);
		$("#bigTypeId").attr("disabled",false);
		$("#smallTypeId").attr("disabled",false);
		$("#munitionId").attr("disabled",false);
		$("#quantity").attr("disabled",false);
		$("#unit").attr("disabled",false);
		$("#weight").attr("disabled",false);
		$("#length").attr("disabled",false);
		$("#width").attr("disabled",false);
		$("#height").attr("disabled",false);
		$("#remark").attr("disabled",false);
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改物资规格");
    }
    else if(workMode == WORK_MODE_VIEW){
		$("#munitionSpecId").attr("disabled",true);
		$("#munitionSpecName").attr("disabled",true);
		$("#bigTypeId").attr("disabled",true);
		$("#smallTypeId").attr("disabled",true);
		$("#munitionId").attr("disabled",true);
		$("#quantity").attr("disabled",true);
		$("#unit").attr("disabled",true);
		$("#weight").attr("disabled",true);
		$("#length").attr("disabled",true);
		$("#width").attr("disabled",true);
		$("#height").attr("disabled",true);
		$("#remark").attr("disabled",true);
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看物资规格");
    }
}
