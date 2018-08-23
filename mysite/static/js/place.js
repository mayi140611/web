$(document).ready(OnLoad);
$(window).resize(OnSize);

var g_cur_select_cnt = 0;

function OnLoad(){
	$("#main tr td").bind('click', function(){
		$(this).css("backgroundColor", "blue");
		g_cur_select_cnt ++;
	});
	
	$("#main tr td").bind('dblclick', function(e){
		//$(this).css("backgroundColor", "green");
		g_cur_select_cnt = 0;
		AreaMark(e.clientX, e.clientY);
	});
	
}

function OnSize(){
}

function AreaMark(x, y){
	var mark = new Mark(x,y,x+200,y+100,80,40);
	mark.setSize(80,40);
	mark.setTextAlign("center");
	mark.Show("弹药区",2000);
}

function Mark(left,up,right,down,width,height)
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
			this.div = document.getElementById("danyao_toast_9999");
		}
		if(this.div == null)
		{
			this.div = document.createElement("div");
			this.div.id = "danyao_toast_9999";
			this.div.style.display = "block";
			this.div.style.padding = "10px 10px 10px 10px";
			
			this.div.style.position = "absolute";
			this.div.style.zIndex = "10001";
			this.div.style.background = "#369";
			this.div.style.color = "#FFFFFF";
			this.div.style.border = "solid #FFFFFF 1px";
			
			document.body.appendChild(this.div);
		}
		
		this.div.style.display = "block";
		this.div.style.top = up + "px";	
		this.div.style.left = left + "px";	
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
}
