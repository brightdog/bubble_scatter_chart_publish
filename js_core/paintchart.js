
var BubbleArrayList = {};
var BubbleObjList = new Array;
var SelectedBubbles = new Array;
var SelectedBubblesIndex = new Array;
var garrDiameter = new Array;
var gRadiusMapping = {};
var bolSelectedBubble = new Boolean(false);
var gShowType_X = "Lin", gShowType_Y = "Log";
var iConfig;
var giDate;
var Unit = new Array();
var gMinRadius = 5; gMaxRadius = 50;

var Axis_X_Name, Axis_Y_Name, Axis_R_Name;

String.prototype.trim=function(){
        return this.replace(/(^s*)|(s*$)/g, "");
}
String.prototype.ltrim=function(){
        return this.replace(/(^s*)/g,"");
}
String.prototype.rtrim=function(){
        return this.replace(/(s*$)/g,"");
}

Array.prototype.Exists = function (Item){
	for (var i = 0; i < this.length; i++)
	{
		if (this[i] == Item)
			return true;
	}
	return false;
}

Array.prototype.MinDistence = function (Item){
	//一个数组里的所有值，和给定的值的最小距离。返回为大于等于0的数。
	var MinDis = Math.pow(10,100);
	for (var i = 0; i < this.length; i++)
	{
		t = Math.abs(this[i] - Item)
		if (t < MinDis)
			MinDis = t;
	}
	return MinDis;
}

Array.prototype.IndexOf = function (Item){
	for (var i = 0; i < this.length; i++)
	{
		if (this[i] == Item)
			return i;
	}
	return -1;
}
Array.prototype.Remove = function(Item) {
	var a = [];
	for (var i=0; i<this.length; i++) {
		if (this[i] != Item) {
			a.push(this[i]);
		}
	}
	return a;
}

Array.prototype.SortBySubArrIndex = function(Index) {
	var arr = this;
	var tmp = [];
	var iMin;
	inc_Sort = function(){
		do{
			iMin = arr[0]
			for (i = 0; i < arr.length; i++){
				if (iMin[Index] > arr[i][Index])
					iMin = arr[i];
			}
			tmp.push(iMin);
			arr = arr.Remove(iMin)
		} while (arr.length > 0)
	}
	inc_Sort();
	return tmp;
}


Array.prototype.uniq = function() {  
	var temp = {}, len = this.length;

	for(var i=0; i < len; i++)  {  
		if(typeof temp[this[i]] == "undefined") {
			temp[this[i]] = 1;
		}  
	}  
	this.length = 0;
	len = 0;
	for(var i in temp) {  
		this[len++] = i;
	}  
	return this;  
}

// 说明：给 Javascript 数组添加一个 indexOf 方法

// 整理：http://www.CodeBit.cn

Array.prototype.IndexInclude = function(v){
	for (var i = this.length - 1; i >= 0; i--)
	{
		if (this[i].toString().indexOf(v) >= 0)
		{
			break;
		}
		
	}
	return i;
}; 

//这是矩形对象------------------------------------

function Rect(x,y,width,height)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height= height;
}
Rect.prototype.getX = function()
{
    return this.x;
}
Rect.prototype.getY = function()
{
    return this.y;
}
Rect.prototype.getWidth = function()
{
    return this.width;
}
Rect.prototype.getHeight = function()
{
    return this.height;
}
Rect.prototype.getLeft = function()
{
    return this.x;
}
Rect.prototype.getTop = function()
{
    return this.y;
}
Rect.prototype.getRight = function()
{
    return (this.x + this.width);
}
Rect.prototype.getBottom = function()
{
    return (this.y + this.height);
}

//----------------------------------------

getLogAxis = function(Val, AxisName){
	Axis = eval("arrAxis_" + AxisName);
	PaintLength = AxisName == "X" ? gPaintWidth : gPaintHeight;
	if (Axis[0] == 0)
		logMin = 0;
	else
		logMin = Math.log(Axis[0]);
	logMax = Math.log(Axis[Axis.length - 1]);
	
	if (logMin == 0) logMove = 0;
	else {logSeed = logMax / PaintLength; logMove = Math.log(logMin) / logSeed;}
	tmp = ((Math.log(Val) - logMin) * logMax) / (logMax - logMin);
	tmp = parseInt(tmp * PaintLength / logMax);
	return tmp;
}

var cricle = function(x,y,r,c){
	this.x = x;
	this.y = y;
	this.r = r;
	this.c = c;
	//this.isCurrent=false;
	this.drawC=function(ctx, x, y, Alp, index){
		//LogicalPixMapping_X, LogicalPixMapping_Y取全局变量
		//arrAxis_X, arrAxis_Y取全局变量
		ctx.save();
		ctx.globalCompositeOperation = 'destination-over';
		ctx.beginPath();

		ctx.translate(0, gAreaHeight - 100);//设置绘图的原点  //将上层画圈圈的CANVAS缩小，放在坐标轴内部确保圈圈不会盖住坐标轴上的刻度值
		//这里要根据坐标轴的显示类型，确定圆心的位置
		
		if(gShowType_X != "Log")
			this_x = this.x / LogicalPixMapping_X;
		else{
			this_x = getLogAxis(this.x, "X");
		}
		if(gShowType_Y != "Log")
			this_y = -1 * this.y / LogicalPixMapping_Y;
		else{
			this_y = -1 * getLogAxis(this.y, "Y");
		}


		this_r = gRadiusMapping[this.r];

		ctx.arc(this_x, this_y, this_r, PI_2, 0, true);
		if (x && y && ctx.isPointInPath(x, y)) {
				
				if (!bolSelectedBubble){
					bolSelectedBubble = true;
					if (SelectedBubbles.Exists(this)){
						SelectedBubbles = SelectedBubbles.Remove(this);
						SelectedBubblesIndex = SelectedBubblesIndex.Remove(index);
						ctx.fillStyle = c.replace("|Alp|", Alp);
					}
					else{
						SelectedBubbles.push(this);
						SelectedBubblesIndex.push(index);
						ctx.fillStyle = c.replace("|Alp|", 0);
					}
				}else{
					ctx.fillStyle = c.replace("|Alp|", Alp);
				}

		}else{
			ctx.fillStyle = c.replace("|Alp|", Alp);
		}
		
		ctx.fill();
		
		ctx.moveTo(this_x + this_r + 1, this_y);
		ctx.lineWidth = 1;//宽度为1像素
		ctx.arc(this_x, this_y, this_r, 0, PI_2, true);
		//ctx.strokeStyle = this.c.replace("|Alp|", 1.0);
		ctx.strokeStyle = "rgba(153,153,153, 0.5)";
		ctx.stroke();
		ctx.restore();
	}
}


