from rest_framework.throttling import UserRateThrottle

class SummarizeRateThrottle(UserRateThrottle):
    scope = "summarize"