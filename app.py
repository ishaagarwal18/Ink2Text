# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from config import Config
# from extensions import db
# import pytesseract
# import cv2
# import numpy as np
# from PIL import Image

# # 👇 IMPORTANT: set tesseract path (Windows)
# pytesseract.pytesseract.tesseract_cmd = r"C:\Users\Admin\IdeaProjects\git\Ink2Text\tesseract-ocr-w64-setup-5.5.0.20241111.exe"


# def create_app():
#     app = Flask(__name__)
#     app.config.from_object(Config)

#     CORS(app)
#     db.init_app(app)

#     # import models AFTER db init
#     from models import Document, OCRText

#     with app.app_context():
#         db.create_all()

#     # ---------------- HOME ----------------
#     @app.route("/")
#     def home():
#         return {"message": "Ink2Text backend running 🚀"}

#     # ---------------- OCR API ----------------
#     @app.route("/api/ocr", methods=["POST"])
#     def ocr_image():
#         file = request.files.get("image")

#         if not file:
#             return jsonify({"error": "No image uploaded"}), 400

#         # Save document
#         document = Document(file_name=file.filename)
#         db.session.add(document)
#         db.session.commit()

#         # OCR processing
#         image = Image.open(file.stream).convert("RGB")
#         img = np.array(image)
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

#         extracted_text = pytesseract.image_to_string(
#             gray,
#             config="--oem 3 --psm 6"
#         )

#         print("OCR OUTPUT:", extracted_text)

#         # Save OCR text
#         ocr_entry = OCRText(
#             document_id=document.document_id,
#             extracted_text=extracted_text,
#             confidence_score=0.90
#         )
#         db.session.add(ocr_entry)
#         db.session.commit()

#         return jsonify({
#             "message": "OCR saved successfully",
#             "document_id": document.document_id,
#             "text": extracted_text
#         })

#     # ---------------- HISTORY API ----------------
#     @app.route("/api/history", methods=["GET"])
#     def get_ocr_history():
#         results = (
#             db.session.query(
#                 Document.document_id,
#                 Document.file_name,
#                 Document.uploaded_at,
#                 OCRText.extracted_text
#             )
#             .join(OCRText, Document.document_id == OCRText.document_id)
#             .order_by(Document.uploaded_at.desc())
#             .all()
#         )

#         history = []
#         for row in results:
#             history.append({
#                 "document_id": row.document_id,
#                 "file_name": row.file_name,
#                 "uploaded_at": row.uploaded_at.strftime("%Y-%m-%d %H:%M:%S"),
#                 "text": row.extracted_text
#             })

#         return jsonify(history)

#     return app


# # ⬇️ THIS MUST BE AT THE VERY BOTTOM
# app = create_app()

# if __name__ == "__main__":
#     app.run(debug=True)





from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from extensions import db
import pytesseract
import cv2
import numpy as np
from PIL import Image, UnidentifiedImageError

pytesseract.pytesseract.tesseract_cmd = r"C:\Users\Admin\IdeaProjects\git\Ink2Text\tesseract-ocr-w64-setup-5.5.0.20241111.exe"


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)

    from models import Document, OCRText

    with app.app_context():
        db.create_all()

    # ---------------- HOME ----------------
    @app.route("/")
    def home():
        return {"message": "Ink2Text backend running 🚀"}

    # ---------------- OCR ----------------
    @app.route("/api/ocr", methods=["POST"])
    def ocr_image():
        file = request.files.get("image")

        if not file or file.filename == "":
            return jsonify({"error": "No image uploaded"}), 400
        
        try:
            image = Image.open(file.stream)
            image.verify()
            file.stream.seek(0)
            image = Image.open(file.stream).convert("RGB")
        except UnidentifiedImageError:
            return jsonify({"error": "Invalid image file"}), 400

        img = np.array(image)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        extracted_text = pytesseract.image_to_string(gray)

        document = Document(file_name=file.filename)
        db.session.add(document)
        db.session.commit()

        ocr_entry = OCRText(
            document_id=document.document_id,
            extracted_text=extracted_text,
            confidence_score=0.90
        )
        db.session.add(ocr_entry)
        db.session.commit()

        return jsonify({
            "message": "OCR saved successfully",
            "document_id": document.document_id,
            "text": extracted_text
        })

    # ---------------- HISTORY ----------------
    @app.route("/api/history", methods=["GET"])
    def get_ocr_history():
        results = (
            db.session.query(
                Document.document_id,
                Document.file_name,
                Document.uploaded_at,
                OCRText.extracted_text
            )
            .join(OCRText, Document.document_id == OCRText.document_id)
            .all()
        )

        history = []
        for row in results:
            history.append({
                "document_id": row.document_id,
                "file_name": row.file_name,
                "uploaded_at": row.uploaded_at.strftime("%Y-%m-%d %H:%M:%S"),
                "text": row.extracted_text
            })

        return jsonify(history)

    return app


app = create_app()

if __name__ == "__main__":
    print(">>> THIS APP.PY IS RUNNING <<<")
    app.run(debug=True)