function GetSeries(x, y, r){
	var LastiDateIndex = -1;
	var LastiDate = "";
	garrDiameter = new Array();
	
	var CurrentSeries = [];
	
	
	//{"y":2004,"data":[[97809,66929,117373],[15802,14078,19703],[1861,1705,2775],[5358,4556,6929],[355128,259421,428707],[213542,161317,257464]]},
	
	
	for(i = 0; i < x.length; i++){
		
		var t = "";
		t = "{\"y\":\"" + DateRange[i] + "\",\"data\":[|DATA|]}";
		var tt = "", iAxis = 1;
		for(j = 0; j < Segment.length; j++){
			tt += "[" + x[i][j] + "," + y[i][j] + "," + r[i][j] + "]";
			if(iAxis < Segment.length){
				tt += ",";
			}

			iAxis++;
		}
		
		//t = eval(t.replace(/\|DATA\|/, tt));
		t = eval("(" + t.replace(/\|DATA\|/, tt) + ")")
		CurrentSeries.push(t);
		//DateIndex++;
	}
	
	for (i = 0; i < CurrentSeries.length; i++){
		if(CurrentSeries[i].y != LastiDate){
			LastiDate = CurrentSeries[i].y
		}
		arrBubble = new Array();
		for(j = 0; j < CurrentSeries[i].data.length; j++){
			arrBubble[j] = [CurrentSeries[i].data[j][0], CurrentSeries[i].data[j][1], CurrentSeries[i].data[j][2], "rgba(" + ColorList[j] + ", |Alp|)"];
			garrDiameter.push(CurrentSeries[i].data[j][2]);
		}
		BubbleArrayList[LastiDate.toString()] = arrBubble;
	}
	//gRadiusMapping = SplitRadiusRange(gMinRadius, gMaxRadius, garrDiameter.uniq(), 1)
	return;
}

reMappingRadius = function(){
	gRadiusMapping = SplitRadiusRange(gMinRadius, gMaxRadius, garrDiameter.uniq(), 1)
}

function GetMaxMinValue(){
	var Vmin_X, Vmax_X, Vmin_Y, Vmax_Y, bolFirst = true;
	
	for (i in BubbleArrayList){
		if (typeof(BubbleArrayList[i]) != "function")
			for (j = 0; j < BubbleArrayList[i].length; j++){
				if(bolFirst){
					Vmin_X = BubbleArrayList[i][j][0];
					Vmax_X = BubbleArrayList[i][j][0];
					Vmin_Y = BubbleArrayList[i][j][1];
					Vmax_Y = BubbleArrayList[i][j][1];
					bolFirst = !bolFirst;
				}
				
				if(BubbleArrayList[i][j][0] < Vmin_X)
					Vmin_X = BubbleArrayList[i][j][0];
				if(BubbleArrayList[i][j][0] > Vmax_X)
					Vmax_X = BubbleArrayList[i][j][0];
				if(BubbleArrayList[i][j][1] < Vmin_Y)
					Vmin_Y = BubbleArrayList[i][j][1];
				if(BubbleArrayList[i][j][1] > Vmax_Y)
					Vmax_Y = BubbleArrayList[i][j][1];
				
			}
	}
	return [Vmin_X, Vmax_X, Vmin_Y, Vmax_Y];
}

function draw(iDateIndex, bolWithGrid, AreaWidth, AreaHeight, ShowType_X, ShowType_Y, ResetAll){
		giDateIndex = iDateIndex
		if (AreaWidth != undefined)
			gAreaWidth = AreaWidth;
		if (AreaHeight != undefined)
			gAreaHeight = AreaHeight;
		if ((gAreaWidth && gAreaHeight) == undefined)
			return;

		var ctx = $('MySelected').getContext('2d');
		ctx.clearRect(0, 0, gAreaWidth, gAreaHeight);//绘图区域
		var ctx = $('MyChart').getContext('2d');
		ctx.clearRect(0, 0, gAreaWidth, gAreaHeight);//绘图区域
		BubbleObjList = [];
		if (bolWithGrid) {
			GetSeries(eval(Axis_X_Name), eval(Axis_Y_Name), eval(Axis_R_Name));
			iConfig = GetMaxMinValue();
			gShowType_X = gShowType_X == undefined? ShowType_X : ShowType_X != gShowType_X ? ShowType_X != undefined ? ShowType_X : gShowType_X : gShowType_X;
			gShowType_Y = gShowType_Y == undefined? ShowType_Y : ShowType_Y != gShowType_Y ? ShowType_Y != undefined ? ShowType_Y : gShowType_Y : gShowType_Y;
			DrawGrid('MyGrid', iConfig[0], iConfig[1], gShowType_X,iConfig[2], iConfig[3], gShowType_Y, gAreaWidth, gAreaHeight);
		}
		reMappingRadius();
		var iDate = DateRange[iDateIndex];
		for(var i = 0; i < BubbleArrayList[iDate].length; i++){
			var c=new cricle(BubbleArrayList[iDate][i][0],BubbleArrayList[iDate][i][1],BubbleArrayList[iDate][i][2], BubbleArrayList[iDate][i][3]);
			c.drawC(ctx, null, null,1.0);
			BubbleObjList.push(c);
		}
		var ctx = $("iDate").getContext('2d');
		ctx.clearRect(0, 0, gAreaWidth, gAreaHeight);//绘图区域
		ctx.fillStyle = "#E0E0E0";
		iFontSize = (gAreaWidth * 0.25).toString();
		ctx.font = "bolder " + iFontSize + "px Arial,sans-serif";
		m=ctx.measureText(iDate)
		//ctx.fillText(iDate, (gAreaWidth) / 2 - (m.width / 2) + 40,  gAreaHeight / 2 + gAreaHeight * 0.15 + 40);
		ctx.fillText(iDate, 82,  gAreaHeight / 2 + gAreaHeight * 0.15 + 40);
		if(ResetAll){
			SelectedBubbles = [];
			SelectedBubblesIndex = [];
		}
		if(!bolWithGrid)
			reDraw(null, null, null, "index");//drawSelected("index");
		else
			reDraw();
			//drawSelected();
}

