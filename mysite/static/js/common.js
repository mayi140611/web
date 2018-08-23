var g_head_height = 130;
var g_subbody_title_height = 34;
var g_sub_title_height = 24;
var g_pagebar_height = 36;


var g_pageSize = 72;

var g_ajax_index = 0;
Function.prototype.bindAsEventListener = function(object) 
{ 
  var __method = this; 
  return function(event) 
  { 
    __method.call(object, event || window.event); 
  } 
}

Function.prototype.bind = function(object) {
  var __method = this;
  return function() {
    __method.apply(object, arguments);
  }
}
String.prototype.trim= function(){  
    return this.replace(/(^\s*)|(\s*$)/g, "");  
}


function addListener(obj, name, func)
{
	if (obj.addEventListener) {//firefox
		return obj.addEventListener(name, func, false)
	} else if (obj.attachEvent) {//IE
		return obj.attachEvent("on" + name, func);
	} else {
		return obj["on" + name] = func;
	}
}

function removeListener(obj, name, func)
{
	if (obj.removeEventListener) {
		return obj.removeEventListener(name, func, false)
	} else if (obj.detachEvent) {
		return obj.detachEvent("on" + name, func)
	} else {
		return obj["on" + name] = null;
	}
}

function stopEvent(e)
{
	stopEventDefault(e);
	stopEventBubble(e);
}

function stopEventBubble(e)
{
	if (!e) {
		e = window.event;
	}
	if( !e ){       //*** add by nishino
	    return ;
	}
	if (e.preventDefault) {
		e.stopPropagation();
	} else {
		e.cancelBubble = true;
	}
}

function stopEventDefault(e)
{
	if (!e) {
		e = window.event;
	}
	if( !e ){
	    return ;
	}
	if (e.preventDefault) {
		e.preventDefault();
	} else {
		e.returnValue = false;
	}
}

function CPoint(x,y)
{
	this.x=x;
	this.y=y;
}

function CEnvelop(left,bottom,right,top)
{
	this.left = left;
	this.bottom = bottom;
	this.right = right;
	this.top = top;
}

function getObjectPoint(obj, tobj)
{
	var point;
	if (typeof obj.offsetX != "undefined") {
		var temp = obj.target || obj.srcElement;
		point = getDeltaPoint(temp, tobj);
		return new CPoint(obj.offsetX + point.x, obj.offsetY + point.y);
	} else if (typeof obj.pageX != "undefined") {
		point = _getObjectPoint(tobj);
		return new CPoint(obj.pageX - point.x, obj.pageY - point.y);
	} else {
		return new CPoint(0, 0);
	}
}

function _getObjectPoint(obj)
{
	var point = new CPoint(0, 0);
	while (obj) {
		point.x += obj.offsetLeft;
		point.y += obj.offsetTop;
		obj = obj.offsetParent;
	}
	return point;
}

