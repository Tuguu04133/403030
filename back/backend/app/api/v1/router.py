from fastapi import APIRouter

from app.api.v1.routers import committees, health, students, teachers, mock_evaluations, analytics, recommendations

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(teachers.router, prefix="/teachers", tags=["teachers"])
api_router.include_router(committees.router, prefix="/committees", tags=["committees"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(mock_evaluations.router, prefix="/evaluations", tags=["evaluations"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])



