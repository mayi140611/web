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

    
	var setting = {
			check: {
				enable: true,
				chkStyle: "checkbox",
				chkboxType: { "Y": "p", "N": "s" }
			},
			data: {
				simpleData: {
					enable: true
				}
			}
		};
    
    var roleId;
    var roleSet;
    $(document).on({
    	click:function(){
    		roleId=$(this).attr("id");
    		$("#roleid").text(roleId);
    		$.post("json/roleSet!getAllResources.action",
    				{},
    		function(data){
    			var zNodes="";
    			var zNodes1=[];
    			$(data.resources).each(function(){
    				zNodes='{ "id":"'+this.resourceid+'", "pId":"'+this.pId+'", "name":"'+this.name+'"'; 
    				if(this.pId<10){
    					zNodes+=',"open":true';
    				}
    				zNodes+='}'; 
    				zNodes1.push(JSON.parse(zNodes));
    			});
    			$.fn.zTree.init($("#userroletree"), setting, zNodes1);
    			var treeObj = $.fn.zTree.getZTreeObj("userroletree");
    			$.post("json/roleSet!findItemById.action",
    					{id:roleId},
    					function(data){
    						roleSet=data.roleSet;
    						var nodes = treeObj.getNodesByFilter(filter); // 查找节点集合
    			  			$(nodes).each(function(i,e){
    		    				treeObj.checkNode(e, true, true);
    		    			});
    			  			
    			  			function filter(node) {
    			  			  	var bool=false;
    			  			  	var rId=roleSet.resourceId;
    			  			  	var Rid=rId.split(",");  
    			  			  	if(Rid.indexOf(node.id)>0){ 
    			  			  		bool=true;
    			  			  	}
    			  				return bool;
    			  			}
    			});
    			

    			$("#importmodal").modal({
    				keyboard:false,
    				backdrop:true
    				});
    		});
    	}
    },".detailbtn");
    
    //查找全部数据
    SearchAll();
}

	function filter1(node) {
				if(node.checked==true){
				return true;
				}
	} 


	function submit(){
  		var treeObj = $.fn.zTree.getZTreeObj("userroletree");
  		var nodes=treeObj.getNodesByFilter(filter1);
  		var checknodes="";
  		var roleId=$("#roleid").text();
  		$.each(nodes,function(){
  			checknodes+=this.id+",";
  		});
  		var c=checknodes.substring(0,checknodes.length-1);
	  	$.post("json/roleSet!update.action",
	  	{
	  	id:roleId,
	  	checknodes:c,
	  	},
	  	function(data){
	  	if(data.msg){
	  		alert(data.msg);
	  		$("#importmodal").modal("hide");
	  		window.location.href="http://localhost:8080/Dblb/left.action?val=roleset";
	  		}
	  	});
  	}
/**
 * 查找全部数据
 */
function SearchAll()
{
    //向后台发送服务请求和数据
    $.post("json/roleSet!findAll.action",
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
            var dataList=$(data.roleSetList);
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
    if($("#btncondition").text()=="角色名称"){
        item="roleName";
    }

    //向后台发送服务请求和数据
    $.post("json/roleSet!findItems.action",
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
            var dataList=$(data.roleSetList);
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
    txtHtml +="<td><input type='checkbox' name='sonChecked'/></td>";
	currentPage = parseInt($("#Pagination option:selected").html());
    txtHtml +="<td>"+(i+1+(currentPage-1)*10)+"</td>";
    txtHtml +="<td>"+value.roleName+"</td>";
    txtHtml +="<td id='"+value.id+"'>";
    txtHtml +="<a class='glyphicon glyphicon-remove' style='margin-left:10px;' title='删除' href='javascript:void(0)' onclick='OnDeleteOne("+ value.id +")'></a>";
    txtHtml +="<a id='"+value.id+"'  class='detailbtn glyphicon glyphicon-user' style='margin-left:15px;'  data-toggle='modal' data-keyboard='false' data-backdrop='static'></a>";
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
    $.post("json/roleSet!delete.action",
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
    $.post("json/roleSet!deleteItems.action",
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
    $.post("json/roleSet!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#roleName").val(data.roleSet.roleName);
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
    $.post("json/roleSet!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#roleName").val(data.roleSet.roleName);
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
    $.post("json/roleSet!save.action",
        {
            optionCode:"addnew",
            roleName:$("#roleName").val(),
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
    $.post("json/roleSet!update.action",
        {
            optionCode:"update",
            id:gCurId,
            roleName:$("#roleName").val(),
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
	$("#roleName").val("");
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
		$("#roleName").attr("disabled",false);
        $("#btnsave").text("保存");
		$("#modaltitle").text("添加角色设置");
	}
    else if(workMode == WORK_MODE_UPDATE){
		$("#roleName").attr("disabled",false);
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改角色设置");
    }
    else if(workMode == WORK_MODE_VIEW){
		$("#roleName").attr("disabled",true);
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看角色设置");
    }
}
