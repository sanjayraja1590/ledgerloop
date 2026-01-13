from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import CategoryListView, ExpenseViewSet, AvailableMonthsView, CategorySummaryView

router = DefaultRouter()
router.register("expenses", ExpenseViewSet, basename="expense")

urlpatterns = [
    path("expenses/months/", AvailableMonthsView.as_view()),
    path("expenses/summary/", CategorySummaryView.as_view()),
    path("categories/", CategoryListView.as_view()),

]

urlpatterns += router.urls