function reDraw(e, Alp, bolOnMouseMove, tp){
	//e=e||event;
	if (Alp == void(0)) Alp = 0.3;
	canvas = $('MyChart');
	if (e){
		var x = e.clientX - canvas.offsetLeft + window.scrollX;
		var y = e.clientY - canvas.offsetTop + window.scrollY;
	}else{
		x = null;
		y = null;
	}
	//canvas.width = canvas.width;
	ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, gAreaWidth, gAreaHeight); //绘图区域
	//for(var i = list.length - 1;i>=0; i--){
	iDate = DateRange[giDateIndex];
	for(var i = 0;i < BubbleArrayList[iDate].length; i++){
		var c = BubbleObjList[i];
		c.drawC(ctx,x,y, Alp, i);

	}
	if (!bolSelectedBubble && !bolOnMouseMove){
		SelectedBubbles = [];
		SelectedBubblesIndex = [];
	}
	drawSelected(tp);
}

drawSelected = function(tp){
		var ctx = $('MyTip').getContext('2d');
		ctx.clearRect(0, 0, gAreaWidth, gAreaHeight); //绘图区域
		var ctx = $('MySelected').getContext('2d');
		ctx.clearRect(0, 0, gAreaWidth, gAreaHeight); //绘图区域
		//$('MyTip').width = $('MyTip').width;
		//BubbleArrayList = [];
		if(tp == "index"){
			SelectedBubbles = [];
			for(var i = 0; i < BubbleObjList.length; i++){
				if(SelectedBubblesIndex.Exists(i))
					SelectedBubbles.push(BubbleObjList[i]);
			}
		}
		if (SelectedBubbles.length > 0){
			SelectedBubbles = SelectedBubbles.SortBySubArrIndex('r');
			for(var i = 0;i < SelectedBubbles.length; i++){
				ctx.save();
				ctx.globalCompositeOperation = 'destination-over';
				
				ctx.beginPath();
				ctx.lineWidth = 1;
				//ctx.translate(80, gAreaHeight - 50);//设置绘图的原点
				ctx.translate(0, gAreaHeight - 100);//设置绘图的原点  //将上层画圈圈的CANVAS缩小，放在坐标轴内部确保圈圈不会盖住坐标轴上的刻度值
				if(gShowType_X != "Log")
					this_x = SelectedBubbles[i].x / LogicalPixMapping_X;
				else{
					this_x = getLogAxis(SelectedBubbles[i].x, "X");
				}
				if(gShowType_Y != "Log")
					this_y = -1 * SelectedBubbles[i].y / LogicalPixMapping_Y;
				else{
					this_y = -1 * getLogAxis(SelectedBubbles[i].y, "Y");
				}
				//this_x = SelectedBubbles[i].x / LogicalPixMapping_X;
				//this_y = SelectedBubbles[i].y / LogicalPixMapping_Y * -1;
				//this_r = Math.sqrt(Math.sqrt(SelectedBubbles[i].r)) * 1.5 + 5;
				this_r = gRadiusMapping[SelectedBubbles[i].r];
				//SelectedBubbles[i].r = 30;
				ctx.arc(this_x, this_y, this_r, PI_2, 0, true);

				ctx.fillStyle = SelectedBubbles[i].c.replace("|Alp|", 1);
				ctx.fill();
				
				ctx.moveTo(this_x + this_r + 20, this_y);
				ctx.lineWidth = 5;//宽度为10像素
				ctx.arc(this_x, this_y, this_r + 20, 0, PI_2, true);
				ctx.strokeStyle = SelectedBubbles[i].c.replace("|Alp|", 0.8);
				ctx.stroke();
				ctx.moveTo(this_x + this_r + 25, this_y);
				ctx.lineWidth = 5;//宽度为10像素
				ctx.arc(this_x, this_y, this_r + 25, 0, PI_2, true);
				ctx.strokeStyle = SelectedBubbles[i].c.replace("|Alp|", 0.5);
				ctx.stroke();
				ctx.moveTo(this_x + this_r + 30, this_y);
				ctx.lineWidth = 5;//宽度为10像素
				ctx.arc(this_x, this_y, this_r + 30, 0, PI_2, true);
				ctx.strokeStyle = SelectedBubbles[i].c.replace("|Alp|", 0.2);
				ctx.stroke();
				ctx.restore();
				ShowAxisLabel(SelectedBubbles[i], this_x, this_y, this_r, i);
				
			}
		}else{
			ctx = $('MyChart').getContext('2d');
			ctx.clearRect(0, 0, gAreaWidth, gAreaHeight); //绘图区域
			//for(var i = list.length - 1;i>=0; i--){
			if(SelectedBubbles.length > 0) Alp = 0.3; else Alp = 1.0
			for(var i = 0;i < BubbleObjList.length; i++){
				var c = BubbleObjList[i];
				c.drawC(ctx, null, null, Alp);
		
			}
		}
}

