#!/bin/bash
# Generate self-signed SSL certificates for local development
# For production, use Let's Encrypt or your certificate provider

CERT_DIR="$(dirname "$0")/certs"
mkdir -p "$CERT_DIR"

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$CERT_DIR/key.pem" \
  -out "$CERT_DIR/cert.pem" \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

echo "Certificates generated in $CERT_DIR"
