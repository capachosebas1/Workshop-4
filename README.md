# Anonimizador PII

## Descripción del Proyecto

Este proyecto es un servicio de anonimización de información personal identificable (PII) que utiliza la API de OpenAI para generar respuestas a prompts mientras protege la privacidad de los datos sensibles. El servicio anonimiza nombres, direcciones de correo electrónico y números de teléfono antes de enviar los prompts a OpenAI, y luego desanonimiza las respuestas antes de devolverlas al usuario.

## Características

- Anonimización de nombres, correos electrónicos y números de teléfono
- Integración con la API de OpenAI para completar texto
- Almacenamiento de tokens de anonimización en MongoDB
- API RESTful para anonimizar y desanonimizar mensajes

## Requisitos Previos

- Node.js (versión 14 o superior)
- MongoDB
- Cuenta de OpenAI con clave de API

## Instalación

1. Clonar el repositorio:
   ```
   git clone https://github.com/tu-usuario/anonimizador-pii.git
   cd anonimizador-pii
   ```

2. Instalar las dependencias:
   ```
   npm install
   ```

3. Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:
   ```
   PORT=3001
   MONGODB_URI=tu_uri_de_mongodb
   OPENAI_API_KEY=tu_clave_api_de_openai
   ```
   Reemplaza `tu_uri_de_mongodb` y `tu_clave_api_de_openai` con tus propias credenciales.

4. Iniciar el servidor:
   ```
   npm run dev
   ```

## Uso

El servicio expone los siguientes endpoints:

- `POST /anonymize`: Anonimiza un mensaje
- `POST /deanonymize`: Desanonimiza un mensaje
- `POST /secureChatGPT`: Envía un prompt anonimizado a OpenAI y devuelve la respuesta desanonimizada

Ejemplo de uso con curl:
curl -X POST http://localhost:3001/secureChatGPT -H "Content-Type: application/json" -d "{\"prompt\":\"Genera un correo electrónico para Juan Pérez (juan.perez@email.com) sobre una reunión el próximo lunes a las 3pm. Su número de teléfono es 1234567890.\"}"

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir los cambios propuestos antes de hacer un pull request.

## Licencia

[MIT](https://choosealicense.com/licenses/mit/)