ShowAxisLabel = function(obj, x, y, r, i){
	//obj: 泡泡对象,包含原始数据
	//x, y: 实际像素坐标
	//i: 第几个泡泡,如果是第一个(i == 0)的话,需要将MyTip层的画布清空,否则直接增量画上去就可以了。 
	//最好再加一个浮动层提示
	lbl_x = obj.x;
	lbl_y = obj.y;
	lbl_r = obj.r;	

	
	var ctx = $('MyTip').getContext('2d');
	if(i ==0)ctx.clearRect(0, 0, gAreaWidth, gAreaHeight); //绘图区域
	ctx.save();
	ctx.globalCompositeOperation = "destination-over";
	ctx.translate(80, gAreaHeight - 50);//设置绘图的原点
	ctx.lineWidth = 1;//宽度为1像素

	ctx.font = "bold 13px Arial";
	ctx.style_Height = "200px";
	
	m=ctx.measureText(lbl_x);
	lblwidth_x = m.width + 10;	
	ctx.fillText(lbl_x, x - lblwidth_x / 2 + 5, 15);
	
	m=ctx.measureText(lbl_y);
	lblwidth_y = m.width + 10;
	if(lblwidth_y > 30){
		lbl_y = makeAxisLabel(lbl_y, true);
		m=ctx.measureText(lbl_y);
		lblwidth_y = m.width + 10;
	}
	if(x -lblwidth_y + 5 < 50)
		ctx.fillText(lbl_y, x + r + 35, y + 10);
	else
		ctx.fillText(lbl_y, -lblwidth_y + 5, y + 10);
	//ctx.stroke();
	
	ctx.strokeStyle = obj.c.replace("|Alp|", 1);
	ctx.fillStyle = obj.c.replace("|Alp|", 1);
	
	rect = new Rect(x - lblwidth_x / 2, 0, lblwidth_x, 20);
	roundRectanglePath(ctx, rect, 5);
	
	
	if(x -lblwidth_y + 5 < 50)
		rect = new Rect(x + r + 30, y - 5, lblwidth_y, 20);
	else
		rect = new Rect(-lblwidth_y, y - 5, lblwidth_y, 20);
	roundRectanglePath(ctx, rect, 5);

	ctx.restore();
	
	
	
	ShowToolTip = function(){
	//obj: 泡泡对象,包含原始数据
	//x, y: 实际圆心坐标
		lbl_x = obj.x;
		lbl_y = obj.y;
		lbl_r = obj.r;	
	
		var LineLength = 60;//斜线至少有60个像素长；
		
		var ctx = $('MyTip').getContext('2d');
		ctx.save();
		ctx.beginPath();
		ctx.globalCompositeOperation = "destination-over";
		ctx.translate(80, gAreaHeight - 50);//设置绘图的原点
		ctx.lineWidth = 3;//宽度为3像素
		ctx.strokeStyle = obj.c.replace("|Alp|", 1);
		ctx.lineCap = "round"; 
		ctx.font = "bold 15px Arial";
		ctx.style_Height = "200px";
		
		m=ctx.measureText(lbl_r);
		lblwidth = m.width + 10;	
		
		//color = obj.c.match(/(\d+)/g);
		//ctx.fillStyle = "rgba(" + (255 - parseInt(color[0])).toString() + ", " + (255 - parseInt(color[1])).toString() + ", " + (255 - parseInt(color[2])).toString() + ", 1)"
		
		//先算出浮动提示框可以存在的空间，如果不满足，则进行空间变换
		//指示线条与水平线之间的夹角为30度，如果空间不够，则向另外3个方向变换
		//tx1： 与圆周交会的X坐标点，同理还有个ty1
		//tx2： 与水平线交会的X坐标点，同理还有个ty2
		//在水平线上还要画一个圆角矩形，或者去掉水平线，直接与30度角的斜线交会，显示实际R的值
		//先左上角，然后右上叫，再右下角，再左下角（与CSS规则一样，上，右，下，左）
		tmp1 = Math.cos(PI / 6) * r;
		tx1 = x - tmp1;
		ty1 = y - Math.sqrt((r * r) - (tmp1 * tmp1));
		
		R = r + LineLength;
		tmp2 = Math.cos(PI / 6) * (R);
		tx2 = x - tmp2;
		ty2 = y - Math.sqrt((R * R) - (tmp2 * tmp2));
		bolLeft = true;
		bolUpper = true;
		
		switch(true){
			case tx2 < 60://左侧空间不够，需要向右边画
				tx1 = x + tmp1;
				tx2 = x + tmp2;
				bolLeft = false;
			break;
			
			case ty2 < -1 * gPaintHeight://上面空间不够，需要向下面画
				ty1 = y + Math.sqrt((r * r) - (tmp1 * tmp1));
				ty2 = y + Math.sqrt((R * R) - (tmp2 * tmp2)) - 5;
				bolUpper = false;
			break;
		}
		
		ctx.moveTo(tx1, ty1);
		ctx.lineTo(tx2, ty2);
		ctx.stroke();

		m=ctx.measureText(lbl_r);
		lblwidth = m.width + 10;
		
		
		if(bolUpper){
			ctx.fillText(lbl_r, tx2 - lblwidth / 2 + 5 , ty2 - 5);
			ctx.fillStyle = obj.c.replace("|Alp|", 1);
			rect = new Rect(tx2 - lblwidth / 2, ty2 - 20, lblwidth, 20);
		}else{
			ctx.fillText(lbl_r, tx2 - lblwidth / 2 + 5 , ty2 + 15);
			ctx.fillStyle = obj.c.replace("|Alp|", 1);
			rect = new Rect(tx2 - lblwidth / 2, ty2, lblwidth, 20);
		}
		
		roundRectanglePath(ctx, rect, 8);

		ctx.closePath();
		ctx.restore();
	}
	ShowToolTip();
}



function roundRectanglePath(context,rect,radius)
{
	
    context.beginPath();
    context.moveTo( rect.getX()+radius,rect.getY() );
    context.lineTo( rect.getRight()-radius,rect.getY() );
    context.arc( rect.getRight()-radius,rect.getY()+radius, radius, 3*Math.PI/2,2*Math.PI, false);
    context.lineTo( rect.getRight(),rect.getBottom()-radius);
    context.arc( rect.getRight()-radius,rect.getBottom()-radius, radius, 0, Math.PI/2, false);
    context.lineTo( rect.getX()+radius,rect.getBottom() );
    context.arc( rect.getX()+radius,rect.getBottom()-radius, radius, Math.PI/2, Math.PI, false);
    context.lineTo( rect.getX(),rect.getY()+radius);
    context.arc( rect.getX()+radius,rect.getY()+radius, radius,Math.PI, 3*Math.PI/2, false);
	//context.stroke();
	context.fill();
    context.closePath();
}


//===========================================================================================
//Mapping = SplitDiameterRange(5, intMaxBubbleSize, arrItems.uniq(), 10);
SplitRadiusRange = function(intMin, intMax, arrItems, intRange)
{
	//intMin, intMax, 半径允许的最小和最大值（像素）
	//arrItems，传入的经过唯一性转化的数组，arr.uniq()
	if (intMin == undefined) intMin = 10;
	if (intMax == undefined) intMax = 150;
	if (intRange == undefined) intRange = 5;
	if (intRange > (intMax - intMin)) intRange = parseInt((intMax - intMin) / 10);
	// 数组排序先...从小到大排序
	//arrSortItems = arrItems.sort(function(a,b){return a - b;});
	// 确定到底可以画几个圈...
	intCircle = Math.round(intMax - intMin) / intRange + 1;
	ValueRange = (arrItems[arrItems.length - 1] - arrItems[0]) / arrItems.length;
	//算出每个圈的分布情况
	//Values Per Circle  -->每个半径值内，覆盖到了多少个半径圈 （形象：正梯形，或者倒梯形）
	VsPC = intCircle / arrItems.length;
	
	map = {};
	
	for (i = 0; i < arrItems.length; i++){
		map[arrItems[i]] = Math.round(i * VsPC) * intRange + intMin > intMax ? intMax : Math.round(i * VsPC) * intRange + intMin;
	}

	return map;
}

