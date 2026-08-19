from rest_framework import serializers
from accounts.models import CustomUser

class AdminUserManagementSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField(read_only=True)
    managedStaff = serializers.SerializerMethodField(read_only=True)
    company = serializers.SerializerMethodField(read_only=True)
    companySize = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'role', 'department', 'designation',
            'phone', 'avatar', 'is_active', 'status', 'managedStaff', 'company', 'companySize', 'created_at'
        ]

    def get_status(self, obj):
        return 'Active' if obj.is_active else 'Inactive'

    def get_managedStaff(self, obj):
        return "145 Employees" if obj.role in ['hr', 'admin'] else "N/A"

    def get_company(self, obj):
        return "TechCorp Systems"

    def get_companySize(self, obj):
        return "500+ Staff"
