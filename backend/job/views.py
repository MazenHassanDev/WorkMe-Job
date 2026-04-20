from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from .serializers import JobSerializer
from .models import JobApplicationModel
from rest_framework.response import Response
from .utils.ai_summarizer import summarize_job
from .utils.throttles import SummarizeRateThrottle

# Create your views here.

# CREATE JOB
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def job_list_create_view(request):

    cache_list_key = f"jobs_user_{request.user.id}"

    if request.method == 'POST':
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user)
            cache.delete(cache_list_key)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    if request.method == 'GET':
        cached = cache.get(cache_list_key)
        if cached:
            response = Response(cached, status=status.HTTP_200_OK)
            response['X-Cache'] = 'HIT'
            return response

        qs = JobApplicationModel.objects.filter(user=request.user)
        serializer = JobSerializer(qs, many=True)
        cache.set(cache_list_key, serializer.data, timeout=60*60)
        response = Response(serializer.data, status=status.HTTP_200_OK)
        response['X-Cache'] = 'MISS'
        return response

@api_view(['GET', 'PUT', 'PATCH', 'DELETE']) 
@permission_classes([IsAuthenticated])
def job_detail_view(request, pk):

    cache_list_key = f"jobs_user_{request.user.id}"
    cache_single = f"jobs_user_{request.user.id}_{pk}"

    if request.method == 'GET':
        cached = cache.get(cache_single)
        if cached:
            response = Response(cached, status=status.HTTP_200_OK)
            response['X-Cache'] = 'HIT'
            return response
        
        job = get_object_or_404(JobApplicationModel, pk=pk, user = request.user)
        serializer = JobSerializer(job)
        cache.set(cache_single, serializer.data, timeout=60*60)
        response = Response(serializer.data, status=status.HTTP_200_OK)
        response['X-Cache'] = 'MISS'
        return response
    
    if request.method in ['PUT', 'PATCH']:
        job = get_object_or_404(JobApplicationModel, pk=pk, user=request.user)
        serializer = JobSerializer(job, data=request.data, partial=request.method == 'PATCH')
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user)
            cache.delete(cache_single)
            cache.delete(cache_list_key)
            cache.set(cache_single, serializer.data, timeout=60*60)
            return Response(serializer.data, status=status.HTTP_200_OK)     

    if request.method == 'DELETE':
        job = get_object_or_404(JobApplicationModel, pk=pk, user = request.user)
        job.delete()
        cache.delete(cache_single)
        cache.delete(cache_list_key)
        return Response({'success': 'Job deleted.'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([SummarizeRateThrottle])
def job_summarize_view(request):
    description = request.data.get('description')
    if not description:
        return Response({'error': 'Description is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    result = summarize_job(description)
    if 'error' in result:
        return Response(result, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(result, status=status.HTTP_200_OK)