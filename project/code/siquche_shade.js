
var gl;
var program;

var vNormal,vPosition,ModelViewMatrixLoc,vTexCoord;
var lightViewMatrixLoc,projectionMatrixLoc;


//模型变换参数
var Tx = 0,Ty=0,Tz=-4;
var LTx = 2,LTy=8,LTz=-5;
var XRotateAngle = 0,YRotateAngle = 0,ZRotateAngle = 0;
var selfXRotateAngle=0,selfYRotateAngle=0,selfZRotateAngle=0;
var LXRotateAngle = 0,LYRotateAngle = 0,LZRotateAngle = 0;
var longjuanfeng=0,running=1,move=0;

//漫游参数
var near = 0.55;
var far = 100;
var radius = 4.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;
var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio
var eye = vec3(0,6,11);
var eyeY = 0;
var theta  = 0.0;
var at = vec3(0.0, 0,0);
var up = vec3(0, 1.0, 0);


//定义索引Buffer
var iBufferCubeID,waike_front_id,waike_front_id2,waike_back_id,waike_back_id2,weiyi_id;
var lianjiegan_back_id,side_back_id,side_front_id;

//定义顶点Buffer
var buffer_lupai,buffer_lupai2;
var buffer,buffer2,buffer3,buffer4,buffer5;//车轮 底盘
var buffer_lunzhou1,buffer_lunzhou2,buffer_lunzhou3,buffer_lunzhou4;//车轮轴
var buffer_qianhu,buffer_feilun1,buffer_feilun2,buffer_feilun3,buffer_feilun4,buffer_feilunzhou1,buffer_feilunzhou2;//前弧和飞轮
var buffer_waike_front,buffer_front_gang,buffer_lianjiegan1,buffer_lianjiegan2;//前下外壳和前杠 前连接杆
var buffer_waike_front2;//前上外壳
var buffer_waike_back,buffer_waike_back2,buffer_waike_back3;//后外壳
var buffer_houzhu1,buffer_houzhu2,buffer_lianjiegan_back1,buffer_lianjiegan_back2;//后部底柱,后部连接杆
var buffer_weiyi,buffer_side_back1,buffer_side_back2,buffer_side_front1,buffer_side_front2;//尾翼，前后的边
var buffer_skybox;//天空盒
var buffer_light;//光源
var buffer_track,buffer_track2,buffer_track3;//轨道

//定义法向量Buffer
var nBuffer,nBuffer2,nBuffer_waike_back,nBuffer_waike_back2,nBuffer_waike_back3,nBuffer_lunzhou,nBuffer_feilun,nBuffer_feilunzhou,nBuffer_lupai,buffer_lupai2;
var nBuffer_waike_front,nBuffer_waike_front2,nBuffer_front_gang,nBuffer_qianhu,nBuffer_houzhu,nBuffer_weiyi,nbuffer_track3;
var nBuffer_lianjiegan_front,nBuffer_lianjiegan_back,nBuffer_side_front,nBuffer_side_front2,nBuffer_side_back,nBuffer_side_back2;

var tBuffer_skybox,tBuffer_lupai2;


//光照参数
var lightPosition = vec4(0,-2,3, 0.0 );

var lightAmbient = vec4(0.8,0.8,0.8, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );


//材质参数
var materialAmbient = vec4( 0.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 0.0, 0.0, 1.0, 1.0);
var materialSpecular = vec4( 0.0, 0.0, 1.0, 1.0 );

var materialAmbient_black = vec4( 0.0, 0.0, 0.0, 1.0 );
var materialDiffuse_black = vec4( 0.3, 0.3, 0.3, 1.0);
var materialSpecular_black = vec4( 0.3, 0.3, 0.3, 1.0 );

var materialAmbient_white = vec4( 1, 1, 1, 1.0 );
var materialDiffuse_white = vec4( 1, 1, 1, 1.0);
var materialSpecular_white = vec4( 1, 1, 1, 1.0 );

var materialAmbient_deep_blue = vec4( 0.0, 0.0, 0.0, 1.0 );
var materialDiffuse_deep_blue = vec4( 0.0, 0.0, 0.5, 1.0);
var materialSpecular_deep_blue = vec4( 0.0, 0.0, 0.5, 1.0 );

var materialAmbient_light_blue = vec4( 0.5, 0.5, 1, 1.0 );
var materialDiffuse_light_blue = vec4( 0.1, 0.1, 1.0, 1.0);
var materialSpecular_light_blue = vec4( 0.1, 0.1, 1.0, 1.0 );

var materialAmbient_grey = vec4( 0.5, 0.5, 0.5, 1.0 );
var materialDiffuse_grey = vec4( 0.5, 0.5, 0.5, 1.0);
var materialSpecular_grey = vec4( 0.5, 0.5, 0.5, 1.0 );

var materialShininess = 100.0;

var ms = 90;//绘制圆的参数


  
//绘制球的函数
var drawBall=function(rX,rY,rZ,r,m){//rX,rY,rZ是球心坐标，r是半径
    var arr=new Array();
    var addAlpha=360/m;
    var addTheta=360/m;
    var theta=0,alpha=0;
    for(var i=0;i<m/2;i++){
        theta+=addTheta;
        for(var j=0;j<m;j++){
            alpha+=addAlpha;
            arr.push(rX+Math.sin(Math.PI/180*alpha)*Math.sin(Math.PI/180*theta)*r,rY+Math.cos(Math.PI/180*alpha)*Math.sin(Math.PI/180*theta)*r, rZ+Math.cos(Math.PI/180*theta)*r);
            arr.push(rX+Math.sin(Math.PI/180*(alpha+addAlpha))*Math.sin(Math.PI/180*theta)*r,rY+Math.cos(Math.PI/180*(alpha+addAlpha))*Math.sin(Math.PI/180*theta)*r, rZ+Math.cos(Math.PI/180*theta)*r);
            arr.push(rX+Math.sin(Math.PI/180*alpha)*Math.sin(Math.PI/180*(theta-addTheta))*r,rY+Math.cos(Math.PI/180*alpha)*Math.sin(Math.PI/180*(theta-addTheta))*r, rZ+Math.cos(Math.PI/180*(theta-addTheta))*r);
            
            arr.push(rX+Math.sin(Math.PI/180*alpha)*Math.sin(Math.PI/180*(theta-addTheta))*r,rY+Math.cos(Math.PI/180*alpha)*Math.sin(Math.PI/180*(theta-addTheta))*r, rZ+Math.cos(Math.PI/180*(theta-addTheta))*r);
            arr.push(rX+Math.sin(Math.PI/180*(alpha+addAlpha))*Math.sin(Math.PI/180*(theta-addTheta))*r,rY+Math.cos(Math.PI/180*(alpha+addAlpha))*Math.sin(Math.PI/180*(theta-addTheta))*r, rZ+Math.cos(Math.PI/180*(theta-addTheta))*r);
            arr.push(rX+Math.sin(Math.PI/180*(alpha+addAlpha))*Math.sin(Math.PI/180*theta)*r,rY+Math.cos(Math.PI/180*(alpha+addAlpha))*Math.sin(Math.PI/180*theta)*r, rZ+Math.cos(Math.PI/180*theta)*r);
        }
    }
    return arr;
    
}
//椭球面的函数
var drawBall2=function(rX,rY,rZ,r,m,a,b,c){//rX,rY,rZ是球心坐标，r是半径， a，b，c是xyz倍数
    var arr=new Array();
    var addAlpha=360/m;
    var addTheta=360/m;
    var theta=0,alpha=0;
    for(var i=0;i<m/2;i++){
        theta+=addTheta;
        for(var j=0;j<m;j++){
            alpha+=addAlpha;
            arr.push(vec3(rX+a*Math.sin(Math.PI/180*alpha)*Math.sin(Math.PI/180*theta)*r,rY+b*Math.cos(Math.PI/180*alpha)*Math.sin(Math.PI/180*theta)*r, rZ+c*Math.cos(Math.PI/180*theta)*r));
            arr.push(vec3(rX+a*Math.sin(Math.PI/180*(alpha+addAlpha))*Math.sin(Math.PI/180*theta)*r,rY+b*Math.cos(Math.PI/180*(alpha+addAlpha))*Math.sin(Math.PI/180*theta)*r, rZ+c*Math.cos(Math.PI/180*theta)*r));
            arr.push(vec3(rX+a*Math.sin(Math.PI/180*alpha)*Math.sin(Math.PI/180*(theta-addTheta))*r,rY+b*Math.cos(Math.PI/180*alpha)*Math.sin(Math.PI/180*(theta-addTheta))*r, rZ+c*Math.cos(Math.PI/180*(theta-addTheta))*r));
            
            arr.push(vec3(rX+a*Math.sin(Math.PI/180*alpha)*Math.sin(Math.PI/180*(theta-addTheta))*r,rY+b*Math.cos(Math.PI/180*alpha)*Math.sin(Math.PI/180*(theta-addTheta))*r, rZ+c*Math.cos(Math.PI/180*(theta-addTheta))*r));
            arr.push(vec3(rX+a*Math.sin(Math.PI/180*(alpha+addAlpha))*Math.sin(Math.PI/180*(theta-addTheta))*r,rY+b*Math.cos(Math.PI/180*(alpha+addAlpha))*Math.sin(Math.PI/180*(theta-addTheta))*r, rZ+c*Math.cos(Math.PI/180*(theta-addTheta))*r));
            arr.push(vec3(rX+a*Math.sin(Math.PI/180*(alpha+addAlpha))*Math.sin(Math.PI/180*theta)*r,rY+b*Math.cos(Math.PI/180*(alpha+addAlpha))*Math.sin(Math.PI/180*theta)*r, rZ+c*Math.cos(Math.PI/180*theta)*r));
        }
    }
    return arr;
    
}

