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
const detection_options = {
    withLandmarks: true,
    withDescriptors: true,
    Mobilenetv1Model: "models",
    FaceLandmarkModel: "models",
    FaceRecognitionModel: "models",
    // MODEL_URLS: {
    //     Mobilenetv1Model: 'https://raw.githubusercontent.com/ml5js/ml5-data-and-models/main/models/faceapi/ssd_mobilenetv1_model-weights_manifest.json',
    //     FaceLandmarkModel: 'https://raw.githubusercontent.com/ml5js/ml5-data-and-models/main/models/faceapi/face_landmark_68_model-weights_manifest.json',
    //     FaceLandmark68TinyNet: 'https://raw.githubusercontent.com/ml5js/ml5-data-and-models/main/models/faceapi/face_landmark_68_tiny_model-weights_manifest.json',
    //     FaceRecognitionModel: 'https://raw.githubusercontent.com/ml5js/ml5-data-and-models/main/models/faceapi/face_recognition_model-weights_manifest.json',
    // },
};
// Initialize the magicFeature
var faceapi;
// var options = {
//     detectionType: 'multiple',
//     maxPoseDetections: 15,
// }
// var videoFile = document.getElementById('uploadVideo');
// videoFile.addEventListener("change", function (e) {
//     console.log(this.files[0]);
// });
function startDrawing() {
    video.play();
    loop()
}
function stopDrawing() {
    video.stop();
    noLoop();
}
function modelLoaded() {
    console.log('Model Loaded!!!!');
    faceapi.detect(gotFaceResults)
    // Make some sparkles
}
function setup() {
    console.log("Setup")
    console.log('ml5 version:', ml5.version)
    // noLoop()
    canvas = document.getElementById('overlay');


    ctx = canvas.getContext('2d');
    // ctx.moveTo(0, 0);

    // ctx.lineTo(300, 150);
    // ctx.stroke();

    realVideo = document.getElementById('inputVideo');
    console.log("realVideo.width ---" + realVideo.width)
    // realVideo.width = realVideo.videoWidth;
    // canvas.width = realVideo.videoWidth;
    // canvas.height = realVideo.videoHeight;

    // realVideo.height = window.innerWidth;
    // realVideo.height = 400;
    // setTimeout(function(){
    //             console.log("video loaded")
    //     poseNet = ml5.poseNet(realVideo, options, modelReady);
    //     // This sets up an event that fills the global variable "poses"
    //     // with an array every time new poses are detected
    //     poseNet.on('pose', function (results) {
    //         console.log("results.length-", results.length)
    //         console.log("results", results)
    //         poses = results;
    //     });

    // },2000)
    realVideo.loadedmetadata = function () {
        console.log("video loaded", realVideo.width)
        // canvas.width = realVideo.videoWidth;
        // canvas.height = realVideo.videoHeight;

        realVideo.width = realVideo.videoWidth;
        // realVideo.height = realVideo.videoHeight;

        poseNet = ml5.poseNet(realVideo, options, modelReady);
        // This sets up an event that fills the global variable "poses"
        // with an array every time new poses are detected
        poseNet.on('pose', function (results) {
            console.log("results.length-", results.length)
            console.log("results", results)
            poses = results;
        });

    };

    // realVideo.addEventListener('loadeddata', function () {
    //     console.log("video loaded")
    //     poseNet = ml5.poseNet(realVideo, options, modelReady);
    //     // This sets up an event that fills the global variable "poses"
    //     // with an array every time new poses are detected
    //     poseNet.on('pose', function (results) {
    //         console.log("results.length-", results.length)
    //         console.log("results", results)
    //         poses = results;
    //     });
    //     }, false);

    videoIsPlaying = false;

    // const canvas = createCanvas(700, 400);
    noCanvas();

    // videoInput = createFileInput(handleFile);
    // videoInput.position(0, 0);


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
function drawVideo(v) {
    console.log("888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888")
    // if (v.paused || v.ended) return false;
    // ctx.drawImage(v, 0, 0, 700,400);
    // setTimeout(draw, 20, v);
}

function handleFile(file) {
    print(file);
    if (file.type === 'video') {
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
function gotFaceResults(err, result) {
    if (err) {
        console.log(err)
        return
    }
    // console.log(result)
    detections = result;

    // background(220);
    background(255);


    video.width = 700;
    video.height = 400;

    image(video, 0, 0, width, height)
    if (detections) {
        if (detections.length > 0) {
            console.log("detections-", detections)
            // drawBox(detections)
            // drawLandmarks(detections)
        }

    }
    faceapi.detect(gotFaceResults)
}
function onLoad() {
    video.stop();
    // video.loop();
    videoIsPlaying = true;
    poseNet = ml5.poseNet(video, options, modelReady);
    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on('pose', function (results) {
        console.log(results.length)
        poses = results;
    });
    // This function is called when the video loads
    //  print("start auto play after load");
    //  video.play();
}
function drawBox(detections) {
    for (let i = 0; i < detections.length; i++) {
        const alignedRect = detections[i].alignedRect;
        const x = alignedRect._box._x
        const y = alignedRect._box._y
        const boxWidth = alignedRect._box._width
        const boxHeight = alignedRect._box._height

        noFill();
        stroke(161, 95, 251);
        strokeWeight(2);
        rect(x, y, boxWidth, boxHeight);
    }

}
function draw() {


    if (realVideo != null) {
        // console.log("draw")


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
        // image(video, 0, 0, width, height);
        // filter('GRAY');
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawKeypoints(ctx);
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
function drawKeypoints(ctx) {
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
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.beginPath();
                ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 9 * Math.PI, false);
                ctx.fillStyle = 'green';
                ctx.fill();
                // ctx.moveTo(keypoint.position.x+5)
                ctx.stroke();
                // noStroke();
                // ellipse(keypoint.position.x, keypoint.position.y, 10,10);
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
                console.log("00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
                fill(255, 255, 255);
                ctx.beginPath();
                ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 9 * Math.PI, false);
                ctx.fillStyle = 'red';
                ctx.fill();
                ctx.stroke();

                // noStroke();
                // ellipse(keypoint.position.x, keypoint.position.y, 6,6);
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

// let options = {
//     architecture: 'MobileNetV1',
//     imageScaleFactor: 0.3,
//     outputStride: 16,
//     flipHorizontal: false,
//     minConfidence: 0.5,
//     maxPoseDetections: 20,
//     scoreThreshold: 0.1,
//     nmsRadius: 20,
//     detectionType: 'multiple',
//     inputResolution: 513,
//     multiplier: 0.75,
//     quantBytes: 2,
// };


// const video = document.getElementById("inputVideo");

// // Create a new poseNet method

// var canvas = document.getElementById('overlay');
// var ctx = canvas.getContext('2d');

// video.onplay = function () {
//     const poseNet = ml5.poseNet(video, modelLoaded);

//     console.log("video loaded", video.width)
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     video.width = video.videoWidth;
//     video.height = video.videoHeight;

//     poseNet = ml5.poseNet(video, options, modelReady);
//     // This sets up an event that fills the global variable "poses"
//     // with an array every time new poses are detected
//     poseNet.on('pose', function (results) {
//         console.log("results.length-", results.length)
//         console.log("results", results)
//         poses = results;
//         drawKeypoints();
//     });

// };



// // When the model is loaded
// function modelLoaded() {
//     console.log("Model Loaded!");
// }
// // Listen to new 'pose' events




// function drawKeypoints(ctx) {
//     // console.log("drawKeypoints")
//     // Loop through all the poses detected
//     for (let i = 0; i < poses.length; i++) {
//         // For each pose detected, loop through all the keypoints
//         let pose = poses[i].pose;

//         let leftShoulder = pose.keypoints[5]['position']
//         let leftElbow = pose.keypoints[7]['position']
//         let leftWrist = pose.keypoints[9]['position']

//         let rightShoulder = pose.keypoints[6]['position']
//         let rightElbow = pose.keypoints[8]['position']
//         let rightWrist = pose.keypoints[10]['position']

//         let leftElbowDistanceX = Math.abs(leftShoulder['y'] - leftElbow['y']);
//         let leftWristDistanceX = Math.abs(leftShoulder['y'] - leftWrist['y']);

//         let rightElbowDistanceY = Math.abs(leftShoulder['y'] - leftElbow['y']);
//         let rightWristDistanceY = Math.abs(rightShoulder['y'] - rightWrist['y']);
//         // console.log("leftWristDistanceX", leftWristDistanceX)
//         // console.log("rightWristDistanceY", rightWristDistanceY)
//         if (leftWristDistanceX < 250 && rightWristDistanceY < 250 && leftWristDistanceX > 95 && rightWristDistanceY > 95) {
//             for (let j = 0; j < pose.keypoints.length; j++) {
//                 // console.log(pose.keypoints)
//                 // A keypoint is an object describing a body part (like rightArm or leftShoulder)
//                 let keypoint = pose.keypoints[j];
//                 // Only draw an ellipse is the pose probability is bigger than 0.2
//                 // if (keypoint.score > 0.2) {
//                 fill(255, 0, 0);
//                 ctx.clearRect(0, 0, canvas.width, canvas.height);

//                 ctx.beginPath();
//                 ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 9 * Math.PI, false);
//                 ctx.fillStyle = 'green';
//                 ctx.fill();
//                 // ctx.moveTo(keypoint.position.x+5)
//                 ctx.stroke();
//                 // noStroke();
//                 // ellipse(keypoint.position.x, keypoint.position.y, 10,10);
//                 // }
//             }
//         }
//         else {
//             for (let j = 0; j < pose.keypoints.length; j++) {
//                 // console.log(pose.keypoints)
//                 // A keypoint is an object describing a body part (like rightArm or leftShoulder)
//                 let keypoint = pose.keypoints[j];
//                 // Only draw an ellipse is the pose probability is bigger than 0.2
//                 // if (keypoint.score > 0.2) {
//                 console.log("00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
//                 fill(255, 255, 255);
//                 ctx.beginPath();
//                 ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 9 * Math.PI, false);
//                 ctx.fillStyle = 'red';
//                 ctx.fill();
//                 ctx.stroke();

//                 // noStroke();
//                 // ellipse(keypoint.position.x, keypoint.position.y, 6,6);
//                 // }
//             }

//         }



//     }
// }