function getDeltaPoint(obj, tobj)
{
	var point = new CPoint(0, 0);
	while (obj && obj != tobj) {
		point.x += obj.offsetLeft;
		point.y += obj.offsetTop;
		obj = obj.offsetParent;
	}
	return point;
}
//检测是有是有效的ID（以字母开头，【字母】【数字】【_】有效）
function isValidId(str)
{
	var patrn=/^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){0,129}$/; 
	if (patrn.exec(str)) 
	{
		return true;
	}
	return false;
}
//是否是邮件地址
function isValidEmail(str) {
	var myReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/; 
	if (myReg.test(str)) 
		return true; 
	return false; 
}
//是否是汉字
function isValidZh(str)
{
 var reg = /^[\u4e00-\u9fa5]+$/;
 if (reg.test(str))
 	 return true;
 return false;
}
//是否是数字
function isValidNumber(str) {
    var regex = /^[+|-]?\d*\.?\d*$/;
    if (!regex.test(str)){
        return false;
    }
    return true;
}
function isValidNumberEx (str,min,max,len) {
    var regex;
	if(len == undefined)
	{
		regex = /^[+|-]?\d*\.?\d*$/;
	}
	else if (len == 0)
	{
		regex = /^[+|-]?\d*$/;
	}
	else
	{
		regex = eval("/^[+|-]?\\d*\\.?\\d{1,"+len+"}$/");
 	}
	
    if (!regex.test(str))
    {
        return false;
    }
    if (min != undefined)
    {
    	if (Number(str) < min)
    	{
            return false;
    	}
    }
    if (max != undefined)
    {
    	if (Number(str) > max)
    	{
            return false;
    	}
    }
   return true;
}
function isValidInteger (str) {
				
    var regex = /^[+|-]?\d*$/;
    if (!regex.test(str))
    {
        return false;
    }
    return true;
}
function isValidIntegerEx (str,min,max) {
    var regex = /^[+|-]?\d*$/;
    if (!regex.test(str))
    {
        return false;
    }
    if (min != undefined)
    {
    	if (Number(str) < min)
    	{
            return false;
    	}
    }
    if (max != undefined)
    {
    	if (Number(str) > max)
    	{
            return false;
    	}
    }
   return true;
}
function isValidDate (str) {
    var regex = /((^((1[8-9]\d{2})|([2-9]\d{3}))([\-])(10|12|0[13578])([\-])(3[01]|[12][0-9]|0[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([\-])(11|0[469])([\-])(30|[12][0-9]|0[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([\-])(02)([\-])(2[0-8]|1[0-9]|0[1-9])$)|(^([2468][048]00)([\-])(02)([\-])(29)$)|(^([3579][26]00)([\-])(02)([\-])(29)$)|(^([1][89][0][48])([\-])(02)([\-])(29)$)|(^([2-9][0-9][0][48])([\-])(02)([\-])(29)$)|(^([1][89][2468][048])([\-])(02)([\-])(29)$)|(^([2-9][0-9][2468][048])([\-])(02)([\-])(29)$)|(^([1][89][13579][26])([\-])(02)([\-])(29)$)|(^([2-9][0-9][13579][26])([\-])(02)([\-])(29)$))/;
    if (!regex.test(str))
    {
        return false;
    }
   return true;
}
function isValidStartEndDate (start,end) {
    var regex = /((^((1[8-9]\d{2})|([2-9]\d{3}))([\-])(10|12|0[13578])([\-])(3[01]|[12][0-9]|0[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([\-])(11|0[469])([\-])(30|[12][0-9]|0[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([\-])(02)([\-])(2[0-8]|1[0-9]|0[1-9])$)|(^([2468][048]00)([\-])(02)([\-])(29)$)|(^([3579][26]00)([\-])(02)([\-])(29)$)|(^([1][89][0][48])([\-])(02)([\-])(29)$)|(^([2-9][0-9][0][48])([\-])(02)([\-])(29)$)|(^([1][89][2468][048])([\-])(02)([\-])(29)$)|(^([2-9][0-9][2468][048])([\-])(02)([\-])(29)$)|(^([1][89][13579][26])([\-])(02)([\-])(29)$)|(^([2-9][0-9][13579][26])([\-])(02)([\-])(29)$))/;
    if (!regex.test(start))
    {
        return -1001;
    }
    if (!regex.test(end))
    {
        return -1002;
    }
    
	var startDate = new Date(start.replace(/-/g,"/"));
	var endDate = new Date(end.replace(/-/g,"/"));
    if (startDate.getTime() == endDate.getTime())
    {
    	return 0;
    }
    else if (startDate.getTime() > endDate.getTime())
    {
    	return -1;
    }
    else
    {
    	return 1;
    }
}

function AjaxIndex()
{
	g_ajax_index++;
	return g_ajax_index;
}
function AjaxGetJSON(url)
{
	try
	{
		var ret=$.ajax({ url:url,async:false});
		if (ret.status == 200)
		{
			return ParseBackJSON(ret.responseText);
		}
        else{
            return null;
        }
	}
	catch(error)
	{
		return null;
	}
}
function AjaxPostJSON(url,postdata)
{
	try
	{
		var ret=AjaxPost(url,postdata);
		if (ret.status == 200)
		{
			return ParseBackJSON(ret.responseText);
		}
        else{
            return null;
        }
	}
	catch(error)
	{
		return null;
	}
}
function AjaxGetHTML(urla)
{
	try
	{
		var ret=$.ajax({ url:urla,async:false});
		if (ret.status == 200)
		{
			return ret.responseText;
		}
	}
	catch(error)
	{
		return "";
	}
	return "";
}function AjaxPostHTML0(url,postdata)
{
	try
	{
		var ret=$.ajax({
		   type:"post",
		   async:false,
		   cache:false,
		   url: url,
		   data:postdata
		   });
		if (ret.status == 200)
		{
			return ret.responseText;
		}
        else{
            return null;
        }
	}
	catch(error)
	{
		return null;
	}
}
function AjaxPostHTML(url,postdata)
{
	try
	{
		var ret=AjaxPost(url,postdata);
		if (ret.status == 200)
		{
			return ret.responseText;
		}
        else{
            return null;
        }
	}
	catch(error)
	{
		return null;
	}
}
function AjaxPostBack0(url,postdata,backfun)
{
	try
	{
		$.ajax({
		   type:"POST",
		   async:true,
		   cache:false,
		   url: url,
		   data:postdata,
		   complete:backfun
		   });
	}
	catch(error)
	{
	}
}
function AjaxPostBack(url, postdata, callback) 
{
    var xmlhttp; //定义ajax对象
    if (window.XMLHttpRequest) {//Mozilla 浏览器
        xmlhttp = new XMLHttpRequest();
        if (xmlhttp.overrideMinmeType) {
            //设置Mime类别
            xmlhttp.overrideMimeType("text/xml");
        }
    }
    else if (window.ActiveXObject)//IE浏览器
    {
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) {
            }
        }
    }
    if (!xmlhttp) {
        //异常，创建对象实例失败
        window.alert("不能创建XMLHttpRequest对象实例");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {//响应完成
            callback(xmlhttp);
        }
    }
    xmlhttp.open("post", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(postdata);
}
function AjaxPost(url, postdata) 
{
    var xmlhttp; //定义ajax对象
    if (window.XMLHttpRequest) {//Mozilla 浏览器
        xmlhttp = new XMLHttpRequest();
        if (xmlhttp.overrideMinmeType) {
            //设置Mime类别
            xmlhttp.overrideMimeType("text/xml");
        }
    }
    else if (window.ActiveXObject)//IE浏览器
    {
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) {
            }
        }
    }
    if (!xmlhttp) {
        //异常，创建对象实例失败
        window.alert("不能创建XMLHttpRequest对象实例");
    }

    xmlhttp.open("post", url, false);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(postdata);
    return xmlhttp;
}

function ParseBackJSON(data)
{
	try
	{
		var ret = eval("(" + data + ")");
		if(ret.status == "notreg")
		{
			var params=new Object();
			params.servicename="user/Logout";
			var paramsString=JSON.stringify(params);
			AjaxPost("../services/index.php",paramsString);
			top.window.location.href="../index.php";
		}
		return ret;
	}
	catch(error)
	{
		return null;
	}
}

function disabledButton(btnid,status)
{
	var btn = $("#"+btnid);
	btn.removeClass();
	if(status == true)
	{
		//disable
        btn.addClass("ButtonDisable");
	}
	else
	{
		//enable
		btn.addClass("ButtonNormal");
	}
}
function showButton(btnid,show)
{
	var btn = $("#"+btnid);
	if(show)
	{
		btn.css("display","inline-block");
	}
	else
	{
		btn.css("display","none");
	}
}



//实用函数
function makePageBar(allcount,pagesize,currentpage)
{
	return makePageBarEx(allcount,pagesize,currentpage,OnPage);
}
function makePageBarEx(allcount,pagesize,currentpage,backfun)
{
	var allpagecount = Math.ceil(allcount/pagesize);
	//总数
	$("#span_itemcount").html(allcount);
	//总页数
	$("#span_allpagecount").html(allpagecount);

	//当前页
	$("#span_currentpage").html(currentpage+1);
	
	var page_first = 0;
	var page_last = allpagecount-1;

	if(parseInt(currentpage)==0)
	{
		disabledButton("span_page_first",true);
		disabledButton("span_page_pre",true);
		$('#span_page_first').unbind('click');
		$('#span_page_pre').unbind('click');
	}
	else
	{
		disabledButton("span_page_first",false);
		disabledButton("span_page_pre",false);
		
		$('#span_page_first').unbind('click');
		$('#span_page_pre').unbind('click');

		$("#span_page_first").click(function(){
				backfun(0);
			});
		$("#span_page_pre").click(function(){
				backfun(currentpage - 1);
			});
	}
	
	if(parseInt(currentpage)==(allpagecount-1))
	{
		disabledButton("span_page_next",true);
		disabledButton("span_page_last",true);
		$('#span_page_last').unbind('click');
		$('#span_page_next').unbind('click');
	}
	else
	{
		disabledButton("span_page_next",false);
		disabledButton("span_page_last",false);
		
		$('#span_page_last').unbind('click');
		$('#span_page_next').unbind('click');

		$("#span_page_next").click(function(){
				backfun(currentpage+1);
			});
		$("#span_page_last").click(function(){
				backfun(allpagecount-1);
			});
	}
	if(parseInt(allcount)==0)
	{
		disabledButton("span_page_first",true);
		disabledButton("span_page_pre",true);
		disabledButton("span_page_next",true);
		disabledButton("span_page_last",true);
		$("#span_currentpage").html("0");
	}
	if($('#txt_page_topage'))
	{
		$('#txt_page_topage').attr("disabled",false);
		$('#txt_page_topage').unbind('keyup');
		$("#txt_page_topage").keyup(function(e){
			if(e.keyCode == 13)
			{
				var page = parseInt("0"+this.value,10);
				
				//S update by wqs 20150205
				if(page<1 || page>allpagecount)
				{
					alert("输入页码不正确！");					
				}
				else
				{
				
					backfun(page-1);
				}
				
				//backfun(page-1);			
				//E update by wqs 20150205
			}
		});
	}
}

//显示一个浮动面板
function showPanel(width,height,info)
{
	var viewWidth=parseInt(document.documentElement.clientWidth);
	var viewHeight=parseInt(document.documentElement.clientHeight) ;
	
	var dialogWidth = parseInt(width);
	var dialogHeight = parseInt(height);
	var dialogX = viewWidth/2-dialogWidth/2;
	var dialogY = viewHeight/2-dialogHeight/2;
	
	div_dialog = document.createElement("div");
	div_dialog.id = "div_dialog"+AjaxIndex();
	div_dialog.style.display = "block";
	div_dialog.style.padding = "10px 10px 10px 10px";
	div_dialog.style.top = dialogY + "px";
	div_dialog.style.left = dialogX + "px";	
	div_dialog.style.width = dialogWidth + "px";
	div_dialog.style.height = dialogHeight + "px";

	div_dialog.style.position = "absolute";
	div_dialog.style.zIndex = "5";
	div_dialog.style.background = "#ECF5FE";
	div_dialog.style.border = "solid #a8a1a9 1px";
	div_dialog.innerHTML = info;
	document.body.appendChild(div_dialog);//将div添加到文档
}
//关闭一个浮动面板
function closePanel(panelid)
{
	var panel = document.getElementById(panelid);
	if(panel==null)
	{
		return false;
	}
	document.body.removeChild(panel);
}
Array.prototype.removeByValue = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) {
			this.splice(i, 1);
			break;
		}
	}
}
Array.prototype.isExist = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) {
			return i;
		}
	}
	return -1;
}