//绘制圆柱的函数 该圆柱的高在z轴上 rX,rY,yZ是圆柱中心，h是高,r是底面半径
var drawYuanzhu=function(rX,rY,rZ,r,m,h){
    var arr= new Array();
    var addAng=360/m;
    var angle=0;
    
    for(var i = 0;i<m;i++){
        angle2=angle+addAng;

        arr.push(vec3(rX+Math.sin(Math.PI/180*angle)*r,rY+Math.cos(Math.PI/180*angle)*r,rZ-h/2));
        arr.push(vec3(rX,rY,rZ-h/2+0.01));//圆心略微凹陷
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle2)*r,rY+Math.cos(Math.PI/180*angle2)*r,rZ-h/2));
        
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle)*r,rY+Math.cos(Math.PI/180*angle)*r,rZ-h/2));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle2)*r,rY+Math.cos(Math.PI/180*angle2)*r,rZ-h/2));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle2)*r,rY+Math.cos(Math.PI/180*angle2)*r,rZ+h/2));

        arr.push(vec3(rX+Math.sin(Math.PI/180*angle2)*r,rY+Math.cos(Math.PI/180*angle2)*r,rZ+h/2));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle)*r,rY+Math.cos(Math.PI/180*angle)*r,rZ+h/2));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle)*r,rY+Math.cos(Math.PI/180*angle)*r,rZ-h/2));

        arr.push(vec3(rX+Math.sin(Math.PI/180*angle)*r,rY+Math.cos(Math.PI/180*angle)*r,rZ+h/2));
        arr.push(vec3(rX,rY,rZ+h/2-0.01));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle2)*r,rY+Math.cos(Math.PI/180*angle2)*r,rZ+h/2));

        angle=angle2;
    }
    return arr;
}
var drawYuanzhu2=function(rX,rY,rZ,r,m,h){//高在y轴
    var arr= new Array();
    var addAng=360/m;
    var angle=0;
    
    for(var i = 0;i<m;i++){
        angle2=angle+addAng;

        arr.push(rX+Math.sin(Math.PI/180*angle)*r,rY-h/2,rZ+Math.cos(Math.PI/180*angle)*r);
        arr.push(rX,rY-h/2,rZ);
        arr.push(rX+Math.sin(Math.PI/180*angle2)*r,rY-h/2,rZ+Math.cos(Math.PI/180*angle2)*r);
        
        arr.push(rX+Math.sin(Math.PI/180*angle)*r,rY-h/2,rZ+Math.cos(Math.PI/180*angle)*r);
        arr.push(rX+Math.sin(Math.PI/180*angle2)*r,rY-h/2,rZ+Math.cos(Math.PI/180*angle2)*r);
        arr.push(rX+Math.sin(Math.PI/180*angle2)*r,rY+h/2,rZ+Math.cos(Math.PI/180*angle2)*r);

        arr.push(rX+Math.sin(Math.PI/180*angle2)*r,rY+h/2,rZ+Math.cos(Math.PI/180*angle2)*r);
        arr.push(rX+Math.sin(Math.PI/180*angle)*r,rY+h/2,rZ+Math.cos(Math.PI/180*angle)*r);
        arr.push(rX+Math.sin(Math.PI/180*angle)*r,rY-h/2,rZ+Math.cos(Math.PI/180*angle)*r);

        arr.push(rX+Math.sin(Math.PI/180*angle)*r,rY+h/2,rZ+Math.cos(Math.PI/180*angle)*r);
        arr.push(rX,rY+h/2,rZ);
        arr.push(rX+Math.sin(Math.PI/180*angle2)*r,rY+h/2,rZ+Math.cos(Math.PI/180*angle2)*r);

        angle=angle2;
    }
    return arr;
}
//画弧函数（圆环）
var drawHu=function(rX,rY,rZ,r,m,h,d){//rX,rY,rZ是圆环中心坐标，r是大圆半径，h是高，d是圆环的宽度
    var arr= new Array();
    var addAng=360/m;
    var angle=80;
    
    for(var i = 0;i<m;i++){
        angle2=angle+addAng;
        //下底面
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle)*r,rY-h/2,rZ+Math.cos(Math.PI/180*angle)*r));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle)*(r-d),rY-h/2,rZ+Math.cos(Math.PI/180*angle)*(r-d)));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle2)*(r-d),rY-h/2,rZ+Math.cos(Math.PI/180*angle2)*(r-d)));

        arr.push(vec3(rX+Math.sin(Math.PI/180*angle2)*(r-d),rY-h/2,rZ+Math.cos(Math.PI/180*angle2)*(r-d)));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle2)*r,rY-h/2,rZ+Math.cos(Math.PI/180*angle2)*r));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle)*r,rY-h/2,rZ+Math.cos(Math.PI/180*angle)*r));
        //上底面
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle)*r,rY+h/2,rZ+Math.cos(Math.PI/180*angle)*r));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle)*(r-d),rY+h/2,rZ+Math.cos(Math.PI/180*angle)*(r-d)));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle2)*(r-d),rY+h/2,rZ+Math.cos(Math.PI/180*angle2)*(r-d)));

        arr.push(vec3(rX+Math.sin(Math.PI/180*angle2)*(r-d),rY+h/2,rZ+Math.cos(Math.PI/180*angle2)*(r-d)));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle2)*r,rY+h/2,rZ+Math.cos(Math.PI/180*angle2)*r));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle)*r,rY+h/2,rZ+Math.cos(Math.PI/180*angle)*r));

        //外侧
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle)*r,rY-h/2,rZ+Math.cos(Math.PI/180*angle)*r));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle2)*r,rY-h/2,rZ+Math.cos(Math.PI/180*angle2)*r));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle2)*r,rY+h/2,rZ+Math.cos(Math.PI/180*angle2)*r));

        arr.push(vec3(rX+Math.sin(Math.PI/180*angle2)*r,rY+h/2,rZ+Math.cos(Math.PI/180*angle2)*r));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle)*r,rY+h/2,rZ+Math.cos(Math.PI/180*angle)*r));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle)*r,rY-h/2,rZ+Math.cos(Math.PI/180*angle)*r));
        //内侧
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle)*(r-d),rY-h/2,rZ+Math.cos(Math.PI/180*angle)*(r-d)));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle2)*(r-d),rY-h/2,rZ+Math.cos(Math.PI/180*angle2)*(r-d)));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle2)*(r-d),rY+h/2,rZ+Math.cos(Math.PI/180*angle2)*(r-d)));

        arr.push(vec3(rX+Math.sin(Math.PI/180*angle2)*(r-d),rY+h/2,rZ+Math.cos(Math.PI/180*angle2)*(r-d)));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle)*(r-d),rY+h/2,rZ+Math.cos(Math.PI/180*angle)*(r-d)));
        arr.push(vec3(rX+Math.sin(Math.PI/180*angle)*(r-d),rY-h/2,rZ+Math.cos(Math.PI/180*angle)*(r-d)));

        angle=angle2;
    }        
    return arr;
}
//画长方体的函数
var drawCube=function(rX,rY,rZ,x,y,z){//rX,rY,rZ是长方体中心坐标，xyz是长宽高
    var arr= new Array();   
    arr.push(vec3(rX-x/2,rY-y/2,rZ+z/2));
    arr.push(vec3(rX-x/2,rY+y/2,rZ+z/2));
    arr.push(vec3(rX+x/2,rY+y/2,rZ+z/2));
    arr.push(vec3(rX+x/2,rY-y/2,rZ+z/2));
    arr.push(vec3(rX-x/2,rY-y/2,rZ-z/2));
    arr.push(vec3(rX-x/2,rY+y/2,rZ-z/2));
    arr.push(vec3(rX+x/2,rY+y/2,rZ-z/2));
    arr.push(vec3(rX+x/2,rY-y/2,rZ-z/2));    
    return arr;
}
//长方体索引
var indices = [
    1, 0, 3,
    1, 3, 2,
    2, 3, 7,
    2, 7, 6,
    3, 0, 4,
    3, 4, 7,
    6, 5, 1,
    6, 1, 2,
    4, 5, 6,
    4, 6, 7,
    5, 4, 0,
    5, 0, 1
];


