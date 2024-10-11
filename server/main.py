from pathlib import Path
from connexion import FlaskApp
import os

def post_greeting(name: str) -> str:
  return f"Hello {name}", 200

def get_models_list():
  return os.listdir('models/')

app = FlaskApp(__name__, specification_dir='spec/')
app.add_api("openapi.yaml", arguments={"title": "Hello World"})

if __name__ == "__main__":
  app.run(f"{Path(__file__).stem}:app", port=8080)