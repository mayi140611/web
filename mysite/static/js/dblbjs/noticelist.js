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
    $.post("json/noticeList!findAll.action",
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
            var dataList=$(data.noticeListList);
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
    alert($("#btncondition").text())
    if($("#btncondition").text().trim()=="查找条件"){
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
    if($("#btncondition").text()=="公告编码"){
        item="noticeCode";
    }
    else if($("#btncondition").text()=="内容"){
        item="content";
    }
    else if($("#btncondition").text()=="开始时间"){
        item="beginTime";
    }
    else if($("#btncondition").text()=="结束时间"){
        item="endTime";
    }

    //向后台发送服务请求和数据
    $.post("json/noticeList!findItems.action",
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
            var dataList=$(data.noticeListList);
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
    var beginTime = value.beginTime+"";
    var endTime = value.endTime+"";
    var txtHtml = "";
    txtHtml +="<tr id='"+value.id+"' style='"+ trstyle + "'>";
    txtHtml +="<td><input type='checkbox' name='sonChecked'/></td>";
	currentPage = parseInt($("#Pagination option:selected").html());
    txtHtml +="<td>"+(i+1+(currentPage-1)*10)+"</td>";
    txtHtml +="<td>"+value.noticeCode+"</td>";
    txtHtml +="<td>"+value.content+"</td>";
    txtHtml +="<td>"+beginTime.toString().substring(0, 10)+" "+beginTime.toString().substring(11,16)+"</td>";
    txtHtml +="<td>"+endTime.toString().substring(0, 10)+" "+endTime.toString().substring(11,16)+"</td>";
    txtHtml +="<td readable='td' id='"+value.id+"'>";
    txtHtml +="<a class='glyphicon glyphicon-pencil' readable='251' style='margin-left:10px;' title='修改' href='javascript:void(0)' onclick='OnUpdate("+ value.id +")'></a>";
    txtHtml +="<a class='glyphicon glyphicon-remove' readable='252'  style='margin-left:10px;' title='删除' href='javascript:void(0)' onclick='OnDeleteOne("+ value.id +")'></a>";
    txtHtml +="<a class='glyphicon glyphicon-search'  readable='253' style='margin-left:10px;' title='查看' href='javascript:void(0)' onclick='OnView("+ value.id +")'></a>";
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
    $.post("json/noticeList!delete.action",
        {
            optionCode:"delone",
            id:recId
        },
        function(data){
            if(data.actionStatus!="ok"){
                alert(data.msg);
                return;
            }
            SearchAll();
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
    $.post("json/noticeList!deleteItems.action",
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
            SearchAll();
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
    
  //向后台发送服务请求和数据
  //向后台发送服务请求和数据
    $.post("json/noticeList!findFirst.action",
        {
            optionCode:"getAll"
        },
        function(data){
        	if(data.actionStatus == "ok"){
                $("#planId").val(data.planId);
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
    $.post("json/noticeList!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                var beginTime = data.noticeList.beginTime+"";
                var endTime = data.noticeList.endTime+"";
                $("#planId").val(data.noticeList.planlist.PLAN_ID);
                $("#noticeCode").val(data.noticeList.noticeCode);
                if(data.noticeList.content=="住舱信息"){
                	$("#divContent").css("display","none");
                	$("#noticeType").val("1");
                }else if(data.noticeList.content=="换乘计划"){
                    	$("#divContent").css("display","none");
                    	$("#noticeType").val("2");
                }else{
                	$("#content").val(data.noticeList.content);
                }
                $("#beginTime").val(beginTime.toString().substring(0, 10)+" "+beginTime.toString().substring(11,16));
                $("#endTime").val(endTime.toString().substring(0, 10)+" "+endTime.toString().substring(11,16));
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
    $.post("json/noticeList!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                var beginTime = data.noticeList.beginTime+"";
                var endTime = data.noticeList.endTime+"";
                $("#planId").val(data.noticeList.planlist.PLAN_ID);
                $("#noticeCode").val(data.noticeList.noticeCode);
                if(data.noticeList.content=="住舱信息"){
                	$("#divContent").css("display","none");
                	$("#noticeType").val("1");
                }else if(data.noticeList.content=="换乘计划"){
                    	$("#divContent").css("display","none");
                    	$("#noticeType").val("2");
                }else{
                	$("#content").val(data.noticeList.content);
                }
                
                $("#beginTime").val(beginTime.toString().substring(0, 10)+" "+beginTime.toString().substring(11,16));
                $("#endTime").val(endTime.toString().substring(0, 10)+" "+endTime.toString().substring(11,16));
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
    if($("#noticeCode").val() == ""){
    	alert("公告编码不能为空");
    	$("#noticeCode").focus();
    	return;
    }
    if($("#noticeType").val() == "0"){
    	if($("#content").val() == ""){
        	alert("内容不能为空");
        	$("#content").focus();
        	return;
        }

        if($("#content").val().length > 50){
        	alert("公告内容字数应小于50");
        	$("#content").focus();
        	return;
        }
    }
    
    if($("#beginTime").val() == ""){
    	alert("开始时间不能为空");
    	$("#beginTime").focus();
    	return;
    }

    if($("#endTime").val() == ""){
    	alert("结束时间不能为空");
    	$("#endTime").focus();
    	return;
    }
    //2017-09-29 16:32
    var beginTime = $("#beginTime").val().split(" ")
    var d1 = beginTime[0].split("-");
    var d2 = beginTime[1].split(":");
    var t1 = new Date(d1[0],d1[1]-1,d1[2],d2[0],d2[1],0,0);
    var endTime = $("#endTime").val().split(" ")
    d1 = endTime[0].split("-");
    d2 = endTime[1].split(":");
    t2 = new Date(d1[0],d1[1]-1,d1[2],d2[0],d2[1],0,0);
    if(Date.parse(t1)>=Date.parse(t2)){
    	alert("结束时间应该在开始时间之后");
    	$("#endTime").focus();
    	return;
    }
    if($("#endTime").val() == ""){
    	alert("结束时间不能为空");
    	$("#endTime").focus();
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
    $.post("json/noticeList!save.action",
        {
            optionCode:"addnew",
            planId:$("#planId").val(),
            noticeCode:$("#noticeCode").val(),
            noticeType:$("#noticeType").val(),
            content:$("#content").val(),
            beginTime:$("#beginTime").val(),
            endTime:$("#endTime").val(),
        },
        function(data){
            if(data.actionStatus == "ok"){
				$("#modaldialog").modal("hide");
                SearchAll();
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
    $.post("json/noticeList!update.action",
        {
            optionCode:"update",
            id:gCurId,
            planId:$("#planId").val(),
            noticeCode:$("#noticeCode").val(),
            noticeType:$("#noticeType").val(),
            content:$("#content").val(),
            beginTime:$("#beginTime").val(),
            endTime:$("#endTime").val(),
        },
    function(data){
        if(data.actionStatus == "ok"){
            $("#modaldialog").modal("hide");
            SearchAll();
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
	$("#noticeCode").val("");
	$("#noticeType").val("0");
	$("#content").val("");
	$("#beginTime").val("");
	$("#endTime").val("");
	$("#divContent").css("display","");
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
//		$("#planId").text(${sessionScope.username});
		$("#noticeCode").attr("disabled",false);
		$("#content").attr("disabled",false);
		$("#beginTime").attr("disabled",false);
		$("#endTime").attr("disabled",false);
        $("#btnsave").text("保存");
		$("#modaltitle").text("添加公告发布");
		$("#noticeType").attr("disabled",false);
	}
    else if(workMode == WORK_MODE_UPDATE){
		$("#planId").attr("disabled",true);
		$("#noticeCode").attr("disabled",true);
		$("#content").attr("disabled",false);
		$("#beginTime").attr("disabled",false);
		$("#endTime").attr("disabled",false);
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改公告发布");
		$("#noticeType").attr("disabled",true);
    }
    else if(workMode == WORK_MODE_VIEW){
		$("#planId").attr("disabled",true);
		$("#noticeCode").attr("disabled",true);
		$("#noticeType").attr("disabled",true);
		$("#content").attr("disabled",true);
		$("#beginTime").attr("disabled",true);
		$("#endTime").attr("disabled",true);
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看公告发布");
    }
}
