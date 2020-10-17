from django.db import models
from django.contrib.auth.models import AbstractUser
class UserProfile(AbstractUser):
    nickname=models.CharField(max_length=10 ,blank=True)
    date_of_birth=models.DateField()
    profile_photo=models.ImageField(upload_to='profile_images', blank=True)
    def __str__(self):
        return self.user.primary_key
class Code_file(models.Model):
    description=models.CharField(max_length=200)
    file_name=models.CharField(max_length=20)
    uploaded_on=models.DateTimeField(auto_now=True)
    creator=models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    content=models.FileField('/documents/personal/{0}/{1}'.format(creator, file_name))
    language=models.CharField(max_length=20)
    uploaded_at=models.DateTimeField(auto_now_add=True)
# Create your models here.
