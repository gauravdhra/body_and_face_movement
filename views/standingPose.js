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
    const minConfidence = 0.5; // 0.5
    const VIDEO_WIDTH = 700;
    const VIDEO_HEIGHT = 400;
    const frameRate = 20;


    // This configuration  is for video multiple pose detection 
    const imageScaleFactor = 0.50;
    const flipHorizontal = false;
    const outputStride = 8; // 16
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
            if (isDetecting)
                estimateMultiplePoses();
                
        } catch (err) {
            clearInterval(intervalID)
            setErrorMessage(err.message)
        }
    }, Math.round(1000 / frameRate))


    function drawPoint(y, x, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        // ctx.fillStyle = "red";
        // ctx.fillText(Math.round(y),x,y)
    }
    function drawKeypoints(keypoints) {
        for (let i = 0;i < keypoints.length;i++) {
            const keypoint = keypoints[i];
            // console.log(`keypoint in drawkeypoints ${keypoint}`);
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



    function drawEachBodyKeypoints(keypoints) {
        for (let i = 0;i < keypoints.length;i++) {
            const keypoint = keypoints[i];
            // console.log(`keypoint in drawkeypoints ${keypoint}`);
            const { y, x } = keypoint.position;

            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
        }
    }

    function drawEachBodySkeleton(keypoints) {
        const color = "red";
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


    const countStudentsRaisingHands = (rasingHandStudents) => {
        $('#rasing_hands_students').val(rasingHandStudents)

        json_output.data.summary_statistics.actions.hands_raised = rasingHandStudents

        $('#realData').text(JSON.stringify(json_output))

    }
    const countStandingPoses = (totalStandingStudents) => {
        $('#standing_student').val(totalStandingStudents)

        json_output.data.summary_statistics.postures.standing = totalStandingStudents
        json_output.data.summary_statistics.postures.sitting = json_output.total_students - totalStandingStudents

        $('#realData').text(JSON.stringify(json_output))

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

            })
            .then(function (poses) {
                // console.log(`got Poses ${JSON.stringify(poses)}`);
                canvas.width = video.width;
                canvas.height = video.height;
                // canvas.width = VIDEO_WIDTH;
                // canvas.height = VIDEO_HEIGHT;
                ctx.clearRect(0, 0, video.width, video.height);
                ctx.save();
                // ctx.drawImage(video, 0, 0, video.width, video.height);
                // ctx.restore();
                let totalStandingStudents = 0
                let rasingHandStudents = 0
                poses.forEach(({ score, keypoints }) => {

                    let leftEye = keypoints[1]['position']
                    let rightEye = keypoints[2]['position']
                    let leftShoulder = keypoints[5]['position']
                    let rightShoulder = keypoints[6]['position']

                    let leftHip = keypoints[11]['position']
                    let rightHip = keypoints[12]['position']
                    

                    let leftElbow = keypoints[7]['position']
                    let rightElbow = keypoints[8]['position']
                    
                    let leftWrist = keypoints[9]['position']
                    let rightWrist = keypoints[10]['position']

                    
                    let leftWristDistanceX = Math.abs(leftShoulder['y'] - leftWrist['y']);
                    let rightWristDistanceY = Math.abs(rightShoulder['y'] - rightWrist['y']);

                    let leftHIPDistanceY = (leftHip['y'] - leftShoulder['y']);
                    let rightHIPDistanceY = (rightHip['y'] - rightShoulder['y']);
                    
                    // Measurement to find raised hands of students/body (wrist's and shoulder's 'Y' position )
                    let leftWristRaisedDistance = (leftShoulder['y'] - leftWrist['y']);
                    let rightWristRaisedDistance = (rightShoulder['y'] - rightWrist['y'])
                    console.log(leftWristRaisedDistance + " ****** " + rightWristRaisedDistance)

                    // if (Math.sign(rightWristRaisedDistance) == 1) {
                    //     rasingHandStudents++
                    //     drawKeypoints(keypoints);
                    //     drawSkeleton(keypoints);
                    // }
                    // else if (Math.sign(leftWristRaisedDistance) == 1) {
                    //     rasingHandStudents++
                    //     drawKeypoints(keypoints);
                    //     drawSkeleton(keypoints);
                    // }

                    if (score >= minConfidence && leftWristDistanceX < 250 && rightWristDistanceY < 250 && leftWristDistanceX > 80 && rightWristDistanceY > 80) {
                        totalStandingStudents++
                        drawKeypoints(keypoints);
                        drawSkeleton(keypoints);
                    }
                    // if (
                    //     score >= minConfidence &&
                    //     // (leftWristDistanceX < 250 || rightWristDistanceY < 250)
                    //     //  &&
                    //     (leftWristDistanceX > 40 || rightWristDistanceY > 40)
                    //      &&
                    //     // (leftHIPDistanceY < 180 || rightHIPDistanceY < 180)
                    //     // &&
                    //     (leftHIPDistanceY > 40 || rightHIPDistanceY > 40)
                    // ) {
                    //     totalStandingStudents++
                    //     drawKeypoints(keypoints);
                    //     drawSkeleton(keypoints);
                    // }
                    // else {
                    //     drawEachBodyKeypoints(keypoints);
                    //     drawEachBodySkeleton(keypoints);
                    // }

                });
                countStudentsRaisingHands(rasingHandStudents);
                countStandingPoses(totalStandingStudents);
            });
    };


};