let video;
let poseNet;
let poses = [];
let videoInput;
let videoIsPlaying
let multiType = 'multiple'
let singleType = 'single'
let canvas;
let ctx;
let realVideo;
let isVideoLoaded = false;
let options = {
    architecture: 'MobileNetV1',
    imageScaleFactor: 0.3,
    outputStride: 16,
    flipHorizontal: false,
    minConfidence: 0.5,
    maxPoseDetections: 20,
    scoreThreshold: 0.1,
    nmsRadius: 20,
    detectionType: 'multiple',
    inputResolution: 513,
    multiplier: 0.75,
    quantBytes: 2,
};
function startDrawing() {
    video.play();
    loop()
}
function stopDrawing() {
    video.stop();
    noLoop();
}
function setup() {
    console.log('ml5 version:', ml5.version)
    // // noLoop()
    // canvas = document.getElementById('overlay');    ctx = canvas.getContext('2d');
    // // ctx.moveTo(0, 0);

    // // ctx.lineTo(300, 150);
    // // ctx.stroke();

    // realVideo = document.getElementById('inputVideo');
    // console.log("realVideo.width ---"+realVideo.width)
    // // realVideo.width = realVideo.videoWidth;
    // // canvas.width = realVideo.videoWidth;
    // // canvas.height = realVideo.videoHeight;

    // // realVideo.height = window.innerWidth;
    // // realVideo.height = 400;
    // // setTimeout(function(){
    // //             console.log("video loaded")
    // //     poseNet = ml5.poseNet(realVideo, options, modelReady);
    // //     // This sets up an event that fills the global variable "poses"
    // //     // with an array every time new poses are detected
    // //     poseNet.on('pose', function (results) {
    // //         console.log("results.length-", results.length)
    // //         console.log("results", results)
    // //         poses = results;
    // //     });

    // // },2000)
    // realVideo.loadedmetadata = function () { 
    //     console.log("video loaded", realVideo.width)
    //     // canvas.width = realVideo.videoWidth;
    //     // canvas.height = realVideo.videoHeight;

    //     realVideo.width = realVideo.videoWidth;
    //     // realVideo.height = realVideo.videoHeight;

    //     poseNet = ml5.poseNet(realVideo, options, modelReady);
    //     // This sets up an event that fills the global variable "poses"
    //     // with an array every time new poses are detected
    //     poseNet.on('pose', function (results) {
    //         console.log("results.length-", results.length)
    //         console.log("results", results)
    //         poses = results;
    //     });

    //  };


    //  noCanvas();

    videoIsPlaying = false;


    videoInput = createFileInput(handleFile);
    videoInput.position(0, 0);


    // pixelDensity(1)
    // var ctx = canvas.getContext('2d');
    // ctx.drawImage($this, 50, 10, 100, 100);
    // canvas.style('width','100%');
    // createGraphics(700, 500);
    // canvas.parent('videoContainer');
    // Video capture
    // video = createCapture(VIDEO);
    // video = document.getElementById('video');
    // Create a new poseNet method with a single detection

    // Hide the video element, and just show the canvas
    // video.hide();
}


