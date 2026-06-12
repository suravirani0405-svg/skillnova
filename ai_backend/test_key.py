import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GEMINI_API_KEY")
print(f"Key: {key[:10]}...")
genai.configure(api_key=key)
model = genai.GenerativeModel('models/gemini-1.5-flash')

print("SENDING TEST REQUEST...")
try:
    response = model.generate_content("hello")
    print("SUCCESS: AI RESPONSE RECEIVED")
    print(f"RESPONSE TIER: {response.text[:50]}...")
except Exception as e:
    print(f"FAILED: {str(e)}")