function nowTimeStr()
{
	var nowtime=new Date();
	return nowtime.format("yyyy-MM-dd HH:mm:ss");
}

function showTime(timerid)
{
	try
	{
		var nowtime=new Date();
		$("#"+timerid).html(nowtime.format("yyyy-MM-dd HH:mm:ss"));
		setInterval(function()
		{
			var nowtime=new Date();
			$("#"+timerid).html(nowtime.format("yyyy-MM-dd HH:mm:ss"));
		},1000);
	}
	catch(error)
	{
	}
}

Date.prototype.format = function(format){
	var o = {
		"M+" :this.getMonth() + 1, // month
		"d+" :this.getDate(), // day
		"H+" :this.getHours(), // hour
		"m+" :this.getMinutes(), // minute
		"s+" :this.getSeconds(), // second
		"q+" :Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" :this.getMilliseconds()
	}
	if (/(y+)/.test(format))
	format = format.replace(RegExp.$1, (this.getFullYear() + "")
	.substr(4 - RegExp.$1.length));
	for ( var k in o)
	if (new RegExp("(" + k + ")").test(format))
	format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
	: ("00" + o[k]).substr(("" + o[k]).length));
	return format;
}


//------------------------  选择组织 ---------------


function InitOrgSel(txt_sub_company_code,txt_main_branch_code,txt_branch_code,txt_org_code,txt_vehicleCode,txt_id_driver,input_org_code,mode,fun)
{
	var g_sub_company_code_id="";
	var g_main_branch_code_id="";
	var g_branch_code_id="";
	var g_vehicle_code="";
	var tag_id_driver="";
	var g_fun=null;
	var g_vehicleFinish = true;
	var g_driverFinish	= true;
	
	g_sub_company_code_id = "#"+txt_sub_company_code;
	g_main_branch_code_id = "#"+txt_main_branch_code;
	g_branch_code_id = "#"+txt_branch_code;
	g_org_code_id = "#"+txt_org_code;
	
	/*$(g_sub_company_code_id).change(change_sub_company_code);
	$(g_main_branch_code_id).change(change_main_branch_code);
	$(g_branch_code_id).change(change_branch_code);
	*/
	//20121206 huang
	$(g_sub_company_code_id).live("change",change_sub_company_code);
	$(g_main_branch_code_id).live("change",change_main_branch_code);
	$(g_branch_code_id).live("change",change_branch_code);
	
	
	$(g_sub_company_code_id+" option").remove(); 
	$(g_main_branch_code_id+" option").remove(); 
	$(g_branch_code_id+" option").remove(); 
	$(g_org_code_id+" option").remove(); 
	
	if(mode != 1)
	{
		$(g_sub_company_code_id).append("<option value=''>--</option>");
	}
	$(g_main_branch_code_id).append("<option value=''>--</option>");
	$(g_branch_code_id).append("<option value=''>--</option>");
	$(g_org_code_id).append("<option value=''>--</option>");
	
	var org_code = readCookie('org_code');
	if(input_org_code!=null && input_org_code!="" && input_org_code!="undefined")
	{
		org_code = input_org_code;
	}
	var function_code = readCookie('function_code');
	
	if(function_code == "1")
	{
		$(g_sub_company_code_id).attr("disabled",true);
	}
	else if(function_code == "2")
	{
		$(g_sub_company_code_id).attr("disabled",true);
		$(g_main_branch_code_id).attr("disabled",true);
	}
	else if(function_code == "3")
	{
		$(g_sub_company_code_id).attr("disabled",true);
		$(g_main_branch_code_id).attr("disabled",true);
		$(g_branch_code_id).attr("disabled",true);
	}
	else if(function_code == "4")
	{
		$(g_sub_company_code_id).attr("disabled",true);
		$(g_main_branch_code_id).attr("disabled",true);
		$(g_branch_code_id).attr("disabled",true);
		$(g_org_code_id).attr("disabled",true);
	}
	
	getfullorg(org_code);

	//选择了分公司
	function change_sub_company_code()
	{
		var code =""+$(g_sub_company_code_id).val();

		//alert("change_sub_company_code");
		$(g_main_branch_code_id+" option").remove(); 
		$(g_branch_code_id+" option").remove(); 
		$(g_org_code_id+" option").remove(); 
		
		$(g_main_branch_code_id).append("<option value=''>--</option>");
		$(g_branch_code_id).append("<option value=''>--</option>");
		$(g_org_code_id).append("<option value=''>--</option>");
		//380000108 s
		if(txt_vehicleCode != null)
		{
			$("#"+txt_vehicleCode+" option").remove();
			$("#"+txt_vehicleCode).append("<option value=''>--</option>");
		}
		
		if(txt_id_driver != null)
		{
			$("#"+txt_id_driver+" option").remove();
			$("#"+txt_id_driver).append("<option value=''>--</option>");
		}	
		//380000108 e
		if(code=="")
		{
			return;
		}
		getorgs(code,"1");
		
	}
	//选择了主管支店
	function change_main_branch_code()
	{
		var code =""+$(g_main_branch_code_id).val();
		
		$(g_branch_code_id+" option").remove(); 
		$(g_org_code_id+" option").remove(); 
		
		$(g_branch_code_id).append("<option value=''>--</option>");
		$(g_org_code_id).append("<option value=''>--</option>");
		//380000108 s
		if(txt_vehicleCode != null)
		{
			$("#"+txt_vehicleCode+" option").remove();
			$("#"+txt_vehicleCode).append("<option value=''>--</option>");
		}
		
		if(txt_id_driver != null)
		{
			$("#"+txt_id_driver+" option").remove();
			$("#"+txt_id_driver).append("<option value=''>--</option>");
		}	
		//380000108 e
		if(code=="")
		{
			return;
		}
		getorgs(code,"2");
	}
	//选择了支店
	function change_branch_code()
	{
		var code =""+$(g_branch_code_id).val();
		
		$(g_org_code_id+" option").remove();
		$(g_org_code_id).append("<option value=''>--</option>");
		//380000108 s
		if(txt_vehicleCode != null)
		{
			$("#"+txt_vehicleCode+" option").remove();
			$("#"+txt_vehicleCode).append("<option value=''>--</option>");
		}
		
		if(txt_id_driver != null)
		{
			$("#"+txt_id_driver+" option").remove();
			$("#"+txt_id_driver).append("<option value=''>--</option>");
		}
		//380000108 e
		if(code=="")
		{
			return;
		}
		getorgs(code,"3");
	}
	function getorgs(org_code,function_code)
	{
		params = new Object();
		params.servicename="com/org/SearchSubOrg";
		params.org_code=org_code;
		params.function_code=function_code;
	
		var paramsString=JSON.stringify(params);
		AjaxPostBack("../services/index.php?index="+AjaxIndex(),paramsString,json_back_common_orgsel);
		
				
		//组织变化，人员随时查询 2014-11-14  S
		if(txt_id_driver!= null)
		{
			tag_id_driver = "#"+txt_id_driver;
			$(tag_id_driver+" option").remove(); 
			var g_vehicleFinish = true;
			var g_driverFinish	= true;
			searchDriver(org_code,function_code);
		
		}
		//组织变化，人员随时查询 2014-11-14  E
	}
	function json_back_common_orgsel(data){
		if (data.status == 200) 
		{
			var result="";
			try {
				result = ParseBackJSON(data.responseText);
				if(result.status=="ok")
				{
					MakeCommonOrgList(result);
				}
				else
				{
				}
			} catch( error ) {
			}
		}
		else
		{
		}

		
	}
	function getfullorg(org_code)
	{
		params = new Object();
		params.servicename="com/org/GetFullOrgInfo";
		params.org_code=org_code;
		var paramsString=JSON.stringify(params);
		AjaxPostBack("../services/index.php?index="+AjaxIndex(),paramsString,json_back_common_getfullorg);
	}
	function json_back_common_getfullorg(data){
		if (data.status == 200) 
		{
			var result="";
			try {
				result = ParseBackJSON(data.responseText);
				if(result.status=="ok")
				{
					MakeCommonFullOrgList(result);
				}
				else
				{
				}
			} catch( error ) {
			}
		}
		else
		{
		}

	}
	function MakeCommonFullOrgList(data)
	{
		var sub_company_sel = $(g_sub_company_code_id);
		var main_branch_sel = $(g_main_branch_code_id);
		var branch_sel = $(g_branch_code_id);
		var org_sel = $(g_org_code_id);
		$(g_sub_company_code_id+" option").remove(); 
		$(g_main_branch_code_id+" option").remove(); 
		$(g_branch_code_id+" option").remove(); 
		$(g_org_code_id+" option").remove(); 

		if(mode !=1)
		{
			sub_company_sel.append("<option value=''>--</option>");
		}
		main_branch_sel.append("<option value=''>--</option>");
		branch_sel.append("<option value=''>--</option>");
		org_sel.append("<option value=''>--</option>");
		var selItem = null;
		var subflg=0;
		var mainflg=0;
		var branchflg=0;
		var orgflg=0;
		for(var i=0;i<data.count;i++)
		{
			
			var item = data.items[i];
			if(item.org_code == data.org_code)
			{
				selItem = item;
			}
			if(item.function_code == "1")
			{
				if(mode == 1 && subflg == 0)
				{
					sub_company_sel.append("<option value='0    1'>"+"--"+"</option>");
					subflg = 1;
				}
				sub_company_sel.append("<option value='"+item.org_code+"'>"+item.org_name+"</option>");
			}
			else if(item.function_code == "2")
			{
				if(mode == 1 && mainflg == 0)
				{
					main_branch_sel.append("<option value='0    2'>"+"--"+"</option>");
					mainflg = 1;
				}
				main_branch_sel.append("<option value='"+item.org_code+"'>"+item.org_name+"</option>");
			}
			else if(item.function_code == "3")
			{
				if(mode == 1 && branchflg == 0)
				{
					branch_sel.append("<option value='0    3'>"+"--"+"</option>");
					branchflg = 1;
				}
				branch_sel.append("<option value='"+item.org_code+"'>"+item.org_name+"</option>");
			}
			else
			{
				if(mode == 1 && orgflg == 0)
				{
					org_sel.append("<option value='0    4'>"+"--"+"</option>");
					orgflg = 1;
				}
				org_sel.append("<option value='"+item.org_code+"'>"+item.org_name+"</option>");
			}
		}
		if(selItem != null)
		{
			if(selItem.function_code == "1")
			{
				sub_company_sel.val(selItem.org_code);
				if(fun != null)
				{
					fun();
				}
			}
			else if(selItem.function_code == "2")
			{
				sub_company_sel.val(selItem.sub_company_code);
				main_branch_sel.val(selItem.org_code);
				if(fun != null)
				{
					fun();
				}
			}
			else if(selItem.function_code == "3")
			{
				sub_company_sel.val(selItem.sub_company_code);
				main_branch_sel.val(selItem.main_branch_code);
				branch_sel.val(selItem.org_code);
				if(fun != null)
				{
					fun();
				}
			}
			else
			{
				sub_company_sel.val(selItem.sub_company_code);
				main_branch_sel.val(selItem.main_branch_code);
				branch_sel.val(selItem.branch_code);
				org_sel.val(selItem.org_code);
				
				if(txt_vehicleCode == null && txt_id_driver == null)
				{
					if(fun != null)
					{
						fun();
					}
				}
				if(txt_vehicleCode!= null)
				{
					g_vehicle_code = "#"+txt_vehicleCode;
					$(g_vehicle_code).val(""); 					
					searchVehicle();				
				}
				if(txt_id_driver!= null)
				{
					tag_id_driver = "#"+txt_id_driver;
					$(tag_id_driver+" option").remove(); 
					var g_vehicleFinish = true;
					var g_driverFinish	= true;
					searchDriver();
				
				}
			}
				
			if(selItem.function_code != "4")
			{
				getorgs(selItem.org_code,selItem.function_code);
			}
		}
	}
	function MakeCommonOrgList(data)
	{
		var cnt = data.count;
		var items = data.items;
		var function_id = data.function_code;
		var sele = null;
		var selectid = "";
		var orglist = "";
		if(function_id =="0")
		{
			selectid=g_sub_company_code_id;
		}
		else if(function_id =="1")
		{
			selectid=g_main_branch_code_id;
		}
		else if(function_id =="2")
		{
			selectid=g_branch_code_id;
		}
		else
		{
			selectid=g_org_code_id;
		}
		orglist= "--";
		sele = $(selectid);
		$(selectid+" option").remove(); 
		
		if (mode != 1)
		{
			sele.append("<option value=''>--</option>");
		}
		else
		{
			if (data.count >0)
				sele.append("<option value='0    "+ (Number(function_id)+1)+"'>" +orglist+"</option>");
			else
				sele.append("<option value=''>--</option>");
		}

			
		for(var i=0;i<cnt;i++)
		{
			sele.append("<option value='"+items[i].org_code+"'>"+items[i].org_name+"</option>");
		}

	}
	this.setBackfun = function(func)
	{
		g_fun = func;
	}
	
	this.rmBackfun = function()
	{
		fun = null;
	}
	
	this.searchVehicle = function(txt_vehicleCode)
	{
		g_vehicle_code = "#"+txt_vehicleCode;
		$(g_org_code_id).change(change_org_code);
		function change_org_code()
		{
			$(g_vehicle_code).val(""); 
			searchVehicle();
			
		}
		

	};
	//检索组织下面的车辆
	function searchVehicle(){
		
		
		var params = new Object();
		params.servicename = "com/monitor/SearchVehicle";
		params.vehiclenumber = "";
		params.orgcode = new Object();
		params.orgcode.sub_company_code = ""+$(g_sub_company_code_id).val();
		params.orgcode.main_branch_code = ""+$(g_main_branch_code_id).val();
		params.orgcode.branch_code = ""+$(g_branch_code_id).val();
		params.orgcode.org_code = ""+$(g_org_code_id).val();
		
		//params.operatorid="lijun";
		//params.comid="TEST_VEH";
		
		var paramsString = JSON.stringify(params);
		g_vehicleFinish = false;
		ret = AjaxPostBack("../services/index.php", paramsString,json_back_vehicle);	
	}
	
	function json_back_vehicle(data){
		
		if (data.status == 200) 
		{
			var result="";
			try {
				result = ParseBackJSON(data.responseText);
				if(result.status=="ok")
				{		
					var htm="<option value=''>--</option>";
					for(var i=0;i<result.vehicles.length;i++)
					{
						vehicleid = result.vehicles[i]["vehicleid"];
						htm+="<option value='"+vehicleid+"'>"+vehicleid+"</option>";
					}
					$(g_vehicle_code).html(htm);
					g_vehicleFinish = true;
					if(fun != null && g_driverFinish == true)
					{
						fun();
					}
				}
				else
				{
					//$("#div_info").html("<font color=red>"+result.message+"</font>");
				}
			} catch( error ) {
				//$("#div_info").html("无效的JSON："+error.message);
			}
		}
		else
		{
			//$("#div_info").html("通讯失败："+data.statusText);
		}
	}
	this.searchDriver = function(txt_id_driver)
	{
		tag_id_driver = "#"+txt_id_driver;
		$(g_org_code_id).change(change_org_code);
		function change_org_code()
		{
			$(tag_id_driver+" option").remove(); 
			searchDriver();
			
		}
		
	};
	//检索组织下面的人员
	function searchDriver(org_code, function_code){
		var params = new Object();
		params.servicename = "com/user/SearchDeptStaff";
		params.org_code = org_code;
		params.function_code=function_code;
		
		var paramsString = JSON.stringify(params);
		g_driverFinish =false;
		ret = AjaxPostBack("../services/index.php", paramsString,json_back_driver);	
	}
	function json_back_driver(data){
		if (data.status == 200) 
		{
			var result="";
			try {
				result = ParseBackJSON(data.responseText);
				if(result.status=="ok")
				{		
					var htm="<option value=''>--</option>";
					for(var i=0;i<result.count;i++)
					{
						htm+="<option value='"+result.items[i].staff_id+"'>"+result.items[i].name+"</option>";
					}
					$(tag_id_driver).html(htm);
					g_driverFinish =true;
				}
				else
				{
					//$("#div_info").html("<font color=red>"+result.message+"</font>");
				}
			} catch( error ) {
				//$("#div_info").html("无效的JSON："+error.message);
			}
		}
		else
		{
			//$("#div_info").html("通讯失败："+data.statusText);
		}
	}
}
// -----------------  选择组织结束  ---------------------------------


