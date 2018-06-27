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


    
    saveHcPlan();//保存room人员数据
    transferPeople();//左右箭头绑定
    
    $("#equipname").change(function(){
    	var v=$("#equipname").val(); 
    	$("#equipnum").html("");
    	var num=$("#equipname option:selected").attr("num");
		for(var i=0;i<num;i++){
			var html1="<option>"+(i+1)+"</option>";
			$("#equipnum").append(html1);
		}
    });
    
    $("#equipname1").change(function(){
    	var v=$("#equipname1").val(); 
    	$("#equipnum1").html("");
    	var num=$("#equipname1 option:selected").attr("num");
		for(var i=0;i<num;i++){
			var html1="<option>"+(i+1)+"</option>";
			$("#equipnum1").append(html1);
		}
    });
    
    $("#hcplanupdate").click(function(){
    	$.post("json/hcPlan!update.action",
    			{
    			id:gCurId,
    			 equipId:$("#equipname1").val(),
    			 equipOrder:$("#equipnum1").val()
    			},
    		function(data){
    				alert(data.msg);
    				$("#updatedialog").modal("hide");
    				SearchAll();
    			});
    		
    });
    

    //向后台发送服务请求和数据
    $.post("json/orderList!findAllLeaveOrder.action",
        {
            optionCode:"getAll"
        },
        function(data){

            if(data.actionStatus!="ok"){
                alert(data.msg);
                return;
            }
            // 创建分页
            $("#orderid").html("");
            var dataList=$(data.orderListList);
            $("#orderid").empty();
            $(dataList).each(function(){
            	var html="";
            	html+="<option>"+this.orderId+"</option>";
            	$("#orderid").append(html);
            });
           // alert($("#orderid option:first").html())
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
    $.post("json/hcPlan!findAll.action",
        {
            optionCode:"getAll"
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
            var dataList=$(data.hcPlanList);
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
    if($("#btncondition").text()=="人员"){
        item="personName";
    }
    else if($("#btncondition").text()=="波次"){
        item="orderId";
    }
    else if($("#btncondition").text()=="装备名称"){
        item="equip_name";
    }
    else if($("#btncondition").text()=="出动次序"){
        item="equipOrder";
    }
    else if($("#btncondition").text()=="装备编码"){
        item="equip_id";
    }

    //向后台发送服务请求和数据
    $.post("json/hcPlan!findItems.action",
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
            var dataList=$(data.hcPlanList);
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

    var txtHtml = "";
    txtHtml +="<tr id='"+value.id+"' style='"+ trstyle + "'>";
    txtHtml +="<td><input type='checkbox' name='sonChecked'/></td>";
	currentPage = parseInt($("#Pagination option:selected").html());
    txtHtml +="<td>"+(i+1+(currentPage-1)*10)+"</td>";
    txtHtml +="<td>"+isnull(value.personName)+"</td>";
    txtHtml +="<td>"+isnull(value.orderId)+"</td>";
    txtHtml +="<td>"+isnull(value.equipName)+"</td>";
    txtHtml +="<td>"+isnull(value.goodsNum)+"</td>";
    txtHtml +="<td>"+isnull(value.equipCode)+"</td>";
    txtHtml +="<td readable='td' id='"+value.id+"'>";
    txtHtml +="<a class='glyphicon glyphicon-remove' readable='233' style='margin-left:10px;' title='删除' href='javascript:void(0)' onclick='OnDeleteOne("+ value.id +")'></a>";
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


    
    var txtHtml = "";
    txtHtml +="<tr id='"+value.id+"' style='"+ trstyle + "'>";
    txtHtml +="<td><input type='checkbox' name='sonChecked'/></td>";
    txtHtml +="<td>"+(i+1)+"</td>";
    txtHtml +="<td>"+isnull(value.personName)+"</td>";
    txtHtml +="<td>"+isnull(value.orderId)+"</td>";
    txtHtml +="<td>"+isnull(value.equipName)+"</td>";
    txtHtml +="<td>"+isnull(value.equipOrder)+"</td>";
    txtHtml +="<td>"+isnull(value.listId)+"</td>";
    txtHtml +="<td id='"+value.id+"'>";
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
    $.post("json/hcPlan!delete.action",
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
    $.post("json/hcPlan!deleteItems.action",
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
 * 按下添加按钮，弹出添加页面
 *
 */
function OnAddNew(obj)
{
	 //绑定添加表
    $.post("json/staffOrderInfo!findAll.action",
			{
    			orderId:$("#orderid option:first").html()
			},
			function(data){
				
				$("#equipname").empty();
				$("#equipnum").empty();
				//下拉框
				$(data.staffOrderInfoList).each(function(){
					var html="<option value='"+this.id+":"+this.goodsType+":"+this.goodsId+"'>"+this.goodsName+"（容量："+this.goodsNum+"人）</option>"; 
					$("#equipname").append(html);
				});
				
				 //绑定添加表
			    $.post("json/hcPlan!findPersonNoEquip.action",
						{
			    			orderId:$("#orderid option:first").html(),
//			    "planOrderDetailListId":$("#equipname option:first").val()
						},
						function(data){
							var zNodes=[];
							var zNodesR=[];
							$("#ztreeL").empty();
							$("#ztreeR").empty();
							//左边
							showZtree(data.noEquipHcPlanList,data.noEquipHcPlanList,zNodes);
							//右边
							showZtree([],data.noEquipHcPlanList,zNodesR);
						
							var Lztree= $.fn.zTree.init($("#ztreeL"), setting, zNodes);
							var Rztree=$.fn.zTree.init($("#ztreeR"), settingR, zNodesR);
							});
			});
				 
    //添加工作模式
    gWorkMode = WORK_MODE_ADD;
    setControlsStatus(WORK_MODE_ADD);
    $("#modaldialog").modal("show");
}

//数展示
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
function saveHcPlan(){ 
	$("#hcplansave").unbind();
	$("#hcplansave").bind("click",function(e){
	
	Lztree=$.fn.zTree.getZTreeObj("ztreeL");
	Rztree=$.fn.zTree.getZTreeObj("ztreeR");
	
	var LNodes=Lztree.getNodesByFilter(function(node){
		 if(node.parentTId != null){ 
		 	return true;
		 }
		 });
	var nameList2=[];
	$.each(LNodes,function(){ 
		nameList2.push(this.name);
	});

	var l=eval('('+JSON.stringify(nameList2)+')');
	var LnameList=l.toString();
	var RNodes=Rztree.getNodesByFilter(function(node){
		 if(node.parentTId != null){ 
		 	return true;
		 }
		 });

	var nameList=[];
	$.each(RNodes,function(){ 
		nameList.push(this.name);
	});
	var r=eval('('+JSON.stringify(nameList)+')');
	var nameList1=r.toString();
	//alert($("#equipname option:selected").attr("id"));
	$.post("json/hcPlan!savePersonInEquip.action",
			{
//			LnameList:LnameList,
			 nameList:nameList1,
//			 equipId:$("#equipname option:selected").attr("id"),
//			 equipOrder:$("#equipnum").val(),
			 orderId:$("#orderid option:selected").text(),
			 equipInfo:$("#equipname option:selected").val()//planOrderDetailInfolistId:equipType:equipId
			},
			function(data){
				alert(data.msg);
				SearchAll();
				$("#modaldialog").modal("hide");
			});
	});
}

//绑定
function transferPeople(){
  	//人员选择 
	   //绑定右边箭头
 	$("#toright").bind("click",function(){		
 		Lztree=$.fn.zTree.getZTreeObj("ztreeL");
 		Rztree=$.fn.zTree.getZTreeObj("ztreeR");
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
 * 按下查看按钮，弹出查看页面
 *
 */
function OnView(recId)
{
    gWorkMode = WORK_MODE_VIEW;
    setControlsStatus(WORK_MODE_VIEW)

    //向后台发送服务请求和数据
    $.post("json/hcPlan!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#personName").val(data.hcPlan.personName);
                $("#orderId").val(data.hcPlan.orderId);
                $("#equipName").val(data.hcPlan.equipName);
                $("#equipOrder").val(data.hcPlan.equipOrder);
                $("#equipId").val(data.hcPlan.equipId);
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
    $.post("json/hcPlan!findItemById.action",
        {
            optionCode:"view",
            id:recId
        },
        function(data){
            if(data.actionStatus == "ok"){
                $("#equipname1").val(data.hcPlan.equipName);
                $("#equipnum1").val(data.hcPlan.equipOrder);
                $("#updatedialog").modal("show");
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
    	alert("波次必须是整数");
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
    $.post("json/hcPlan!save.action",
        {
            optionCode:"addnew",
            personName:$("#personName").val(),
            orderId:$("#orderId").val(),
           
            equipOrder:$("#equipOrder").val(),
            equipId:$("#equipId").val(),
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
    $.post("json/hcPlan!update.action",
        {
            optionCode:"update",
            id:gCurId,
            personName:$("#personName").val(),
            orderId:$("#orderId").val(),
            equipName:$("#equipName").val(),
            equipOrder:$("#equipOrder").val(),
            equipId:$("#equipId").val(),
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
	$("#personName").val("");
	$("#orderId").val("");
	$("#equipName").val("");
	$("#equipOrder").val("");
	$("#equipId").val("");
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
		$("#personName").attr("disabled",false);
		$("#orderId").attr("disabled",false);
		$("#equipName").attr("disabled",false);
		$("#equipOrder").attr("disabled",false);
		$("#equipId").attr("disabled",false);
        $("#btnsave").text("保存");
		$("#modaltitle").text("添加换乘计划");
	}
    else if(workMode == WORK_MODE_UPDATE){
		$("#personName").attr("disabled",false);
		$("#orderId").attr("disabled",false);
		$("#equipName").attr("disabled",false);
		$("#equipOrder").attr("disabled",false);
		$("#equipId").attr("disabled",false);
        $("#btnsave").text("保存");
        $("#modaltitle").text("修改换乘计划");
    }
    else if(workMode == WORK_MODE_VIEW){
		$("#personName").attr("disabled",true);
		$("#orderId").attr("disabled",true);
		$("#equipName").attr("disabled",true);
		$("#equipOrder").attr("disabled",true);
		$("#equipId").attr("disabled",true);
        $("#btnsave").text("确认");
        $("#modaltitle").text("查看换乘计划");
    }
}

function changeZBType(o){
//	alert($("#orderid option:selected").html())
	 //绑定添加表
    $.post("json/staffOrderInfo!findAll.action",
			{
    			orderId:$("#orderid option:selected").html()
			},
			function(data){
				$("#equipname").empty();
				//下拉框
				$(data.staffOrderInfoList).each(function(){
					var html="<option value='"+this.id+":"+this.goodsType+":"+this.goodsId+"'>"+this.goodsName+"（容量："+this.goodsNum+"人）</option>"; 
					$("#equipname").append(html);
				});
				 //绑定添加表
			    $.post("json/hcPlan!findPersonNoEquip.action",
						{
			    			orderId:$("#orderid option:selected").html()
//			    "planOrderDetailListId":$("#equipname option:first").val()
						},
						function(data){
							var zNodes=[];
							var zNodesR=[];
							$("#ztreeL").empty();
							$("#ztreeR").empty();
							//左边
							showZtree(data.noEquipHcPlanList,data.noEquipHcPlanList,zNodes);
							//右边
							showZtree([],data.noEquipHcPlanList,zNodesR);
						
							var Lztree= $.fn.zTree.init($("#ztreeL"), setting, zNodes);
							var Rztree=$.fn.zTree.init($("#ztreeR"), settingR, zNodesR);
							});
	});
}
