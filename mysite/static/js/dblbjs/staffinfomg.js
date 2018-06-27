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
 * 判断权限
 */
function RoleSet(data){
    //通过用户权限设置资源 
	var resourceids=rid.split(","); 
	$("[readable]").each(function(){   
		if(resourceids.indexOf($(this).attr("readable"))<0){  
			$(this).css("display","none"); 
		}
	});
    if(data.planState == "7" || data.planState == "8"){
        $("#btnaddnew").css("display", "none");							
		$("#btndel").css("display", "none");	
	}
    var f=false;
    $(".control a").each(function(){
    	if($(this).css("display")=="none"){
    		f=f||false; 
    	}
    	else{
    		f=f||true; 
    	}
    });
    if(!f){
    	$("#control").css("display","none");
    	$(".control").css("display","none");
    }
    if(f){
    	$("#control").css("display","");
    	$(".control").css("display","");
    }
}

/**
 * 查找全部数据
 */
function SearchAll()
{
    //向后台发送服务请求和数据
    $.post("json/staffInfoMg!findAll.action",
        {
            optionCode:"getAll"
        },
        function(data){

            if(data.actionStatus!="ok"){
                alert(data.msg);
                return;
            }
            $("#tblist_body").html("");
            var dataList=$(data.staffInfoMgList);
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
                    if(data.planState == "7" || data.planState == "8"){
                        dataList.slice(page_index*10,(page_index+1)*10).each(tableBuildReadOnly);
					}
					else {
	                    dataList.slice(page_index*10,(page_index+1)*10).each(tableBuild);
					}	
                    return false;
                },
            });
            RoleSet(data);
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
    if($("#btncondition").text()=="编码"){
        item="personCode";
    }
    else if($("#btncondition").text()=="姓名"){
        item="personName";
    }
    else if($("#btncondition").text()=="兵种"){
        item="personType";
    }
    else if($("#btncondition").text()=="所属分组"){
        item="groupName";
    }
    else if($("#btncondition").text()=="波次"){
        item="orderId";
    }

    if(item=="personType"){ 
    	if(value.search(/[驾驶员]/)!=-1){value="0"}
    	else if (value.search(/[炮手]/)!=-1){value="2"}
    	else if (value.search(/[登陆兵]/)!=-1){value="1"}
    	else if (value.search(/[留舰人员]/)!=-1){value="3"}
    	else if (value.search(/[坦克瞭望兵]/)!=-1){value="4"}
    }
    
    //向后台发送服务请求和数据
    $.post("json/staffInfoMg!findItems.action",
        {
            optionCode:"getAll",
            item:item,
            value:value
        },
        function(data){
        	if(data.planState == "7" || data.planState == "8"){
                $("#btnaddnew").css("display", "none");							
				$("#btndel").css("display", "none");	
			}
			else {
                $("#btnaddnew").css("display", "");							
				$("#btndel").css("display", "");	
			}	
            if(data.actionStatus!="ok"){
                alert(data.msg);
                return;
            }
            $("#tblist_body").html("");

            // 创建分页
            var dataList=$(data.staffInfoMgList);
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
                    if(data.planState == "7" || data.planState == "8"){
                        dataList.slice(page_index*10,(page_index+1)*10).each(tableBuildReadOnly);
					}
					else {
	                    dataList.slice(page_index*10,(page_index+1)*10).each(tableBuild);
					}	
                    return false;
                },
            });
            RoleSet(data);
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
    
    if(value.personType==2){
    	value.personType="炮手";
    }
    else if(value.personType==0){
    	value.personType="驾驶员";
    }
    else if(value.personType==1){
    	value.personType="登陆兵";
    }
    else if(value.personType==3){
    	value.personType="留舰人员";
    }
    else if(value.personType==4){
    	value.personType="坦克瞭望兵";
    }

    var txtHtml = "";
    txtHtml +="<tr id='"+value.id+"' style='"+ trstyle + "'>";
    txtHtml +="<td><input type='checkbox' name='sonChecked'/></td>";
	currentPage = parseInt($("#Pagination option:selected").html());
    txtHtml +="<td>"+(i+1+(currentPage-1)*10)+"</td>";
    txtHtml +="<td>"+isnull(value.personCode)+"</td>";
    txtHtml +="<td>"+isnull(value.personName)+"</td>";
    txtHtml +="<td>"+isnull(value.personType)+"</td>";
    txtHtml +="<td>"+isnull(value.orderId)+"</td>";
    txtHtml +="<td>"+isnull(value.groupName)+"</td>";
   
    txtHtml +="<td class='control' id='"+value.id+"'>";
    txtHtml +="<a class='glyphicon glyphicon-pencil' style='margin-left:10px;' title='修改' href='javascript:void(0)' readable='211' onclick='OnUpdate("+ value.id +")'></a>";
    txtHtml +="<a class='glyphicon glyphicon-remove' style='margin-left:10px;' title='删除' href='javascript:void(0)' readable='212' onclick='OnDeleteOne("+ value.id +")'></a>";
    txtHtml +="<a class='glyphicon glyphicon-search' style='margin-left:10px;' title='查看' href='javascript:void(0)' readable='213' onclick='OnView("+ value.id +")'></a>";
    txtHtml +="</td>";
    txtHtml +="</tr>";

    $("#tblist_body").append(txtHtml);
}
/**
 * 显示查找到的数据
 */