function InitRoleLevel(select_role_level_id,initValue)
{
	this.m_common_search_role_levelid = select_role_level_id;
	this.initValue = initValue;
	this.common_json_back_search_role=function(data)
	{
		var _this = this;
		if (data.status == 200) 
		{
			var result="";
			try {
				result = ParseBackJSON(data.responseText);
				if(result.status=="ok")
				{
					var sel = $("#"+_this.m_common_search_role_levelid);
					//var oldsel = sel.val();
					//$("#"+g_common_search_role_levelid+" option").remove(); 
					
					sel.append("<option value=''>--</option>");
					for(var i=0;i<result.count;i++)
					{
						sel.append("<option value='"+result.items[i].role_level+"'>"+result.items[i].role_name+"</option>");
					}
					sel.val(_this.initValue);
				}
				else
				{
					alert(result.message);
				}
			} catch( error ) {
				alert(error.message);
			}
		}
		else
		{
			alert("通讯失败："+data.statusText);
		}
	}
	
	this._common_json_back_search_role = this.common_json_back_search_role.bindAsEventListener(this);
	//ret = AjaxPostBack(url, paramsString,this._common_json_back_search_role);
	
	params = new Object();
	params.servicename="com/role/SearchRole";
	var paramsString=JSON.stringify(params);
	AjaxPostBack("../services/index.php?index="+AjaxIndex(),paramsString,this._common_json_back_search_role);
}
function common_json_back_search_role(data){
	
}


