from extensions import db
from datetime import datetime

class Document(db.Model):
    __tablename__ = "documents"

    document_id = db.Column(db.Integer, primary_key=True)
    file_name = db.Column(db.String(255), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    ocr_texts = db.relationship("OCRText", backref="document", lazy=True)


class OCRText(db.Model):
    __tablename__ = "ocr_text"

    ocr_id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(
        db.Integer,
        db.ForeignKey("documents.document_id"),
        nullable=False
    )
    extracted_text = db.Column(db.Text, nullable=False)
    confidence_score = db.Column(db.Float)
