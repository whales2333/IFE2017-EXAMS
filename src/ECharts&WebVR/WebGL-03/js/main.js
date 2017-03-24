;(function(window){

    var renderer, scene, camera;
    
    init();
    autoRefresh();
    
    function init(){

        // 创建透视摄像机，设置摄像机长宽比为窗口比例
        camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 5000);
        camera.position.set(0,200,0);

        // 新建空场景
        scene = new THREE.Scene();

        var light1 = new THREE.PointLight( 0xACFFAA, 0.7, 500 );
        light1.position.set(200,50,-100);
		scene.add( light1 );

        var light2 = new THREE.PointLight( 0xF7FFBF, 0.8, 500 );
        light2.position.set(0,150,200);
		scene.add( light2 );


        var light3 = new THREE.PointLight( 0xFFFFFF, 1, 500 );
        light3.position.set(-200,150,-100);
		scene.add( light3 );

        // 加载 obj 模型和贴图
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('./obj/');
        mtlLoader.load('car.mtl', function(materials){

            materials.preload();

            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('./obj/');
            objLoader.load('car.obj', function(object){
                object.castShadow = true;
                object.receiveShadow = true;
                scene.add(object);
            })

        });

        // 加载地面纹理贴图
        var texture_floor = new THREE.TextureLoader().load('./textures/floor.jpg');
        texture_floor.wrapS = THREE.RepeatWrapping;
        texture_floor.wrapT = THREE.RepeatWrapping;
        texture_floor.repeat.set( 25, 25 );

        // 创建平面作为地面，赋予兰伯特材质
        var floor = new THREE.Mesh(
            new THREE.PlaneGeometry(5000,5000),
            new THREE.MeshLambertMaterial({
                map: texture_floor
            })
        );
        // 设置地面产生和接收阴影
        floor.castShadow = true;
        floor.receiveShadow  = true;

        floor.rotation.set(-90*Math.PI/180,0,0)
        floor.position.set(0,-114,0);
        scene.add(floor);

        // 加载背景纹理贴图
        var texture_bg = new THREE.TextureLoader().load('./textures/bg.jpg');

        // 创建平面作为地面，赋予兰伯特材质
        var bg = new THREE.Mesh(
            new THREE.PlaneGeometry(4000,1200),
            new THREE.MeshLambertMaterial({
                map: texture_bg
            })
        );
        // 设置地面产生和接收阴影
        bg.castShadow = true;
        bg.receiveShadow  = true;

        bg.rotation.set(0,-25*Math.PI/180,0)
        bg.position.set(200,420,-1000);
        scene.add(bg);


        // 初始化渲染器
        renderer = new THREE.WebGLRenderer();

        // 设置允许渲染阴影
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        renderer.setPixelRatio(window.devicePixelRatio);
        // 设置渲染画面大小为窗口大小
        renderer.setSize(window.innerWidth, window.innerHeight);
        // 生成canvas添加到body中
        document.body.appendChild(renderer.domElement);

        // 开始渲染
        renderer.render(scene, camera);

        // 添加窗口大小改变监听，使摄像机长宽比、渲染画面大小和窗口一致
        window.addEventListener('resize', onWindowResize, false);

    }

    function onWindowResize(){
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.render(scene, camera);

    }

    function autoRefresh(){

        requestAnimationFrame(autoRefresh);
        renderer.render(scene, camera);

    }

    



})(window);