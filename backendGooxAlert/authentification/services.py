import requests
import base64
from django.conf import settings

class ImgBBService:
    def __init__(self):
        self.api_key = settings.IMGBB_API_KEY
        self.api_url = "https://api.imgbb.com/1/upload"

    def upload_image(self, image_file):
        try:
            # Lire le fichier image
            image_data = image_file.read()
            
            # Encoder l'image en base64
            encoded_image = base64.b64encode(image_data).decode('utf-8')
            
            # Préparer les données pour l'API
            payload = {
                "key": self.api_key,
                "image": encoded_image
            }
            
            # Faire la requête à l'API ImgBB
            response = requests.post(self.api_url, data=payload)
            response.raise_for_status()  # Lève une exception si la requête échoue
            
            # Extraire l'URL de l'image
            result = response.json()
            if result.get("success"):
                return result["data"]["url"]
            else:
                raise Exception("Échec de l'upload vers ImgBB")
                
        except Exception as e:
            raise Exception(f"Erreur lors de l'upload vers ImgBB: {str(e)}") 