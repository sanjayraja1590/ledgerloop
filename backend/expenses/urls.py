from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExpenseViewSet, AvailableMonthsView, CategorySummaryView, CategoryListView

router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet, basename='expense')

urlpatterns = [
    path("", include(router.urls)),

    # ✅ PUBLIC ROUTES
    path("months/", AvailableMonthsView.as_view(), name="months"),
    path("summary/", CategorySummaryView.as_view(), name="summary"),
    path("categories/", CategoryListView.as_view(), name="categories"),
]
