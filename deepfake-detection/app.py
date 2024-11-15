from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import cv2
import numpy as np
import os

app = Flask(__name__)
model = load_model("xception_deepfake_model.h5")  # Load pre-trained model

UPLOAD_FOLDER = "./uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def detect_image(file_path):
    img = image.load_img(file_path, target_size=(299, 299))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0
    prediction = model.predict(img_array)[0][0]
    return {"fake": prediction > 0.5, "confidence": prediction if prediction > 0.5 else 1 - prediction}

def detect_video(file_path):
    cap = cv2.VideoCapture(file_path)
    frame_count = 0
    fake_count = 0
    real_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.resize(frame, (299, 299)) / 255.0
        frame = np.expand_dims(frame, axis=0)
        prediction = model.predict(frame)[0][0]

        frame_count += 1
        if prediction > 0.5:
            fake_count += 1
        else:
            real_count += 1

    cap.release()
    total_frames = fake_count + real_count
    fake_confidence = fake_count / total_frames if total_frames else 0
    real_confidence = real_count / total_frames if total_frames else 0
    return {
        "fake": fake_count > real_count,
        "fake_frames": fake_count,
        "real_frames": real_count,
        "fake_confidence": fake_confidence,
        "real_confidence": real_confidence,
    }