function handleFile(file) {
    print(file);
    if (file.type === 'video') {
        const canvas = createCanvas(700, 400);

        video = createVideo(file.data, onLoad);
        // http://92.253.126.199:5000/standing.mp4
        // video.size(width, height);
        video.size(700, 400);
        // faceapi = ml5.faceApi(video, detection_options, modelLoaded)



        // img = createImg(file.data, '');
        // video.hide();

    } else {
        video = null;
    }
}
function onLoad() {
    if (video != null) {
        // video.stop();
        // video.loop();
        video.width = 700
        videoIsPlaying = true;
        isVideoLoaded = true
        poseNet = ml5.poseNet(video, options, modelReady);
        // This sets up an event that fills the global variable "poses"
        // with an array every time new poses are detected
        poseNet.on('pose', function (results) {
            console.log(results)
            poses = results;
        });
        // This function is called when the video loads
        //  print("start auto play after load");
        //  video.play();

    }
}
function draw() {
    if (isVideoLoaded == true) {
        // console.log("draw")
        // image(video, 0, 0, width, height);
        // drawKeypoints();


        video.width = 700;
        video.height = 400;
        filter('GRAY');
        image(video, 0, 0, width, height);
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawKeypoints();
        // if (canvas.getContext) {
        // var X = canvas.width / 2;
        // var Y = canvas.height / 2;
        // var R = 45;
        // ctx.beginPath();
        // ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
        // ctx.lineWidth = 3;
        // ctx.strokeStyle = '#FF0000';
        // ctx.stroke();
        //     video.width = 700;
        //     video.height = 400;

        // }
        // ctx.beginPath();
        // ctx.moveTo(0, 0);
        // ctx.lineTo(300, 150);
        // ctx.drawImage(video, 0, 0, 700, 400);
        // console.log("line draw")
        // video.width = 700;
        // video.height = 400;
        // filter('GRAY');
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        // drawKeypoints(ctx);

    }
    // image(video, 0, 0, width, height, 700, 00, 200, 300);


    // let leftShoulder = keypoints[5]['position']
    // let leftElbow = keypoints[7]['position']
    // let leftWrist = keypoints[9]['position']

    // let rightShoulder = keypoints[6]['position']
    // let rightElbow = keypoints[8]['position']
    // let rightWrist = keypoints[10]['position']

    // // let leftElbowDistanceX = Math.abs(leftShoulder['y'] - leftElbow['y']);
    // let leftWristDistanceX = Math.abs(leftShoulder['y'] - leftWrist['y']);

    // // let rightElbowDistanceY = Math.abs(leftShoulder['y'] - leftElbow['y']);
    // let rightWristDistanceY = Math.abs(rightShoulder['y'] - rightWrist['y']);
    // console.log("leftWristDistanceX", leftWristDistanceX)
    // console.log("rightWristDistanceY", rightWristDistanceY)
    // if (leftWristDistanceX < 250 && rightWristDistanceY < 250 && leftWristDistanceX > 95 && rightWristDistanceY > 95) {




    // We can call both functions to draw all keypoints and the skeletons
    // drawSkeleton();
}
function modelReady() {
    select('#status').html('model Loaded')
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
    // console.log("drawKeypoints")
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
        // For each pose detected, loop through all the keypoints
        let pose = poses[i].pose;

        let leftShoulder = pose.keypoints[5]['position']
        let leftElbow = pose.keypoints[7]['position']
        let leftWrist = pose.keypoints[9]['position']

        let rightShoulder = pose.keypoints[6]['position']
        let rightElbow = pose.keypoints[8]['position']
        let rightWrist = pose.keypoints[10]['position']

        let leftElbowDistanceX = Math.abs(leftShoulder['y'] - leftElbow['y']);
        let leftWristDistanceX = Math.abs(leftShoulder['y'] - leftWrist['y']);

        let rightElbowDistanceY = Math.abs(leftShoulder['y'] - leftElbow['y']);
        let rightWristDistanceY = Math.abs(rightShoulder['y'] - rightWrist['y']);
        // console.log("leftWristDistanceX", leftWristDistanceX)
        // console.log("rightWristDistanceY", rightWristDistanceY)
        if (leftWristDistanceX < 250 && rightWristDistanceY < 250 && leftWristDistanceX > 95 && rightWristDistanceY > 95) {
            for (let j = 0; j < pose.keypoints.length; j++) {
                // console.log(pose.keypoints)
                // A keypoint is an object describing a body part (like rightArm or leftShoulder)
                let keypoint = pose.keypoints[j];
                // Only draw an ellipse is the pose probability is bigger than 0.2
                // if (keypoint.score > 0.2) {
                fill(255, 0, 0);
                //     ctx.clearRect(0, 0, canvas.width, canvas.height);

                //     ctx.beginPath();
                //     ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 9 * Math.PI,false);
                //     ctx.fillStyle ='green';
                //     ctx.fill();
                // // ctx.moveTo(keypoint.position.x+5)
                //     ctx.stroke();


                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
                // }
            }
        }
        else {
            for (let j = 0; j < pose.keypoints.length; j++) {
                // console.log(pose.keypoints)
                // A keypoint is an object describing a body part (like rightArm or leftShoulder)
                let keypoint = pose.keypoints[j];
                // Only draw an ellipse is the pose probability is bigger than 0.2
                // if (keypoint.score > 0.2) {
                // console.log("00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
                fill(255, 255, 255);
                //     ctx.beginPath();
                //     ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 9 * Math.PI,false);
                //     ctx.fillStyle = 'red';
                //     ctx.fill();
                //     ctx.stroke();

                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 6, 6);
                // }
            }

        }



    }
}

// A function to draw the skeletons
function drawSkeleton() {
    console.log("drawSkeleton")

    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i++) {
        let skeleton = poses[i].skeleton;

        // For every skeleton, loop through all body connections
        for (let j = 0; j < skeleton.length; j++) {

            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            stroke(255, 0, 0);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}