function OnLogout()
{
	var params=new Object();
	params.servicename="user/Logout";
	var paramsString=JSON.stringify(params);
	AjaxPostBack("services/index.php",paramsString,json_back_logout);
}
function json_back_logout(data){
	if (data.status == 200) 
	{
		var result="";
		try {
			result = eval("(" + data.responseText + ")");
			if(result.status=="ok")
			{
				top.window.location="index.php";
			}
			else if(result.status=="notreg")
			{
				top.window.location="index.php";
			}
			else
			{
				alert(result.message);
			}
		} catch( error ) {
			alert("无效的JSON："+data.responseText);
		}
	}
	else
	{
		alert("查询失败："+data.statusText);
	}
}


function readCookie(name)
{
	var cookieValue = null;
	var search = name + "=";
	if(document.cookie.length > 0)
	{ 
		offset = document.cookie.indexOf(search);
		if (offset != -1)
		{ 
			offset += search.length;
			end = document.cookie.indexOf(";", offset);
			if (end == -1) 
				end = document.cookie.length;
			cookieValue = unescape(document.cookie.substring(offset, end))
		}
	}
	return cookieValue;
}

function showDialog(url, name, width, height) {
    var left = (screen.width - width) / 2;
    var top = (screen.height - height) / 2;
    var ret = window.showModalDialog(url, name, "DialogHeight:" + height + "px;DialogWidth:" + width + "px;left:" + left + "px;top:" + top + "px;toolbar:no;menubar:no;scrollbars:no;resizable:no;location:no;status:no");
    return ret;
}

function downFile(url,params,toast)
{
	this.url = url;
	this.params = params;
	this.toast = toast;
	params.csv = "true";
	var paramsString = JSON.stringify(params);
	if(toast == null || toast =="undefined")
	{
		this.toast = null;
	}
	
	this.common_down_file_back = function(data)
	{
		if (data.status == 200) 
		{
			var result="";
			try {
				result = ParseBackJSON(data.responseText);
				if(result.status=="ok")
				{
					if(result.fileid =="")
					{
						this.toast.Show(result.message,2000);
					}
					else
					{
						var iframe = document.getElementById("common_download_csv_iframe");
						if(iframe == null)
						{
							iframe = document.createElement("iframe");
							iframe.id="common_download_csv_iframe";
							iframe.style.display = "none";
							document.body.appendChild(iframe); 
						}
						var downurl = this.url.replace("index.php","download.php");
						iframe.src = downurl+"?fileid="+result.fileid;
						if(this.toast!=null)
						{
							this.toast.Show("下载完毕",1000);
						}
					}
					
				}
				else if(result.status=="notreg")
				{
					top.window.location="index.php";
				}
				else
				{
					//alert("服务器错误："+result.message);
					if(this.toast!=null)
					{
						this.toast.Show(result.message,2000);
					}
				}
			} catch( error ) {
				//alert("服务器错误："+data.responseText);
				if(this.toast!=null)
				{
					this.toast.Show(data.responseText,2000);
				}
			}
		}
		else
		{
			//alert("下载CSV失败："+data.statusText);
			if(this.toast!=null)
			{
				this.toast.Show("下载CSV失败："+data.statusText,2000);
			}
		}
	}
	this._common_down_file_back = this.common_down_file_back.bindAsEventListener(this);
	ret = AjaxPostBack(url, paramsString,this._common_down_file_back);
}

function showHTMLPrint(reporttype,params,toast)
{
	this.reporttype = reporttype;
	this.params = params;
	this.toast = toast;
	this.paramsString = params;
	this.timer = null;
	
	this.common_down_addtask_back = function(data)
	{
		var _this = this;
		if (data.status == 200) 
		{
			var result="";
			try {
				result = ParseBackJSON(data.responseText);
				if(result.status=="ok")
				{
					var printid = result.printid;
					showDialog("../print/index.php?printid="+printid+"&type="+_this.reporttype,_this.reporttype,842+20,1191-400);
				}
				else if(result.status=="notreg")
				{
					top.window.location="index.php";
				}
				else
				{
					if(_this.toast!=null)
					{
						_this.toast.Show(result.message,2000);
					}
				}
			} catch( error ) {
				if(_this.toast!=null)
				{
					_this.toast.Show(data.responseText,2000);
				}
			}
		}
		else
		{
			if(_this.toast!=null)
			{
				_this.toast.Show("添加打印任务失败："+data.statusText,2000);
			}
		}
	}
	
	this._common_down_addtask_back = this.common_down_addtask_back.bindAsEventListener(this);
	var addTaskParams=new Object();
	addTaskParams.servicename="com/report/AddReportTask";
	addTaskParams.type = this.reporttype;
	addTaskParams.mail_dec_list = "";
	addTaskParams.param = this.paramsString;
	addTaskParams.printstatus = 9;
	var addTaskParamsString=JSON.stringify(addTaskParams);
	ret = AjaxPostBack("../services/index.php?index="+AjaxIndex(), addTaskParamsString,this._common_down_addtask_back);
}

