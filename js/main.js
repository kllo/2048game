var board=new Array();
var score=0;   //分数
var hightscore=0;
var hasConflicted=new Array();

$(document).ready(function(){
	newgame();
	
});

function newgame(){
	prepareFormobile();
	//初始化棋盘格
	init();
	generateOneNumber(); //随机一个数字
	generateOneNumber(); //随机一个数字
	//手机端
	
}
//手机端
function prepareFormobile(){
	if(documentWidth>500){
		gridContainerWidth=500;
		cellSpace=20;
		cellSideLength=100;
	}
	$('#grid-container').css('width',gridContainerWidth-2*cellSpace);
	$('#grid-container').css('height',gridContainerWidth-2*cellSpace);
	$('#grid-container').css('padding',cellSpace);
	$('#grid-container').css('border-radius',gridContainerWidth*0.02);
	
	$('.grid-cell').css('width',cellSideLength);
	$('.grid-cell').css('height',cellSideLength);
	$('.grid-cell').css('border-radius',0.02*cellSideLength);
}
//初始化
function init(){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var gridCell=$("#grid-cell-"+i+"-"+j);
			gridCell.css("top",getPosTop(i,j));
			gridCell.css("left",getPosLeft(i,j));
		}
	}
	//数组初始化
	for(var i=0;i<4;i++){
		board[i]=new Array();
		hasConflicted[i]=new Array();
		for(var j=0;j<4;j++){
			board[i][j]=0;
			hasConflicted[i][j]=false;
		}
	}
	updateBoardView();  //棋盘格
	
	
	
	score=0;
}

function updateBoardView(){
	$(".number-cell").remove();
	$('.number-cell').css('line-height',cellSideLength+'px');
	$('.number-cell').css('font-size',0.6*cellSideLength+'px');
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell=$("#number-cell-"+i+"-"+j);
			
			if(board[i][j]==0){
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
				theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
			}else{
				theNumberCell.css('width',cellSideLength);
				theNumberCell.css('height',cellSideLength);
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
				if(board[i][j]>1000){
					theNumberCell.css('font-size',0.3*cellSideLength);
				}
			}
			hasConflicted[i][j]=false;
		}
	}
	
}

function generateOneNumber(){
	if(nospace(board)){
		return false;
	}
	
	//随机位置
	var randx=parseInt(Math.floor(Math.random()*4));
	var randy=parseInt(Math.floor(Math.random()*4));
	var num=0;
//	while(true){
//		if(board[randx][randy]==0){
//			break;
//		}else{
//			randx=parseInt(Math.floor(Math.random()*4));
//	        randy=parseInt(Math.floor(Math.random()*4));
//		}
//	}
//算法优化
    var num=0;
	while(num<50){
		if(board[randx][randy]==0){
			break;
		}else{
			randx=parseInt(Math.floor(Math.random()*4));
	        randy=parseInt(Math.floor(Math.random()*4));
		}
		num++;
	}
	if(num==50){
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				if(board[i][j]==0){
					randx=i;
					randy=j;
				}
			}
		}
	}
	//随机数字
	var randNumber=Math.random()>0.5?2:4;
	
	//随机位置显示随机数字
	board[randx][randy]=randNumber;
	showNumberWithAnimation(randx,randy,randNumber);
	
	return true
	
}

