from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.evaluation import (
    KomissinEhiinUzleg,
    KomissinGishvvdUzleg,
    UridchilsanHamgaalalt,
    UridchilsanKomissinGishvvd,
    JinkheneHamgaalalt,
    JinkheneKomissinGishvvd,
    ReviewerEvaluation,
    Progress1Evaluation,
    OverallEvaluation,
)

router = APIRouter()


@router.get("/komissin-ehiin-uzleg")
def get_komissin_ehiin_uzleg(db: Session = Depends(get_db)):
    """Table 1: Комиссын эхний үзлэг (from PostgreSQL)"""
    return db.query(KomissinEhiinUzleg).all()


@router.get("/komissin-gishvvd-uzleg")
def get_komissin_gishvvd_uzleg(db: Session = Depends(get_db)):
    """Table 2: Комиссын гишүүдийн үзлэг (from PostgreSQL)"""
    return db.query(KomissinGishvvdUzleg).all()


@router.get("/uridchilsan-hamgaalalt")
def get_uridchilsan_hamgaalalt(db: Session = Depends(get_db)):
    """Table 3: Урьдчилсан хамгаалалт (from PostgreSQL)"""
    return db.query(UridchilsanHamgaalalt).all()


@router.get("/uridchilsan-komissin-gishvvd")
def get_uridchilsan_komissin_gishvvd(db: Session = Depends(get_db)):
    """Table 4: Урьдчилсан хамгаалалтын гишүүд (from PostgreSQL)"""
    return db.query(UridchilsanKomissinGishvvd).all()


@router.get("/jinkhene-hamgaalalt")
def get_jinkhene_hamgaalalt(db: Session = Depends(get_db)):
    """Table 5: Жинхэнэ хамгаалалт (from PostgreSQL)"""
    return db.query(JinkheneHamgaalalt).all()


@router.get("/jinkhene-komissin-gishvvd")
def get_jinkhene_komissin_gishvvd(db: Session = Depends(get_db)):
    """Table 6: Жинхэнэ хамгаалалтын гишүүд (from PostgreSQL)"""
    return db.query(JinkheneKomissinGishvvd).all()


@router.get("/reviewer-evaluations")
def get_reviewer_evaluations(db: Session = Depends(get_db)):
    """Шүүмжийн үнэлгээ (3-5 онооноос)"""
    return db.query(ReviewerEvaluation).all()


@router.get("/progress-1-evaluations")
def get_progress_1_evaluations(db: Session = Depends(get_db)):
    """Явц 1-ийн үнэлгээ (15 онооноос)"""
    return db.query(Progress1Evaluation).all()


@router.get("/overall-evaluations")
def get_overall_evaluations(db: Session = Depends(get_db)):
    """Нийт overall үнэлгээ (100 онооноос)"""
    return db.query(OverallEvaluation).all()


