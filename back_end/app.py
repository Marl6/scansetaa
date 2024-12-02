from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import base64
from PIL import Image
from io import BytesIO
import tensorflow as tf
import numpy as np
import pickle
import cv2
import traceback

app = Flask(__name__)
CORS(app)

# Define the upload folder
CAPTURE_FOLDER = 'captures'
UPLOAD_FOLDER = 'uploads'
app.config['CAPTURE_FOLDER'] = CAPTURE_FOLDER
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB limit

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Image parameters
IMG_WIDTH = 224
IMG_HEIGHT = 224

def preprocess_image(img_path):
    """
    Preprocess the image for the model
    """
    img = cv2.imread(img_path)  # Load image using OpenCV
    img_resized = cv2.resize(img, (IMG_WIDTH, IMG_HEIGHT))  # Resize to match model input size
    img_normalized = img_resized / 255.0  # Normalize pixel values to [0, 1]
    return np.expand_dims(img_normalized, axis=0)  # Add batch dimension

MODEL_PATH = 'C:/Users/Admin/Desktop/scanseta/back_end/model/experiment2 (1).keras'
ENCODER_PATH = 'C:/Users/Admin/Desktop/scanseta//back_end/model/label_classes(2).pkl'

model = tf.keras.models.load_model(MODEL_PATH)

# Load the label encoder
with open(ENCODER_PATH, 'rb') as f:
    label_encoder = pickle.load(f)

@app.route('/upload-file', methods=['POST'])
def upload_file():
    """
    Handles file uploads
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return jsonify({'message': f'File {filename} uploaded successfully'}), 200

    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/scan-image', methods=['POST'])
def scan_image():
    """
    Endpoint to process an uploaded image and perform inference
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        # Save the uploaded file
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)

        try:
            # Preprocess the image
            input_data = preprocess_image(file_path)

            # Perform prediction (adjust to match your model's output)
            bbox_pred, class_pred = model.predict(input_data)

            # Print model output
            print("Bounding box prediction:", bbox_pred)
            print("Class prediction:", class_pred)

            # Post-process bounding box (scale it back to image dimensions)
            image = cv2.imread(file_path)
            height, width, _ = image.shape
            bbox_pred_scaled = bbox_pred * np.array([width, height, width, height])

            # Get bounding box coordinates
            xmin, ymin, xmax, ymax = bbox_pred_scaled[0]

            # Decode the predicted class label
            predicted_class_id = np.argmax(class_pred)
            predicted_class_label = label_encoder.inverse_transform([predicted_class_id])[0]

            # Get the confidence (probability) of the predicted class
            confidence = class_pred[0][predicted_class_id]

            # Convert numpy float32 to native Python float
            confidence = float(confidence)
            xmin, ymin, xmax, ymax = float(xmin), float(ymin), float(xmax), float(ymax)

            # Prepare response data
            response = {
                'message': 'Image scanned successfully!',
                'predicted_class': predicted_class_label,
                'confidence': confidence,
                'bounding_box': {
                    'xmin': xmin,
                    'ymin': ymin,
                    'xmax': xmax,
                    'ymax': ymax
                }
            }
            print("Response:", response)
            return jsonify(response), 200

        except Exception as e:
            error_message = str(e)
            print(f"Error during inference: {error_message}")
            traceback.print_exc()  # Print detailed stack trace
            return jsonify({'error': f'Failed to process the image: {error_message}'}), 500

    return jsonify({'error': 'Invalid file type'}), 400


if __name__ == '__main__':
    app.run(debug=True)