//顶点信息
//前下外壳
var waike_front = [
    vec3(0.55,0.02,0.02),
    vec3(0.55,0.02,-0.02),
    vec3(0.18,0.02,0.18),
    vec3(0.18,0.02,-0.18),
    vec3(-0.1,0.02,0.15),
    vec3(-0.1,0.02,-0.15),
    
    vec3(0.55,0.04,0.02),
    vec3(0.55,0.04,-0.02),
    vec3(0.18,0.13,0.18),
    vec3(0.18,0.13,-0.18),
    vec3(-0.1,0.15,0.15),
    vec3(-0.1,0.15,-0.15)
];
//waike_front 索引
var indices_waike_front = [
    0,1,6,
    6,7,1,
    0,2,6,
    6,8,2,
    1,3,7,
    7,9,3,
    2,4,8,
    8,10,4,
    3,5,9,
    9,11,5,
    4,5,10,
    10,11,5,
    0,1,2,
    1,2,3,
    2,3,4,
    3,4,5,
    6,7,8,
    7,8,9,
    8,9,10,
    9,10,11
];
//前上外壳
var waike_front2=[
    vec3(-0.1,0.15,0.15),   //0
    vec3(-0.1,0.15,0.08),    //1
    vec3(-0.1,0.15,-0.08),   //2
    vec3(-0.1,0.15,-0.15),     //3
    
    vec3(-0.05,0.19,0.14),  //4
    vec3(-0.05,0.19,0.09),   //5
    vec3(-0.05,0.19,-0.09),  //6
    vec3(-0.05,0.19,-0.14), //7
    
    vec3(0.15,0.15,0),  //8

    vec3(0.55,0.04,0.02),  //9
    vec3(0.55,0.04,-0.02)  //10
]
var indices_waike_front2 = [
    0,1,4,
    1,4,5,
    2,3,6,
    3,6,7,
    
    0,4,9,
    3,7,10,
    1,5,8,
    2,6,8,

    4,5,8,
    4,8,9,

    6,7,8,
    7,8,10,

    8,9,10
]
//后中外壳
var waike_back2=[
    
    vec3(-0.55,0.1,-0.08),
    vec3(-0.55,0.1,0.08),
    vec3(-0.2,0.1,-0.08),
    vec3(-0.2,0.1,0.08),    //底面四点

    vec3(-0.53,0.2,-0.07),  //4
    vec3(-0.53,0.2,0.07),
    vec3(-0.4,0.2,-0.07),
    vec3(-0.4,0.2,0.07),   //顶面四点
    vec3(-0.31,0.2,-0.05),//前沿两点
    vec3(-0.31,0.2,0.05),    //9

    vec3(-0.4,0.2,-0.07),
    vec3(-0.4,0.2,0.07),    

    vec3(-0.55,0.15,-0.078),
    vec3(-0.55,0.15,0.078),
    vec3(-0.3,0.15,-0.078),
    vec3(-0.3,0.15,0.078), //15

    vec3(-0.52,0.215,-0.068),//16
    vec3(-0.52,0.215,0.068),
    vec3(-0.4,0.215,-0.068),
    vec3(-0.4,0.215,0.068),   
    vec3(-0.32,0.215,-0.048),
    vec3(-0.32,0.215,0.048),   //21

]
var indices_waike_back2=[
    0,1,4,
    1,4,5,
    0,4,12,
    1,5,13,
    
    0,2,12,
    2,12,14,
    1,3,13,
    3,13,15,

    4,5,10,
    5,10,11,
    10,11,8,
    11,8,9,

    12,14,4,
    14,4,6,
    13,15,5,
    15,5,7,

    4,6,16,
    6,16,18,
    5,7,17,
    7,17,19,

    4,5,16,
    5,16,17,
    8,9,20,
    9,20,21,

    6,8,18,
    8,18,20,
    7,9,19,
    9,19,21,

    18,19,20,
    19,20,21,
    0,1,2,
    1,2,3

]
//后上外壳
var waike_back3=[
    vec3(-0.52,0.215,-0.035),
    vec3(-0.52,0.215,0.035),
    vec3(-0.35,0.215,-0.04),
    vec3(-0.35,0.215,0.04),
    vec3(-0.4,0.25,-0.035),
    vec3(-0.4,0.25,0.035)

]
var indices_waike_back3=[
    0,1,4,
    1,4,5,
    0,2,4,
    1,3,5,

    2,3,4,
    3,4,5
]
//尾翼
var weiyi=[
    vec3(-0.58,0.25,-0.25),
    vec3(-0.58,0.25,0.25),
    vec3(-0.7,0.3,-0.25),
    vec3(-0.7,0.3,0.25),

    vec3(-0.58,0.26,-0.25),
    vec3(-0.58,0.26,0.25),
    vec3(-0.7,0.31,-0.25),
    vec3(-0.7,0.31,0.25),
    //侧翼
    vec3(-0.54,0.25,-0.25), //8
    vec3(-0.58,0.32,-0.25),
    vec3(-0.74,0.33,-0.25),
    vec3(-0.65,0.2,-0.25),
    vec3(-0.58,0.2,-0.25), //12

    vec3(-0.54,0.25,0.25), //13
    vec3(-0.58,0.32,0.25),
    vec3(-0.74,0.33,0.25),
    vec3(-0.65,0.2,0.25),
    vec3(-0.58,0.2,0.25), //17

    vec3(-0.54,0.25,-0.26), //18
    vec3(-0.58,0.32,-0.26),
    vec3(-0.74,0.33,-0.26),
    vec3(-0.65,0.2,-0.26),
    vec3(-0.58,0.2,-0.26), //22

    vec3(-0.54,0.25,0.26), //23
    vec3(-0.58,0.32,0.26),
    vec3(-0.74,0.33,0.26),
    vec3(-0.65,0.2,0.26),
    vec3(-0.58,0.2,0.26), //27

]
var indices_weiyi=[
    1, 0, 3,
    3, 2, 1,
    2, 3, 7,
    7, 6, 2,
    3, 0, 4,
    4, 7, 3,
    6, 5, 1,
    1, 2, 6,
    4, 5, 6,
    6, 7, 4,
    5, 4, 0,
    0, 1, 5,

    8,9,10,
    8,10,11,
    8,11,12,
    
    13,14,15,
    13,15,16,
    13,16,17,

    18,19,20,
    18,20,21,
    18,21,22,

    23,24,25,
    23,25,26,
    23,26,27,

    8,9,18,
    9,18,19,
    9,10,19,
    10,19,20,
    10,11,20,
    11,20,21,
    11,12,21,
    12,21,22,
    12,8,22,
    8,22,18,

    13,14,23,
    14,23,24,
    14,15,24,
    15,24,25,
    15,16,25,
    16,25,26,
    16,17,26,
    17,26,27,
    17,13,27,
    13,27,23

]

