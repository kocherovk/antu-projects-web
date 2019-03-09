import os

from server import serve

serve(port=os.getenv('PORT', 8080))
