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
    
    $(document).on(
    	{click:function(e){
    		e.stopPropagation();
    		var id=$(this).parent("td").attr("id");
    		var maxnum=$(this).parent("td").attr("num");
    		$.post("json/cabinAssign!findPeopleByItemAndValue.action",
    				{
    				 roomId:id,
    				},
    				function(data){
    					var zNodes=[];
    					var zNodesR=[];
    					$("#ztreeL").empty();
    					$("#ztreeR").empty();
    					//左边
    					showZtree(data.noRoomPersonList,data.staffInfoMgList,zNodes);
    					//右边
    					showZtree(data.inRoomPersonList,data.staffInfoMgList,zNodesR);
    				
    					var Lztree= $.fn.zTree.init($("#ztreeL"), setting, zNodes);
    					var Rztree=$.fn.zTree.init($("#ztreeR"), settingR, zNodesR);
    					transferPeople(Lztree,Rztree);//左右箭头绑定
    					saveRoom(Lztree,Rztree,id);//保存room人员数据
    					$("#roomid").val(id);
    					$("#maxnum").val(maxnum);
    					$("#detailDlg").modal("show");
    					});
    	}},	
    	".detailbtn"
    	);
}


function showZtree(personList1,personList2,zNodes){ 
	$.each(personList1,function(i,value){	
			var zNodes1 ='{"id":"'+(i+1)+'", "pId":"0", "name":"'+value.groupName+'", "open":"true"}';
			var zChildNodes='{ "pId":"'+(i+1)+'", "name":"'+value.personName+'"}';
			var flag=0;
			for(var a=0;a<zNodes.length;a++){
				if((JSON.parse(zNodes1).name==zNodes[a].name)&&(zNodes[a].pId=="0")){	
					zChildNodes='{ "pId":"'+(zNodes[a].id)+'", "name":"'+value.personName+'"}'; 	
						flag=1;
						break;
						}
					}
				if(flag==0){
					zNodes.push(JSON.parse(zNodes1));
					}
					zNodes.push(JSON.parse(zChildNodes)); 
					});
	$.each(personList2,function(i,value){
			var zNodes1 ='{"id":"'+(personList1.length+i+1)+'","pId":"0", "name":"'+value.groupName+'", "open":"true"}'; 
			var flag=0;
			for(var a=0;a<zNodes.length;a++){
				if((JSON.parse(zNodes1).name==zNodes[a].name)&&(zNodes[a].pId=="0")){
					flag=1;
					break;
					}
				}
			if(flag==0){
				zNodes.push(JSON.parse(zNodes1));
				}
			
			});

}


//保存人员数据
function saveRoom(Lztree,Rztree,id){
	$("#saveRoom").unbind();
	$("#saveRoom").bind("click",function(e){
		e.stopPropagation();
		e.cancelBubble=true;
		var RnameList=[];
		var LnameList=[];
		var RNodes=Rztree.getNodesByFilter(function(node){
			 if(node.parentTId != null){ 
			 	return true;
			 }
			 });
		$.each(RNodes,function(){ 
			RnameList.push(this.name);
		});
//		var f=true;

		
		var LNodes=Lztree.getNodesByFilter(function(node){
			 if(node.parentTId != null){ 
			 	return true;
			 }
			 });
		$.each(LNodes,function(){ 
			LnameList.push(this.name);
		});
		var l=eval('('+JSON.stringify(LnameList)+')');
		var r=eval('('+JSON.stringify(RnameList)+')');
		var nameListL=l.toString();
		var nameListR=r.toString();
		$.post("json/cabinAssign!savePersonInRoom.action",
			{
			 LnameList:nameListL,
			 RnameList:nameListR,
			 roomId:id
			},
			function(data){
				SearchAll();
				$("#detailDlg").modal("hide");
			});
		});
}



