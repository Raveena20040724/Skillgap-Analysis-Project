from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
# pyrefly: ignore [missing-import]
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),

    # OpenAPI Schema & Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # API Version 1 Routes
    path('api/v1/accounts/', include('accounts.urls')),
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/employee/', include('profiles.urls')),
    path('api/v1/employee/', include('skills.urls')),
    path('api/v1/employee/', include('resumes.urls')),
    path('api/v1/employee/', include('ai_engine.urls')),
    path('api/v1/employee/', include('assessments.urls')),
    path('api/v1/employee/', include('courses.urls')),
    path('api/v1/hr/', include('hr.urls')),
    path('api/v1/admin/', include('admin_panel.urls')),

    # Direct /api/ prefix routes (Legacy/Fallback for existing frontend services)
    path('api/accounts/', include('accounts.urls')),
    path('api/employee/', include('profiles.urls')),
    path('api/employee/', include('skills.urls')),
    path('api/employee/', include('resumes.urls')),
    path('api/employee/', include('ai_engine.urls')),
    path('api/employee/', include('assessments.urls')),
    path('api/employee/', include('courses.urls')),
    path('api/hr/', include('hr.urls')),
    path('api/admin/', include('admin_panel.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
