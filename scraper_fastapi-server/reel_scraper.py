from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from instagrapi import Client
import os
import pickle

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

USERNAME = "hell.ow2649"
PASSWORD = "Hardi@Hardi1102"
SESSION_FILE = "insta_session.pkl"

cl = Client()

def login():
    if os.path.exists(SESSION_FILE):
        with open(SESSION_FILE, "rb") as f:
            session = pickle.load(f)
        cl.set_settings(session["settings"])
        cl.login(USERNAME, PASSWORD, verification_code=session.get("verification_code"))
    else:
        cl.login(USERNAME, PASSWORD)
        with open(SESSION_FILE, "wb") as f:
            pickle.dump({"settings": cl.get_settings()}, f)


@app.get("/test")
def test():
    return {"message": "CORS works!"}


@app.get("/scrape")
def scrape_reel(url: str):
    login()
    media_pk = cl.media_pk_from_url(url)
    media = cl.media_info(media_pk)
    user_full = cl.user_info_by_username(media.user.username)

    comments = cl.media_comments(media.pk, amount=100)
    comment_data = [{
        'id': c.pk,
        'text': c.text,
        'username': c.user.username,
        'like_count': c.like_count
    } for c in comments]

    reel_data = {
        'method': 'instagrapi',
        'shortcode': media.code,
        'id': media.pk,
        'username': media.user.username,
        'full_name': user_full.full_name,
        'bio': user_full.biography,
        'verified': user_full.is_verified,
        'profile_pic_url': str(user_full.profile_pic_url),
        'followers': user_full.follower_count,
        'like_count': media.like_count,
        'view_count': media.view_count,
        'comment_count': media.comment_count,
        'caption': media.caption_text,
        'taken_at': media.taken_at.isoformat(),
        'video_url': str(media.video_url),
        'image_url': str(media.thumbnail_url),
        'comments': comment_data
    }

    return reel_data
