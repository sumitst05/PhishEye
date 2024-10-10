from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from app.model import predict_url, predict_email

router = APIRouter()


class URLFeatures(BaseModel):
    length_url: int
    length_hostname: int
    nb_dots: int
    nb_qm: int
    nb_eq: int
    nb_slash: int
    nb_www: int
    ratio_digits_url: float
    ratio_digits_host: float
    tld_in_subdomain: int
    shortest_word_host: int
    longest_words_raw: int
    longest_word_path: int
    nb_hyperlinks: int
    ratio_intHyperlinks: float
    empty_title: int
    domain_in_title: int


class EmailContent(BaseModel):
    email_text: str


@router.post("/predict_url")
async def url_prediction(features: URLFeatures):
    try:
        feature_dict = features.model_dump()
        prediction = predict_url(feature_dict)
        return JSONResponse(status_code=200, content=prediction)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/predict_email")
async def email_prediction(content: EmailContent):
    try:
        email_data = {"email_text": content.email_text}
        prediction = predict_email(email_data)
        return JSONResponse(status_code=200, content=prediction)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
