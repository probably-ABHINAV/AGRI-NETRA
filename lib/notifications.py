import os
from twilio.rest import Client

# From twilio_send_message integration
TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.environ.get("TWILIO_PHONE_NUMBER")

def send_twilio_message(to_phone_number: str, message: str) -> None:
    """Send SMS message using Twilio integration"""
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    
    # Sending the SMS message
    message = client.messages.create(
        body=message, 
        from_=TWILIO_PHONE_NUMBER, 
        to=to_phone_number
    )
    
    print(f"Message sent with SID: {message.sid}")

def send_irrigation_alert(phone_number: str, farm_name: str, field_name: str):
    """Send irrigation reminder to farmer"""
    message = f"🌾 IRRIGATION ALERT: {field_name} at {farm_name} needs watering. Soil moisture is low. Check your farm immediately."
    send_twilio_message(phone_number, message)

def send_pest_alert(phone_number: str, farm_name: str, pest_type: str, severity: str):
    """Send pest detection alert to farmer"""
    message = f"🐛 PEST ALERT: {pest_type} detected at {farm_name}. Severity: {severity}. Take immediate action to prevent crop damage."
    send_twilio_message(phone_number, message)

def send_weather_alert(phone_number: str, farm_name: str, weather_condition: str):
    """Send weather warning to farmer"""
    message = f"🌦️ WEATHER ALERT: {weather_condition} expected at {farm_name}. Protect your crops and equipment."
    send_twilio_message(phone_number, message)

def send_task_reminder(phone_number: str, task_title: str, due_date: str):
    """Send task reminder to farmer"""
    message = f"📋 TASK REMINDER: '{task_title}' is due on {due_date}. Don't forget to complete this farm activity."
    send_twilio_message(phone_number, message)