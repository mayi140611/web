//var pathname = window.document.location.pathname;
//var curwwwpath = window.document.location.href;
//var pos = curwwwpath.indexOf(pathname);
//var localhostpath = curwwwpath.substring(0,pos);
//var projectname = pathname.substring(0,pathname.substr(1).indexOf('/')+1);
//var basepath = localhostpath+projectname;


function closeadd(){
	$('#addModal').modal('hide');
	$("#error").html('');
}

function closeedit(){
	$('#editModal').modal('hide');
	$("#error2").html('');
}

//刷新数据列表
function myreload(){
	if(otherbutton){
	 $("#datalist").myload(tempurl,tempcolumns,otherbutton);
	 }else{
	 $("#datalist").myload(tempurl,tempcolumns);
	 }
}
	
	function saveadd(url) {
			$('#addform').form('submit',{//引入Easyui的Form   
                url:url,//URL指向添加的Action   
                method:'post',
                onSubmit: function(){  
                },
                success:function(data){
                  var data1 = eval('(' + data + ')'); 
                  if(!data1.flag){
			      	$("#error").text(data1.msg);
			      	$("#error").css("display","block");
		          }else{
		          	hiOverAlert('保存成功',1500); 
		          	closeadd();
	                //刷新列表
	                myreload();
		           }
                }  
            });
		}
		
		function saveedit(url) {
			$('#editform').form('submit',{//引入Easyui的Form   
                url:url,//URL指向添加的Action   
                method:'post',
                onSubmit: function(){  
                },
                success:function(data){
                  var data1 = eval('(' + data + ')'); 
                  if(!data1.flag){
			      	$("#error2").text(data1.msg);
			      	$("#error2").css("display","block");
		          }else{
		          	hiOverAlert('修改成功',1500); 
		          	closeedit();
	                //刷新列表
	                myreload();
		           }
                }  
            });
		}
	function deletewarning(id,url,type){
	hiConfirm('确认删除此信息吗?', '确认框', function(r) {
		if(r){
			 $.ajax({
                   type:       "POST",
                   url:        url,      //可改为调用的.do路径
                   data:       type+".id="+id,
                   dataType:   'json',
                   success:    function(data) { 
		           		if(!data.flag){
					   		alert(data.msg);   
				         }else{
				          	hiOverAlert('删除成功',1500);  
			                //刷新列表
			              myreload();
				         }
                   }
               });
		}
	 });
	}
	

	
	$(function (){

$.fn.myload = function(url,columns,otherbutton,readonly){
	var myobj = this;
	var html = "<table id='tblinfo'  class='col-md-12 table table-bordered table-hover text-center table-striped' style='margin-top:15px;'>"
			+"<tr class='info'>"
			+"<th class='text-center'>序号</th>";
	$.each(columns,function (j,item2){
		html += "<td>"+item2.title+"</td>";
	})
	if(!readonly){
		html += "<td width='150'>操作</td>";
	}
	html += "</tr>";
	$.ajax({
        type:       "POST",
        url:        url,      //可改为调用的.do路径
        dataType:   'json',
        success:    function(data) {
        	$.each(data.page.datas,function (i,item){
        		html += "<tr><td>"+eval("("+i+"+"+data.page.pagesize*(data.page.pageno-1)+"+1)")+"</td>";
				$.each(columns,function (j,item2){
					html += "<td>"+(eval("item."+item2.field))+"</td>";
				})
				var otherbuttons = "";
				if(otherbutton){
					$.each(otherbutton,function (k,item3){
						otherbuttons += "<a readable='"+item3.biaozhi+"' title='"+item3.title+"' class='cz_"+item3.biaozhi+"' onclick="+item3.biaozhi+"("+item.id+") style='text-decoration: none;margin-left: 10px;cursor:pointer'></a>";
					})
				}
				if(!readonly){
				html += "<td width='120px'>"
						+"<a readable='edit' href='javascript:void' data-toggle='modal' style='text-decoration: none;margin-left: 10px;' onclick=edit("+item.id+") title='修改' class='cz_edit' ></a>"
						+"<a readable='del' onclick=del("+item.id+") style='text-decoration: none;margin-left: 10px;cursor:pointer;' title='删除' class='cz_del'></a>"
						+otherbuttons
						+"</td>";
				}
				html += "</tr>";
			})
			html += "</table>";
			$(myobj).html(html);
			$("#totalpage").html(data.page.total);
			var pageselect = "";
			for(var i=1;i<=data.page.pagecount;i++){
				if(i==data.page.pageno){
					pageselect+="<option value='"+i+"' selected>"+i+"&nbsp;</option>";
				}else{
					pageselect+="<option value='"+i+"'>"+i+"&nbsp;</option>";
				}
			}
			$("#pageselect").html(pageselect);
			$.each($("a[readable]"),function(i,item){
			
				if(caidanquanxian.indexOf("Role_"+$(item).attr("readable")+"$")<0){
		   			$(item).attr("style","display:none");
		   		}
				
			})   
			$("#beforepage").attr("onclick","chaxun('"+eval("("+data.page.pageno+"-1)")+"');return false;");
			$("#nextpage").attr("onclick","chaxun('"+eval("("+data.page.pageno+"+1)")+"');return false;");
        }
    });

}

	//查找条件事件处理
	$(document).on({
		click:function(e){ 
			e.preventDefault(); 
			e.stopPropagation();
			 var info = $(this).text();
            $("#btncondition").html(info+"<span class='caret'></span>");
		}
	},  "#optionSearch a");
	
	
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

});

function getnow(){
	var mydate=new Date();
	var year = mydate.getFullYear();
	var month = mydate.getMonth()+1;
	var day = mydate.getDate();
	var hour = mydate.getHours();
	var min = mydate.getMinutes();
	var ss = mydate.getSeconds();
	if(month<10){
		month = "0"+month;
	}
	if(day<10){
		day = "0"+day;
	}
	return year+"-"+month+"-"+day+" "+hour+":"+min+":"+ss;
} 

function limitTA(num,id){
	var text = document.getElementById(id).value;
	if(text.length>num){
		text = text.substring(0,num);
		document.getElementById(id).value = text;
	}
}

function closeother(modelid,msgid){
	$('#'+modelid).modal('hide');
	$("#"+msgid).html('');
}