function downReport(reporttype,params,toast,allcount)
{
	this.allcount = allcount;
	this.reporttype = reporttype;
	this.mail_dec_list = "";
	this.params = params;
	this.toast = toast;
	this.paramsString = params;
	this.timer = null;
	this.secondtick = 0;
	this.printid = null;
	this._query_status_back = null;
	this._query_status = null;
	this.isquery = false;
	if(toast == null || toast =="undefined")
	{
		this.toast = null;
	}
	this.query_status = function()
	{
		var _this = this;
		if(_this.isquery)
		{
			return;
		}
		if(_this._query_status_back == null)
		{
			_this._query_status_back = _this.query_status_back.bindAsEventListener(_this);
		}
		_this.isquery = true;
		var queryTaskParams=new Object();
		queryTaskParams.servicename="com/report/QueryReportStatus";
		queryTaskParams.printid = _this.printid;
		var queryTaskParamsString=JSON.stringify(queryTaskParams);
		ret = AjaxPostBack("../services/index.php?index="+AjaxIndex(), queryTaskParamsString,_this._query_status_back);
	}
	
	this.cancel_task = function()
	{
		clearTimeout(this.timer);
		if(this.toast!=null)
		{
			this.toast.Show("正在取消打印任务...",200000);
		}
		var cancelTaskParams=new Object();
		cancelTaskParams.servicename="com/report/CancelReportTask";
		cancelTaskParams.printid = this.printid;
		var cancelTaskParamsString=JSON.stringify(cancelTaskParams);
		this._common_cancel_task_back = this.common_cancel_task_back.bindAsEventListener(this);
		
		ret = AjaxPostBack("../services/index.php?index="+AjaxIndex(), cancelTaskParamsString,this._common_cancel_task_back);
	}
	this.common_cancel_task_back = function(data)
	{
		if (data.status == 200) 
		{
			var result="";
			try {
				result = ParseBackJSON(data.responseText);
				if(result.status=="ok")
				{
					this.toast.Show(result.message,2000);
				}
				else if(result.status=="notreg")
				{
					top.window.location="index.php";
				}
				else
				{
					if(this.toast!=null)
					{
						this.toast.Show(result.message,2000);
					}
				}
			} catch( error ) {
				if(this.toast!=null)
				{
					this.toast.Show(data.responseText,2000);
				}
			}
		}
		else
		{
			if(this.toast!=null)
			{
				this.toast.Show("取消打印任务失败："+data.statusText,2000);
			}
		}
	}
	
	this.query_status_back = function(data)
	{
		this.isquery = false;
		var _this = this;
		if (data.status == 200) 
		{
			var result="";
			try {
				result = ParseBackJSON(data.responseText);
				if(result.status=="ok")
				{
					if(result.printstatus == "2")
					{//打印完毕
						window.clearInterval(_this.timer);
						//_this.timer = null;
						var iframe = document.getElementById("common_download_csv_iframe");
						if(iframe == null)
						{
							iframe = document.createElement("iframe");
							iframe.id="common_download_csv_iframe";
							iframe.style.display = "none";
							document.body.appendChild(iframe);
						}
						var downurl = "../services/xls.php";
						iframe.src = downurl+"?printresult="+result.printresult;
						if(this.toast!=null)
						{
							this.toast.Show("打印完毕",1000);
						}
					}
					else if(result.printstatus == "1")
					{//正在打印
						//已设置邮件
						if(_this.secondtick > 31)
						{
							window.clearInterval(_this.timer);
							/*if(this.toast!=null)
							{
								this.toast.Show("打印超时，请重试！",2000);
								return;
							}*/
							return;
						}
						//打印超时
						else if(_this.secondtick>30)
						{
							//20121025 已经设置了邮件，提示稍后发送
							if(_this.mail_dec_list != "")
							{
								_this.secondtick++;
								this.toast.Show("打印超时，稍后将发送邮件！",2000);
								return;
							}
							//没有设置邮件，提示设置邮件
							var ret = showDialog('../print/mailreport.php','发送报表',400,300);
							if(ret!=undefined && ret.status =="ok")
							{
								_this.mail_dec_list = ret.mail;
								var params=new Object();
								params.servicename="com/report/SetReportMail";
								params.printid = _this.printid;
								params.mail_dec_list = _this.mail_dec_list
								var paramsString=JSON.stringify(params);
								var ret = AjaxPostJSON("../services/index.php", paramsString);
								if(ret.status == "ok")
								{
									_this.secondtick++;
									return;
								}
							}
							else
							{
								_this.secondtick++;
								this.toast.Show("打印超时，请稍后重试！",2000);
								return;
							}
						}
						_this.secondtick++;
						if(_this.toast!=null)
						{
							//_this.toast.Show("<img src='../img/wait.gif'/>正在打印...",2000);
							var div_cancel = document.getElementById("common_div_print_task_cancel");
							if(div_cancel == null)
							{
								div_cancel = document.createElement("div");
								div_cancel.id="common_div_print_task_cancel";
							}
							div_cancel.innerHTML = "<img src='../img/wait.gif'/>打印开始...";
							/*正在打印时不能取消
							span_cancel = document.createElement("span");
							span_cancel.style.cursor="pointer";
							span_cancel.style.color="#0000FF";
							span_cancel.innerHTML="取消";
							if(this._cancel_task == null)
							{
								this._cancel_task = this.cancel_task.bindAsEventListener(this);
							}
							addListener(span_cancel,"click",this._cancel_task);
							div_cancel.appendChild(span_cancel);
							*/
							this.toast.ShowEx(div_cancel,1000);
						}
					}
					else if(result.printstatus == "0")
					{//正在等待打印
						if(this.toast!=null)
						{
							if(parseInt(result.waitcount,10)==0)
							{
								//this.toast.Show("<img src='../img/wait.gif'/>打印开始...",1000);
								var div_cancel = document.getElementById("common_div_print_task_cancel");
								if(div_cancel == null)
								{
									div_cancel = document.createElement("div");
									div_cancel.id="common_div_print_task_cancel";
								}
								div_cancel.innerHTML = "<img src='../img/wait.gif'/>打印开始...";
								/*span_cancel = document.createElement("span");
								span_cancel.style.cursor="pointer";
								span_cancel.style.color="#0000FF";
								span_cancel.innerHTML="取消";
								if(this._cancel_task == null)
								{
									this._cancel_task = this.cancel_task.bindAsEventListener(this);
								}
								addListener(span_cancel,"click",this._cancel_task);
								div_cancel.appendChild(span_cancel);*/
								this.toast.ShowEx(div_cancel,1000);
							}
							else
							{
								var div_cancel = document.getElementById("common_div_print_task_cancel");
								if(div_cancel == null)
								{
									div_cancel = document.createElement("div");
									div_cancel.id="common_div_print_task_cancel";
								}
								div_cancel.innerHTML = "<img src='../img/wait.gif'/>还有"+result.waitcount+"份文档待打印...";
								span_cancel = document.createElement("span");
								span_cancel.style.cursor="pointer";
								span_cancel.style.color="#0000FF";
								span_cancel.innerHTML="取消";
								if(this._cancel_task == null)
								{
									this._cancel_task = this.cancel_task.bindAsEventListener(this);
								}
								addListener(span_cancel,"click",this._cancel_task);
								div_cancel.appendChild(span_cancel);
								this.toast.ShowEx(div_cancel,1000);
							}
						}
					}
					else if(result.printstatus == "3")
					{//打印已取消
						window.clearInterval(_this.timer);
						if(this.toast!=null)
						{
							this.toast.Show("打印已取消",2000);
						}
					}
					else
					{//打印出错
						window.clearInterval(_this.timer);
						if(this.toast!=null)
						{
							this.toast.Show("打印出错:"+result.printresult,2000);
						}
					}
				}
				else if(result.status=="notreg")
				{
					window.clearInterval(_this.timer);
					top.window.location="index.php";
				}
				else
				{
					window.clearInterval(_this.timer);
					if(_this.toast!=null)
					{
						_this.toast.Show(result.message,2000);
					}
				}
			} catch( error ) {
				if(_this.toast!=null)
				{
					_this.toast.Show(data.responseText,2000);
				}
			}
		}
		else
		{
			if(_this.toast!=null)
			{
				_this.toast.Show("添加打印任务失败："+data.statusText,2000);
			}
		}
	}
	
	this.common_down_addtask_back = function(data)
	{
		var _this = this;
		if (data.status == 200) 
		{
			var result="";
			try {
				result = ParseBackJSON(data.responseText);
				if(result.status=="ok")
				{
					if(_this.mail_dec_list!="")
					{
						_this.toast.Show("等待打印，请注意查收邮件！",2000);
					}
					else
					{
						_this.printid = result.printid;
						if(_this._query_status == null)
						{
							_this._query_status = _this.query_status.bindAsEventListener(_this);
						}
						_this.timer = setInterval(_this._query_status,1500);
						_this._query_status();
					}
				}
				else if(result.status=="notreg")
				{
					top.window.location="index.php";
				}
				else
				{
					if(_this.toast!=null)
					{
						_this.toast.Show(result.message,2000);
					}
				}
			} catch( error ) {
				if(_this.toast!=null)
				{
					_this.toast.Show(data.responseText,2000);
				}
			}
		}
		else
		{
			if(_this.toast!=null)
			{
				_this.toast.Show("添加打印任务失败："+data.statusText,2000);
			}
		}
	}
	if(parseInt(this.allcount,10)>=1000)
	{
		var ret = showDialog('../print/mailreport.php','发送报表',400,300);
		if(ret!=undefined && ret.status =="ok")
		{
			this.mail_dec_list = ret.mail;
		}
	}
	this.init = function()
	{
		this._common_down_addtask_back = this.common_down_addtask_back.bindAsEventListener(this);
		var addTaskParams=new Object();
		addTaskParams.servicename="com/report/AddReportTask";
		addTaskParams.type = this.reporttype;
		addTaskParams.mail_dec_list = this.mail_dec_list;
		addTaskParams.param = this.paramsString;
		var addTaskParamsString=JSON.stringify(addTaskParams);
		ret = AjaxPostBack("../services/index.php?index="+AjaxIndex(), addTaskParamsString,this._common_down_addtask_back);
	}
}


