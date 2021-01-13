var json_output = {
    "id": "abcdefg",
    "current_face_pose": {
        "top": 0,
        "left": 0,
        "right": 0,
        "front": 0,
        "down": 0,
    },
    "video_meta": {
        "id": "video_id",
        "path": "url",
        "name": "name_of_video_file",
        "length": 0,
        "total_frames": 0,
        "recording_device": {
            "type": "camera",
            "position": "front"
        }
    },
    "item_ordinal": 1,
    "total_students": 0,
    "maximum_focus_0f_student": 0,
    "frames_computed": 24,
    "data": {
        "total_students_detected": 50,
        "summary_statistics": {
            "postures": {
                "standing": 0,
                "sitting": 0,
                "lying": 0,
                "walking": 0
            },
            "actions": {
                "hands_raised": 2,
                "yawning": 1,
                "laughing": 5,
                "speaking": 1,
                "writing": 5
            },
            "gaze_subject": {
                "main_subject": 39,
                "desk": 5,
                "other": 6
            },
            "position": {
                "front": 15,
                "center": 15,
                "back": 20
            }
        },
        "student_details": [
            {
                "id": "student_rand_id1",
                "data": {
                    "posture": "standing/sitting/lying",
                    "actions": {
                        "hands_raised": true,
                        "yawning": false,
                        "laughing": true,
                        "speaking": false,
                        "writing": false
                    },
                    "gaze_subject": "main_subject/desk/other"
                },
                "position": "front/center/back"
            },
            {
                "id": "student_rand_id2",
                "data": {
                    "posture": "standing/sitting/lying",
                    "actions": {
                        "hands_raised": true,
                        "yawning": false,
                        "laughing": true,
                        "speaking": false,
                        "writing": false
                    },
                    "gaze_subject": "main_subject/desk/other"
                },
                "position": "front/center/back"
            },
            {
                "id": "student_rand_id3",
                "data": {
                    "posture": "standing/sitting/lying",
                    "actions": {
                        "hands_raised": true,
                        "yawning": false,
                        "laughing": true,
                        "speaking": false,
                        "writing": false
                    },
                    "gaze_subject": "main_subject/desk/other"
                },
                "position": "front/center/back"
            }
        ]
    },
    "created_timestamp": 123123123,
    "updated_timestamp": 123123123
}