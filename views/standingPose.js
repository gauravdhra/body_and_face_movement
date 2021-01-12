// var jQueryScript = document.createElement('script');
// jQueryScript.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js');
// document.head.appendChild(jQueryScript);
// var  jQueryScript2 = document.createElement('script');
// jQueryScript.setAttribute('src', 'https://unpkg.com/@tensorflow/tfjs');
// document.head.appendChild(jQueryScript2);
//  var jQueryScript3 = document.createElement('script');
// jQueryScript.setAttribute('src', 'https://unpkg.com/@tensorflow-models/posenet');
// document.head.appendChild(jQueryScript3);


// const video = document.getElementById("video");
// const canvas = document.getElementById("canvas");

// var fileupload = $("#fileUpload");

// fileupload.change(function () {
//     video.src = URL.createObjectURL(this.files[0]);
//     video.load();
//     startPoseNet();
//     // startFaceDetect();
//     // startFaceMesh();
// });


// const playVideo = () => {
//     document.getElementById("video").currentTime = 0;
//     document.getElementById("video").play();
// }
const startPoseNet = (video, canvas) => {
    'use strict';
    // const TWILIO_DOMAIN = location.host;
    const ROOM_NAME = 'tf';
    // const Video = Twilio.Video;
    let videoRoom, localStream;
    const ctx = canvas.getContext("2d");
    const maxPoseDetect = 20;
    const minConfidence = 0.5;
    const VIDEO_WIDTH = 700;
    const VIDEO_HEIGHT = 400;
    const frameRate = 20;


    // This configuration  is for video multiple pose detection 
    const imageScaleFactor = 0.50;
    const flipHorizontal = false;
    const outputStride = 16;
    //  const outputStride = 32;
    // get up to 20 poses
    const maxPoseDetections = 20;
    // minimum confidence of the root part of a pose
    const scoreThreshold = 0.5;
    // minimum distance in pixels between the root parts of poses
    const nmsRadius = 20;
    const multiplier = 0.75;
    const architecture = 'MobileNetV1';

    const intervalID = setInterval(async () => {
        try {
            estimateMultiplePoses();
        } catch (err) {
            clearInterval(intervalID)
            setErrorMessage(err.message)
        }
    }, Math.round(1000 / frameRate))


    // preview screen
    // navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    //   .then(vid => {
    //     video.srcObject = vid;
    //     localStream = vid;
    //     const intervalID = setInterval(async () => {
    //       try {
    //         estimateMultiplePoses();
    //       } catch (err) {
    //         clearInterval(intervalID)
    //         setErrorMessage(err.message)
    //       }
    //     }, Math.round(1000 / frameRate))
    //     return () => clearInterval(intervalID)
    //   });
    function drawPoint(y, x, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
    }
    function drawKeypoints(keypoints) {
        for (let i = 0; i < keypoints.length; i++) {
            const keypoint = keypoints[i];
            console.log(`keypoint in drawkeypoints ${keypoint}`);
            const { y, x } = keypoint.position;
            drawPoint(y, x, 3);
        }
    }
    function drawSegment(
        pair1,
        pair2,
        color,
        scale
    ) {
        ctx.beginPath();
        ctx.moveTo(pair1.x * scale, pair1.y * scale);
        ctx.lineTo(pair2.x * scale, pair2.y * scale);
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    function drawSkeleton(keypoints) {
        const color = "#FFFFFF";
        const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
            keypoints,
            minConfidence
        );

        adjacentKeyPoints.forEach((keypoint) => {
            drawSegment(
                keypoint[0].position,
                keypoint[1].position,
                color,
                1,
            );
        });
    }
    const showStandingPoses = (totalStandingStudents) => {
        $('#standing_student').val(totalStandingStudents)
        // $('standing').val = 1
        // setTimeout(() => {
        //     $('standing').val = 0
        // }, 2000)
    }
    const estimateMultiplePoses = () => {
        posenet.load({
            architecture: architecture,
            outputStride: outputStride,
            inputResolution: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT },
            multiplier: multiplier
        })
            .then(function (net) {
                // console.log("estimateMultiplePoses .... ");
                return net.estimateMultiplePoses(video, {
                    flipHorizontal: flipHorizontal,
                    maxDetections: maxPoseDetections,
                    // imageScaleFactor: imageScaleFactor,
                    // outputStride: outputStride,
                    scoreThreshold: scoreThreshold,
                    nmsRadius: nmsRadius
                })
                // return net.estimateMultiplePoses(
                //   video, imageScaleFactor, flipHorizontal, outputStride,
                //   maxPoseDetections, scoreThreshold, nmsRadius);
                // return net.estimatePoses(video, {
                //   decodingMethod: "multi-person",
                // });
            })
            .then(function (poses) {
                // console.log(`got Poses ${JSON.stringify(poses)}`);
                canvas.width = video.width;
                canvas.height = video.height;
                // canvas.width = VIDEO_WIDTH;
                // canvas.height = VIDEO_HEIGHT;
                ctx.clearRect(0, 0, video.width, video.height);
                ctx.save();
                ctx.drawImage(video, 0, 0, video.width, video.height);
                ctx.restore();
                let totalStandingStudents = 0
                poses.forEach(({ score, keypoints }) => {

                    let leftShoulder = keypoints[5]['position']
                    let rightShoulder = keypoints[6]['position']
                    let leftWrist = keypoints[9]['position']
                    let rightWrist = keypoints[10]['position']

                    let leftWristDistanceX = Math.abs(leftShoulder['y'] - leftWrist['y']);
                    let rightWristDistanceY = Math.abs(rightShoulder['y'] - rightWrist['y']);



                    if (score >= minConfidence && leftWristDistanceX < 250 && rightWristDistanceY < 250 && leftWristDistanceX > 80 && rightWristDistanceY > 80) {
                        totalStandingStudents++
                        drawKeypoints(keypoints);
                        drawSkeleton(keypoints);
                    }
                });
                showStandingPoses(totalStandingStudents);
            });
    };

    // buttons
    const joinRoomButton = document.getElementById("button-join");
    const leaveRoomButton = document.getElementById("button-leave");
    // var site = `https://${TWILIO_DOMAIN}/video-token`;
    // console.log(`site ${site}`);

};