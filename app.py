print(">>> THIS APP.PY IS RUNNING <<<")

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import pytesseract
import numpy as np
import cv2
import io
from datetime import datetime
import os
import json

app = Flask(__name__)
CORS(app)

# ---------------- TESSERACT PATH ----------------
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ---------------- FILES ----------------
HISTORY_FILE = "history.json"

if not os.path.exists(HISTORY_FILE):
    with open(HISTORY_FILE, "w") as f:
        json.dump([], f)

# ---------------- HELPERS ----------------
def load_history():
    with open(HISTORY_FILE, "r") as f:
        return json.load(f)

def save_history(data):
    with open(HISTORY_FILE, "w") as f:
        json.dump(data, f, indent=4)

# ---------------- ROUTES ----------------

@app.route("/")
def home():
    return "Ink2Text backend running"

# OCR CONVERT
@app.route("/convert", methods=["POST"])
def convert():
    if "image" not in request.files:
        return jsonify({"text": "No image received"}), 400

    file = request.files["image"]
    image = Image.open(io.BytesIO(file.read())).convert("RGB")
    img_np = np.array(image)

    gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
    gray = cv2.threshold(gray, 0, 255,
                          cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

    text = pytesseract.image_to_string(
        gray,
        lang="eng",
        config="--oem 3 --psm 6"
    )

    return jsonify({"text": text})

# SAVE TEXT
@app.route("/save", methods=["POST"])
def save_text():
    data = request.get_json()
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"message": "No text received"}), 400

    history = load_history()
    history.append({
        "id": len(history) + 1,
        "text": text,
        "datetime": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

    save_history(history)
    return jsonify({"message": "Text saved successfully"})

# GET HISTORY
@app.route("/history", methods=["GET"])
def get_history():
    return jsonify(load_history())

# DELETE HISTORY
@app.route("/delete/<int:entry_id>", methods=["DELETE"])
def delete_entry(entry_id):
    history = load_history()
    new_history = [h for h in history if h["id"] != entry_id]

    if len(new_history) == len(history):
        return jsonify({"message": "Entry not found"}), 404

    for i, item in enumerate(new_history, start=1):
        item["id"] = i

    save_history(new_history)
    return jsonify({"message": "Entry deleted successfully"})

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True)
