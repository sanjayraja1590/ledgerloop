from django.db import models

class Expense(models.Model):
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100, default="General")
    date = models.DateField()  # ✅ NO auto_now_add, NO default

    def __str__(self):
        return f"{self.category} - {self.amount}"
 