var PI = Math.PI;
var PI_2 = Math.PI * 2;
var iTimer;
var bolOnMoving = new Boolean(false);

var arrAxisPoint_X = new Array();
var arrAxisPoint_Y = new Array();
//var TrueStepLength_X;
//var TrueStepLength_Y;
var LogicalPixMapping_X;
var LogicalPixMapping_Y;
var gAreaWidth;
var gAreaHeight;
var arrAxis_X = new Array();
var arrAxis_Y = new Array();
var gPaintWidth;
var gPaintHeight;
DrawGrid = function(id, Vmin_X, Vmax_X, ShowType_X, Vmin_Y, Vmax_Y, ShowType_Y, AreaWidth, AreaHeight){

	arrAxisPoint_X = new Array();
	arrAxisPoint_Y = new Array();
	
	var objAxis_X = CoordinateScale(Vmin_X, Vmax_X, ShowType_X);

	var objAxis_Y = CoordinateScale(Vmin_Y, Vmax_Y, ShowType_Y);
	

	arrAxis_X = new Array();
	arrAxis_Y = new Array();
	
	arrAxis_X.push(objAxis_X.Lower.toFixed(objAxis_X.DecimalLength));
	for (i = 1; i <= objAxis_X.Step; i ++){
		tmp = ((i * objAxis_X.StepLength) + objAxis_X.Lower).toFixed(objAxis_X.DecimalLength);
		arrAxis_X.push(tmp);
	}
	arrAxis_Y.push(objAxis_Y.Lower.toFixed(objAxis_Y.DecimalLength));
	for (i = 1; i <= objAxis_Y.Step; i ++){
		tmp = ((i * objAxis_Y.StepLength) + objAxis_Y.Lower).toFixed(objAxis_Y.DecimalLength);
		arrAxis_Y.push(tmp);
	}


	
	_drawGrid = function(id, Axis_X, ShowType_X, Axis_Y, ShowType_Y, AreaWidth, AreaHeight, AxisArr_X, AxisArr_Y){

		var ctx = $(id).getContext('2d');
		ctx.font = "14px Arial";
		ctx.save();
		ctx.clearRect(0,0,AreaWidth,AreaHeight);//绘图区域
		
		ctx.strokeStyle = "#D6D6D6";//网格线的颜色
		//ctx.scale(0.9,0.9);  //缩放坐标系，但是全局的，不能用！
		ctx.lineWidth = 1;//网格线宽度为1像素
		ctx.font = "bold 13px Arial";
		ctx.style_Height = "200px";
		ctx.translate(80, AreaHeight - 50);//设置绘图的原点

		ctx.moveTo(0, 0);//移动到原点
		
		gPaintWidth = PaintWidth = AreaWidth - 85;
		gPaintHeight = PaintHeight = AreaHeight - 100;
		
		var iPix = 0.5;
		
		//this.GetZeroLength = function(Val){return Val.toString().length - Val.replace(/0/g, "").toString().length;}
		

		if(ShowType_X != "Log"){
			TrueStepLength_X = Math.round(PaintWidth / (Axis_X.length - 1));
			if(TrueStepLength_X < PaintWidth / (Axis_X.length - 1)) iPix *= -1;
			
			for (i = 0; i < Axis_X.length; i++)
			{
				ctx.beginPath();
				ctx.strokeStyle = "#D6D6D6";//网格线的颜色
				tmp = i * TrueStepLength_X;
				arrAxisPoint_X.push(tmp);
				ctx.moveTo(tmp + iPix, 0);
				ctx.lineTo(tmp + iPix, -PaintHeight);
				//ctx.lineTo(900,-j);
				ctx.stroke();
				
				if (i > 0 && i < Axis_X.length - 1){
					strLbl = makeAxisLabel(Axis_X[i]);
					m=ctx.measureText(strLbl);
					if((tmp + m.width / 2) < PaintWidth)
						ctx.fillText(strLbl, tmp - m.width / 2, 15);
				}
				ctx.closePath();
			}
		}else{
			lastAxisTitlePix = 0;
			lastAxisPix = 0;
			var arrAxisTitlePixRange = new Array();
			if (Axis_X[0] == 0)
				logMin = 0;
			else
				logMin = Math.log(Axis_X[0]);
			logMax = Math.log(Axis_X[Axis_X.length - 1]);
			
			if (logMin == 0) logMove = 0;
			else {logSeed = logMax / PaintWidth; logMove = Math.log(logMin) / logSeed;}
			for (var i = 0; i < Axis_X.length; i++)
			{
				ctx.beginPath();
				tmp = ((Math.log(Axis_X[i]) - logMin) * logMax) / (logMax - logMin);
				tmp = parseInt(tmp * PaintWidth / logMax);
				
				if (isNaN(tmp)) tmp = 0;
				
				if(tmp - lastAxisPix >= 30 || tmp == 0){
					
					ctx.strokeStyle = "#D6D6D6";//网格线的颜色
					ctx.moveTo(tmp + iPix, 0);
					ctx.lineTo(tmp + iPix, -PaintHeight);
					ctx.stroke();
					lastAxisPix = tmp;
					arrAxisPoint_X.push(tmp);
				
					if (i > 0 && i < Axis_X.length - 1){
						strLbl = makeAxisLabel(Axis_X[i]);
						m=ctx.measureText(strLbl);
						if((tmp - m.width / 2) - lastAxisTitlePix >= 50 && (tmp + m.width / 2) < PaintWidth){
							ctx.fillText(strLbl, tmp - m.width / 2, 15);
							lastAxisTitlePix = tmp + m.width / 2;
							arrAxisTitlePixRange.push(tmp - m.width / 2);
							arrAxisTitlePixRange.push(tmp + m.width / 2);
						}
					}
				}
				ctx.closePath();
			}
			lastAxisPix = 0;
			lastAxisTitlePix = 0;
			for (var i = 0; i < AxisArr_X.length; i++)
			{
				if(AxisArr_X[i] < Axis_X[Axis_X.length - 1]){
					tmp = ((Math.log(AxisArr_X[i]) - logMin) * logMax) / (logMax - logMin);
					tmp = parseInt(tmp * PaintWidth / logMax);
					//arrAxisPoint_X.push(tmp);
					if((tmp - lastAxisPix >= 10 && arrAxisPoint_X.MinDistence(tmp) >= 10)){
						ctx.beginPath();
						ctx.strokeStyle = "#EEEEEE";//网格线的颜色
						ctx.moveTo(tmp + iPix, 0);
						ctx.lineTo(tmp + iPix, -PaintHeight);
						ctx.stroke();
						lastAxisPix = tmp;
						if (i > 0 && i < AxisArr_X.length - 1){
							strLbl = makeAxisLabel(AxisArr_X[i]);
							m=ctx.measureText(strLbl);
							if((tmp - m.width / 2) - lastAxisTitlePix >= 50 && arrAxisTitlePixRange.MinDistence(tmp) >= 50 && (tmp + m.width / 2) < PaintWidth){
								if(AxisArr_X[i].toString().replace(/0/g,"") % 2 == 0){
									//刻度值去掉0之后，必须为偶数，否则不予显示
									ctx.fillText(strLbl, tmp - m.width / 2, 15);
									lastAxisTitlePix = tmp + m.width / 2;
								}
							}
						}
						ctx.closePath();
					}
				}
			}
				

		}
		if(ShowType_Y != "Log"){
			TrueStepLength_Y = Math.round(PaintHeight / (Axis_Y.length - 1));
			if(TrueStepLength_Y < PaintHeight / (Axis_Y.length - 1)) iPix *= -1;

			for (i = 0; i < Axis_Y.length; i++)
			{
				ctx.beginPath();
				ctx.strokeStyle = "#D6D6D6";//网格线的颜色
				tmp = -i * TrueStepLength_Y;
				arrAxisPoint_Y.push(tmp);
				ctx.moveTo(0, tmp + iPix);
				ctx.lineTo(arrAxisPoint_X[arrAxisPoint_X.length - 1], tmp + iPix);
				ctx.stroke();
				
				if (i > 0 && i < Axis_Y.length - 1){
					strLbl = makeAxisLabel(Axis_Y[i]);
					m=ctx.measureText(strLbl);
					if((tmp + 5) < PaintHeight)
						ctx.fillText(strLbl, -m.width - 5, (tmp + 5));
				}
				ctx.closePath();
			}
		}else{
			lastAxisTitlePix = 0;
			lastAxisPix = 0;
			var arrAxisTitlePixRange = new Array();
			if (Axis_Y[0] == 0)
				logMin = 0;
			else
				logMin = Math.log(Axis_Y[0]);
			logMax = Math.log(Axis_Y[Axis_Y.length - 1]);
			
			if (logMin == 0) logMove = 0;
			else {logSeed = logMax / PaintHeight; logMove = Math.log(logMin) / logSeed;}
			for (i = 0; i < Axis_Y.length; i++)
			{
				ctx.beginPath();
				tmp = ((Math.log(Axis_Y[i]) - logMin) * logMax) / (logMax - logMin);
				tmp = -1 * parseInt(tmp * PaintHeight / logMax);

				if (isNaN(tmp)) tmp = 0;
				
				if(Math.abs(tmp - lastAxisPix) >= 30 || tmp == 0 || i == Axis_Y.length - 1){
				
					ctx.strokeStyle = "#D6D6D6";//网格线的颜色
					ctx.moveTo(0, tmp + iPix);
					ctx.lineTo(arrAxisPoint_X[arrAxisPoint_X.length - 1], tmp + iPix);
					//ctx.lineTo(900,-j);
					ctx.stroke();
					lastAxisPix = tmp;
					arrAxisPoint_Y.push(tmp);
				
					if (i > 0 && i < Axis_Y.length - 1){
						strLbl = makeAxisLabel(Axis_Y[i]);
						m=ctx.measureText(strLbl);
						if(Math.abs((tmp + 5) - lastAxisTitlePix) >= 30 && (tmp + 5) < PaintHeight){
							ctx.fillText(strLbl, -m.width - 5, (tmp + 5));
							lastAxisTitlePix = tmp + 5;
							arrAxisTitlePixRange.push(tmp - 5);
							arrAxisTitlePixRange.push(tmp + 5);
						}
	
					}
				}
				ctx.closePath();
			}
			lastAxisPix = 0;
			lastAxisTitlePix = 0;
			for (var i = 0; i < AxisArr_Y.length; i++)
			{
				if(AxisArr_Y[i] < Axis_Y[Axis_Y.length - 1]){
					tmp = ((Math.log(AxisArr_Y[i]) - logMin) * logMax) / (logMax - logMin);
					tmp = -1 * parseInt(tmp * PaintHeight / logMax);
					if (isNaN(tmp)) tmp = 0;
					//arrAxisPoint_X.push(tmp);
					if((Math.abs(tmp - lastAxisPix) >= 10 && arrAxisPoint_Y.MinDistence(tmp) >= 10)){
						ctx.beginPath();
						ctx.strokeStyle = "#EEEEEE";//网格线的颜色
						ctx.moveTo(0, tmp + iPix);
						ctx.lineTo(arrAxisPoint_X[arrAxisPoint_X.length - 1], tmp + iPix);
						ctx.stroke();
						lastAxisPix = tmp;
						if (i > 0 && i < AxisArr_Y.length - 1){
							strLbl = makeAxisLabel(AxisArr_Y[i]);
							m=ctx.measureText(strLbl);
							if(Math.abs((tmp + 5) - lastAxisTitlePix) >= 30 && arrAxisTitlePixRange.MinDistence(tmp) >= 30  && (tmp + 5) < PaintHeight){
								if(AxisArr_Y[i].toString().replace(/0/g,"") % 2 == 0){
									ctx.fillText(strLbl, -m.width - 5, (tmp + 5));
									lastAxisTitlePix = tmp + 5;
								}
							}
						}
						ctx.closePath();
					}
				}
			}
		}
		
		
		ctx.restore();
	}
	this._drawGrid(id, arrAxis_X, ShowType_X, arrAxis_Y, ShowType_Y, AreaWidth, AreaHeight, objAxis_X.AxisArr, objAxis_Y.AxisArr);
	
	LogicalPixMapping_X = arrAxis_X[arrAxis_X.length - 1] / arrAxisPoint_X[arrAxisPoint_X.length - 1];
	LogicalPixMapping_Y = arrAxis_Y[arrAxis_Y.length - 1] / arrAxisPoint_Y[arrAxisPoint_Y.length - 1] * -1;
	
	FillTitle = function(id, AreaWidth, AreaHeight, Title_Chart){
		
		var ctx = $(id).getContext('2d');
		ctx.save();
		ctx.font = "bold 24px Arial";
		m=ctx.measureText(Title_Chart)
		ctx.fillText(Title_Chart, (AreaWidth - 40) / 2 - (m.width / 2),  30);
		
		//ctx.translate(80, AreaHeight - 50);//设置绘图的原点
		//ctx.font = "bold 18px Arial";
		//ctx.fontWeight = "";
		//ctx.shadowOffsetX = 2;
		//ctx.shadowOffsetY = 2;
		//ctx.shadowBlur = 1;
		//ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
		//m=ctx.measureText(Title_X)
    	//alert(m.width);
		//ctx.fillText(Title_X, (AreaWidth - 80) / 2 - (m.width / 2),  40);
		//m=ctx.measureText(Title_Y)
		//ctx.rotate(-Math.PI/2);
		//ctx.fillText(Title_Y, (AreaHeight - 80) / 2 - (m.width / 2), -60);
		ctx.restore();
	}
	this.FillTitle(id, AreaWidth, AreaHeight, "BI多维动态气泡图");
}
CoordinateScale = function(Vmin, Vmax, ShowType) {
	var differX;
	var Step = 0;
	var StepLength = 0;
	var Lower;
	var Higher;
	var Seed = 0;
	var DecimalLength;
	var arrCommonNumber = [1, 1.5, 2, 2.5, 5];
	var arrCommonRange = [5, 10];
	var arrLogNumber = [1, 2, 4, 5, 8];
	var arrLogRange = [10, 30]; 

	
	Vmin = parseFloat(Vmin);
	Vmax = parseFloat(Vmax);
	
	differX = Math.abs(Vmax - Vmin);	//Vmax >= Vmin  -->  Vmax - Vmin >= 0
	
	var Coefficient = Math.log(differX) / Math.LN10;

	NumberLength = parseInt(Coefficient);
	
	
	if (Coefficient < 0) NumberLength --;		
	var CurrentNumberArr;
	var CurrentRangeArr;
	if (ShowType == void(0) || ShowType == "Log"){
		CurrentNumberArr = arrLogNumber;
		CurrentRangeArr = arrLogRange;
	}else{
		CurrentNumberArr = arrCommonNumber;
		CurrentRangeArr = arrCommonRange;
	}
	
	GetResult = function(ShowType){
		StepLength = CurrentNumberArr[Seed] * Math.pow(10, NumberLength - 1);
		StepLength = Math.round(StepLength * 1000000000000) / 1000000000000;
		DecimalLength = StepLength.toString().split(".").length > 1?StepLength.toString().split(".")[1].length : 0;
		Step = Math.ceil(differX / StepLength);
		if (Step < CurrentRangeArr[0] || Step > CurrentRangeArr[1])	{
			Seed ++;
			if (Seed == CurrentNumberArr.length){
				Seed = 0;
				NumberLength ++;
			}
			GetResult(ShowType);
		}

		
		if(Vmin - StepLength <= 0 && Vmin >= 0)
			Lower = 0;
		else{
				
			p = parseInt(Vmin / StepLength);
			if (Vmin < 0) p --;
			
			if((Vmin * 1000000000000) % (StepLength * 1000000000000) == 0)
				p --;
			
			Lower =  parseFloat((StepLength * p).toFixed(DecimalLength));
			//if (Vmin < 0) Lower --;
			
		}
		
		Higher = Lower + (Step * StepLength);
		
		
		
		if (Higher <= Vmax){
			Higher += StepLength;
			Step ++;
		}
		
		Higher = Higher.toFixed(DecimalLength);
		
		if(ShowType == "Log"){
			CoefficientMax = Math.log(Vmax) / Math.LN10;
			CoefficientMin = Vmin > 0 ? Math.log(Vmin) / Math.LN10 : 0;
			
			CoefficientMax = (CoefficientMax < 0 && parseInt(CoefficientMax) > CoefficientMax) ? parseInt(CoefficientMax) - 1 : parseInt(CoefficientMax);
			CoefficientMin = (CoefficientMin < 0 && parseInt(CoefficientMin) > CoefficientMin) ? parseInt(CoefficientMin) - 1 : parseInt(CoefficientMin);
			
			var AxisArr = new Array();
			
			for(i = CoefficientMin; i <= CoefficientMax + 2; i++){
			//循环每个数量级
				for(j = 1; j < 10; j++){
				//每个数量级里，出10个数，可以是小数，但是看上去必须是整数（常见数）
					AxisArr.push(Math.round(j * Math.pow(10, i) * 1000000000000) / 1000000000000);
				}
			}
		}

		return {"Step": Step, "StepLength": StepLength, "Lower": Lower, "Higher": Higher, "DecimalLength" : DecimalLength, "AxisArr" : AxisArr};
	}
	

	return GetResult(ShowType);

}

