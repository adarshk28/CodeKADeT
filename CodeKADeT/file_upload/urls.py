from django.urls import path, include
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
   path('upload_file_from_computer', views.upload_from_computer, name='upload_file_from_computer'),
   path('upload_file_from_textbox', views.upload_from_textbox, name='upload_file_from_textbox'),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
