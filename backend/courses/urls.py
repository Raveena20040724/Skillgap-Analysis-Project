from django.urls import path
from .views import CourseListView, EnrollCourseView, UpdateProgressView, ProgressAnalyticsView

urlpatterns = [
    path('courses/', CourseListView.as_view(), name='employee_courses_list'),
    path('courses/<int:pk>/enroll/', EnrollCourseView.as_view(), name='course_enroll'),
    path('courses/<int:pk>/progress/', UpdateProgressView.as_view(), name='course_progress'),
    path('progress/', ProgressAnalyticsView.as_view(), name='employee_progress_analytics'),
]
