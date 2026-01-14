from django.db import models
from django.conf import settings
from django.db import models

class Expense(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,        # 👈 TEMP
        blank=True        # 👈 TEMP
    )
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    category = models.CharField(max_length=50, default="General")
    
    def __str__(self):
        return f"{self.category} - {self.amount}"
 