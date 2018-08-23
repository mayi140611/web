/*
 * 本文件是页面输入项通用有效性检测的Js文件.
 * 
 * Distributed in whole under the terms of the SNARC.
 *
 * Comment version: 1.0.0
 */
 
//检测是有是有效的ID（以字母开头，【字母】【数字】【_】有效）
function _isValidId(str)
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
function isValidNumber (str) {
    var regex = /^[+|-]?\d*\.?\d*$/;
    if (!regex.test(str)){
        return false;
    }
    return true;
}

//数字是否在指定的有效值范围内
function isValidNumberEx (str,min,max,len) {
	///	<summary>
	///		判断一个字符串是数值
	///		并且在指定的范围内
	///	</summary>
	///	<returns type="Boolean" />
	///	<param name="str" type="String">
	///		元素数组
	///	</param>
	///	<param name="min" type="Number">
	///		指定有效范围最小值，可以为undefined
	///	</param>
	///	<param name="max" type="Number">
	///		指定有效范围最大值，可以为undefined
	///	</param>
	///	<param name="len" type="Number">
	///		小数位长度
	///	</param>
	
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

//是否是整数字符串
function isValidInteger (str) {
				
    var regex = /^[+|-]?\d*$/;
    if (!regex.test(str))
    {
        return false;
    }
    return true;
}

//整数是否指定的有效值范围内
function isValidIntegerEx (str,min,max) {
	///	<summary>
	///		判断一个字符串是整数
	///		并且在指定的范围内
	///	</summary>
	///	<returns type="Boolean" />
	///	<param name="str" type="String">
	///		元素数组
	///	</param>
	///	<param name="min" type="Number">
	///		指定有效范围最小值，可以为undefined
	///	</param>
	///	<param name="max" type="Number">
	///		指定有效范围最大值，可以为undefined
	///	</param>
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

//日期是否合法
function isValidDate (str) {
    var regex = /((^((1[8-9]\d{2})|([2-9]\d{3}))([\-])(10|12|0[13578])([\-])(3[01]|[12][0-9]|0[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([\-])(11|0[469])([\-])(30|[12][0-9]|0[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([\-])(02)([\-])(2[0-8]|1[0-9]|0[1-9])$)|(^([2468][048]00)([\-])(02)([\-])(29)$)|(^([3579][26]00)([\-])(02)([\-])(29)$)|(^([1][89][0][48])([\-])(02)([\-])(29)$)|(^([2-9][0-9][0][48])([\-])(02)([\-])(29)$)|(^([1][89][2468][048])([\-])(02)([\-])(29)$)|(^([2-9][0-9][2468][048])([\-])(02)([\-])(29)$)|(^([1][89][13579][26])([\-])(02)([\-])(29)$)|(^([2-9][0-9][13579][26])([\-])(02)([\-])(29)$))/;
    if (!regex.test(str))
    {
        return false;
    }
   return true;
}

//开始日期和结束日期是否合法
function isValidStartEndDate (start,end) {
	///	<summary>
	///		判断开始日期和结束日期合法
	///		并且开始日期不大于结束日期
	///	</summary>
	///	<returns type="Boolean" />
	///	<param name="start" type="String">
	///		开始日期
	///	</param>
	///	<param name="end" type="String">
	///		结束日期
	///	</param>
    var regex = /((^((1[8-9]\d{2})|([2-9]\d{3}))([\-])(10|12|0[13578])([\-])(3[01]|[12][0-9]|0[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([\-])(11|0[469])([\-])(30|[12][0-9]|0[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([\-])(02)([\-])(2[0-8]|1[0-9]|0[1-9])$)|(^([2468][048]00)([\-])(02)([\-])(29)$)|(^([3579][26]00)([\-])(02)([\-])(29)$)|(^([1][89][0][48])([\-])(02)([\-])(29)$)|(^([2-9][0-9][0][48])([\-])(02)([\-])(29)$)|(^([1][89][2468][048])([\-])(02)([\-])(29)$)|(^([2-9][0-9][2468][048])([\-])(02)([\-])(29)$)|(^([1][89][13579][26])([\-])(02)([\-])(29)$)|(^([2-9][0-9][13579][26])([\-])(02)([\-])(29)$))/;
    if (!regex.test(start))
    {
        return false;
    }
    if (!regex.test(end))
    {
        return false;
    }
    
	var startDate = new Date(start.replace(/-/g,"/"));
	var endDate = new Date(end.replace(/-/g,"/"));
    if (startDate.getTime() == endDate.getTime())
    {
    	return true;
    }
    else if (startDate.getTime() > endDate.getTime())
    {
    	return false;
    }
    else
    {
    	return true;
    }
}

//清除非数字字符（.不清除）
function clearNoNum(obj){
	obj.value = obj.value.replace(/[^\d.]/g,"");
	obj.value = obj.value.replace(/^\./g,"");
	obj.value = obj.value.replace(/\.{2,}/g,"");
	obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
}

//清除所有非数字字符
function getPureNum(obj){
	obj.value = obj.value.replace(/[^\d]/g,"");
}

