/*
	Custom checkbox and radio button - Jun 18, 2013
	(c) 2013 @ElmahdiMahmoud 
	license: http://www.opensource.org/licenses/mit-license.php
*/   

window.onload=function(){
    
    
    //Onload
    var rateGroup = new Array(3);
	var heartAge,paramHeart;
	var numctr = 400;
	var ctr = 1;
		
	
		
	// load the result image
	var positiveImage = new Image();
		positiveImage.src = 'images/positive.png';
		positiveImage.onload = function() {
	};
		
		var negativeImage = new Image();
		negativeImage.src = 'images/negative.png';
		negativeImage.onload = function() {
		};

	var optimalImage = new Image();
		optimalImage.src = 'images/optimal.png';
		optimalImage.onload = function() {
	};
		//get canavas
	var canavasResult;
	var ctxResult;
    var stdFontSize;
    var errorMessage ="";
    
	//chart objects
	var iniX,iniY,endX,endY,cMargin,diameter,circleWidth,totalBars,maxDataValue;
    
    //初始化canvas
    //get canavas
	canavasResult = document.getElementById('sceneResult');	
    var stdLength = (screen.width < screen.height ? screen.width : screen.height);
    //屏幕密度
    canavasResult.width = stdLength / window.devicePixelRatio;
    stdFontSize = canavasResult.width/ 25;
    if(canavasResult && canavasResult.getContext){
		 ctxResult = canavasResult.getContext('2d');
	}
    canavasResult.height = canavasResult.width * 1.16;
    
    

    $("#btCommitResult").on('click',function(){
        
        ctxResult.clearRect(0, 0, ctxResult.canvas.width, ctxResult.canvas.height);
        var params = GetControlValues();
        if(CheckControlValues())
        {
            paramHeart = params;
            getRateResult(params);
            
            //显示结果	  
            barChart(); 
            showRateAndAge();
        }
        else
        {
            charSettings(false);
            showErrorMessage();
        }
        

	});

    function showErrorMessage(){
            ctxResult.fillStyle = 'black';
            ctxResult.font = stdFontSize + "px Arial";
			var iniResultX = iniX-stdFontSize ;
			var endResultY = endY +  cMargin + stdFontSize;
            var imageWidth = 145 / 1200 * canavasResult.width;
            var imageHeight = 149 / 1200 * canavasResult.width;
            ctxResult.drawImage(negativeImage,endX + cMargin -imageWidth,endResultY,imageWidth,imageHeight);

			ctxResult.fillText(errorMessage,iniResultX,endResultY + stdFontSize );
    }
    
   function CheckControlValues(){
        var rMale = document.getElementById("rMale");
        var rFemale = document.getElementById("rFemale");
        if(rMale.checked == 0 && rFemale.checked == 0){
            errorMessage = "请选择性别";
            return false;
        }

        var rSmoke = document.getElementById("rSmoke");
        var rNotSmoke = document.getElementById("rNotSmoke");
        if(rSmoke.checked == 0 && rNotSmoke.checked == 0){
            errorMessage = "请选择是否抽烟";
            return false;
        }
        var rTFH = document.getElementById("rTFH");
        var rNotTFH = document.getElementById("rNotTFH");
        if(rTFH.checked == 0 && rNotTFH.checked == 0){
            errorMessage = "请选择是否正在接受高血压治疗";
            return false;
        }
        var rDIAB = document.getElementById("rDIAB");
        var rNotDIAB = document.getElementById("rNotDIAB");
        if(rDIAB.checked == 0 && rNotDIAB.checked == 0){
            errorMessage = "请选择是否有糖尿病";
            return false;
        }

        var tbAge = document.getElementById("tbAge");
       if(tbAge.value == "" || isNaN(parseInt(tbAge.value)) || parseInt(tbAge.value) <= 0)
       {
           errorMessage = "请正确填写年龄";
           return false;
       }
       
       var tbHeight = document.getElementById("tbHeight");
       if(tbHeight.value == "" || isNaN(parseFloat(tbHeight.value)) || parseFloat(tbHeight.value) <= 0)
       {
           errorMessage = "请正确填写身高";
           return false;
       }

        var tbWeight = document.getElementById("tbWeight");
       if(tbWeight.value == "" || isNaN(parseFloat(tbWeight.value)) || parseFloat(tbWeight.value) <= 0)
       {
           errorMessage = "请正确填写体重";
           return false;
       }
        var tbSBP = document.getElementById("tbSBP");
       if(tbSBP.value == "" || isNaN(parseInt(tbSBP.value)) || parseInt(tbSBP.value) <= 0)
       {
           errorMessage = "请正确填写收缩压";
           return false;
       }

      return true;
   }


	//
	//Get Control Values
	function GetControlValues(){
        //controls
        var rGender = document.getElementById("rMale");
        var tbAge = document.getElementById("tbAge");
        var tbSBP = document.getElementById("tbSBP");
        var tbHeight = document.getElementById("tbHeight");
        var tbWeight = document.getElementById("tbWeight");
        var rTFH = document.getElementById("rTFH");
        var rSmoke = document.getElementById("rSmoke");
        var rDIAB = document.getElementById("rDIAB");
                
        //Control Values
        var params4Calculate = new CalculateParams();
                
        params4Calculate.Gender = (rGender.checked?1:0);
        params4Calculate.Age = parseFloat(tbAge.value);
        params4Calculate.Sbp = parseFloat(tbSBP.value);
        params4Calculate.Height = parseFloat(tbHeight.value) / 100; //cm转换为m
        params4Calculate.Weight = parseFloat(tbWeight.value);
        params4Calculate.Smoke = (rSmoke.checked?1:0);
        params4Calculate.Tfh = (rTFH.checked?1:0);
        params4Calculate.Diab = (rDIAB.checked?1:0);
                
        return params4Calculate;
    }
    
    //Calculate Params,含默认值
    function CalculateParams(){			
        this.Gender = 1;
        this.Age = 30;
        this.Sbp = 125;
        this.Height = 1.8;
        this.Weight = 72.9;
        this.Smoke = 0;
        this.Diab = 0;
        this.Tfh = 0;
    }	
    
    
		function commitHeartAge(gender,rate){
			var sbp = 125.0;
			var bmi = 22.5;
			var heartAge;
            if(rate == 1){
                heartAge = "大于100";
                return heartAge;
            }
			if(gender == 1 ){
				var sum= 1.85508*Math.log(sbp)+ 0.79277*Math.log(bmi)- 23.9388;
				var expo= 1/3.11296;
				var constiNum = Math.pow(Math.E,-(sum*expo));
				var constiDenom = Math.pow(-Math.log(0.88431), expo);
				var consti=constiNum/constiDenom;
				var term=Math.pow((-Math.log(1-rate)),expo);
				heartAge = (consti * term).toFixed(0);
			}
			else if(gender == 0){
				var sum= 2.81291*Math.log(sbp)+ 0.51125*Math.log(bmi)- 26.0145;
				var expo= 1/2.72107;
				var constiNum = Math.pow(Math.E,-(sum*expo));
				var constiDenom = Math.pow(-Math.log(0.94833), expo);
				var consti=constiNum/constiDenom;
				var term=Math.pow((-Math.log(1-rate)),expo);
				heartAge = (consti * term).toFixed(0);
			}
			return heartAge;
		}
		
		function commitResult(gender,age,sbp,height,weight,smoke,tfh,diab){
			var bmi = weight / Math.pow(height,2);
			var sum;
			var resultRate = 0;

			if(gender == 1){
				if(tfh == 0){
					sum = 3.11296 * Math.log(age) + 1.85508 * Math.log(sbp) + 0.70953 * smoke + 0.79277 * Math.log(bmi) + 0.5316 * diab;
				}
				else if(tfh == 1){
					sum = 3.11296 * Math.log(age) + 1.92672 * Math.log(sbp) + 0.70953 * smoke + 0.79277 * Math.log(bmi) + 0.5316 * diab;
				}
				resultRate= 1- Math.pow(0.88431,Math.pow(Math.E,(sum-23.9388)));
			}
			else if(gender == 0){
				if(tfh == 0){
					sum = 2.72107 * Math.log(age) + 2.81291 * Math.log(sbp) + 0.61868 * smoke + 0.51125 * Math.log(bmi) + 0.77763 * diab;
				}
				else if(tfh == 1){
					sum = 2.72107 * Math.log(age) + 2.88267 * Math.log(sbp) + 0.61868 * smoke + 0.51125 * Math.log(bmi) + 0.77763 * diab;
				}
				resultRate= 1- Math.pow(0.94833,Math.pow(Math.E,(sum-26.0145)));
			}
			return resultRate;
		}

        function getRateResult(params){
            //Actual rate
            var resultRisk = commitResult(params.Gender,params.Age,params.Sbp,params.Height,params.Weight,params.Smoke,params.Tfh,params.Diab);
            heartAge =commitHeartAge(params.Gender,resultRisk);
            rateGroup[0] = "您的风险,"+ (resultRisk * 100).toFixed(2);
            resultRisk = commitResult(params.Gender,params.Age,125.0,1.8,72.9,0,0,0);
            
            rateGroup[1] = "平均风险," + (resultRisk * 100).toFixed(2);
            resultRisk=commitResult(params.Gender,params.Age,110.0,1.8,71.28,0,0,0);
            rateGroup[2] = "最佳人群," + (resultRisk * 100).toFixed(2);
            
             
        }
            
		//draw chart
		//chart construcotr
		function barChart()	{
			//clear ctr
			ctr = 1;
			//初始线宽
			ctxResult.lineWidth = 2;
            ctxResult.strokeStyle = 'black';
            ctxResult.fillStyle = 'black';
			charSettings(true);
			drawAxisLabelMakers();
			drawChartWithAnimation();

		}

		function showRateAndAge(){
			//填充
            ctxResult.fillStyle = 'black';
			var resultImage;
			var iniResultX = iniX-stdFontSize ;
			var endResultY = endY +  cMargin + stdFontSize;
			var arrVal = rateGroup[0].split(',');
			var actualRate = parseFloat(arrVal[1]);	
			arrVal = rateGroup[1].split(',');
			var normalRate  = parseFloat(arrVal[1]);
			arrVal = rateGroup[2].split(',');
			var optimalRate  = parseFloat(arrVal[1]);		
			var resultText,comment;			
            if(actualRate <= optimalRate){
				resultText = "您的心脏状况为：最佳。";
                comment = "您有一颗强壮的心!";
                resultImage = optimalImage;
			}else if(actualRate <= normalRate){
				resultText = "您的心脏状况为：正常~最佳。";
                comment = "您的身体状况良好，请继续保持。";
                resultImage = positiveImage; 
			}else{
                resultText = "您的心脏状况为：正常以下。";
                resultImage = negativeImage; 
                if(paramHeart.Smoke == 1){
                    comment = "您知道'Smoking kills'吗？该戒啦。";
                }else if(paramHeart.Diab == 1){
                    comment = "请您注意饮食、尽量控制糖分的摄入。";
                }else if(paramHeart.Tfh == 1){
                    comment = "请您继续坚持治疗高血压。";
                }else if(paramHeart.Sbp > 125){
                    comment = "注意保持情绪稳定，减少油脂和盐的摄入。";
                }else if(paramHeart.Weight > parseInt(22.5 * Math.pow(paramHeart.Height,2))){
                    var deltaWeight = paramHeart.Weight -  parseInt(22.5 * Math.pow(paramHeart.Height,2));
                    comment = "减掉" + deltaWeight + "公斤，心脏更健康。";
                }else{
                    comment = "适当地运动，能让您的心脏更强壮！";
                }
            }
            ctxResult.font = stdFontSize + "px Arial";
			var heartAgeResultText = "您的心脏年龄为：" + heartAge +"岁。";
            var imageWidth = 145 / 1200 * canavasResult.width;
            var imageHeight = 149 / 1200 * canavasResult.width;
            ctxResult.drawImage(resultImage,endX + cMargin -imageWidth,endResultY,imageWidth,imageHeight);
			ctxResult.fillText(resultText,iniResultX,endResultY + stdFontSize );
			ctxResult.fillText(comment,iniResultX,endResultY + stdFontSize * 2);
			ctxResult.fillText(heartAgeResultText,iniResultX,endResultY + stdFontSize * 3);
		}

		function charSettings(check){
			//bar properties	
			totalBars = rateGroup.length;
			cMargin = stdFontSize * 2;			
			//maximum value			
			maxDataValue = 0;
            if(check)
            {
               for(var i = 0;i < totalBars;++i){
				var arrVal = rateGroup[i].split(',');
				var bVal = parseFloat(arrVal[1]);
				if(bVal > maxDataValue){
					maxDataValue = bVal;
				}
			}
            }

			
			
			iniY = cMargin * 2;
			iniX = iniY;
			endY = canavasResult.width  - cMargin * 2;
			endX = endY;
			diameter = endX - iniX;
			circleWidth = diameter / 2 / (totalBars+1);
		}

		function drawAxisLabelMakers(){
            var x = iniX - cMargin;
            var y = iniY - cMargin;
			var length = endX - iniX + 2 * cMargin;
			drawArcRect(length,cMargin,x,y);	
		}
        function drawArcRect(l,r,x,y){
			drawAxis(r + x,y,l - r + x,y);
			drawArc(l- r+x,r + y,r,1.5 * Math.PI,0);
			drawAxis(l + x,r + y,l + x,l - r + y);
			drawArc(l - r + x,l - r + y,r,0,0.5 * Math.PI);
			drawAxis(l - r + x,l + y,r + x,l + y);
			drawArc(r + x,l - r + y,r,0.5 * Math.PI, Math.PI);
			drawAxis(x,l - r + y,x,r + y);
			drawArc(r + x, r + y,r,Math.PI,1.5 *Math.PI);
		}
		function drawAxis(x,y,X,Y){
			ctxResult.beginPath();
			ctxResult.moveTo(x,y);
			ctxResult.lineTo(X,Y);
			ctxResult.closePath();
			ctxResult.stroke();
		}
		
		function drawArc(x,y,r,bAngle,eAngle){
			ctxResult.beginPath();
			ctxResult.arc(x,y,r,bAngle,eAngle,false);
			ctxResult.stroke();
		}
		function getCircleColor(i){
			var color = "";
			switch(i){
				case 0:
				color = "rgba(222,31,0,.85)";
				break;
				case 1:
				color = "rgba(0,255,0,.85)";
				break;
				case 2:
				color = "rgba(0,101,159,.85)";
				break;
			}
			return color;
		}
		
		function drawChartWithAnimation(){
			//Loop through the total bars and draw
			var x = iniX + diameter / 2;
			var y = iniY + diameter / 2;
			for(var i = 0;i < totalBars;i++){
				var arrval = rateGroup[i].split(',');
				var arrF = arrval[1];
				var fVal = parseFloat(arrF);
				var eAngle = (fVal / maxDataValue) *(Math.PI*11/6)/numctr * ctr;
				var radius = diameter / 2 - i * circleWidth - circleWidth / 2;
				var color = getCircleColor(i);
				drawArcRegion(x,y,eAngle,radius,circleWidth,color);
			}
			
			if(ctr < numctr){
				ctr=ctr+1;
				setTimeout(drawChartWithAnimation,5);
			}
			else
			{
				drawXMakers();
			}
		}

		function drawXMakers(){
			//X Axis
            ctxResult.font = "bold " + circleWidth / 2 + "px Arial";
			for(var i = 0;i < totalBars;i++){
				var arrVal = rateGroup[i].split(',');
				var name = arrVal[0];			
				var markerXPos =  iniX + diameter / 2;			
				var markerYPos =  iniY + circleWidth *3/ 4 + i * circleWidth;
				ctxResult.fillText(name,markerXPos,markerYPos);
			}
			
			
		}

		function drawArcRegion(x,y,e,r,w,color){
				ctxResult.save();
				ctxResult.strokeStyle = color;					
				ctxResult.lineWidth = w;
				ctxResult.beginPath();
				ctxResult.arc(x,y,r,Math.PI*1.5,Math.PI*1.5 + e,false); 
				ctxResult.stroke();
				ctxResult.restore();
		}
//
}






		