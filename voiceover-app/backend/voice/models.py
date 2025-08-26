from django.db import models

class Voiceover(models.Model):
    title = models.CharField(max_length=100)
    text_input = models.TextField()
    audio_file = models.FileField(upload_to='voiceover/')
    created_at = models.DateTimeField(auto_now_add=True)
    