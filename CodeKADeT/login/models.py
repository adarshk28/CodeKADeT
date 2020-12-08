"""! Imports for the login model, uuid for user specific information"""
from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


class UserProfile(AbstractUser):
    """! 
    @param refer_id UUIDField for the logged in user
    @param symlink  Symbolic link to the user's media directory
    @param nickname Character nickname for user
    @param date_of_birth User's D.O.B
    @param profile_photo Profile photo of user
    """
    nickname=models.CharField(max_length=10 ,blank=True)
    date_of_birth=models.DateField(blank=True, null=True)
    profile_photo=models.ImageField(upload_to='profile_images', blank=True)
    refer_id=models.UUIDField(default=uuid.uuid4)
    symlink=models.CharField(max_length=250, blank=True)


    