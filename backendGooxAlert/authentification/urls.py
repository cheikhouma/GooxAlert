from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
import authentification.views as views

urlpatterns = [
    path('api/register/', views.RegisterUserAPIView.as_view(), name='register'),
    path('api/login/', views.LoginAPIView.as_view(), name='login'),
    path('api/update-personal-info/', views.UpdatePersonalInfoAPIView.as_view(), name='update_personal_info'),
    path('api/modifier-mot-de-passe/', views.ChangePasswordAPIView.as_view(), name='modifier-mot-de-passe'),
    path('api/demande-reinitialisation/', views.RequestPasswordResetAPIView.as_view(), name='demande-reinitialisation'),
    path('api/reinitialiser-mot-de-passe/', views.ResetPasswordAPIView.as_view(), name='reinitialiser-mot-de-passe'),
    path('api/profile/', views.ProfileAPIView.as_view(), name='profile'),
    path('api/me/', views.CurrentUserAPIView.as_view(), name='me'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Routes d'administration
    path('api/admin/users/', views.AdminUserListView.as_view(), name='admin-users-list'),
    path('api/admin/users/<int:user_id>/role/', views.AdminUpdateUserRoleView.as_view(), name='admin-update-user-role'),
]



# path("test/", views.test_sms, name="test"),