GiveMeInfo = function (Vmin, Vmax) {
	
	var objResult = CoordinateScale($("Vmin").value, $("Vmax").value);
	$("result").innerHTML = "";
	for (k in objResult)
		$("result").innerHTML += k + " : " + objResult[k] + "<br />";
	
	$("Axis").innerHTML = "";
	var arrAxis = new Array();
	
	
	
	arrAxis.push(objResult.Lower.toFixed(objResult.DecimalLength));
	for (var i = 1; i <= objResult.Step; i ++){
		var tmp = (i * objResult.StepLength) + objResult.Lower;
		//tmp = Math.round(tmp * 1000000000000000) / 1000000000000000;
			tmp = (tmp).toFixed(objResult.DecimalLength)
		arrAxis.push(tmp);
	}
	$("Axis").innerHTML = arrAxis.join("__");
}

makeAxisLabel = function(lbl, bolFixed){
	len = parseInt(lbl).toString().length - 1;
	var Num, Char;
	switch (true){
		case len < 3:
			Num = lbl;
			Char = "";
			break;
		case len >= 3 && len < 6:
			Num = (lbl / Math.pow(10, 3));
			Char = "K";
			break;
		case len >= 6 && len < 9:
			Num =  (lbl / Math.pow(10, 6));
			Char = "M"
			break;
		case len >= 9 && len < 12:
			Num =  (lbl / Math.pow(10, 9));
			Char = "B"
			break;
		default:
			Num =  (lbl / Math.pow(10, 12));
			Char = "T"
			break;
	}
	if(bolFixed){
		a = lbl.toString().length;
		b = parseInt(lbl).toString().length
		tofix = a > b ? a - b > 2 ? 2 : a - b : 0;
		Num = Num.toFixed(tofix);
	}
	return Num.toString() + Char;
}
function onDocMouseMove(e) {

	var ev = e ? e: window.event;
	mouseX = ev.clientX - $("MySelected").offsetLeft;
	mouseY = ev.clientY - $("MySelected").offsetTop + $("MySelected").style.height;
	$("MousePos").innerHTML = "Mouse Pos: " + mouseX + " : " + ((mouseY - gAreaHeight + 80) * -1);

}