//后连接杆
var lianjiegan_back1=[
    vec3(-0.25,0.1,-0.08),
    vec3(-0.25,0.1,-0.15),
    vec3(-0.32,0.15,-0.08),
    vec3(-0.32,0.15,-0.15),

    vec3(-0.5,0.15,-0.08),
    vec3(-0.5,0.15,-0.15),
    vec3(-0.52,0.21,-0.08),
    vec3(-0.52,0.21,-0.15),
    vec3(-0.58,0.25,-0.08),
    vec3(-0.58,0.25,-0.15),

    vec3(-0.6,0.26,-0.08),
    vec3(-0.6,0.26,-0.15),
    vec3(-0.55,0.18,-0.08),
    vec3(-0.55,0.18,-0.15),
    vec3(-0.54,0.15,-0.08),
    vec3(-0.54,0.15,-0.15),
    
    vec3(-0.55,0.1,-0.08),
    vec3(-0.55,0.1,-0.15)

]
var lianjiegan_back2=[
    vec3(-0.25,0.1,0.08),
    vec3(-0.25,0.1,0.15),
    vec3(-0.32,0.15, 0.08),
    vec3(-0.32,0.15, 0.15),

    vec3(-0.5,0.15, 0.08),
    vec3(-0.5,0.15, 0.15),
    vec3(-0.52,0.21, 0.08),
    vec3(-0.52,0.21, 0.15),
    vec3(-0.58,0.25, 0.08),
    vec3(-0.58,0.25, 0.15),

    vec3(-0.6,0.26, 0.08),
    vec3(-0.6,0.26, 0.15),
    vec3(-0.55,0.18, 0.08),
    vec3(-0.55,0.18, 0.15),
    vec3(-0.54,0.15, 0.08),
    vec3(-0.54,0.15, 0.15),
    
    vec3(-0.55,0.1, 0.08),
    vec3(-0.55,0.1, 0.15),

]
var indices_lianjiegan_back=[
    0,1,2,
    1,2,3,
    2,3,4,
    3,4,5,
    4,5,6,
    5,6,7,
    6,7,8,
    7,8,9,
    8,9,10,
    9,10,11,
    10,11,12,
    11,12,13,
    12,13,14,
    13,14,15,
    14,15,16,
    15,16,17,
    16,17,0,
    17,0,1,

    0,2,16,
    2,16,14,
    4,14,6,
    14,6,12,
    6,12,8,
    12,8,10,
    
    1,3,17,
    3,17,15,
    5,15,7,
    15,7,13,
    7,13,9,
    13,9,11

]
//后边壳
var side_back1=[
    vec3(-0.16,0.05,-0.15),
    vec3(-0.48,0.05,-0.15),

    vec3(-0.02,0.04,-0.18),//2
    vec3(-0.03,0.1,-0.18),  //3 - 8
    vec3(-0.43,0.15,-0.18),
    vec3(-0.438,0.15,-0.24), //5

    vec3(-0.49,0.15,-0.28),//6
    vec3(-0.25,0.13,-0.28),  //7-11
    vec3(-0.08,0.1,-0.24),//8 - 3
    
    vec3(-0.35,0.1,-0.28),
    vec3(-0.28,0.04,-0.28),
    vec3(-0.25,0.04,-0.28),  //11 -7
    vec3(-0.07,0.04,-0.24),

]
var side_back2=[
    vec3(-0.16,0.05,0.15),
    vec3(-0.48,0.05,0.15),

    vec3(-0.02,0.04, 0.18),//2
    vec3(-0.03,0.1, 0.18),  //3 - 8
    vec3(-0.43,0.15, 0.18),
    vec3(-0.438,0.15, 0.24), //5

    vec3(-0.49,0.15, 0.28),//6
    vec3(-0.25,0.13, 0.28),  //7-11
    vec3(-0.08,0.1, 0.24),//8 - 3
    
    vec3(-0.35,0.1, 0.28),
    vec3(-0.28,0.04, 0.28),
    vec3(-0.25,0.04, 0.28),  //11 -7
    vec3(-0.07,0.04, 0.24),

]
var indices_side_back=[
    3,4,5,
    3,5,8,
    0,1,3,
    1,3,4,

    5,6,7,
    5,7,8,
    6,9,7,
    9,10,7,
    10,11,7,

    7,11,8,
    11,8,12,
    
    2,3,8,
    2,8,12
]       
//前边壳

var side_front1=[
    vec3(0.57,0.1,-0.12),
    vec3(0.56,0.1,-0.25),
    vec3(0.39,0.15,-0.28),
    vec3(0.42,0.15,-0.13),

    vec3(0.57,0.04,-0.12),
    vec3(0.56,0.04,-0.25),

    vec3(0.5,0.04,-0.26),
    vec3(0.48,0.04,-0.12),

    vec3(0.47,0.08,-0.27),
]
var side_front2=[
    vec3(0.57,0.1, 0.12),
    vec3(0.56,0.1, 0.25),
    vec3(0.39,0.15, 0.28),
    vec3(0.42,0.15, 0.13),

    vec3(0.57,0.04, 0.12),
    vec3(0.56,0.04, 0.25),

    vec3(0.5,0.04, 0.26),
    vec3(0.48,0.04, 0.12),

    vec3(0.47,0.08, 0.27),
]
var indices_side_front=[
    0,1,2,
    0,2,3,

    0,1,4,
    1,4,5,
    0,3,4,
    3,4,7,

    2,8,1,
    8,6,1,
    6,5,1

]

var track3=[
    vec3(10,-0.199, -4.5),
    vec3(10,-0.199, -3.5),
    vec3(10,-0.101, -4.5),
    vec3(10,-0.101, -3.5),

    vec3(15,4.801, -4.5),
    vec3(15,4.801, -3.5),
    vec3(15,4.899, -4.5),
    vec3(15,4.899, -3.5),
]


//获得球得数组
lightarray=drawBall(0,-2,3,0.3,ms);


//通过函数得到的顶点数组
lupai = drawYuanzhu2(4,1,-4.3,0.05,ms,2);

yuanzhu1=drawYuanzhu(-0.4,0,0.25,0.1,ms,0.1);
yuanzhu2=drawYuanzhu(0.39,0,0.25,0.1,ms,0.1);
yuanzhu3=drawYuanzhu(-0.4,0,-0.25,0.1,ms,0.1);
yuanzhu4=drawYuanzhu(0.39,0,-0.25,0.1,ms,0.1);

body=drawCube(0,0,0,1.1,0.04,0.3);
lianjiegan1=drawCube(0.57,0,0.05,0.06,0.04,0.04);
lianjiegan2=drawCube(0.57,0,-0.05,0.06,0.04,0.04);
front_gang=drawCube(0.53,0.04,0,0.05,0.04,0.24);

lunzhou1=drawYuanzhu(-0.4,0,0.175,0.02,ms,0.05);
lunzhou2=drawYuanzhu(-0.4,0,-0.175,0.02,ms,0.05);
lunzhou3=drawYuanzhu(0.4,0,0.175,0.02,ms,0.05);
lunzhou4=drawYuanzhu(0.4,0,-0.175,0.02,ms,0.05);

waike_back=drawBall2(-0.22,0.1,0,0.1,ms,2.7,1.1,0.78);

houzhu1=drawCube(-0.325,0.06,-0.075,0.45,0.08,0.15);
houzhu2=drawCube(-0.325,0.06,0.075,0.45,0.08,0.15);

qianhu=drawHu(-1.35,0,0,2,ms,0.04,0.05);
feilunzhou1=drawYuanzhu2(0.60,0,-0.32,0.02,ms,0.08);
feilunzhou2=drawYuanzhu2(0.60,0,0.32,0.02,ms,0.08);

feilun1=drawHu(0.60,0.04,-0.32,0.07,ms,0.02,0.03);
feilun2=drawHu(0.60,0.04,0.32,0.07,ms,0.02,0.03);

feilun3=drawHu(0.60,0.05,-0.32,0.06,ms,0.02,0.02);
feilun4=drawHu(0.60,0.05,0.32,0.06,ms,0.02,0.02);

skybox=drawCube(0,0,0,50,50,50);
lupai2 = drawCube(4,2,-4.3,1,1,0.2);

track=drawHu(0,-0.15,0,4.5,ms,0.1,1);
track2=drawCube(5,-0.15,-4,10,0.098,1);


skyboxArray=[];
lupai2Array=[];
function quad(a, b, c, d) {
    skyboxArray.push(skybox[a]);
    skyboxArray.push(skybox[b]);
    skyboxArray.push(skybox[c]);
    skyboxArray.push(skybox[a]);
    skyboxArray.push(skybox[c]);
    skyboxArray.push(skybox[d]);

    lupai2Array.push(lupai2[a]);
    lupai2Array.push(lupai2[b]);
    lupai2Array.push(lupai2[c]);
    lupai2Array.push(lupai2[a]);
    lupai2Array.push(lupai2[c]);
    lupai2Array.push(lupai2[d]);
}
quad( 1, 0, 3, 2 );
quad( 2, 3, 7, 6 );
quad( 3, 0, 4, 7 );
quad( 6, 5, 1, 2 );
quad( 4, 5, 6, 7 );
quad( 5, 4, 0, 1 );


