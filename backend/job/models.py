from django.db import models
from django.contrib.auth.models import User
from datetime import date

# Create your models here.
class JobApplicationModel(models.Model):
    class Meta:
        ordering = ['-created_at']

    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('interview', 'Interview'),
        ('rejected', 'Rejected'),
        ('offer', 'Offer'),
        ('withdrawn', 'Withdrawn'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs')

    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=150)
    job_url = models.URLField()
    description = models.TextField()
    ai_summary = models.TextField(blank=True, null=True)
    status = models.CharField(max_length = 50, choices=STATUS_CHOICES, default='applied')
    applied_at = models.DateField(default=date.today)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Title -> {self.title}"




    
    