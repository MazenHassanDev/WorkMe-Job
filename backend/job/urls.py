from django.urls import path
from . import views

urlpatterns = [
    path('', views.job_list_create_view, name='job-list-create'),
    path('summarize/', views.job_summarize_view, name='job-summarize'),
    path('<int:pk>/', views.job_detail_view, name='job-detail'),
]