//document.onmousemove = onDocMouseMove;


var list=[];
var currentC;
var _e={};
var LastR1, LastR2, CurrentCircle;

PaintMyRadius =  function(r1, r2){
	var ctx = $("MyRadiusUp").getContext('2d');
	LastR1 = r1 != undefined ? r1 : LastR1;
	LastR2 = r2 != undefined ? r2 : LastR2;
	this.r1 = LastR1;
	this.r2 = LastR2;
	
	ctx.clearRect(0, 0, 200, 35);
	ctx.globalCompositeOperation = 'destination-over';
	
	ctx.font = "bold 10px Arial";
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillText("Min:" + this.r1.toFixed(0) + " | Max:" + this.r2.toFixed(0), 100, 10);
	
	ctx.strokeStyle = "rgb(153,153,153)";
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.moveTo(10, 30)
	ctx.lineTo(200, 30)
	
	ctx.moveTo(this.r1, 30)
	ctx.arc(this.r1, 30, this.r1, Math.PI, 0, false);
	ctx.stroke();
	ctx.fillStyle = "rgb(197,197,197)";
	ctx.fill();	
	
	ctx.moveTo(this.r2, 30)
	ctx.arc(this.r2, 30, this.r2, Math.PI, 0, false);
	ctx.stroke();
	ctx.fillStyle = "rgb(239,239,239)";
	ctx.fill();

	ctx.closePath();

}

 var MyRadiuscricle = function(x,r){
	this.x=x;
	this.y=32;
	this.r=r;
	this.isCurrent=false;
	this.drawC=function(ctx,x,i){
		ctx.save();
		ctx.globalCompositeOperation = 'destination-over';
		ctx.beginPath();
		//ctx.moveTo(this.x,this.y-this.r);
		ctx.arc(this.x,this.y,this.r,2*Math.PI,0,true);

		if ((x && ctx.isPointInPath(x, 32) && !currentC )|| this.isCurrent) {
				//console.log(x);
				CurrentCircle = i
				ctx.fillStyle = "rgb(217,255,160)";
				currentC=this;
				this.isCurrent=true;

		}else{
			//ctx.fillStyle = "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ", 0.8)";
			ctx.fillStyle = "rgb(4,105,4)";
		}
		ctx.fill();
	}


}
MyRadiusdraw = function(){
	var canvas = $('MyRadius');
	if (canvas.getContext){
		var ctx = canvas.getContext('2d');
		var c=new MyRadiuscricle(gMinRadius * 2,4);
		c.drawC(ctx);
		list.push(c);
		var c=new MyRadiuscricle(gMaxRadius * 2,4);
		c.drawC(ctx);
		list.push(c);

	}
}

