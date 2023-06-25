from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import tempfile

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
temp_dir = r".\temp" # Path to a temporary directory

# Load your trained model
model = tf.keras.models.load_model(r'.\mobile_net_v3.h5') # Path to your trained model

# Define a dictionary to map class indices to labels
class_labels = {
    0: 'Alternaria',
    1: 'Bacterial Blight',
    2: 'Grey Mildew',
    3: 'Healthy',
}

@app.route('/predict', methods=['POST'])
def predict():
    # Get the image data from the request
    image_data = request.files['image']

    # Save the uploaded file to a temporary location
    with tempfile.NamedTemporaryFile(suffix='.jpg', dir=temp_dir, delete=False) as temp_file:
        image_data.save(temp_file.name)

        # Read and preprocess the image
        img = image.load_img(temp_file.name, target_size=(224, 224))
        img_array = image.img_to_array(img)
        preprocessed_data = preprocess_input(np.expand_dims(img_array, axis=0))

        # Perform the prediction
        prediction = model.predict(preprocessed_data)

        # Get the predicted class index
        predicted_class_index = np.argmax(prediction)

        # Get the predicted class label
        predicted_class_label = class_labels[predicted_class_index]

        # Create a response dictionary
        response = {'prediction': predicted_class_label}

    # Return the response as JSON
    return jsonify(response)



# Load the leaf classification model
leaf_model = tf.keras.models.load_model(r'\mobile_net_classification.h5') # Path to your leaf classification model

# Define class labels
class_labels_classify = {
    0: 'Cotton Leaf',
    1: 'Other Leaf'
}

@app.route('/classify', methods=['POST'])
def classify_leaf():
    # Get the image data from the request
    image_data = request.files['image']

    # Save the uploaded file to a temporary location
    with tempfile.NamedTemporaryFile(suffix='.jpg', dir=temp_dir, delete=False) as temp_file:
        image_data.save(temp_file.name)

        # Read and preprocess the image
        img = image.load_img(temp_file.name, target_size=(224, 224))
        img_array = image.img_to_array(img)
        preprocessed_data = preprocess_input(np.expand_dims(img_array, axis=0))

        # Perform leaf classification
        prediction = leaf_model.predict(preprocessed_data)
        predicted_class_index = np.argmax(prediction)
        predicted_class_label = class_labels_classify[predicted_class_index]

        # Create a response dictionary
        response = {'classification': predicted_class_label}

    # Return the response as JSON
    return jsonify(response)