//计算顶点法向量
function getNormal(vertices){
    var arr= new Array();
    for(var i =0;i<vertices.length;i+=3){
        var t1 = vec3(subtract(vertices[i+1], vertices[i]));
        var t2 = vec3(subtract(vertices[i+2], vertices[i+1]));
        var normal =  vec3(cross(t1, t2));
        //console.log(normal);
        arr.push(normal);
        arr.push(normal);
        arr.push(normal);
    }
    
    
    return arr;
}
//计算顶点法向量（朝外）
function getNormal1(vertices,ox,oy,oz){
    var arr= new Array();
    var o=vec3(ox,oy,oz);
    for(var i =0;i<vertices.length;i+=3){
        var t1 = vec3(subtract(vertices[i+1], vertices[i]));
        var t2 = vec3(subtract(vertices[i+2], vertices[i+1]));
        var normal =  vec3(cross(t1, t2));
        var t3 = vec3(subtract(vec3(vertices[i+1]),o));
        
        if(normal[0]*t3[0]+normal[1]*t3[1]+normal[2]*t3[2]<0){
            
            normal =  vec3(cross(t2, t1));
        }
            
        arr.push(normal);
        arr.push(normal);
        arr.push(normal);
    }
    
    
    return arr;
}
//计算有索引的顶点法向量
function getNormalByIndices(vertices,indices){
    var arr= new Array();
    for(var i =0;i<indices.length;i+=3){
        var t1 = vec3(subtract(vertices[indices[i+1]], vertices[indices[i]]));
        var t2 = vec3(subtract(vertices[indices[i+2]], vertices[indices[i+1]]));
        var normal =  vec3(cross(t1, t2));
        //console.log(normal);
        arr.push(normal);
        arr.push(normal);
        arr.push(normal);
    }
    return arr;
}
//计算有索引的顶点法向量（朝外）
function getNormalByIndices1(vertices,indices,ox,oy,oz){
    var arr= new Array();
    o=vec3(ox,oy,oz);
    for(var i =0;i<indices.length;i+=3){
        var t1 = vec3(subtract(vertices[indices[i+1]], vertices[indices[i]]));
        var t2 = vec3(subtract(vertices[indices[i+2]], vertices[indices[i+1]]));
        var normal =  vec3(cross(t1, t2));
        
        var t3 = vec3(subtract(vec3(vertices[indices[i+1]]),o));
        
        if(normal[0]*t3[0]+normal[1]*t3[1]+normal[2]*t3[2]<0){
            
            normal =  vec3(cross(t2, t1));
        }
        arr.push(normal);
        arr.push(normal);
        arr.push(normal);
    }
    return arr;
}


//法向量
//路牌法向量
var Normal_lupai=getNormal1(lupai,0,0,0);
//圆柱法向量
var vertexNormal=getNormal1(yuanzhu1,-0.4,0,0.25);
//长方体法向量
var vertexNormal2=getNormalByIndices1(body,indices,0,0,0);
//驾驶舱法向量
var Normal_qiu=getNormal1(waike_back,-0.22,0.1,0);
//前下外壳法向量
var Normal_waike_front=getNormalByIndices1(waike_front,indices_waike_front,0.3,0,0);
//前上外壳法向量
var Normal_waike_front2=getNormalByIndices1(waike_front2,indices_waike_front2,0.16,0.15,0);
//轮轴法向量
var Normal_lunzhou=getNormal1(lunzhou1,-0.4,0,0.175);
//弧法向量
var Normal_qianhu=getNormal(qianhu,0.648,0,0);
//上飞轮法向量
var Normal_feilun=getNormal1(feilun1,0.60,0.04,-0.32);
//飞轮轴法向量
var Normal_feilunzhou=getNormal1(feilunzhou1,0.60,0,-0.32);
//后中外壳法向量
var Normal_waike_back2=getNormalByIndices1(waike_back2,indices_waike_back2,-0.4,0,0);
//后上外壳法向量
var Normal_waike_back3=getNormalByIndices1(waike_back3,indices_waike_back3,-0.55,0.2,0);
//底柱法向量
var Normal_houzhu=getNormalByIndices1(houzhu1,indices,-0.325,0.06,-0.075);
//尾翼法向量
var Normal_weiyi=getNormalByIndices1(weiyi,indices_weiyi,-0.6,0.255,0);
//后连接杆法向量
var Normal_lianjiegan_back=getNormalByIndices1(lianjiegan_back1,indices_lianjiegan_back,-0.5,0.1,0);
//后边壳法向量
var Normal_side_back=getNormalByIndices1(side_back1,indices_side_back,-0.3,0.05,-0.2);
var Normal_side_back2=getNormalByIndices1(side_back2,indices_side_back,-0.3,0.05,0.2);
//前边壳法向量
var Normal_side_front=getNormalByIndices1(side_front1,indices_side_front,0.5,0.05,-0.1);    
var Normal_side_front2=getNormalByIndices1(side_front2,indices_side_front,0.5,0.05,0.1);
var Normal_track3=getNormalByIndices1(track3,indices,13,2.95,4);
var Normal_Buffer_light=getNormal1(lightarray,0,-2,3);

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];
//计算texCoordsArray
var texCoordsArray=[];

for( var i=0;i<6;i++){
    texCoordsArray.push(texCoord[0]);
    texCoordsArray.push(texCoord[1]);
    texCoordsArray.push(texCoord[2]);
    texCoordsArray.push(texCoord[0]);
    texCoordsArray.push(texCoord[2]);
    texCoordsArray.push(texCoord[3]);

}

   


    

function configureTexture( image,i ) {
    texture = gl.createTexture();






    

    if(i == 1){
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture( gl.TEXTURE_2D, texture );
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
             gl.RGB, gl.UNSIGNED_BYTE, image );
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                          gl.NEAREST_MIPMAP_LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
        gl.uniform1i(gl.getUniformLocation(program, "texture1"), 0);
    }   






    else if(i==2){
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture( gl.TEXTURE_2D, texture );
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
             gl.RGB, gl.UNSIGNED_BYTE, image );
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                          gl.NEAREST_MIPMAP_LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
        gl.uniform1i(gl.getUniformLocation(program, "texture2"), 1);
    }
    else if(i==3){
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture( gl.TEXTURE_2D, texture );
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
             gl.RGB, gl.UNSIGNED_BYTE, image );
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                          gl.NEAREST_MIPMAP_LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
        gl.uniform1i(gl.getUniformLocation(program, "texture3"), 2);
    }
    else if(i==4){
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture( gl.TEXTURE_2D, texture );
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
             gl.RGB, gl.UNSIGNED_BYTE, image );
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                          gl.NEAREST_MIPMAP_LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
        gl.uniform1i(gl.getUniformLocation(program, "texture4"), 3); 
    }
    else if(i==5){
        gl.activeTexture(gl.TEXTURE4);
        gl.bindTexture( gl.TEXTURE_2D, texture );
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
             gl.RGB, gl.UNSIGNED_BYTE, image );
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                          gl.NEAREST_MIPMAP_LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
        gl.uniform1i(gl.getUniformLocation(program, "texture5"), 4);  
    }
    else if(i==6){
        gl.activeTexture(gl.TEXTURE5);
        gl.bindTexture( gl.TEXTURE_2D, texture );
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
             gl.RGB, gl.UNSIGNED_BYTE, image );
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                          gl.NEAREST_MIPMAP_LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
        gl.uniform1i(gl.getUniformLocation(program, "texture6"), 5);     
    }
    else if(i==7)
    {
        gl.activeTexture(gl.TEXTURE6);
        gl.bindTexture( gl.TEXTURE_2D, texture );
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
             gl.RGB, gl.UNSIGNED_BYTE, image );
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                          gl.NEAREST_MIPMAP_LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
        gl.uniform1i(gl.getUniformLocation(program, "texture7"), 6);     
    }
    else if(i==8)
    {
        gl.activeTexture(gl.TEXTURE7);
        gl.bindTexture( gl.TEXTURE_2D, texture );
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
             gl.RGB, gl.UNSIGNED_BYTE, image );
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                          gl.NEAREST_MIPMAP_LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
        gl.uniform1i(gl.getUniformLocation(program, "texture8"), 7);     
    }

              
}

