# twilio_client.py
from twilio.rest import Client
import os

ACCOUNT_SID = 'AC4032a80e2c6e259fcf2ba8c8d607b8a0'
AUTH_TOKEN = 'f483dd52ff5256c685bc512d5034e79e'
TWILIO_PHONE_NUMBER = '+19134047029'

client = Client(ACCOUNT_SID, AUTH_TOKEN)

def send_sms(to_phone_number, message_body):
    message = client.messages.create(
        body=message_body,
        from_=TWILIO_PHONE_NUMBER,
        to=to_phone_number
    )
    return message.sid
