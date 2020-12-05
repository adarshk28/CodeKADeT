from logging import StreamHandler
from sys import flags
from django.http.response import HttpResponse
from django.shortcuts import render, redirect
from django.conf import Settings, settings
from django.contrib.auth.forms import UserCreationForm,AuthenticationForm
from django.core.files.storage import FileSystemStorage
from django.contrib.auth.decorators import login_required
from rest_framework import serializers
from shutil import move
from .models import Code_file
from .forms import DocumentForm
from django.middleware.csrf import CsrfViewMiddleware
from django.contrib.auth import logout
from .models import UserProfile as User
from django.db import IntegrityError
from django.contrib import auth
import subprocess
from django.http import JsonResponse
import logging
logger=logging.getLogger(__name__)
from .serializers import *
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import FileUploadParser, JSONParser
from django.core.files.base import ContentFile
from rest_framework.decorators import api_view
from django.core.files import File
import os
import json
#def home(request):
    #documents = Code_file.objects.all()
    #return render(request, 'core/home.html', { 'documents': documents })

@api_view(['GET'])
def logout_user(request):
    print(request.user)
    logout(request)
    return JsonResponse({"status": "Logged out"})


def path_to_dict(path, request):
        d = {'name': os.path.basename(path)}
        if os.path.isdir(path):
            d['type'] = "folder"
            d['children'] = [path_to_dict(os.path.join(path,x), request) for x in os.listdir(path)]
        else:
            d['type'] = "file"
            d['path']=os.path.relpath(os.path.dirname(path), settings.MEDIA_ROOT+'personal_file/'+str(request.user.id))
        return d


@api_view(['GET'])
def make_map(request):
    if not request.user.is_authenticated:
        return JsonResponse({'Status': 'not logged in'})
    if request.method=='GET':
       return JsonResponse(path_to_dict(settings.MEDIA_ROOT+'personal_file/'+str(request.user.id), request))
@api_view(['POST'])
def upload_from_computer(request):
    print('User is:', request.user)
    if request.user.code_file_set.filter(file_name = request.POST['file_name'], path=request.POST['path']).exists():
        return JsonResponse({'status': 'Already exists'})
    request.user.code_file_set.create(description = request.POST['description'], content = request.FILES['content'], language = request.POST['language'], file_name = request.POST['file_name'], path=request.POST['path'])
    return JsonResponse({'status': 'Empty file uploaded'})

@api_view(['POST'])
def emptyFileUpload(request):
    print('User is:', request.user)
    data = json.loads(request.body)
    if request.user.code_file_set.filter(file_name = data.get('file_name'), path=data.get('path')).exists():
        return JsonResponse({'status': 'Already exists'})
    temp=open(data.get('file_name'), 'w+')
    f=File(temp)
    request.user.code_file_set.create(description = data.get('description'), content = f, language = data.get('language'), file_name = data.get('file_name'), path=data.get('path'))
    os.remove(data.get('file_name'))
    return JsonResponse({'status': 'Empty file uploaded'})

@api_view(['POST'])
def edit_from_textbox(request):
    print('User is:', request.user)
    data = json.loads(request.body)
    name=data.get('file_name')
    content=data.get('content')
    path=data.get('path')
    print(name)
    print(path)
    myfile=request.user.code_file_set.get(file_name=name, path=path).content
    GDRAT_abs_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../CodeKADeT/media/'+ str(myfile))
    fil=open(GDRAT_abs_path, 'w')
    fil.write(content)
    fil.close()
    return JsonResponse({"status":"Edit reflected in backend"})

def deletefile(request):
    if request.method=='POST':
        name=request.POST.get('filename')
        path=request.POST.get('path')
        request.user.code_file_set.get(file_name=name, path=path).delete()
        return JsonResponse({"status":"done"})

