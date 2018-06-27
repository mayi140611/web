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
    //设置为当前任务
	  $(document).on({
		  click:function(e){ e.preventDefault(); e.stopPropagation();
	    	var id=$(this).parent("td").attr("class");
	    	var pstate=$(this).parent("td").attr("pstate");
	    	var pname=$(this).parent("td").attr("pname");
	    	$.post("json/personTaskList!setPlan.action",
	    		{
	    		planId:id,
	    		planName:pname,
	    		planState:pstate
	    		},
	    		function(data){
		    		if(data.msg){
		    			alert(data.msg);
		    		}
		    		getItemsInSession();
		    		findPlanState();
	    		}
	    	);
	    }
	  },  ".thisplanbtn1");
    
    //查找全部数据
    SearchAll();
}

/**
 * 查找全部数据
 */
function SearchAll()
{
    //向后台发送服务请求和数据
    $.post("json/personTaskList!findAll.action",
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
            var dataList=$(data.personTaskListList);
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
    if($("#btncondition").text()=="任务编号"){
        item="planId";
    }
    else if($("#btncondition").text()=="任务名称"){
        item="planName";
    }
    else if($("#btncondition").text()=="任务类型"){
        item="planType";
    }
    else if($("#btncondition").text()=="保障任务编号"){
        item="demandId";
    }
    else if($("#btncondition").text()=="起始时刻"){
        item="t0";
    }
    else if($("#btncondition").text()=="作业区域"){
        item="planArea";
    }
    else if($("#btncondition").text()=="任务使命"){
        item="planContent";
    }
    else if($("#btncondition").text()=="任务状态"){
        item="planState";
    }
    else if($("#btncondition").text()=="编制人"){
        item="planEditPerson";
    }
    else if($("#btncondition").text()=="编制日期"){
        item="planEditDate";
    }
    else if($("#btncondition").text()=="计划审核人"){
        item="checkPerson";
    }
    else if($("#btncondition").text()=="计划审核意见"){
        item="checkView";
    }
    else if($("#btncondition").text()=="计划审核时间"){
        item="checkDate";
    }

    if(item=="planType"){ 
    	if(value=="陆保"){value="0"}
    	else if (value=="航保"){value="1"}
    }
    //向后台发送服务请求和数据
    $.post("json/personTaskList!findItems.action",
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
            var dataList=$(data.personTaskListList);
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
	currentPage = parseInt($("#Pagination option:selected").html());
	var ps;
	if(value.planState=="任务编制中"){ps="0"}
	else if(value.planState=="任务编制完"){ps="1"}
	else if(value.planState=="任务已下发"){ps="2"}
	else if(value.planState=="计划已提交"){ps="3"}
	else if(value.planState=="计划审核通过"){ps="4"}
	else if(value.planState=="计划审核未通过"){ps="5"}
	else if(value.planState=="作业任务下发"){ps="6"}
	else if(value.planState=="任务完成"){ps="7"}
	else if(value.planState=="任务取消"){ps="8"}
    var trstyle="";
    if (i % 2 == 1)
    {
        trstyle = "background: #EFEFEF;";
    }
    else
    {
        trstyle = "background: #f5f5f5;";
    }		
//alert(value.planState)
    var txtHtml = "";
    txtHtml +="<tr id='"+value.id+"' style='"+ trstyle + "'>";
    txtHtml +="<td>"+(i+1+(currentPage-1)*10)+"</td>";
    txtHtml +="<td >"+value.planId+"</td>";
    txtHtml +="<td>"+value.planName+"</td>";
    txtHtml +="<td>"+value.planType+"</td>";
	
	if(value.planContent.length > 50){
		txtHtml +="<td>"+value.planContent.substring(0,50)+"...</td>";
	}
	else{
		txtHtml +="<td>"+value.planContent+"</td>";		
	}
    txtHtml +="<td>"+value.planState+"</td>";
    txtHtml +="<td readable='td' pstate='"+ps+"' pname='"+value.planName+"'class='"+value.planId+"'>";
    txtHtml +="<a class='glyphicon glyphicon-search' readable='224' style='margin-left:10px;' title='查看' href='javascript:void(0)' id='"+value.planId+"' onclick='OnView(this)'></a>";
    txtHtml +="<a class='thisplanbtn1 glyphicon glyphicon-flag' readable='225' style='margin-left:15px;' title='设为当前任务'  href='javascript:void(0)' data-toggle='modal' data-keyboard='false' data-backdrop='static'></a>";
    txtHtml +="</td>";
    txtHtml +="</tr>";

    $("#tblist_body").append(txtHtml);
}



function getItemsInSession(){
	//通过Session值设置topbar
	$.post("json/personTaskList!getItemsInSession.action",
			{
			},
			function(data){
			if(data.planName&&data.planState&&data.planName!=null&&data.planState!=null){
					$("#currentPlan").text(data.planName);
					$("#planState").text("("+parseToChinese(data.planState)+")");
			}
			else{
					$("#currentPlan").text("无");
					$("#planState").text("");
			}
			});
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
    $.post("json/personTaskList!delete.action",
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
    $.post("json/personTaskList!deleteItems.action",
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
function OnView(o)
{	
    gWorkMode = WORK_MODE_VIEW;
    setControlsStatus(WORK_MODE_VIEW)

    //向后台发送服务请求和数据
    $.post("json/personTaskList!findItemById.action",
        {
            optionCode:"view",
            planId:o.id
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#planId").val(data.personTaskList.planId);
                $("#planName").val(data.personTaskList.planName);
                $("#planType").val(data.personTaskList.planType);
                $("#demandId").val(data.personTaskList.demandId);
                $("#T0").val(data.personTaskList.t0==null?"":data.personTaskList.t0.substr(0,10)); 
                $("#planArea").val(data.personTaskList.planArea);
                $("#planContent").val(data.personTaskList.planContent);
                $("#planState1").val(data.personTaskList.planState);
                $("#planEditPerson").val(data.personTaskList.planEditPerson);
                $("#planEditDate").val(data.personTaskList.planEditDate==null?"":data.personTaskList.planEditDate.substr(0,10));
                $("#checkPerson").val(data.personTaskList.checkPerson);
                $("#checkView").val(data.personTaskList.checkView);
                $("#checkDate").val(data.personTaskList.checkDate==null?"":data.personTaskList.checkDate.substr(0,10));
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
    $.post("json/personTaskList!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#planId").val(data.personTaskList.planId);
                $("#planName").val(data.personTaskList.planName);
                $("#planType").val(data.personTaskList.planType);
                $("#demandId").val(data.personTaskList.demandId);
                $("#T0").val(data.personTaskList.t0.substr(0,10));
                $("#planArea").val(data.personTaskList.planArea);
                $("#planContent").val(data.personTaskList.planContent);
                $("#planState1").val(data.personTaskList.planState);
                $("#planEditPerson").val(data.personTaskList.planEditPerson);
                $("#planEditDate").val(data.personTaskList.planEditDate.substr(0,10));
                $("#checkPerson").val(data.personTaskList.checkPerson);
                $("#checkView").val(data.personTaskList.checkView);
                $("#checkDate").val(data.personTaskList.checkDate.substr(0,10));
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
    if(!isValidDate($("#T0").val())){
    	alert("起始时刻必须是日期");
    	$("#T0").focus();
    	return;
    }

    if(!isValidDate($("#planEditDate").val())){
    	alert("编制日期必须是日期");
    	$("#planEditDate").focus();
    	return;
    }

    if(!isValidDate($("#checkDate").val())){
    	alert("计划审核时间必须是日期");
    	$("#checkDate").focus();
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
    $.post("json/personTaskList!save.action",
        {
            optionCode:"addnew",
            planId:$("#planId").val(),
            planName:$("#planName").val(),
            planType:$("#planType").val(),
            demandId:$("#demandId").val(),
            t0:$("#T0").val(),
            planArea:$("#planArea").val(),
            planContent:$("#planContent").val(),
            planState:$("#planState1").val(),
            planEditPerson:$("#planEditPerson").val(),
            planEditDate:$("#planEditDate").val(),
            checkPerson:$("#checkPerson").val(),
            checkView:$("#checkView").val(),
            checkDate:$("#checkDate").val(),
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
    $.post("json/personTaskList!update.action",
        {
            optionCode:"update",
            id:gCurId,
            planId:$("#planId").val(),
            planName:$("#planName").val(),
            planType:$("#planType").val(),
            demandId:$("#demandId").val(),
            t0:$("#T0").val(),
            planArea:$("#planArea").val(),
            planContent:$("#planContent").val(),
            planState:$("#planState1").val(),
            planEditPerson:$("#planEditPerson").val(),
            planEditDate:$("#planEditDate").val(),
            checkPerson:$("#checkPerson").val(),
            checkView:$("#checkView").val(),
            checkDate:$("#checkDate").val(),
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
	$("#planName").val("");
	$("#planType").val("");
	$("#demandId").val("");
	$("#T0").val("");
	$("#planArea").val("");
	$("#planContent").val("");
	$("#planState1").val("");
	$("#planEditPerson").val("");
	$("#planEditDate").val("");
	$("#checkPerson").val("");
	$("#checkView").val("");
	$("#checkDate").val("");
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
		$("#planName").attr("disabled",false);
		$("#planType").attr("disabled",false);
		$("#demandId").attr("disabled",false);
		$("#T0").attr("disabled",false);
		$("#planArea").attr("disabled",false);
		$("#planContent").attr("disabled",false);
		$("#planState1").attr("disabled",false);
		$("#planEditPerson").attr("disabled",false);
		$("#planEditDate").attr("disabled",false);
		$("#checkPerson").attr("disabled",false);
		$("#checkView").attr("disabled",false);
		$("#checkDate").attr("disabled",false);
        $("#btnsave").text("保存");
		$("#modaltitle").text("添加任务一览");
	}
    else if(workMode == WORK_MODE_UPDATE){
		$("#planId").attr("disabled",false);
		$("#planName").attr("disabled",false);
		$("#planType").attr("disabled",false);
		$("#demandId").attr("disabled",false);
		$("#T0").attr("disabled",false);
		$("#planArea").attr("disabled",false);
		$("#planContent").attr("disabled",false);
		$("#planState1").attr("disabled",false);
		$("#planEditPerson").attr("disabled",false);
		$("#planEditDate").attr("disabled",false);
		$("#checkPerson").attr("disabled",false);
		$("#checkView").attr("disabled",false);
		$("#checkDate").attr("disabled",false);
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改任务一览");
    }
    else if(workMode == WORK_MODE_VIEW){ 
		$("#planId").attr("disabled",true);
		$("#planName").attr("disabled",true);
		$("#planType").attr("disabled",true);
		$("#demandId").attr("disabled",true);
		$("#T0").attr("disabled",true);
		$("#planArea").attr("disabled",true);
		$("#planContent").attr("disabled",true);
		$("#planState1").attr("disabled",true);
		$("#planEditPerson").attr("disabled",true);
		$("#planEditDate").attr("disabled",true);
		$("#checkPerson").attr("disabled",true);
		$("#checkView").attr("disabled",true);
		$("#checkDate").attr("disabled",true);
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看任务一览");
    }
}
