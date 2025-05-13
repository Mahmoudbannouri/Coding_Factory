FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc python3-dev && \
    rm -rf /var/lib/apt/lists/*

# Install pinned versions first
RUN pip install --no-cache-dir \
    numpy==1.26.4 \
    scikit-learn==1.6.1 \
    joblib==1.3.2

# Copy requirements
COPY requirements.txt .

# Install remaining requirements
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app ./app

# Create model directory
RUN mkdir -p /app/model

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:5000/health || exit 1

# Run application
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app.main:app"]