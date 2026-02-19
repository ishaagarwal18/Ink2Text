from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from extensions import db
import pytesseract
import cv2
import numpy as np
from PIL import Image, UnidentifiedImageError
import os
import sys

# Tesseract Configuration
# For Windows: Update this path to your Tesseract installation
# Default Windows path: C:\Program Files\Tesseract-OCR\tesseract.exe
# For Linux/Mac: Usually auto-detected, no need to set
if sys.platform == "win32":
    # Change this to your actual Tesseract installation path
    tesseract_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    if os.path.exists(tesseract_path):
        pytesseract.pytesseract.tesseract_cmd = tesseract_path
    else:
        print("⚠️  WARNING: Tesseract not found at:", tesseract_path)
        print("Please install Tesseract OCR or update the path in app.py")


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)

    from models import Document, OCRText

    with app.app_context():
        try:
            # Test database connection
            db.engine.connect()
            print("✅ Database connected successfully!")
            
            # Create tables
            db.create_all()
            print("✅ Database tables created!")
        except Exception as e:
            print("❌ Database connection failed!")
            print(f"Error: {e}")
            print("\nPlease check:")
            print("1. PostgreSQL is running")
            print("2. Database 'ink2text_db' exists")
            print("3. Username and password are correct")
            print("4. Connection string in config.py is correct")

    # ---------------- HOME ----------------
    @app.route("/")
    def home():
        return {"message": "Ink2Text backend running 🚀", "status": "ok"}

    # ---------------- OCR ----------------
    @app.route("/api/ocr", methods=["POST"])
    def ocr_image():
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
            
        file = request.files.get("image")

        if not file or file.filename == "":
            return jsonify({"error": "No image uploaded"}), 400
        
        # Validate file extension
        allowed_extensions = app.config.get('ALLOWED_EXTENSIONS', {'png', 'jpg', 'jpeg', 'gif', 'webp'})
        file_ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        if file_ext not in allowed_extensions:
            return jsonify({"error": f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"}), 400
        
        try:
            # Validate image
            image = Image.open(file.stream)
            image.verify()
            file.stream.seek(0)
            image = Image.open(file.stream).convert("RGB")
        except UnidentifiedImageError:
            return jsonify({"error": "Invalid image file"}), 400
        except Exception as e:
            return jsonify({"error": f"Error processing image: {str(e)}"}), 400

        try:
            # Convert to numpy array for OpenCV
            img = np.array(image)
            gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

            # Extract text using Tesseract
            extracted_text = pytesseract.image_to_string(gray)

            # Save to database
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
                "success": True,
                "message": "OCR processed successfully",
                "document_id": document.document_id,
                "text": extracted_text
            })
        
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"OCR processing failed: {str(e)}"}), 500

    # ---------------- HISTORY ----------------
    @app.route("/api/history", methods=["GET"])
    def get_ocr_history():
        try:
            results = (
                db.session.query(
                    Document.document_id,
                    Document.file_name,
                    Document.uploaded_at,
                    OCRText.extracted_text
                )
                .join(OCRText, Document.document_id == OCRText.document_id)
                .order_by(Document.uploaded_at.desc())
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

            return jsonify({"success": True, "history": history})
        
        except Exception as e:
            return jsonify({"error": f"Failed to fetch history: {str(e)}"}), 500

    # ---------------- DELETE HISTORY ----------------
    @app.route("/api/history/<int:document_id>", methods=["DELETE"])
    def delete_history(document_id):
        try:
            document = Document.query.get(document_id)
            if not document:
                return jsonify({"error": "Document not found"}), 404
            
            db.session.delete(document)
            db.session.commit()
            
            return jsonify({"success": True, "message": "Document deleted successfully"})
        
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Failed to delete document: {str(e)}"}), 500

    # ---------------- HEALTH CHECK ----------------
    @app.route("/api/health", methods=["GET"])
    def health_check():
        try:
            # Check database connection
            db.session.execute("SELECT 1")
            db_status = "connected"
        except:
            db_status = "disconnected"
        
        return jsonify({
            "status": "running",
            "database": db_status,
            "tesseract": "configured" if pytesseract.pytesseract.tesseract_cmd else "not configured"
        })

    return app


app = create_app()

if __name__ == "__main__":
    print("\n" + "="*50)
    print("🚀 Starting Ink2Text Backend Server")
    print("="*50)
    print(f"📍 Server: http://localhost:5000")
    print(f"🗄️  Database: {Config.SQLALCHEMY_DATABASE_URI}")
    print("="*50 + "\n")
    
    app.run(debug=True, host="0.0.0.0", port=5000)
