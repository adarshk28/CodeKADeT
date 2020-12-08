"""!
ASGI config for CodeKADeT project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

##  
# @mainpage Django Backend For the Online Competing & Development Environment (OCD-E) project : CodeKADeT
# Built by the four of us from scratch. The frontend is in Angular, and we have used REST API for interaction between the two ends. The users can make their authenticated accounts, upload upto 10 files in their directory in our backend, code, compile and test their files in this update. The directory is dynamic, users can create,rename,update and delete the files and folders. Downloading of files is also possible. The Code Editor is theme-aided, with plugins for modes c++,python and java. Compilation of files of these languages is also possible.
# @authors Adarsh Kumar, Danish Angural, Kanad Pardeshi, Tulip Pandey

import os

from django.core.asgi import get_asgi_application

## 
# @file asgi.py
# brief Setting up the default environment

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CodeKADeT.settings')

application = get_asgi_application()
