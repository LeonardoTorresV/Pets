from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import tensorflow as tf

app = Flask(__name__)
CORS(app)

# Cargar el modelo entrenado
model = tf.keras.models.load_model('cats_and_dogs_model.h5')

@app.route('/predict_frame', methods=['POST'])
def predict_frame():
    try:
        file = request.files['frame']
        npimg = np.fromfile(file, np.uint8)
        frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        
        resized_frame = cv2.resize(frame, (150, 150))
        normalized_frame = resized_frame / 255.0
        input_frame = np.expand_dims(normalized_frame, axis=0)
        
        # Realizar la predicción
        prediction = model.predict(input_frame)
        label = "dog" if prediction[0][0] > 0.5 else "cat"
        
        return jsonify({'prediction': label})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)