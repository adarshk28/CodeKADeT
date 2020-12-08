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
from django.middleware.csrf import CsrfViewMiddleware
from django.contrib.auth import logout
from .models import UserProfile as User
from django.db import IntegrityError
from django.contrib import auth
import subprocess
from django.http import JsonResponse
import logging
logger=logging.getLogger(__name__)
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import FileUploadParser, JSONParser
from django.core.files.base import ContentFile
from rest_framework.decorators import api_view
from django.core.files import File
import os
import json
import shutil

@api_view(['GET'])
def logout_user(request):
    print(request.user)
    logout(request)
    return JsonResponse({"status": "Logged out"})


def path_to_dict(path, request):
        d = {'name': os.path.basename(path)}
        if os.path.isdir(path):
            d['type'] = "folder"
            d['path']=os.path.relpath(os.path.dirname(path), settings.MEDIA_ROOT+'personal_file/'+str(request.user.id))
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
       return JsonResponse(path_to_dict(os.readlink(request.user.symlink), request))

@api_view(['POST'])
def upload_from_computer(request):
    print('User is:', request.user)
    try:
        os.makedirs(os.readlink(request.user.symlink)+request.POST['path']+'/')
        with open(os.readlink(request.user.symlink)+request.POST['path']+'/'+request.POST['file_name'], 'w+') as stored_file:
            stored_file.write(request.FILES['content'].read().decode('utf-8'))
    except:
        if os.path.isfile(os.readlink(request.user.symlink)+request.POST['path']+'/'+request.POST['file_name']):
            return JsonResponse({'status': 'File exists!'})
        with open(os.readlink(request.user.symlink)+request.POST['path']+'/'+request.POST['file_name'], 'w+') as stored_file:
            stored_file.write(request.FILES['content'].read().decode('utf-8'))
    return JsonResponse({'status': 'file uploaded'})

@api_view(['POST'])
def emptyFileUpload(request):
    print('User is:', request.user)
    data = json.loads(request.body)
    print(data.get('file_name'))
    try:
        os.makedirs(os.readlink(request.user.symlink)+data.get('path')+'/')
        with open(os.readlink(request.user.symlink)+data.get('path')+'/'+data.get('file_name'), 'w+') as stored_file:
            stored_file.write('')
    except:
        if not os.path.isfile(os.readlink(request.user.symlink)+data.get('path')+'/'+data.get('file_name')):
            with open(os.readlink(request.user.symlink)+data.get('path')+'/'+data.get('file_name'), 'w+') as stored_file:
                stored_file.write('')
        else:
            return JsonResponse({'status': 'File exists!'})
    return JsonResponse({'status': 'Empty file uploaded'})

@api_view(['POST'])
def makeFolder(request):
    fullPath = request.body.decode('utf-8')
    print(fullPath)
    try:
        os.makedirs(os.readlink(request.user.symlink)+fullPath+'/')
        return JsonResponse({"status":"done"})
    except:
        return JsonResponse({"status":"already exists!"})

@api_view(['POST'])
def edit_from_textbox(request):
    print('User is:', request.user)
    data = json.loads(request.body)
    print('Data is:', data)
    with open(os.readlink(request.user.symlink)+data.get('path')+'/'+data.get('name'), 'w+') as stored_file:
        stored_file.write(data.get('content'))
    return JsonResponse({"status":"Edit reflected in backend"})

@api_view(['POST'])
def delete(request):
    data = json.loads(request.body)
    name=data.get('old_name')
    path=data.get('path')
    a_path = os.readlink(request.user.symlink) + path + '/' + name
    if os.path.isdir(a_path):
        shutil.rmtree(a_path)
    else:
        os.remove(os.readlink(request.user.symlink) + path + '/' + name)
    return JsonResponse({"status":"done"})   

@api_view(['POST'])
def rename(request):
    data = json.loads(request.body)
    if os.path.isfile((request.user.symlink)+data.get('path')+'/'+data.get('new_name')):
        return JsonResponse({'status': 'file with same name exists'})
    os.rename(os.readlink(request.user.symlink)+data.get('path')+'/'+data.get('old_name'), os.readlink(request.user.symlink)+data.get('path')+'/'+data.get('new_name'))
    return JsonResponse({"status":"done"})

@api_view(['GET'])
def view_function(request):
    if os.path.isfile(os.readlink(request.user.symlink)+request.GET['path']+'/'+request.GET['name']):
        with open(os.readlink(request.user.symlink)+request.GET['path']+'/'+request.GET['name']) as f:
            lines=[line for line in f]
        return JsonResponse({'lines':''.join(lines),'name': request.GET['name'], 'language': request.GET['name'].split('.')[-1]})
    else:
        return JsonResponse({'lines':'This is a folder!', 'name': request.GET['name'], 'language': ''})

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
        if(mode==1):
            result=subprocess.Popen(args, cwd= os.readlink(request.user.symlink)+path+'/',stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            ans = result.communicate(input=input.encode())[0].decode('utf-8').replace('/home/danish/Videos/CodeKADeT/CodeKADeT/CodeKADeT/media/personal_file/', '')
            return JsonResponse({'out': ans})
        if(mode==2):
            comp=subprocess.run(args, cwd= os.readlink(request.user.symlink)+path+'/', capture_output=True)
            if(comp.stderr):
                return JsonResponse({'status':'1', 'out':'compilation failed\n'+comp.stderr.decode('utf-8').replace('/home/danish/Videos/CodeKADeT/CodeKADeT/CodeKADeT/media/personal_file/', '')})
            result=subprocess.Popen(exe, cwd= os.readlink(request.user.symlink)+path+'/', stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            ans = result.communicate(input=input.encode())[0].decode('utf-8')
        return JsonResponse({"out": ans.replace('/home/danish/Videos/CodeKADeT/CodeKADeT/CodeKADeT/media/personal_file/', '')})