window.onload = function init()
{

    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL( canvas );
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);

    aspect =  canvas.width/canvas.height;
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);

    vNormal = gl.getAttribLocation(program, "vNormal" );
    vPosition = gl.getAttribLocation(program,"vPosition");
    vTexCoord = gl.getAttribLocation(program, "vTexCoord" );



    ModelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    lightViewMatrixLoc = gl.getUniformLocation(program, "lightViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program,"projectionMatrix");

    

    gl.clearColor(0.5,0.5,0.5,1);//背景颜色
  
    //光源

    nBuffer_light=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,nBuffer_light);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(Normal_Buffer_light),gl.STATIC_DRAW);

    
    buffer_light = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_light);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(lightarray),gl.STATIC_DRAW);

    //路牌buff
    nBuffer_lupai = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer_lupai);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(Normal_lupai), gl.STATIC_DRAW);

    buffer_lupai = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_lupai);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(lupai),gl.STATIC_DRAW);

    tBuffer_lupai2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer_lupai2);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(texCoordsArray), gl.STATIC_DRAW);

    buffer_lupai2=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_lupai2);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(lupai2Array),gl.STATIC_DRAW);

    //车轮buffer
    nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(vertexNormal), gl.STATIC_DRAW);

    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(yuanzhu1),gl.STATIC_DRAW);
        
    buffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer2);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(yuanzhu2),gl.STATIC_DRAW);
    
    buffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer3);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(yuanzhu3),gl.STATIC_DRAW);
    
    buffer4 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer4);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(yuanzhu4),gl.STATIC_DRAW);
    
    //轮轴buffer
    nBuffer_lunzhou=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer_lunzhou);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(Normal_lunzhou), gl.STATIC_DRAW);

    buffer_lunzhou1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_lunzhou1);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(lunzhou1),gl.STATIC_DRAW);
    
    buffer_lunzhou2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_lunzhou2);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(lunzhou2),gl.STATIC_DRAW);
        
    buffer_lunzhou3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_lunzhou3);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(lunzhou3),gl.STATIC_DRAW);
    
    buffer_lunzhou4 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_lunzhou4);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(lunzhou4),gl.STATIC_DRAW);
    
    //前下外壳
    waike_front_id = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, waike_front_id);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices_waike_front), gl.STATIC_DRAW); 

    nBuffer_waike_front=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer_waike_front);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(Normal_waike_front), gl.STATIC_DRAW);
    
    buffer_waike_front = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_waike_front);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(waike_front),gl.STATIC_DRAW);  // 此形式需用flatten  函数返回数组可以用float32array

    //前上外壳
    waike_front_id2 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, waike_front_id2);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices_waike_front2), gl.STATIC_DRAW); 

    nBuffer_waike_front2=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer_waike_front2);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(Normal_waike_front2), gl.STATIC_DRAW);
    
    buffer_waike_front2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_waike_front2);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(waike_front2),gl.STATIC_DRAW);  // 此形式需用flatten  函数返回数组可以用float32array

    //后中外壳
    waike_back_id = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, waike_back_id);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices_waike_back2), gl.STATIC_DRAW); 

    nBuffer_waike_back2=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer_waike_back2);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(Normal_waike_back2), gl.STATIC_DRAW);
    
    buffer_waike_back2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_waike_back2);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(waike_back2),gl.STATIC_DRAW);

    //后上外壳
    waike_back_id2 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, waike_back_id2);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices_waike_back3), gl.STATIC_DRAW); 

    nBuffer_waike_back3=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer_waike_back3);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(Normal_waike_back3), gl.STATIC_DRAW);
    
    buffer_waike_back3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_waike_back3);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(waike_back3),gl.STATIC_DRAW);




    //底盘buffer
    iBufferCubeID = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferCubeID);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);  //如果索引太大 应当用Uint16Array

    nBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(vertexNormal2), gl.STATIC_DRAW);
    
    buffer5 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer5);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(body),gl.STATIC_DRAW);


    
    //直轨道
    buffer_track2= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_track2);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(track2),gl.STATIC_DRAW);

    //上坡轨道

    nbuffer_track3= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nbuffer_track3);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(Normal_track3), gl.STATIC_DRAW);

    buffer_track3= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_track3);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(track3),gl.STATIC_DRAW);


    //天空盒
    tBuffer_skybox = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer_skybox);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(texCoordsArray), gl.STATIC_DRAW);

    buffer_skybox=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_skybox);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(skyboxArray),gl.STATIC_DRAW);
    
    image1=document.getElementById("texImage1");
    image2=document.getElementById("texImage2");
    image3=document.getElementById("texImage3");
    image4=document.getElementById("texImage4");
    image5=document.getElementById("texImage5");
    image6=document.getElementById("texImage6");
    image7=document.getElementById("texImage7");
    image8=document.getElementById("texImage8");
    configureTexture(image1,1);
    configureTexture(image2,2);
    configureTexture(image3,3);
    configureTexture(image4,4);
    configureTexture(image5,5);
    configureTexture(image6,6);
    configureTexture(image7,7);
    configureTexture(image8,8);
    //连接杆
    buffer_lianjiegan1= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_lianjiegan1);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(lianjiegan1),gl.STATIC_DRAW);

    buffer_lianjiegan2= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_lianjiegan2);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(lianjiegan2),gl.STATIC_DRAW);

    //前杠buffer
    nBuffer_front_gang = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer_front_gang);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(vertexNormal2), gl.STATIC_DRAW);
    
    buffer_front_gang = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_front_gang);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(front_gang),gl.STATIC_DRAW);
    
    //后底柱
    nBuffer_houzhu= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer_houzhu);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(Normal_houzhu), gl.STATIC_DRAW);
    
    buffer_houzhu1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_houzhu1);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(houzhu1),gl.STATIC_DRAW);
    buffer_houzhu2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_houzhu2);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(houzhu2),gl.STATIC_DRAW);
    

    //前弧buffer  下飞轮
    nBuffer_qianhu=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer_qianhu);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(Normal_qianhu), gl.STATIC_DRAW);

    buffer_qianhu= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_qianhu);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(qianhu),gl.STATIC_DRAW);
    
    buffer_feilun1=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_feilun1);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(feilun1),gl.STATIC_DRAW);
    buffer_feilun2=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_feilun2);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(feilun2),gl.STATIC_DRAW);

    //上飞轮
    nBuffer_feilun=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,nBuffer_feilun);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(Normal_feilun), gl.STATIC_DRAW);

    buffer_feilun3= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_feilun3);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(feilun3),gl.STATIC_DRAW);
    buffer_feilun4= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_feilun4);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(feilun4),gl.STATIC_DRAW);
    
    
    //圆轨道
    buffer_track = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_track);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(track),gl.STATIC_DRAW);

    //飞轮轴
    nBuffer_feilunzhou=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer_feilunzhou);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(Normal_feilunzhou), gl.STATIC_DRAW);

    buffer_feilunzhou1= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_feilunzhou1);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(feilunzhou1),gl.STATIC_DRAW);

    buffer_feilunzhou2= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_feilunzhou2);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(feilunzhou2),gl.STATIC_DRAW);

    //驾驶舱
    nBuffer_waike_back = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer_waike_back);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(Normal_qiu), gl.STATIC_DRAW);

    buffer_waike_back = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_waike_back);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(waike_back),gl.STATIC_DRAW);

    //尾翼

    weiyi_id = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, weiyi_id);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices_weiyi), gl.STATIC_DRAW);

    nBuffer_weiyi = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer_weiyi);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(Normal_weiyi), gl.STATIC_DRAW);

    buffer_weiyi = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_weiyi);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(weiyi),gl.STATIC_DRAW);

    //后连接杆
    lianjiegan_back_id= gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lianjiegan_back_id);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices_lianjiegan_back), gl.STATIC_DRAW);

    nBuffer_lianjiegan_back = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer_lianjiegan_back);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(Normal_lianjiegan_back), gl.STATIC_DRAW);

    buffer_lianjiegan_back1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_lianjiegan_back1);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(lianjiegan_back1),gl.STATIC_DRAW);

    buffer_lianjiegan_back2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_lianjiegan_back2);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(lianjiegan_back2),gl.STATIC_DRAW);


    //后边壳
    side_back_id= gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, side_back_id);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices_side_back), gl.STATIC_DRAW);

    nBuffer_side_back = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer_side_back);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(Normal_side_back), gl.STATIC_DRAW);

    buffer_side_back1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_side_back1);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(side_back1),gl.STATIC_DRAW);

    nBuffer_side_back2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer_side_back2);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(Normal_side_back2), gl.STATIC_DRAW);

    buffer_side_back2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_side_back2);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(side_back2),gl.STATIC_DRAW);


    //前边壳
    side_front_id= gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, side_front_id);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices_side_front), gl.STATIC_DRAW);

    nBuffer_side_front = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer_side_front);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(Normal_side_front), gl.STATIC_DRAW);

    buffer_side_front1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_side_front1);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(side_front1),gl.STATIC_DRAW);

    nBuffer_side_front2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer_side_front2);
    gl.bufferData(gl.ARRAY_BUFFER, new flatten(Normal_side_front2), gl.STATIC_DRAW);

    buffer_side_front2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer_side_front2);
    gl.bufferData(gl.ARRAY_BUFFER,new flatten(side_front2),gl.STATIC_DRAW);




    gl.enableVertexAttribArray(vPosition);
    gl.enableVertexAttribArray(vNormal);
    gl.enableVertexAttribArray(vTexCoord);


    //材质
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
      
    ambientProduct_black = mult(lightAmbient, materialAmbient_black);
    diffuseProduct_black = mult(lightDiffuse, materialDiffuse_black);
    specularProduct_black= mult(lightSpecular, materialSpecular_black);

    ambientProduct_white = mult(lightAmbient, materialAmbient_white);
    diffuseProduct_white = mult(lightDiffuse, materialDiffuse_white);
    specularProduct_white = mult(lightSpecular, materialSpecular_white);

    ambientProduct_deep_blue = mult(lightAmbient, materialAmbient_deep_blue);
    diffuseProduct_deep_blue = mult(lightDiffuse, materialDiffuse_deep_blue);
    specularProduct_deep_blue = mult(lightSpecular, materialSpecular_deep_blue);

    ambientProduct_light_blue = mult(lightAmbient, materialAmbient_light_blue);
    diffuseProduct_light_blue = mult(lightDiffuse, materialDiffuse_light_blue);
    specularProduct_light_blue = mult(lightSpecular, materialSpecular_light_blue);

    ambientProduct_grey = mult(lightAmbient, materialAmbient_grey);
    diffuseProduct_grey = mult(lightDiffuse, materialDiffuse_grey);
    specularProduct_grey = mult(lightSpecular, materialSpecular_grey);


    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f(gl.getUniformLocation(program, "shininess"),materialShininess);

    
    
    // projection = ortho(-1, 1, -1, 1, -100, 100);
    // gl.uniformMatrix4fv( projectionMatrixLoc,false, flatten(projection));