def rename(request):
    if request.method=='POST':
        name=request.POST.get('filename')
        if os.path.isfile(settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/'+name):
            return JsonResponse({'status': 'file with same name exists'})
        myfile=request.user.code_file_set.get(file_name=name)
        myfile.filename=name
        os.rename(settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/'+name)
        return JsonResponse({"status":"done"})

def newfile(request):
    if request.method=='POST':
        name=request.POST.get('filename')
        if os.path.isfile(settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/'+name):
            return JsonResponse({'status': 'file with same name exists'})
        myfile=request.user.code_file_set.create(description=request.POST['description'], content=request.FILES['content'], language=request.POST['language'], file_name=request.POST['file_name'])
        return JsonResponse({'status': 'done'})

def view_function(request):
    if request.method=='GET':
        filename=request.GET.get('file','')
        language=request.user.code_file_set.get(file_name=filename).language
        lines=[]
        with open(settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/'+filename) as f:
            lines=[line.rstrip('\n') for line in f]
        #return JsonResponse({'lines':lines})
        return JsonResponse({'lines':''.join(lines),'name': filename, 'language': language})

def execute(request):
    if(request.method=='POST'):
        filename=request.POST.get('file','')
        mode=0
        args=[]
        exe=""
        exename=''
        input=request.POST.get('input')
        language=request.POST.get('language', '')
        if language == "c++" or language == "c":
            mode=2
            args=["g++", filename]
            exe="./a.out"
            exename='a.out'
        elif language == "python": 
            mode=1
            args=['python3', filename]
        elif language == "java":
            mode=2
            args=['javac', filename]
            exe=['java', os.path.splitext(filename)]
        if(mode==0):
            return render(request, 'output.html' ,{'out':"invalid language"})
        if(request.POST.get('args')):
            args=request.POST.get('args')
        if(mode==1):
            result=subprocess.Popen(args, cwd= settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/' ,stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            ans = result.communicate(input=input.encode())[0].decode('utf-8').replace('/home/danish/Videos/CodeKADeT/CodeKADeT/CodeKADeT/media/personal_file/', '')
            return JsonResponse({'out': ans}) 
        if(mode==2):
            comp=subprocess.run(args, cwd= settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/', capture_output=True)
            # move(exename, settings.MEDIA_ROOT+'temp'+str(request.user.id)+"/"+exename)
            if(comp.stderr):
                return JsonResponse({'status':'1', 'ans':'compilation failed\n'+comp.stderr.decode('utf-8').replace('/home/danish/Videos/CodeKADeT/CodeKADeT/CodeKADeT/media/personal_file/', '')})
            result=subprocess.Popen(exe, cwd= settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/', stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            ans = result.communicate(input=input.encode())[0].decode('utf-8')
        return JsonResponse({"out": ans.replace('/home/danish/Videos/CodeKADeT/CodeKADeT/CodeKADeT/media/personal_file/', '')})
@api_view(['POST'])
def exec_from_textbox(request):
     if(request.method=='POST'):
        data = json.loads(request.body)
        filename=data.get('Filename')
        path=data.get("path")
        mode=0
        args=[]
        exe=""
        exename=''
        input=data.get('Input')
        language=data.get('Language')
        print('Language is:', language)
        if language == "cpp" or language == "c":
            mode=2
            args=["g++", filename]
            exe="./a.out"
            # exename='a.out'
        elif language == "py": 
            mode=1
            args=['python3', filename]
        elif language == "java":
            mode=2
            print("Filename is: ",filename)
            args=['javac', filename]
            exe=['java', os.path.splitext(filename)[0]]
        if(mode==0):
            return JsonResponse({'out':"invalid language"})
        # if(request.POST.get('args')):
        #     args=request.POST.get('args')
        if(mode==1):
            result=subprocess.Popen(args, cwd= settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/'+str(path) ,stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            ans = result.communicate(input=input.encode())[0].decode('utf-8').replace('/home/danish/Videos/CodeKADeT/CodeKADeT/CodeKADeT/media/personal_file/', '')
            return JsonResponse({'out': ans})
        if(mode==2):
            comp=subprocess.run(args, cwd= settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/'+str(path), capture_output=True)
            # move(exename, settings.MEDIA_ROOT+'temp'+str(request.user.id)+"/"+exename)
            if(comp.stderr):
                return JsonResponse({'status':'1', 'ans':'compilation failed\n'+comp.stderr.decode('utf-8').replace('/home/danish/Videos/CodeKADeT/CodeKADeT/CodeKADeT/media/personal_file/', '')})
            result=subprocess.Popen(exe, cwd= settings.MEDIA_ROOT+'personal_file/'+str(request.user.id)+'/'+str(path), stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            ans = result.communicate(input=input.encode())[0].decode('utf-8')
        return JsonResponse({"out": ans.replace('/home/danish/Videos/CodeKADeT/CodeKADeT/CodeKADeT/media/personal_file/', '')})
