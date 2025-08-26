# views.py (Django Backend with Windows-safe tempfile fix)

import os
import io
import datetime
import tempfile
from dotenv import load_dotenv
from django.http import JsonResponse, HttpResponse
from django.core.files.base import ContentFile
from django.core.paginator import Paginator
from rest_framework.decorators import api_view
from azure.cognitiveservices.speech import SpeechConfig, SpeechSynthesizer
from azure.cognitiveservices.speech.audio import AudioOutputConfig
from .models import Voiceover

# Load Azure credentials
load_dotenv()
AZURE_KEY = os.getenv("AZURE_TTS_KEY")
AZURE_REGION = os.getenv("AZURE_TTS_REGION")

@api_view(["POST"])
def generate_voiceover(request):
    text = request.data.get("text")
    title = request.data.get("title", f"voice_{datetime.datetime.now().timestamp()}")
    voice_name = request.data.get("voice_id", "en-US-JennyNeural")

    if not AZURE_KEY or not AZURE_REGION:
        return JsonResponse({"error": "Missing Azure credentials"}, status=500)

    try:
        speech_config = SpeechConfig(subscription=AZURE_KEY, region=AZURE_REGION)
        speech_config.speech_synthesis_voice_name = voice_name

        tmp_file = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
        tmp_path = tmp_file.name
        tmp_file.close()  # Important: Close the file to avoid locking issues on Windows

        audio_output = AudioOutputConfig(filename=tmp_path)
        synthesizer = SpeechSynthesizer(speech_config=speech_config, audio_config=audio_output)

        result = synthesizer.speak_text_async(text).get()
        if result.reason.name != "SynthesizingAudioCompleted":
            return JsonResponse({"error": "Azure TTS failed"}, status=500)

        with open(tmp_path, "rb") as f:
            voice = Voiceover(title=title, text_input=text)
            voice.audio_file.save(f"{title}.mp3", ContentFile(f.read()))
            voice.save()

        os.remove(tmp_path)

        return JsonResponse({
            "title": voice.title,
            "audio_url": request.build_absolute_uri(voice.audio_file.url),
            "created_at": voice.created_at
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@api_view(["GET"])
def list_voiceovers(request):
    page = int(request.GET.get("page", 1))
    page_size = 5
    queryset = Voiceover.objects.all().order_by('-created_at')
    paginator = Paginator(queryset, page_size)
    page_obj = paginator.get_page(page)

    return JsonResponse({
        "results": [
            {
                "title": v.title,
                "text": v.text_input,
                "audio_url": request.build_absolute_uri(v.audio_file.url),
                "created_at": v.created_at
            } for v in page_obj
        ],
        "has_next": page_obj.has_next(),
        "page": page,
        "total_pages": paginator.num_pages
    })

@api_view(["GET"])
def list_voices(request):
    if not AZURE_KEY or not AZURE_REGION:
        return JsonResponse({"error": "Azure credentials missing"}, status=500)

    try:
        speech_config = SpeechConfig(subscription=AZURE_KEY, region=AZURE_REGION)
        synthesizer = SpeechSynthesizer(speech_config=speech_config)
        result = synthesizer.get_voices_async().get()

        voices = [
            {
                "name": v.name,
                "gender": v.gender.name,
                "language": v.locale
            } for v in result.voices
        ]
        return JsonResponse({"voices": voices})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@api_view(["GET"])
def test_connection(request):
    return JsonResponse({"message": "\u2705 Azure TTS backend is working!"})

def root_view(request):
    return HttpResponse("\ud83c\udf89 Hello from Azure Django backend")