//设置按钮

//模型旋转
// document.getElementById("XRotate").onclick = function() {
//     XRotateAngle -= 5;
// };
// document.getElementById("XRotate2").onclick = function() {
//     XRotateAngle += 5;
// };

// document.getElementById("YRotate").onclick = function() {
//     YRotateAngle -= 5;
// };
// document.getElementById("YRotate2").onclick = function() {
//     YRotateAngle += 5;
// };

// document.getElementById("ZRotate").onclick = function() {
//     ZRotateAngle -= 5;
// };
// document.getElementById("ZRotate2").onclick = function() {
//     ZRotateAngle += 5;
// };

document.getElementById("longjuanfeng").onclick = function() {
    if(longjuanfeng==0){
        longjuanfeng=1;
    }
    else{
        longjuanfeng=0;
        selfXRotateAngle=0;
    }
};
document.getElementById("run").onclick = function() {
    if(move==0){
        move=1;
    }
    else{
        move=0;
    }
};
document.getElementById("track1").onclick = function() {
    running=1;
    eye = vec3(0,6,11);
    at = vec3(0,0,0);
    Tx=0;
    Ty=0;
    Tz=-4;
    selfXRotateAngle=0;
    selfZRotateAngle=0;
    selfYRotateAngle=0;
};
document.getElementById("track2").onclick = function() {
    running=2;
    YRotateAngle=0;
    eye = vec3(10,6,11);
    at = vec3(5,0,0);
};

//光源旋转
document.getElementById("ButtonaddZ").onclick = function(){
    LZRotateAngle+=20
};
document.getElementById("ButtonaddY").onclick = function(){
    LYRotateAngle+=20
};
document.getElementById("ButtonaddX").onclick = function(){
    LXRotateAngle+=20
};


initControl(canvas);

render();

};

//绑定product
function bindProduct(ambientProduct,diffuseProduct,specularProduct){
   
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );
    
}

//绑定法向量Buffer
function bindnBuffer(nBuffer){
    gl.bindBuffer(gl.ARRAY_BUFFER,nBuffer);
    gl.vertexAttribPointer(vNormal,3, gl.FLOAT, false, 0, 0);
}

//绑定纹理Buffer
function bindtBuffer(tBuffer){
    gl.bindBuffer(gl.ARRAY_BUFFER,tBuffer);
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0 );
}

