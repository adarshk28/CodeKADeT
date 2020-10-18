from django.db import models
from django.contrib.auth.models import AbstractUser
class UserProfile(AbstractUser):
    nickname=models.CharField(max_length=10 ,blank=True)
    date_of_birth=models.DateField(blank=True, null=True)
    profile_photo=models.ImageField(upload_to='profile_images', blank=True)
    def __str__(self):
        return self.pk

# Create your models here.
