import spacy
from spacy.tokens import Span
# creating the Flask application
from flask_cors import CORS
nlp = spacy.load("es_core_news_sm")
from flask import Flask, request, jsonify

import requests

app = Flask(__name__)
CORS(app)


def get_wikipedia_url(span):
    # Obtén la URL de Wikipedia si el span tiene uno de los siguientes labels
    if span.label_ in ("LOC"):
        entity_text = span.text.replace(" ", "_")
        return "https://es.wikipedia.org/w/index.php?search=" + entity_text

Span.set_extension("wikipedia_url", getter=get_wikipedia_url)


@app.route('/api/envio', methods=['POST'])
def create_resource():
    lista = []
    data = request.get_json()
    doc = nlp(data['texto'])  
    for ent in doc.ents:
        lista.append(ent._.wikipedia_url)

    url = "https://chatgpt53.p.rapidapi.com/"

    payload = { 
            "messages": [
                {
                    "role": "user",
                    "content": "Lugares de interés de" + str(lista[0]) +" para un chico de "+ str(data['edad']) +"con objetivo de"+ str(data['objetivo'])
                }
            ] 
        }
    headers = {
        "content-type": "application/json",
        "X-RapidAPI-Key": "df160a13f9mshb2095a7423acfb5p15a633jsn7e7ba094823e",
        "X-RapidAPI-Host": "chatgpt53.p.rapidapi.com"
    }
    response = requests.post(url, json=payload, headers=headers)
    return jsonify(response.json()), 201

app.run()