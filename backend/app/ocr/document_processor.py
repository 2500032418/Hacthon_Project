import os


class DocumentProcessor:
    SUPPORTED = (".pdf", ".txt", ".md", ".docx")

    def extract_text(self, file_path: str) -> str:
        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".pdf":
            return self._from_pdf(file_path)
        if ext == ".docx":
            return self._from_docx(file_path)
        if ext in (".txt", ".md"):
            return self._from_txt(file_path)
        raise ValueError(f"Unsupported file type: {ext}")

    def _from_pdf(self, path: str) -> str:
        import pdfplumber

        pages: list[str] = []
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                text = page.extract_text() or ""
                if not text.strip():
                    text = self._ocr_image_page(page)
                pages.append(text)
        return "\n\n".join(pages).strip()

    def _ocr_image_page(self, page) -> str:
        try:
            import pytesseract
            from PIL import Image

            image = page.to_image(resolution=200).original
            return pytesseract.image_to_string(image)
        except Exception:
            return ""

    def _from_docx(self, path: str) -> str:
        from docx import Document as Docx

        doc = Docx(path)
        parts = [p.text for p in doc.paragraphs]
        for table in doc.tables:
            for row in table.rows:
                parts.append("\t".join(cell.text for cell in row.cells))
        return "\n".join(parts).strip()

    def _from_txt(self, path: str) -> str:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read().strip()


def get_document_processor() -> DocumentProcessor:
    return DocumentProcessor()