//绑定
function transferPeople(Lztree,Rztree){

  	//人员选择 
	   //绑定右边箭头
 	$("#toright").bind("click",function(){		
		var nodes=Lztree.getNodesByFilter(function(node){
			if(node.parentTId != null){ 
  				if(node.checked==true){
  				return true;
  				}
  			}
		});
		$(nodes).each(function(i,e){
		var pnode = Rztree.getNodeByParam("name", e.getParentNode().name, null);
		 Rztree.addNodes(pnode,e);
		 Lztree.removeNode(this);
		});
	
		 LNodes=Lztree.getNodesByFilter(function(node){
		 if(node.parentTId != null){ 
		 	return true;
		 }
		 });
 		RNodes=Rztree.getNodesByFilter(function(node){
		 if(node.parentTId != null){ 
		 	return true;
		 }
		 });
	
		$("#leftCount").html("待选"+$(LNodes).length+"人");
		$("#rightCount").html("已选"+$(RNodes).length+"人");
	});
	
	//绑定左边箭头
	$("#toleft").bind("click",function(){		
		var nodes=Rztree.getNodesByFilter(function(node){
			if(node.parentTId != null){ 
  				if(node.checked==true){
  				return true;
  				}
  			}
		});
		$(nodes).each(function(i,e){
			var pnode = Lztree.getNodeByParam("name", e.getParentNode().name, null);
			 Lztree.addNodes(pnode,e);
			 Rztree.removeNode(this);
		});
		
		// 设置人数
		 LNodes=Lztree.getNodesByFilter(function(node){
		 if(node.parentTId != null){ 
		 	return true;
		 }
		 });
 		 RNodes=Rztree.getNodesByFilter(function(node){
		 if(node.parentTId != null){ 
		 	return true;
		 }
		 });
		
		$("#leftCount").html("待选"+$(LNodes).length+"人");
		$("#rightCount").html("已选"+$(RNodes).length+"人");
	});

}