MyRadiusreDraw = function(e){
	e=e||event;
	var canvas = $('MyRadius');
	var x = e.clientX - canvas.offsetLeft;
	//var b = e.clientY - canvas.offsetTop;

	canvas.width = canvas.width;
	
	var ctx = $("MyRadius").getContext('2d');
	
	for(var i = 0;i < list.length; i++){
		var c=list[i];
		c.drawC(ctx, x, i);

	}



}

MyRadiusshow = function(e){
	e=e||event;
	var canvas = $('MyRadius');
	
	var x = e.clientX - canvas.offsetLeft;
	//var y = e.clientY - canvas.offsetTop;

	//console.log(x);

	if(CurrentCircle == 0){
		if(x <= 60)
			if(x / 2 > LastR2){
				if(x <= 60){
					PaintMyRadius(x / 2);
					PaintMyRadius(undefined, x / 2)
					var ctx = $("MyRadius").getContext('2d');
					for(var i = 0;i < list.length; i++){
						var c=list[i];
						c.x = x;
						c.drawC(ctx, x, i);
					}
					gMinRadius = x / 2;
					gMaxRadius = x / 2;
				}else return;
			}else{
				PaintMyRadius(x / 2);
				gMinRadius = x / 2;
			}
		else return;
	}else if(CurrentCircle == 1){
		if(x / 2 < LastR1){
			if(x > 0){
				PaintMyRadius(x / 2);
				PaintMyRadius(undefined, x / 2)
				var ctx = $("MyRadius").getContext('2d');
				for(var i = 0;i < list.length; i++){
					var c=list[i];
					c.x = x;
					c.drawC(ctx, x, i);
				}
				gMinRadius = x / 2;
				gMaxRadius = x / 2;
			}
			else return;
		}else{
			PaintMyRadius(undefined, x / 2);
			gMaxRadius = x / 2;
		}
	}else
		PaintMyRadius()

	if(currentC){
		currentC.x=x;
		//currentC.y=y;
	}
	_e=e;


}

window.onload=function(){
	//canvas = $('MySelected');
	$('MySelected').onmousedown=function(e){
		e=e||event;
		ctx = $('MyTip').getContext('2d');
		ctx.clearRect(0, 0, gAreaWidth, gAreaHeight); //绘图区域
		bolSelectedBubble = false;
		reDraw(e);
	}
	
	//===============================
	var ctx = $("MyRadius").getContext('2d');
	PaintMyRadius(gMinRadius, gMaxRadius)
	var canvas = $('MyRadius');
	MyRadiusdraw();
	canvas.onmousedown=function(e){
		e=e||event;
		var x = e.clientX - canvas.offsetLeft;
		//var y = e.clientY - canvas.offsetTop;
		if(currentC)
			currentC.isCurrent=false;
		currentC=null;
		MyRadiusreDraw(e);
		
		if(!currentC)
			return;

		canvas.onmousemove=MyRadiusshow;
		
		var showTimer=setInterval(function(e){MyRadiusreDraw(e);},20,_e);
		var ChangeSize=setInterval(function(e){draw(giDateIndex);},100);
		canvas.onmouseup=function(){
			if(currentC)
				currentC.isCurrent=false;
			currentC=null;
			CurrentCircle = null;
			
			canvas.onmousemove=null;
			clearInterval(showTimer);
			clearInterval(ChangeSize);
			MyRadiusreDraw;
		}


	}
}


