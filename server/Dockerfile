FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
COPY main.py .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port the app runs on
EXPOSE 8000

# Command to run the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]