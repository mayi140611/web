/**
 * 
 * @param type 装备类型（总数，飞机，两栖运输车，登陆艇）
 * @param progress 进度 百分比*100
 * @returns 
 */
function setProgressCircle(type,finished,sum){
	var chart = null;
	var area=null;
	var c1='black';//未完成区域颜色
	var c2=null;//已完成区域颜色
	switch(type){
		case "总数": area= "totalchart";c2='red';break;
		case "飞机": area= "fjchart";c2='blue';break;
		case "两栖运输车": area= "lzzbchart";c2='purple';break;
		case "登陆艇": area= "dltchart";c2='gray';break;		
	}
	$('#'+area).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            spacing : [100, 0 , 40, 0]
        },
        title: {
            floating:true,
            text: type
        },
        credits: {
            enabled: false
        },
		exporting: {
            enabled: false
		},
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                point: {
                    events: {
                        //mouseOver: function(e) {  // 鼠标滑过时动态更新标题
                            // 标题更新函数，API 地址：https://api.hcharts.cn/highcharts#Chart.setTitle
                            //chart.setTitle({
                           //     text: e.target.name+ '<br>'+ e.target.y + ' %'
                            //});
                        //}
                    }
                },
            }
        },
        colors: [c2,c1],
        series: [{
            type: 'pie',
            innerSize: '80%',
            name: type,
            data: [
                [type,   finished],
                [type,   sum],
            ]
        }]
    }, 
	
	function(c) {
        // 环形图圆心
        var centerY = c.series[0].center[1],
            titleHeight = parseInt(c.title.styles.fontSize);
        c.setTitle({
            y:centerY + titleHeight/2
        });

        chart = c;
    });
}


setInterval(function () {
		$.post("json/state!getTotalStateInfo.action",
				{},
				function(data){
					var area=null;
					for(var i=0;i<data.totalState.items.length;i++){
						//alert(data.totalState.items[i].type);
						switch(data.totalState.items[i].type){
							case "总数": area= "totalchart";c2='red';break;
							case "飞机": area= "fjchart";c2='blue';break;
							case "两栖运输车": area= "lzzbchart";c2='purple';break;
							case "登陆艇": area= "dltchart";c2='gray';break;		
						}
						var c = $('#'+area).highcharts();
						
						var perData = c.series[0].data[0];
						var unData =  c.series[0].data[1];
						
						if(perData.y < 100){
							perData.update(data.totalState.items[i].finished/data.totalState.items[i].sum*100);
							unData.update(100-data.totalState.items[i].finished/data.totalState.items[i].sum*100);
							c.setTitle({
								text: data.totalState.items[i].type+ '<br>'+ (Math.round(data.totalState.items[i].finished/data.totalState.items[i].sum*100)) + ' %'
							});
							c=null;
						}

						divHtml="";
						//刷新上方数字模块
						switch(data.totalState.items[i].type){
							case "总数": {
								divHtml+='<div class="left peity_bar_good">';
								divHtml+='<span class="glyphicon glyphicon-signal" aria-hidden="true" style="font-size:25px"></span>';
								//divHtml+=(data.totalState.items[i].finished/data.totalState.items[i].sum).toFixed(2)*100;
								divHtml+="计划数："+data.totalState.items[i].sum;
								divHtml+='</div>';
								divHtml+='<div class="right"><strong>';
								divHtml+=data.totalState.items[i].finished;
								divHtml+='</strong> 总数';
								divHtml+='</div>';
								//把任务标记设置为完成
								if(data.totalState.items[i].finished == data.totalState.items[i].sum) isTaskComplete++;
								break;
							}
							case "飞机": {
								divHtml+='<div class="left peity_bar_good">';
								divHtml+='<span class="glyphicon glyphicon-signal" aria-hidden="true" style="font-size:25px"></span>';
								//divHtml+=(data.totalState.items[i].finished/data.totalState.items[i].sum).toFixed(2)*100;
								divHtml+="计划数："+data.totalState.items[i].sum;
								divHtml+='</div>';
								divHtml+='<div class="right"><strong>';
								divHtml+=data.totalState.items[i].finished;
								divHtml+='</strong> 飞机';
								divHtml+='</div>';
								break;
							}
							case "两栖运输车": {
								divHtml+='<div class="left peity_bar_good">';
								divHtml+='<span class="glyphicon glyphicon-signal" aria-hidden="true" style="font-size:25px"></span>';
								//divHtml+=(data.totalState.items[i].finished/data.totalState.items[i].sum).toFixed(2)*100;
								divHtml+="计划数："+data.totalState.items[i].sum;
								divHtml+='</div>';
								divHtml+='<div class="right"><strong>';
								divHtml+=data.totalState.items[i].finished;
								divHtml+='</strong> 两栖运输车';
								divHtml+='</div>';
								break;
							}
							case "登陆艇": {
								divHtml+='<div class="left peity_bar_good">';
								divHtml+='<span class="glyphicon glyphicon-signal" aria-hidden="true" style="font-size:25px"></span>';
								//divHtml+=(data.totalState.items[i].finished/data.totalState.items[i].sum).toFixed(2)*100;
								divHtml+="计划数："+data.totalState.items[i].sum;
								divHtml+='</div>';
								divHtml+='<div class="right"><strong>';
								divHtml+=data.totalState.items[i].finished;
								divHtml+='</strong> 登陆艇';
								divHtml+='</div>';
								break;
							}	
						}
						$("#numbers>li:eq("+i+")").html(divHtml);
					}
					//任务完成后不再刷新时间序列
					//if(isTaskComplete<2){
						
					
					
						var c1 = $('#container2').highcharts();//时间序列highcharts
						c1.series[0].setData(data.planeNum);
						c1.series[1].setData(data.lzzbNum);
						c1.series[2].setData(data.dltNum);
						c1.xAxis[0].setCategories(data.xAxis);
						
/*
						 
						//时间序列
						c1.series[0].setData(sData1);
						c1.series[1].setData(sData2);
						c1.series[2].setData(sData3);
						var date = new Date();
						//alert(date.getHours()+":"+date.getMinutes()+":"+date.getSeconds())
						m = date.getMinutes();
						if(date.getMinutes()<10) m = "0"+date.getMinutes();
						s = date.getSeconds();
						if(date.getSeconds()<10) s = "0"+date.getSeconds();
						var t = date.getHours()+":"+m+":"+s;
						
						xAixsData.push(t);
						//alert(xAixsData)
						c1.xAxis[0].setCategories(xAixsData);
					//}
*/				    
				});
	
},5000);

