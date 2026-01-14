from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "django-insecure-p5zy6z=gd%-4y$)#1&fje9^3h41c5u7t_&6+r8$ffts_auhs(j"

DEBUG = False  # ✅ REQUIRED FOR RENDER

ALLOWED_HOSTS = ["*"]  # OK for now on Render

# ---------------- APPS ----------------
INSTALLED_APPS = [
    "corsheaders",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    'rest_framework_simplejwt',
    "expenses",
]

# ---------------- MIDDLEWARE ----------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # MUST be first
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"

# ---------------- DATABASE ----------------
import dj_database_url
import os

DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("postgresql://ledgerloop_db_user:azFpbJgiTiBKb0gtXWKT0HIZJtUEYsLN@dpg-d5jk9av5r7bs7381lrqg-a.oregon-postgres.render.com/ledgerloop_db")
    )
}

# ---------------- PASSWORDS ----------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ---------------- I18N ----------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# ---------------- STATIC FILES (RENDER FIX) ----------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_STORAGE = (
    "whitenoise.storage.CompressedManifestStaticFilesStorage"
)

# ---------------- CORS ----------------
CORS_ALLOW_ALL_ORIGINS = True

# ---------------- DEFAULT PK ----------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ---------------- JWT config ----------------
from datetime import timedelta

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "AUTH_HEADER_TYPES": ("Bearer",),
}