//绘制函数
function render(){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    if(longjuanfeng==1){
        selfXRotateAngle += 8;
    }
    if(running==1&& move==1){
        YRotateAngle+=2;
    }
    else if(running==2 && move==1){
        if(Tx<10){
            Tx+=0.08;
        }
        else if(Tx<16){
            
            Tx+=0.05;
            Ty+=0.05;
           
        }
        else if(Tx>16){
            Tx+=0.03;
            Ty-=0.01;
            
            if(selfZRotateAngle == 0){
                selfXRotateAngle += 8;
            }
            else{
                selfZRotateAngle += 1;
            }
        }

        if(Tx>=9.5&&Tx<15 && selfZRotateAngle!=-45){
            selfZRotateAngle -= 3;
            eye = vec3(15,20,8);
            at = vec3(15,0,0);
        }
        
    }

    var T = translate(Tx, Ty, Tz);//物体 位移 
    var LT = translate(LTx, LTy, LTz);//光源 位移  

    //绕X,Y,Z轴旋转的变换矩阵
    var RX = rotateX(XRotateAngle);
    var RY = rotateY(YRotateAngle);
    var RZ = rotateZ(ZRotateAngle);

    var LRX = rotateX(LXRotateAngle);
    var LRY = rotateY(LYRotateAngle);
    var LRZ = rotateZ(LZRotateAngle);
    
    var LJF=rotateX(selfXRotateAngle);
    var SRZ=rotateZ(selfZRotateAngle);
    var SRY=rotateY(selfYRotateAngle);
    //固定件矩阵
    var fixedX=rotateX(0);
    var fixedY=rotateY(0);
    var fixedZ=rotateZ(0);
    var fixedT=translate(0, 0, 0);

    Mlookat = lookAt(eye, vec3(at[0]-4*Math.sin(theta),at[1]+Math.sin(phi),at[2]-4*Math.cos(theta)*Math.cos(phi)) , up);
    pMatrix = perspective(fovy, aspect, near, far);

    //总变换矩阵
    //Mmodelview=Mlookat*Mobject
    Mfixed=mult(mult(mult(fixedT, fixedX),fixedY),fixedZ);
    Mobject=mult(mult(mult(mult(mult(mult(RX, RY),RZ),T),SRZ),SRY),LJF);

    ModelViewMatrix = mult(Mlookat,Mobject);
    fixedModelViewMatrix=mult(Mlookat,Mfixed);
    LightViewMatrix = mult(mult(mult(LRX, LRY),LRZ),LT);
    
    gl.uniformMatrix4fv(ModelViewMatrixLoc, false, flatten(ModelViewMatrix));
    gl.uniformMatrix4fv(lightViewMatrixLoc, false, flatten(LightViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(pMatrix));
  
    
    bindProduct(ambientProduct_black,diffuseProduct_black,specularProduct_black);
    
    bindtBuffer(tBuffer_skybox);
    bindtBuffer(tBuffer_lupai2);
    //绘制光源
    gl.uniformMatrix4fv(ModelViewMatrixLoc, false, flatten(fixedModelViewMatrix));
    gl.uniform1i(gl.getUniformLocation(program, "choice"), 1);
    bindProduct(ambientProduct_deep_blue,diffuseProduct_deep_blue,specularProduct_deep_blue);
    bindnBuffer(nBuffer_light);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_light);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES,0,ms*ms*3);

    gl.uniform1i(gl.getUniformLocation(program, "choice"), 0);
    gl.uniformMatrix4fv(ModelViewMatrixLoc, false, flatten(ModelViewMatrix));
    
    

    //绘制车轮
    bindnBuffer(nBuffer);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
 
    gl.drawArrays(gl.TRIANGLES,0,ms*12);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES,0,ms*12);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer3);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES,0,ms*12);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer4);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES,0,ms*12);


    
    //绘制轮轴
    bindProduct(ambientProduct,diffuseProduct,specularProduct);

    bindnBuffer(nBuffer_lunzhou);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_lunzhou1);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES,0,ms*12);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_lunzhou2);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES,0,ms*12);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_lunzhou3);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES,0,ms*12);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_lunzhou4);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES,0,ms*12);

    //绘制底盘
    bindProduct(ambientProduct_black,diffuseProduct_black,specularProduct_black);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferCubeID);

    bindnBuffer(nBuffer2);
    
    //绘制底盘
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer5);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE,0);



    //绘制直轨道
    gl.uniformMatrix4fv(ModelViewMatrixLoc, false, flatten(fixedModelViewMatrix));
    bindProduct(ambientProduct_grey,diffuseProduct_grey,specularProduct_grey);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_track2);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE,0);

    //绘制上坡轨道
    bindnBuffer(nbuffer_track3);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_track3);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE,0);


    bindnBuffer(nBuffer2);
    

    //绘制天空盒

    bindProduct(ambientProduct_white,diffuseProduct_white,specularProduct_white);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_skybox);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

    // gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 5);  
    // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE,0);
    // gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 4); 
    // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE,6);
    // gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 3);
    // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE,12);
    // gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 6);  
    // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE,18);
    // gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 1);  
    // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE,30);
    // gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 2);  
    // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE,24);
    
    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 1);
    gl.activeTexture(gl.TEXTURE0);//侧边
    gl.drawArrays( gl.TRIANGLES,0 , 6 );

    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 3);//侧边
    gl.activeTexture(gl.TEXTURE2);
    gl.drawArrays( gl.TRIANGLES,6, 6);

    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 2);
    gl.activeTexture(gl.TEXTURE1);
    gl.drawArrays( gl.TRIANGLES,12, 6);//天灵盖
   
    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 5);
    gl.activeTexture(gl.TEXTURE4);
    gl.drawArrays( gl.TRIANGLES,18,6); //底
   
    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 6);
    gl.activeTexture(gl.TEXTURE5);
    gl.drawArrays( gl.TRIANGLES,30,6);

    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 4);
    gl.activeTexture(gl.TEXTURE3);
    gl.drawArrays(gl.TRIANGLES,24,6);

    //绘制连接杆
    gl.uniformMatrix4fv(ModelViewMatrixLoc, false, flatten(ModelViewMatrix));
    bindProduct(ambientProduct_black,diffuseProduct_black,specularProduct_black);


    gl.activeTexture(gl.TEXTURE6);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_lianjiegan1);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE,0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_lianjiegan2);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE,0);

    //绘制前杠
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_front_gang);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE,0);

    //绘制后底柱
    bindnBuffer(nBuffer_houzhu);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_houzhu1);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE,0);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_houzhu2);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE,0);

    //绘制前下外壳

    bindProduct(ambientProduct_white,diffuseProduct_white,specularProduct_white);
    

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, waike_front_id);

    bindnBuffer(nBuffer_waike_front);
   

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_waike_front);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    //gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 7);  
    gl.drawElements(gl.TRIANGLES, 60, gl.UNSIGNED_BYTE,0);


    bindProduct(ambientProduct,diffuseProduct,specularProduct);

    //绘制前上外壳
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, waike_front_id2);

    bindnBuffer(nBuffer_waike_front2);
   

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_waike_front2);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, 39, gl.UNSIGNED_BYTE,0);

    //绘制后中外壳
    bindProduct(ambientProduct_white,diffuseProduct_white,specularProduct_white);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, waike_back_id);

    bindnBuffer(nBuffer_waike_back2);
   

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_waike_back2);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES,96, gl.UNSIGNED_BYTE,0);
    
    //绘制后上外壳
    bindProduct(ambientProduct,diffuseProduct,specularProduct);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, waike_back_id2);

    bindnBuffer(nBuffer_waike_back3);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_waike_back3);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES,18, gl.UNSIGNED_BYTE,0);

    //gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 3);  
    gl.activeTexture(gl.TEXTURE2);
    //绘制前弧 下飞轮
    bindnBuffer(nBuffer_qianhu);
    

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_qianhu);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES,0,24*5);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_feilun1);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES,0,ms*24);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_feilun2);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES,0,ms*24);

    //绘制上飞轮
    bindnBuffer(nBuffer_feilun);
    
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_feilun3);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES,0,ms*24);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_feilun4);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES,0,ms*24);

    
    //绘制圆轨道
    bindProduct(ambientProduct_grey,diffuseProduct_grey,specularProduct_grey);

    gl.uniformMatrix4fv(ModelViewMatrixLoc, false, flatten(fixedModelViewMatrix));

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_track);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES,0,ms*24);

    gl.uniformMatrix4fv(ModelViewMatrixLoc, false, flatten(ModelViewMatrix));

    
    //绘制飞轮轴
    bindnBuffer(nBuffer_feilunzhou);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_feilunzhou1);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES,0,ms*12);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_feilunzhou2);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES,0,ms*12);



    //绘制驾驶舱
    bindProduct(ambientProduct_deep_blue,diffuseProduct_deep_blue,specularProduct_deep_blue);

    bindnBuffer(nBuffer_waike_back);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_waike_back);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES,0,ms*ms*3);



    //绘制尾翼
    bindProduct(ambientProduct,diffuseProduct,specularProduct);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, weiyi_id);

    bindnBuffer(nBuffer_weiyi);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_weiyi);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES,132, gl.UNSIGNED_BYTE,0);

    //绘制后连接杆
    bindProduct(ambientProduct_grey,diffuseProduct_grey,specularProduct_grey);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lianjiegan_back_id);

    bindnBuffer(nBuffer_lianjiegan_back);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_lianjiegan_back1);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES,90, gl.UNSIGNED_BYTE,0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_lianjiegan_back2);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES,90, gl.UNSIGNED_BYTE,0);

    //绘制后边壳
    bindProduct(ambientProduct_light_blue,diffuseProduct_light_blue,specularProduct_light_blue);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, side_back_id);

    bindnBuffer(nBuffer_side_back);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_side_back1);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES,39, gl.UNSIGNED_BYTE,0);


    bindnBuffer(nBuffer_side_back2);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_side_back2);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES,39, gl.UNSIGNED_BYTE,0);

    //绘制前边壳
    bindProduct(ambientProduct_light_blue,diffuseProduct_light_blue,specularProduct_light_blue);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, side_front_id);

    bindnBuffer(nBuffer_side_front);


    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_side_front1);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES,27, gl.UNSIGNED_BYTE,0);

    bindnBuffer(nBuffer_side_front2);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_side_front2);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES,27, gl.UNSIGNED_BYTE,0);
    //gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 0);  

    //绘制路牌
    gl.uniformMatrix4fv(ModelViewMatrixLoc, false, flatten(fixedModelViewMatrix));
    bindProduct(ambientProduct_black,diffuseProduct_black,specularProduct_black);
    bindnBuffer(nBuffer_lupai);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_lupai);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES,0,ms*12);


    bindnBuffer(tBuffer_lupai2);
    bindProduct(ambientProduct_white,diffuseProduct_white,specularProduct_white);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_lupai2);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    
    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 8);
    gl.activeTexture(gl.TEXTURE7);//侧边
    gl.drawArrays( gl.TRIANGLES,0 , 6 );

    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 2);//侧边
    gl.activeTexture(gl.TEXTURE1);
    gl.drawArrays( gl.TRIANGLES,6, 6);

    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 2);
    gl.activeTexture(gl.TEXTURE1);
    gl.drawArrays( gl.TRIANGLES,12, 6);//天灵盖
   
    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 2);
    gl.activeTexture(gl.TEXTURE1);
    gl.drawArrays( gl.TRIANGLES,18,6); //底
   
    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 2);
    gl.activeTexture(gl.TEXTURE1);
    gl.drawArrays( gl.TRIANGLES,30,6);

    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 2);
    gl.activeTexture(gl.TEXTURE1);
    gl.drawArrays(gl.TRIANGLES,24,6);
    requestAnimFrame(render);
}

//键鼠控制
function initControl(canvas){
    var v = 0.05;//速度
    //键盘控制摄像机位置
    document.onkeydown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e.keyCode==87){ // 按 W
            eye[2]-=v*Math.cos(theta);
            at[2] -= v*Math.cos(theta);
            eye[0]-=v*Math.sin(theta);
            at[0]-=v*Math.sin(theta);
        }
        else if(e.keyCode==83){ // 按 S
            eye[2]-=v*Math.cos(theta+Math.PI);
            at[2]-=v*Math.cos(theta+Math.PI);
            eye[0]-=v*Math.sin(theta+Math.PI);
            at[0]-=v*Math.sin(theta+Math.PI);
        }
        else if(e.keyCode==65){ // 按 D
            eye[2]-=v*Math.cos(theta+Math.PI/2);
            at[2]-=v*Math.cos(theta+Math.PI/2);
            eye[0]-=v*Math.sin(theta+Math.PI/2);
            at[0]-=v*Math.sin(theta+Math.PI/2);
        }
        else if(e.keyCode==68){ // 按 A
            eye[2]-=v*Math.cos(theta-Math.PI/2);
            at[2]-=v*Math.cos(theta-Math.PI/2);
            eye[0]-=v*Math.sin(theta-Math.PI/2);
            at[0]-=v*Math.sin(theta-Math.PI/2);
        }
        else if(e.keyCode==16){ // 按 enter
            eye[1]+=0.5
            at[1]+=0.5
            
        }
        else if(e.keyCode==18)
        {
            eye[1]-=0.1
            at[1]-=0.1
        }
        
    }
    //鼠标控制视角
    var dragging=false;

    //按下鼠标触发监听事件
    canvas.onmousedown = function (event) {
    
        var x = event.clientX, y = event.clientY;
        switch (event.button) {
            case 0:
                //鼠标左键
                var rect1 = event.target.getBoundingClientRect();
                if (rect1.left <= x && x < rect1.right && rect1.top <= y && y < rect1.bottom) {
                    dragging= true;
                }
                break;

        }

    };
    //松开鼠标
    canvas.onmouseup = function (event) {
        switch (event.button) {
            case 0:
                dragging = false;
                break;
        }

    };

    canvas.onmousemove = function(event){  //根据鼠标改变视角
        
        var rect = canvas.getBoundingClientRect();
        var rectMX = (rect.right-rect.left)/2;
        var rectMY = (rect.bottom-rect.top)/2;

        if(event.clientX>rect.left&&event.clientX<rect.right&&event.clientY>rect.top&&event.clientY<rect.bottom&&dragging){

            theta += 0.00004*(rectMX - event.clientX);
            phi += 0.00004*(rectMY-event.clientY);
        }

    }
} 
