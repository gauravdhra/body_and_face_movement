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
let standingStudents =0;
let lastPositionOfRightear =0;
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
    startDetecting();
    video.play();
    loop()
}
function stopDrawing() {
    stopDetecting();
    video.stop();
    noLoop();
}
function getVideo() {
    return video
}
function setup() {
    console.log ('ml5 version:', ml5.version)
        
    videoIsPlaying = false;
    
    videoInput = createFileInput(handleFile);
    videoInput.position(0, 0);
    console.log(videoInput)
}


function handleFile(file) {
    print(file);
    if (file.type === 'video') {
        const canvas = createCanvas(700, 400);

        var $source = $('#video_here');
        $source[0].src = URL.createObjectURL(file.file);
        $source.parent()[0].load();

        video = createVideo(file.data, onLoad);
        video.onended = onVideoEnded
        video.size(700, 400);
        video.hide();
        
    } else {
        video = null;
    } 
}
function onVideoEnded() {
    alert('ended')
    noLoop();
};
function onLoad() {
    if(video !=null){
        // video.stop();
        // video.loop();
        video.width =  700
        videoIsPlaying = true;
        isVideoLoaded = true
        poseNet = ml5.poseNet(video, options, modelReady);
        poseNet.on('pose', function (results) {
            console.log(results)
            poses = results;
        });
         video.play();

    }
}
function draw() {
    if (isVideoLoaded == true){
        video.width = 700;
        video.height = 400;
        filter('GRAY');
        image(video, 0, 0, width, height);
        drawKeypoints();
    }
    // We can call both functions to draw all keypoints and the skeletons
    // drawSkeleton();
}
function modelReady() {
    select('#status').html('model Loaded')
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
       
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
             if (pose.score > 0.55 && leftWristDistanceX < 250 && rightWristDistanceY < 250 && leftWristDistanceX > 95 && rightWristDistanceY > 95) {
                let rightEarX
                // if (pose.score > 0.7){"0.7-",console.log(pose.score)}
                // if (pose.score > 0.8){"0.8-",console.log(pose.score)}
                    rightEarX = pose.keypoints[4]['position']['x'];
                let distance = Math.abs(lastPositionOfRightear - rightEarX)
                console.log(distance)
                // if (pose.score > 0.9 && (distance > 42 || distance < -42)){
                if ((distance > 42)){
                    standingStudents++
                }
                console.log(pose.keypoints[4]['position']['x']);
                $('#standing_student').val(standingStudents)
                for (let j = 0; j < pose.keypoints.length; j++) {
                    let keypoint = pose.keypoints[j];
                    // Only draw an ellipse is the pose probability is bigger than 0.2
                    // if (keypoint.score > 0.2) {
                        fill(255, 0, 0);
                        noStroke();
                        ellipse(keypoint.position.x, keypoint.position.y, 10,10);
                    // }
                }
                lastPositionOfRightear = rightEarX
            }
            else{
                for (let j = 0; j < pose.keypoints.length; j++) {
                    let keypoint = pose.keypoints[j];
                    // Only draw an ellipse is the pose probability is bigger than 0.2
                    // if (keypoint.score > 0.2) {
                    // console.log("00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
                        fill(255, 255, 255);
                        noStroke();
                        ellipse(keypoint.position.x, keypoint.position.y, 6,6);
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