//树
function filter(node) {
  		if(node.parentTId != null){ 
  			if(node.checked==true){
  			return true;
  			}
  		}
	} 
 
  var setting = {
			data: {
				simpleData: {
					enable: true
				}
			},
			check: {
				enable: true,
				nocheckInherit: true,
				chkStyle: "checkbox",
			}
		};
		


 var settingR = {
			data: {
				simpleData: {
					enable: true
				}
			},
			check: {
				enable: true,
				chkStyle: "checkbox",
			}
		};
		

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
    $.post("json/cabinAssign!findAll.action",
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
            var dataList=$(data.cabinAssignList);
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
    if($("#btncondition").text()=="住舱房间号"){
        item="roomId";
    }
    else if($("#btncondition").text()=="居住人员"){
//        item="staffList";
    }
    else if($("#btncondition").text()=="舱室容量"){
        item="maxNum";
    }
    else if($("#btncondition").text()=="住舱级别"){
        item="roomRank";
    }
    else if($("#btncondition").text()=="住舱分区"){
        item="maleRemale";
    }
    else if($("#btncondition").text()=="所属甲板"){
        item="floor";
    }
    else if($("#btncondition").text()=="当前容量"){
        item="currentNum";
    }

    if(item=="roomRank"){ 
    	if(value=="军官"){value="0"}
    	else if (value=="士兵"){value="1"}
    }
    if(item=="maleRemale"){ 
    	if(value=="男性"){value="0"}
    	else if (value=="女性"){value="1"}
    }
    //向后台发送服务请求和数据
    $.post("json/cabinAssign!findItems.action",
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
            var dataList=$(data.cabinAssignList);
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

    
    if(value.roomRank==0){
    	value.roomRank="军官";
    }
    else if(value.roomRank==1){
    	value.roomRank="士兵";
    }
    if(value.maleRemale==0){
    	value.maleRemale="男性";
    }
    else if(value.maleRemale==1){
    	value.maleRemale="女性";
    }
    
	var personNameTxt="无";
	var personCount = 0;
	var cabinState="";
	$(this.staffInfoMgList).each(function(){ 
		personNameTxt=personNameTxt+this.personName+" ";
		personCount += 1;
		personNameTxt=personNameTxt.replace("无","");
	});
    var txtHtml = "";
    txtHtml +="<tr id='"+value.roomId+"' style='"+ trstyle + "'>";
    txtHtml +="<td>"+(i+1+(currentPage-1)*10)+"</td>";
    txtHtml +="<td>"+value.roomId+"</td>";
    txtHtml +="<td>"+personNameTxt+"</td>";
    txtHtml +="<td>"+value.maxNum+"</td>";
    txtHtml +="<td>"+value.roomRank+"</td>";
    txtHtml +="<td>"+value.maleRemale+"</td>";
    txtHtml +="<td>"+value.floor+"</td>";
    txtHtml +="<td>"+personCount+"</td>";
    txtHtml +="<td readable='td' num='"+value.maxNum+"' id='"+value.roomId+"' pstate='"+value.planState+"' pname='"+value.planName+"'class='"+value.planId+"'>";
    txtHtml +="<a class='detailbtn glyphicon glyphicon-user' readable='235' style='margin-left:15px;' title='分配舱室'  href='javascript:void(0)' data-toggle='modal' data-keyboard='false' data-backdrop='static'></a>";
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

    
	var personNameTxt="无";
	var personCount = 0;
	var cabinState="";
	$(this.staffInfoMgList).each(function(){ 
		personNameTxt=personNameTxt+this.personName+" ";
		personCount += 1;
		personNameTxt=personNameTxt.replace("无","");
	});
    var txtHtml = "";
    txtHtml +="<tr id='"+value.roomId+"' style='"+ trstyle + "'>";
    txtHtml +="<td>"+(i+1)+"</td>";
    txtHtml +="<td>"+value.roomId+"</td>";
    txtHtml +="<td>"+personNameTxt+"</td>";
    txtHtml +="<td>"+value.maxNum+"</td>";
    txtHtml +="<td>"+value.roomRank+"</td>";
    txtHtml +="<td>"+value.maleRemale+"</td>";
    txtHtml +="<td>"+value.floor+"</td>";
    txtHtml +="<td>"+personCount+"</td>";
    txtHtml +="<td num='"+value.maxNum+"' id='"+value.roomId+"' pstate='"+value.planState+"' pname='"+value.planName+"'class='"+value.planId+"'>";
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
    $.post("json/cabinAssign!delete.action",
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
    $.post("json/cabinAssign!deleteItems.action",
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
    $.post("json/cabinAssign!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#roomId").val(data.cabinAssign.roomId);
//                $("#staffList").val(data.cabinAssign.staffList);
                $("#maxNum").val(data.cabinAssign.maxNum);
                $("#roomRank").val(data.cabinAssign.roomRank);
                $("#maleRemale").val(data.cabinAssign.maleRemale);
                $("#floor").val(data.cabinAssign.floor);
                $("#currentNum").val(data.cabinAssign.currentNum);
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
    $.post("json/cabinAssign!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#roomId").val(data.cabinAssign.roomId);
//                $("#staffList").val(data.cabinAssign.staffList);
                $("#maxNum").val(data.cabinAssign.maxNum);
                $("#roomRank").val(data.cabinAssign.roomRank);
                $("#maleRemale").val(data.cabinAssign.maleRemale);
                $("#floor").val(data.cabinAssign.floor);
                $("#currentNum").val(data.cabinAssign.currentNum);
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
    if(!isValidInteger($("#maxNum").val())){
    	alert("舱室容量必须是整数");
    	$("#maxNum").focus();
    	return;
    }

    if(!isValidInteger($("#currentNum").val())){
    	alert("当前容量必须是整数");
    	$("#currentNum").focus();
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
    $.post("json/cabinAssign!save.action",
        {
            optionCode:"addnew",
            roomId:$("#roomId").val(),
//            staffList:$("#staffList").val(),
            maxNum:$("#maxNum").val(),
            roomRank:$("#roomRank").val(),
            maleRemale:$("#maleRemale").val(),
            floor:$("#floor").val(),
            currentNum:$("#currentNum").val(),
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
    $.post("json/cabinAssign!update.action",
        {
            optionCode:"update",
            id:gCurId,
            roomId:$("#roomId").val(),
//            staffList:$("#staffList").val(),
            maxNum:$("#maxNum").val(),
            roomRank:$("#roomRank").val(),
            maleRemale:$("#maleRemale").val(),
            floor:$("#floor").val(),
            currentNum:$("#currentNum").val(),
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
	$("#roomId").val("");
//	$("#staffList").val("");
	$("#maxNum").val("");
	$("#roomRank").val("");
	$("#maleRemale").val("");
	$("#floor").val("");
	$("#currentNum").val("");
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
		$("#roomId").attr("disabled",false);
//		$("#staffList").attr("disabled",false);
		$("#maxNum").attr("disabled",false);
		$("#roomRank").attr("disabled",false);
		$("#maleRemale").attr("disabled",false);
		$("#floor").attr("disabled",false);
		$("#currentNum").attr("disabled",false);
        $("#btnsave").text("保存");
		$("#modaltitle").text("添加舱室分配");
	}
    else if(workMode == WORK_MODE_UPDATE){
		$("#roomId").attr("disabled",false);
//		$("#staffList").attr("disabled",false);
		$("#maxNum").attr("disabled",false);
		$("#roomRank").attr("disabled",false);
		$("#maleRemale").attr("disabled",false);
		$("#floor").attr("disabled",false);
		$("#currentNum").attr("disabled",false);
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改舱室分配");
    }
    else if(workMode == WORK_MODE_VIEW){
		$("#roomId").attr("disabled",true);
//		$("#staffList").attr("disabled",true);
		$("#maxNum").attr("disabled",true);
		$("#roomRank").attr("disabled",true);
		$("#maleRemale").attr("disabled",true);
		$("#floor").attr("disabled",true);
		$("#currentNum").attr("disabled",true);
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看舱室分配");
    }
}