function showInfo(message)
{
	$("#span_info").html(message);
}


function Toast(width,height)
{
	this.msg = "";
	this.divmsg = null;
	this.width = parseInt(width);
	this.height = parseInt(height);
	this.div = null;
	this.timespan = 2000;
	this.timer = null;
	this.textAlign = "left";
	this.setTime = function(stime)
	{
		this.timespan = stime;
	}
	this.setTextAlign = function(align)
	{
		this.textAlign = align;
	}
	this.setSize = function(width,height)
	{
		this.width = parseInt(width);
		this.height = parseInt(height);
	}
	this.Hide = function()
	{
		if(this.timer != null)
		{
			clearTimeout(this.timer);
		}
		this.timer = null;
		this.div.style.display = "none";
	}
	
	this.timerfun = function(data)
	{
		this.Hide();
	}
	this.Show = function(msg,stime)
	{
		if(stime != null)
		{
			this.timespan = stime;
		}
		this.msg = msg;
		if(this.div == null)
		{
			this.div = document.getElementById("common_toast_9999");
		}
		if(this.div == null)
		{
			this.div = document.createElement("div");
			this.div.id = "common_toast_9999";
			this.div.style.display = "block";
			this.div.style.padding = "10px 10px 10px 10px";
			
			this.div.style.position = "absolute";
			this.div.style.zIndex = "10001";
			this.div.style.background = "#369";
			this.div.style.color = "#FFFFFF";
			this.div.style.border = "solid #FFFFFF 1px";
			
			document.body.appendChild(this.div);
		}
		var viewWidth=parseInt(document.documentElement.clientWidth);
		var viewHeight=parseInt(document.documentElement.clientHeight);
		this.div.style.display = "block";
		this.div.style.top = (viewHeight-this.height)/2 + "px";	
		this.div.style.left = (viewWidth-this.width)/2 + "px";	
		this.div.style.width = this.width + "px";
		this.div.style.height = this.height + "px";
		this.div.style.textAlign=this.textAlign;
		
		this.div.innerHTML = this.msg;

		if(this.timer != null)
		{
			clearTimeout(this.timer);
		}
		if(this._timerfun == null)
		{
			this._timerfun = this.timerfun.bindAsEventListener(this);
		}
		this.timer = setTimeout(this._timerfun, this.timespan);
	}
	
	this.ShowEx = function(divmsg,stime)
	{
		if(stime != null)
		{
			this.timespan = stime;
		}
		this.divmsg = divmsg;
		if(this.div == null)
		{
			this.div = document.getElementById("common_toast_9999");
		}
		if(this.div == null)
		{
			this.div = document.createElement("div");
			this.div.id = "common_toast_9999";
			this.div.style.display = "block";
			this.div.style.padding = "10px 10px 10px 10px";
			
			this.div.style.position = "absolute";
			this.div.style.zIndex = "5000";
			this.div.style.background = "#322B29";
			this.div.style.color = "#FFFFFF";
			this.div.style.border = "solid #FFFFFF 1px";
			
			document.body.appendChild(this.div);
		}
		var viewWidth=parseInt(document.documentElement.clientWidth);
		var viewHeight=parseInt(document.documentElement.clientHeight);
		this.div.style.display = "block";
		this.div.style.top = (viewHeight-this.height)/2 + "px";
		this.div.style.left = (viewWidth-this.width)/2 + "px";
		this.div.style.width = this.width + "px";
		this.div.style.height = this.height + "px";
		this.div.style.textAlign=this.textAlign;
		this.div.innerHTML = "";
		this.div.appendChild(this.divmsg);

		if(this.timer != null)
		{
			clearTimeout(this.timer);
		}
		if(this._timerfun == null)
		{
			this._timerfun = this.timerfun.bindAsEventListener(this);
		}
		this.timer = setTimeout(this._timerfun, this.timespan);
	}
}


function SaveParamter(name,value)
{
	//top.frm_head.SaveParamter(name,value);
	top.frm_mainmenu.SaveParamter(name,value);
}

function ReadParamter(name)
{
	//return top.frm_head.ReadParamter(name);
	return top.frm_mainmenu.ReadParamter(name);
}

function roleche(servername)
{
	var params = new Object();
	params.servicename = servername
	var paramsString = JSON.stringify(params);
	ret = AjaxPostJSON("../services/index.php", paramsString);
	if(ret == null)
	{
		return true;
	}else{
		if(ret.status == "notrequestrole")
		{
			return ret.message;
		}else
		{
			return true;
		}
	}
}

function BmpButtonOver(btn)
{
	var btnid = btn.id;
	$("#"+btnid).css("backgroundImage","url(img/img_new/"+btnid+"_sel.png)");
}
function BmpButtonOut(btn)
{
	var btnid = btn.id;
	$("#"+btnid).css("backgroundImage","url(img/img_new/"+btnid+".png)");
}

