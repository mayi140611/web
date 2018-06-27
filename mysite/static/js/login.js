$(document).ready(function(){ 
	$("#checkLogin").click(function(){
		loginSubmit();
		return false;
	});
	
	$("#username").click(function(){
		$("#warnSphere").text("欢迎使用XXX系统，请输入您的用户名和密码").css("color","#1E90FF");
	});
});


function loginSubmit(){
	$.ajax({
		url:"json/login.action",
		type:'POST',
		cache:false,
		data:{
			username:$("#username").val(),
			password:$("#password").val(),
			
		},
		success:function(data){
			if(data.tip!=null){
				$("#warnSphere").text(data.tip).css("color","red");
				return false;
			}else{
				window.location.href="login!goToMainpage.action";
			}
		}
	});
}