$(document).keydown(function(event){
	switch(event.keyCode){
		case 37://左
		  if(moveLeft()){
		  	setTimeout("generateOneNumber()",210);
		  	setTimeout("isgameover()",300)
		  }
		  break;
		case 38://上
		  if(moveTop()){
		  	setTimeout("generateOneNumber()",210);
		  	setTimeout("isgameover()",300)
		  }
		  break;
		case 39://右
		  if(moveRight()){
		  	setTimeout("generateOneNumber()",210);
		  	setTimeout("isgameover()",300)
		  }
		  break;
		case 40://下
		  if(moveBottom()){
		  	setTimeout("generateOneNumber()",210);
		  	setTimeout("isgameover()",300)
		  }
		  break;
		default: 
		  break;
	}
});
//--------------手机端---------------
document.addEventListener('touchstart',function(event){
	    starx=event.touches[0].pageX,
	    stary=event.touches[0].pageY;
});
document.addEventListener('touchend',function(){
	    endx=event.changedTouches[0].pageX,
	    endy=event.changedTouches[0].pageY;
	    
	var delex=endx-starx;
	var deley=endy-stary;
	
	if(Math.abs(delex)<0.05*documentWidth&&Math.abs(deley)<0.05*documentWidth){
		return;
	}
	//x轴移动
	if(Math.abs(delex)>=Math.abs(deley)){
		if(delex<0){  //向左移动
			if(moveLeft()){
		  	setTimeout("generateOneNumber()",210);
		  	setTimeout("isgameover()",300)
		    }
		}else{//向右移动
			if(moveRight()){
		  	setTimeout("generateOneNumber()",210);
		  	setTimeout("isgameover()",300)
		    }
		}
	}else{
		if(deley<0){  //向上移动
			if(moveTop()){
		  	setTimeout("generateOneNumber()",210);
		  	setTimeout("isgameover()",300)
		    }
		}else{//向下移动
			if(moveBottom()){
		  	setTimeout("generateOneNumber()",210);
		  	setTimeout("isgameover()",300)
		    }
		}
	}
})

//--------------结束-----------------

//向左移动
function moveLeft(){
	if(!canMoveLeft(board)){
		return false;
	}
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
			if(board[i][j]!=0){
				for(var k=0;k<j;k++){
					if(board[i][k]==0&& noBlockHorizontal(i,k,j,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)&&!hasConflicted[i][k]){
						//move add
						showMoveAnimation(i,j,i,k);
						board[i][k]+=board[i][j];
						board[i][j]=0;
						//加分
						score+=board[i][k];
						updateScpre(score);
						
						hasConflicted[i][k]=true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);  //样式刷新
	return true;
}
//向右移动
function moveRight(){
	if(!canMoveRight(board)){
		return false;
	}
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--){
			if(board[i][j]!=0){
				for(var k=3;k>j;k--){
					if(board[i][k]==0&& noBlockHorizontal(i,j,k,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,j,k,board)&&!hasConflicted[i][k]){
						//move add
						showMoveAnimation(i,j,i,k);
						board[i][k]*=2;
						board[i][j]=0;
						//加分
						score+=board[i][k];
						updateScpre(score);
						
						hasConflicted[i][k]=true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);  //样式刷新
	return true;
}
//向上移动
function moveTop(){
	if(!canMoveTop(board)){
		return false;
	}
	for(var j=0;j<4;j++){
		for(var i=1;i<4;i++){
			if(board[i][j]!=0){
				for(var k=0;k<i;k++){
					if(board[k][j]==0&& noBlockVertical(j,k,i,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}else if(board[k][j]==board[i][j]&&noBlockVertical(j,k,i,board)&&!hasConflicted[k][j]){
						//move add
						showMoveAnimation(i,j,k,j);
						board[k][j]*=2;
						board[i][j]=0;
						//加分
						score+=board[k][j];
						updateScpre(score);
						
						hasConflicted[k][j]=true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);  //样式刷新
	return true;
}
//向下移动
function moveBottom(){
	if(!canMoveBottom(board)){
		return false;
	}
	for(var j=0;j<4;j++){
		for(var i=2;i>=0;i--){
			if(board[i][j]!=0){
				for(var k=3;k>i;k--){
					if(board[k][j]==0&& noBlockVertical(j,i,k,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}else if(board[k][j]==board[i][j]&&noBlockVertical(j,i,k,board)&&!hasConflicted[k][j]){
						//move add
						showMoveAnimation(i,j,k,j);
						board[k][j]*=2;
						board[i][j]=0;
						//加分
						score+=board[k][j];
						updateScpre(score);
						
						hasConflicted[k][j]=true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);  //样式刷新
	return true;
}
//判断游戏结束
function isgameover(){
	if(nospace(board)&&nomove(board)){
		gameover();
		updateHightScore(score);
	}
}
function gameover(){
	$('#showscore').css('transform','scale(1)');
	$('#finalyscore').text(score);
	$('#buttonsure').click(function(){
		$('#showscore').css('transform','scale(0)');
	})
}
