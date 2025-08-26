import os
from dotenv import load_dotenv
from azure.cognitiveservices.speech import SpeechConfig, SpeechSynthesizer
from azure.cognitiveservices.speech.audio import AudioOutputConfig

# Load credentials from .env
load_dotenv()
AZURE_KEY = os.getenv("AZURE_TTS_KEY")
AZURE_REGION = os.getenv("AZURE_TTS_REGION")

# Debug: Check if values loaded
print("🔑 AZURE_TTS_KEY =", AZURE_KEY)
print("🌍 AZURE_TTS_REGION =", AZURE_REGION)

if not AZURE_KEY or not AZURE_REGION:
    print("❌ Azure credentials are missing.")
    exit(1)

try:
    speech_config = SpeechConfig(subscription=AZURE_KEY, region=AZURE_REGION)
    speech_config.speech_synthesis_voice_name = "en-US-JennyNeural"  # ✅ Stable voice

    output_path = "azure_test_output.mp3"
    audio_output = AudioOutputConfig(filename=output_path)
    synthesizer = SpeechSynthesizer(speech_config=speech_config, audio_config=audio_output)

    print("📤 Synthesizing text...")
    result = synthesizer.speak_text_async("Hello, this is a test using Azure Text to Speech.").get()

    if result.reason.name == "SynthesizingAudioCompleted":
        print(f"✅ Success! Audio saved to: {output_path}")
    else:
        print(f"❌ TTS failed: {result.reason.name}")

except Exception as e:
    print(f"❌ Exception occurred: {str(e)}")
