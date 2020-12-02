from django.db.models.fields import files
from .models import *
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model=UserProfile
        fields=['username','refer_id']
