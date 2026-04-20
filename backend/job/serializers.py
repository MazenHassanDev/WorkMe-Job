from rest_framework import serializers
from .models import JobApplicationModel
from datetime import date

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplicationModel
        fields = ['id', 'user', 'title', 'company', 'location', 'job_url', 'description', 'status', 'ai_summary', 'applied_at', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


    def validate_applied_at(self, value):
        if value > date.today():
            raise serializers.ValidationError('Applied date error.')
        return value

        

