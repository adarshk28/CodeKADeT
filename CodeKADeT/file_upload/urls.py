#Imports for urls of views in file_upload app
from CodeKADeT.file_upload.views import view_function
from django.urls import path, include
from . import views
from django.conf import settings
from django.conf.urls.static import static

app_name = "fileupload"

urlpatterns = [


"""! Set of urls defined view-wise for file_upload/views.py"""

   path('upload_file_from_computer/', views.upload_from_computer, name='upload'),
   path('upload_file_from_textbox/', views.upload_from_textbox, name='upload_file_from_textbox'),
   path('file_view/', views.view_function, name='view_function'),
   path('',views.logout_user,name="logout")
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
