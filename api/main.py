import sys
import os

# Dynamically add the parent directory to Python's system path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ai_backend.main import app