function winmove(div_float_head,div_float)
{
	var head = document.getElementById(div_float_head);
	var mouseStart={};
	var divStart={};
	var oDiv2=document.getElementById(div_float);	
	var viewWidth=parseInt(document.documentElement.clientWidth);;
	var viewHeight=parseInt(document.documentElement.clientHeight);
	//head.style.cursor="move";
	head.onmousedown=function(ev)
	{
		var oEvent=ev||event;
		viewWidth=parseInt(document.documentElement.clientWidth);
		viewHeight=parseInt(document.documentElement.clientHeight);

		mouseStart.x=oEvent.clientX;
		mouseStart.y=oEvent.clientY;
		divStart.x=oDiv2.offsetLeft;
		divStart.y=oDiv2.offsetTop;

		if(head.setCapture)
		{
			head.onmousemove=doDrag3;
			head.onmouseup=stopDrag3;
			head.setCapture();
		}else{
			document.addEventListener("mousemove",doDrag3,true);
			document.addEventListener("mouseup",stopDrag3,true);
		}
	};
	function doDrag3(ev){
		var oEvent = ev||event;
		var l=oEvent.clientX-mouseStart.x+divStart.x;
		var t=oEvent.clientY-mouseStart.y+divStart.y;

		if(t < 0 )
		{
			t = 0;
		}
			
		if(l < 0  )
		{
			l =  0
		}
		
		if(l > viewWidth-oDiv2.offsetWidth  )
		{
			l =  viewWidth-oDiv2.offsetWidth;
		}
		
		if(t > viewHeight-oDiv2.offsetHeight)
		{
			t = viewHeight-oDiv2.offsetHeight;
		}

		oDiv2.style.left=l+"px";
		oDiv2.style.top=t+"px";


	};
	function stopDrag3()
	{
		if(head.releaseCapture)
		{
			head.onmousemove=null;
			head.onmouseup=null;
			head.releaseCapture();
		}
		else
		{
			document.removeEventListener("mousemove",doDrag3,true);
			document.removeEventListener("mouseup",stopDrag3,true);
		}

	}
}

function SetRequirementOrg(requirement, subCompany, mainBranch, branch, center)
{
	var orginfo = "总公司";
	
	if($("#" + subCompany).val() !="")
	{
		orginfo = ""+$("#" + subCompany +" option:selected").text();		
		if($("#" + mainBranch).val() !="")
		{
			orginfo += " / "+$("#" + mainBranch +" option:selected").text();		
			if($("#" + branch).val() !="")
			{
				orginfo += " / "+$("#" + branch +" option:selected").text();		
				if($("#" + center).val() !="")
				{
					orginfo += " / "+$("#" + center +" option:selected").text();
				}
			}
		}
	}
	
	$("#" + requirement).html(orginfo);
}

function FoundIn(element, objarray)
{
    var ret = true;
    for(var i=0; i<objarray.length; i++)
    {
        if(element == objarray[i])
        {
            return ret;
        }
    }

    ret=false;
    return ret;
}

function IncMaxCode(maxCode, codeLen)
{
    var iMaxCode=parseInt(maxCode, 10);
    var codeval=("000000000"+(iMaxCode+1));
    codeval=codeval.substr(codeval.length-codeLen, codeLen);
	
	return codeval;
}

function TextRN2BrFormat(strText)
{
	//return(strText.replace(/\r\n/ig,"<br/>"));
	return(strText.replace(/[\r\n]{1,2}/ig,"<br/>"));
}

function TextBr2RNFormat(strText)
{
	return(strText.replace(/<br>/ig,"\n"));
}

function LockChildrenComponent(component_code)
{

	var params = new Object();
	params.component_code=component_code;
    params.servicename = "com/component/GetStaffChildrenComponent";

    var JSONparamsString = JSON.stringify(params);
    AjaxPostBack("../services/index.php", JSONparamsString, jason_back_LockChildrenComponent);	
}

function jason_back_LockChildrenComponent(data)
{
	if (data.status == 200) 
	{
		var result="";
		try {
			result = ParseBackJSON(data.responseText);
			if(result.status=="ok")
			{
				if(result.count == 0)
				{
					//g_toast.Show("no query data", 2000);
					return;
				}

				for(var i=0; i<result.count; i++)
				{
					$("#"+result.items[i].component_id).css("display","inline-block");
				}
			}
			else
			{
				g_toast.Show("<font color=red>"+result.message+"</font>",2000);
			}
		} catch( error ) {
			g_toast.Show(error.message,2000);
		}
	}
	else
	{
		g_toast.Show("通讯失败："+data.statusText,2000);
	}
}

function bindProjectNo(textId, disabledFlag)
{
	$("#"+textId).val(top.frm_submenu.document.getElementById("in_projectno").value);
	if(disabledFlag)
	{
		$("#"+textId).attr("disabled",disabledFlag);
	}
}

function SpaceFormat(sInput)
{
	var sRet = sInput.replace(/\s+/g, " ");
	return sRet;
}

//项目编号是否正确
function isValidProjectCode(str)
{
 //var reg = /^HY[WNO]0[1-9]-[1-9]{2}-[0-9A-Z][0-9]{2}$/;
 var reg = /^HY[WNO]0[1-9]-[1-9]{2}-[0-9A-Z]{3,4}$/;
 if (reg.test(str))
 	 return true;
 return false;
}

//合同编号格式检查
function isValidContractCode(str)
{
 var reg = /^HY-20[1-9]{2}-[0-9BJK][0-9A-Z]{2,3}$/;
 if (reg.test(str))
 	 return true;
 return false;
}

//是否是数字
function isValidQuantity (str) {
    var regex = /(^[0-9]{1,6}[.]{1}[0-9]{1,2}$)|(^[0-9]{1,6}$)/;
    if (!regex.test(str)){
        return false;
    }
    return true;
}

//function dyRoleSet(){
//	 var resourceids=rid.split(","); 
//		$("[readable]").each(function(){   
//			if(resourceids.indexOf($(this).attr("readable"))<0){  
//				$(this).css("display","none"); 
//			}
//		});
//    var f=false;
//    $("[readable='td'] a").each(function(){
//    	if($(this).css("display")=="none"){ 
//    		f=f||false; 
//    	}
//    	else{
//    		f=f||true; 
//    	}
//    });
//    if(!f){
//    	$("#control").css("display","none");
//    	$("[readable='td']").css("display","none");
//    }
//    if(f){
//    	$("#control").css("display","");
//    	$("[readable='td']").css("display","");
//    	//
//    }
//}

function isnull(obj){
	if (obj==null)
		return "";
	else 
		return obj;
}

	function parseToChinese(PLAN_STATE){
	var PLAN_STATE_CH;
	if(PLAN_STATE==0){
		PLAN_STATE_CH="正在进行";
	}
	if(PLAN_STATE==1){
		PLAN_STATE_CH="正在进行";
	}
	if(PLAN_STATE==2){
		PLAN_STATE_CH="正在进行";
	}
	if(PLAN_STATE==3){
		PLAN_STATE_CH="正在进行";
	}
	if(PLAN_STATE==4){
		PLAN_STATE_CH="正在进行";
	}
	if(PLAN_STATE==5){
		PLAN_STATE_CH="正在进行";
	}
	if(PLAN_STATE==6){
		PLAN_STATE_CH="正在进行";
	}
	if(PLAN_STATE==7){
		PLAN_STATE_CH="已完成";
	}
	if(PLAN_STATE==8){
		PLAN_STATE_CH="计划取消";
	}
	return PLAN_STATE_CH;
}

$(document).ready(function() { 
	
	
	//通过Session值设置topbar
	$.post("json/plan!getItemsInSession.action",
			{
			},
			function(data){
				if(data.PLAN_NAME&&data.PLAN_STATE&&data.PLAN_NAME!=null&&data.PLAN_STATE!=null){ 
					$("#currentPlan").text(data.PLAN_NAME);	
					$("#planState").text("("+parseToChinese(data.PLAN_STATE)+")");					
					$("#ctcode").val(data.PLAN_ID);
				}
				else{
					$("#currentPlan").text("无");
					$("#planState").text("");
				}
				if(data.ORDER_ID!=null&&data.ORDER_ID!=0){
					$("#currentOrder").text(data.ORDER_ID);
				}
				else{
					$("#currentOrder").text("无");
				}
			});
 	});

