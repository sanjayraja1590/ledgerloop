from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response   # 👈 THIS WAS MISSING
from rest_framework.views import APIView
from .models import Expense
from .serializers import ExpenseSerializer
from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


class AvailableMonthsView(APIView):
    def get(self, request):
        months = Expense.objects.filter(user=request.user).dates("date", "month", order="DESC")
        month_list = [m.strftime("%Y-%m") for m in months]
        return Response(month_list)

from rest_framework.response import Response

class ExpenseViewSet(ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        queryset = Expense.objects.filter(user=self.request.user)


        # -------- MONTH FILTER (YYYY-MM) --------
        month_param = self.request.query_params.get("month")
        if month_param:
            try:
                year_str, month_str = month_param.strip().split("-")
                queryset = queryset.filter(
                    date__year=int(year_str),
                    date__month=int(month_str)
                )
            except ValueError:
                pass  # invalid format → ignore filter

        # -------- CATEGORY FILTER (USER-DEFINED) --------
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category__iexact=category.strip())

        # -------- SORTING --------
        sort = self.request.query_params.get("sort")

        if sort == "amount_asc":
            queryset = queryset.order_by("amount")

        elif sort == "amount_desc":
            queryset = queryset.order_by("-amount")

        elif sort == "order_asc":
            queryset = queryset.order_by("id")       # oldest first

        elif sort == "order_desc":
            queryset = queryset.order_by("-id")      # newest first

        else:
            queryset = queryset.order_by("-id")

        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        total = sum(exp.amount for exp in queryset)

        return Response({
            "total": total,
            "expenses": serializer.data
        })
    
class CategorySummaryView(APIView):
    def get(self, request):
        month = request.query_params.get("month")

        queryset = Expense.objects.filter(user=request.user)

        if month:
            year, month = month.split("-")
            queryset = queryset.filter(
                date__year=year,
                date__month=month
            )

        summary = (
            queryset
            .values("category")
            .annotate(total=Sum("amount"))
        )

        result = {
            item["category"]: item["total"]
            for item in summary
        }

        return Response(result)

class CategoryListView(APIView):
    def get(self, request):
        categories = (
            Expense.objects
            .values_list("category", flat=True)
            .distinct()
        )
        return Response(list(categories))
