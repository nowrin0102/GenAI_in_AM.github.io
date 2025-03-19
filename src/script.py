
import os

# Retrieve the secret key from environment variables
secret_key = os.getenv('SECRET_KEY')

if secret_key:
    print("Secret key loaded successfully.")
else:
    print("Secret key not found! Make sure it's set in GitHub Secrets.")