function tableBuildReadOnly(i,value){

    var trstyle="";
    if (i % 2 == 1)
    {
        trstyle = "background: #EFEFEF;";
    }
    else
    {
        trstyle = "background: #f5f5f5;";
    }
    
    if(value.personType==2){
    	value.personType="炮手";
    }
    else if(value.personType==0){
    	value.personType="驾驶员";
    }
    else if(value.personType==1){
    	value.personType="登陆兵";
    }
    else if(value.personType==3){
    	value.personType="留舰人员";
    }
    else if(value.personType==4){
    	value.personType="坦克瞭望兵";
    }

    var txtHtml = "";
    txtHtml +="<tr id='"+value.id+"' style='"+ trstyle + "'>";
    txtHtml +="<td><input type='checkbox' name='sonChecked'/></td>";
    txtHtml +="<td>"+(i+1)+"</td>";
    txtHtml +="<td>"+isnull(value.personCode)+"</td>";
    txtHtml +="<td>"+isnull(value.personName)+"</td>";
    txtHtml +="<td>"+isnull(value.personType)+"</td>";
    txtHtml +="<td>"+isnull(value.groupName)+"</td>";

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
    $.post("json/staffInfoMg!delete.action",
        {
            optionCode:"delone",
            id:recId
        },
        function(data){
        	 alert(data.msg);
            if(data.actionStatus="ok"){
            	SearchAll();
            }
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
    $.post("json/staffInfoMg!deleteItems.action",
        {
            optionCode:"deleteitems",
            toDelIds:toDelIds
        },
        function(data){
        	 alert(data.msg);
            if(data.actionStatus!="ok"){
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
    $.post("json/orderList!findAll.action",
        {
            optionCode:"getAll"
        },
        function(data){

            if(data.actionStatus!="ok"){
                alert(data.msg);
                return;
            }
            for(var i=0;i<data.orderListList.length;i++){
//            	alert(data.orderListList[i].taskType)
            	//显示上舰的波次
            	if(data.orderListList[i].taskType==0){
            		var str = "<option value="+data.orderListList[i].orderId+">"+data.orderListList[i].orderId+"</option>"
            		$("#orderId").append(str)
            	}
            }
     });
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
    $.post("json/staffInfoMg!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#personCode").val(data.staffInfoMg.personCode);
                $("#personName").val(data.staffInfoMg.personName);
                $("#personType").val(data.staffInfoMg.personType);
                $("#groupName").val(data.staffInfoMg.groupName);
                $("#roomId").val(data.staffInfoMg.roomId);
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
      $.post("json/orderList!findAll.action",
          {
              optionCode:"getAll"
          },
          function(data){

              if(data.actionStatus!="ok"){
                  alert(data.msg);
                  return;
              }
              for(var i=0;i<data.orderListList.length;i++){
              	if(data.orderListList[i].taskType==0){
              		var str = "<option value="+data.orderListList[i].orderId+">"+data.orderListList[i].orderId+"</option>"
              		$("#orderId").append(str)
              	}
              }
       });
    //向后台发送服务请求和数据
    $.post("json/staffInfoMg!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#personCode").val(data.staffInfoMg.personCode);
                $("#personName").val(data.staffInfoMg.personName);
                $("#personType").val(data.staffInfoMg.personType);
                $("#groupName").val(data.staffInfoMg.groupName);
                $("#roomId").val(data.staffInfoMg.roomId);
                $("#orderId").val(data.staffInfoMg.orderId);
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
    if($("#personCode").val() == ""){
    	alert("编码不能为空");
    	$("#personCode").focus();
    	return;
    }
    if($("#personCode").val().length > 50){
    	alert("编码长度不能超过50位");
    	$("#personCode").focus();
    	return;
    }
    if($("#personName").val() == ""){
    	alert("姓名不能为空");
    	$("#personName").focus();
    	return;
    }
    if($("#orderId").val() == ""){
    	alert("波次不能为空");
    	$("#orderId").focus();
    	return;
    }
//    alert($("#orderId").val())
    if(isNaN($("#orderId").val())){
    	
    	alert("波次必须为整数");
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
    $.post("json/staffInfoMg!save.action",
        {
            optionCode:"addnew",
            personCode:$("#personCode").val(),
            personName:$("#personName").val(),
            personType:$("#personType").val(),
            groupName:$("#groupName").val(),
            roomId:$("#roomId").val(),
            orderId:$("#orderId").val(),
        },
        function(data){

            if(data.actionStatus == "ok"){
            	alert(data.msg);
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
    $.post("json/staffInfoMg!update.action",
        {
            optionCode:"update",
            id:gCurId,
            personCode:$("#personCode").val(),
            personName:$("#personName").val(),
            personType:$("#personType").val(),
            groupName:$("#groupName").val(),
            roomId:$("#roomId").val(),
            orderId:$("#orderId").val(),
        },
    function(data){
        	alert(data.msg);
        if(data.actionStatus == "ok"){
        	
            $("#modaldialog").modal("hide");
            SearchAll();
        }
        
    });
}

/**
 * 清空输入内容
 */
function clearContents()
{
	$("#personCode").val("");
	$("#personName").val("");
	$("#personType").val("1");
	$("#groupName").val("");
	$("#roomId").val("");
	$("#orderId").val("");
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
		$("#personCode").attr("disabled",false);
		$("#personName").attr("disabled",false);
		$("#personType").attr("disabled",false);
		$("#groupName").attr("disabled",false);
		$("#roomId").attr("disabled",false);
		$("#orderId").attr("disabled",false);
        $("#btnsave").text("保存");
		$("#modaltitle").text("添加陆战人员信息管理");
	}
    else if(workMode == WORK_MODE_UPDATE){
		$("#personCode").attr("disabled",true);
		$("#personName").attr("disabled",true);
		$("#personType").attr("disabled",false);
		$("#groupName").attr("disabled",false);
		$("#orderId").attr("disabled",false);
		$("#roomId").attr("disabled",false);
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改陆战人员信息管理");
    }
    else if(workMode == WORK_MODE_VIEW){
		$("#personCode").attr("disabled",true);
		$("#personName").attr("disabled",true);
		$("#personType").attr("disabled",true);
		$("#groupName").attr("disabled",true);
		$("#roomId").attr("disabled",true);
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看陆战人员信息管理");
    }
}
