from .models import *

from rest_framework import serializers

class CodeFileSerializer(serializers.ModelSerializer):
    class Meta:
        model=Code_file
        fields=['description', 'language', 'file_name', 'uploaded_on', 'content']