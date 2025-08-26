from django.urls import path
from .views import list_voices, generate_voiceover, list_voiceovers, test_connection

urlpatterns = [
    path("api/voices/", list_voices),
    path("api/generate/", generate_voiceover),
    path("api/voiceovers/", list_voiceovers),
    path("api/test/", test_connection),
]
