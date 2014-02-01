(function() {

  var streaming = false,
      video        = document.querySelector('#video'),
      canvas       = document.querySelector('#canvas2'),
      photo        = document.querySelector('#crate'),
      width = 320,
      height = 0;

  navigator.getMedia = ( navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);

  navigator.getMedia(
    {
      video: true,
      audio: false
    },
    function(stream) {
      if (navigator.mozGetUserMedia) {
        video.mozSrcObject = stream;
      } else {
        var vendorURL = window.URL || window.webkitURL;
        video.src = vendorURL.createObjectURL(stream);
      }
      video.play();
    },
    function(err) {
      console.log("An error occured! " + err);
    }
  );

  video.addEventListener('canplay', function(ev){
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth/width);
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      streaming = true;
    }
  }, false);

  function takepicture() {
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(video, 0, 0, 50, 40);
    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }

  setInterval(takepicture, 70);

})();



function init() {
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2AABB = Box2D.Collision.b2AABB;
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    var b2Fixture = Box2D.Dynamics.b2Fixture;
    var b2World = Box2D.Dynamics.b2World;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    var worldScale = 30;

    var world = new b2World(new b2Vec2(0, 10),true);

    var canvasPosition = getElementPosition(canvas);

    debugDraw();
    window.setInterval(update,1000/60);

   createBox(640,1,320,480,b2Body.b2_staticBody,null);
    createBox(640,1,320,0,b2Body.b2_staticBody,null);
    createBox(1,480,0,240,b2Body.b2_staticBody,null);
    createBox(1,480,640,240,b2Body.b2_staticBody,null);

    canvas.addEventListener("mousedown",function(e){
          setInterval(createRandomBox, 1000);

        //createBox(50,40,e.clientX-canvasPosition.x,e.clientY-canvasPosition.y,b2Body.b2_dynamicBody,document.getElementById("crate"));
    });



    function createRandomBox()
    {
       if (!this.count)
       {
        this.count = 0
       }
       this.count ++;

        var randX = Math.round(Math.random() * 640);
        var randY = 2;

        if (this.count < 130)
        {
          createBox(50,40,randX,randY,b2Body.b2_dynamicBody,document.getElementById("crate"));
        }
    }


    function createBox(width,height,pX,pY,type,data){
        var bodyDef = new b2BodyDef;
        bodyDef.type = type;
        bodyDef.position.Set(pX/worldScale,pY/worldScale);
        bodyDef.userData=data;
        var polygonShape = new b2PolygonShape;
        polygonShape.SetAsBox(width/2/worldScale,height/2/worldScale);
        var fixtureDef = new b2FixtureDef;
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.5;
        fixtureDef.restitution = 0.5;
        fixtureDef.shape = polygonShape;
        var body=world.CreateBody(bodyDef);
        body.CreateFixture(fixtureDef);
    }

    function debugDraw(){
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
        debugDraw.SetDrawScale(30.0);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        //world.SetDebugDraw(debugDraw);
    }

    function update() {
        world.Step(1/60,10,10);
         world.DrawDebugData();
         for(var b = world.m_bodyList; b != null; b = b.m_next){
            if(b.GetUserData()){
                context.save();
                context.translate(b.GetPosition().x*worldScale,b.GetPosition().y*worldScale);
                context.rotate(b.GetAngle());
                context.drawImage(b.GetUserData(),-50/2,-40/2);
                context.restore();
            }
        }
         world.ClearForces();
    };

    //http://js-tut.aardon.de/js-tut/tutorial/position.html
    function getElementPosition(element) {
        var elem=element, tagname="", x=0, y=0;
        while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
            y += elem.offsetTop;
            x += elem.offsetLeft;
            tagname = elem.tagName.toUpperCase();
            if(tagname == "BODY"){
                elem=0;
            }
            if(typeof(elem) == "object"){
                if(typeof(elem.offsetParent) == "object"){
                    elem = elem.offsetParent;
                }
            }
        }
        return {x: x, y: y};
    }

};
init();