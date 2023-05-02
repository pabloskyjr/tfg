import spacy
from spacy.tokens import Span
# creating the Flask application
from flask_cors import CORS
nlp = spacy.load("es_core_news_sm")
from flask import Flask, request, jsonify

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
    for id in lista:
        print(id)
    # Guardar el recurso nuevo en una base de datos o en un archivo
    return jsonify(lista), 201

app.run()