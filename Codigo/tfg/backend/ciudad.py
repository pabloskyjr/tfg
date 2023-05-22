# Librería Spacy
import spacy
from spacy.tokens import Span

#Librería Sumy
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer

# Librerías adicionales como wikipedia-api o json
import json
import wikipediaapi
from io import BytesIO
from PIL import Image
import re
#from pixabay import Image 

from flask_cors import CORS
nlp = spacy.load("es_core_news_sm")
from flask import Flask, request, jsonify

import requests

app = Flask(__name__)
CORS(app)

# Método que detecta la ciudad en el texto pasado por parámetro
def get_ciudad(span):
    if span.label_ in ("LOC"):
        entity_text = span.text.replace(" ", "_")
        return entity_text

Span.set_extension("get_ciudad", getter=get_ciudad)


@app.route('/api/envio', methods=['POST'])
def create_resource():
    lista = []
    data = request.get_json()
    doc = nlp(data['texto'])  
    for ent in doc.ents:
        lista.append(ent._.get_ciudad)
    
    # Hago la llamada al API externo de la IA

    url = "https://chatgpt53.p.rapidapi.com/"

    payload = { 
            "messages": [
                {
                    "role": "user",
                    "content": "Enumera 8 Lugares de interés de" + str(lista[0]) +" para personas de "+ str(data['edad']) +"años con objetivo de"+ str(data['objetivo'])+"sin explicacion"
                }
            ] 
        }
    headers = {
        "content-type": "application/json",
        "X-RapidAPI-Key": "df160a13f9mshb2095a7423acfb5p15a633jsn7e7ba094823e",
        "X-RapidAPI-Host": "chatgpt53.p.rapidapi.com"
    }

    # Guardo la respuesta y añado otros valores como la ciudad para tenerlo también en el frontned

    response = requests.post(url, json=payload, headers=headers)
    res = response.json()
    res['ciudad'] = lista[0]
    res['edad'] = data['edad']
    res['objetivo'] = data['objetivo']
    return jsonify(res), 201

def get_wikipedia_image_url(page_title):
    pixabay = Image(api_key='36623246-7038aa3d8b22acf0041e435e0')

    # Search for images of cats
    images = pixabay.search(q=page_title)

    # Download the first image in the search results
    response = requests.get(images.hits[0].largeImageURL)
    img = Image.open(BytesIO(response.content))
    img.show()


@app.route('/api/resumen', methods=['POST'])
def create_summary():
    data = request.get_json()
    lugar = data['lugar']
    ciudad = str(data['ciudad'])
    res = '{"resumen": "'
    search_url = 'https://es.wikipedia.org/w/api.php'

    # Inicializo los valores de búsqueda en la api de wikipedia
    search_params = {
        'action': 'query',
        'format': 'json',
        'list': 'search',
        'srsearch': lugar
    }
    
    response = requests.get(search_url, params=search_params)
    data = response.json()
    #imageUrl = ''

    # Se hace la búsqueda
    if 'query' in data and 'search' in data['query']:
        # Obtener el primer resultado de la búsqueda
        first_result = data['query']['search'][0]

        # Obtener el título de la página
        page_title = first_result['title']
        cadena1 = ciudad

        # Comprobamos que el título tenga el nombre de la ciudad para que no haya fallos como Teatro Real (¿de dónde?)
        if page_title.find(cadena1) == -1:
            # Si no está la ciudad en el título, lo añadimos al títuloy y realizamos una nueva búsqueda (ej. Teatro Real + 'de Madrid')
            page_title+= " de " + str(ciudad)
            page_title.replace("(desambiguación)", "")
            search_params = {
                'action': 'query',
                'format': 'json',
                'list': 'search',
                'srsearch': page_title
            }

            response = requests.get(search_url, params=search_params)
            data2 = response.json()
            print(page_title)

            # Hacemos la segunda búsqueda y recogemos el título del primer resultado de búsqueda
            if 'query' in data2 and 'search' in data2['query']:
                first_result = data2['query']['search'][0]
                page_title = first_result['title']
                wiki_wiki = wikipediaapi.Wikipedia('es')
                #imageUrl = get_wikipedia_image_url(page_title)
                page_py = wiki_wiki.page(page_title)
                # Asignamos a la variable el valor del texto de la web
                resumen = page_py.summary

            else:
                print(f"No se encontró la página de Wikipedia para {page_title}")
        else:
            page_title.replace("desambiguación", "")
            print(page_title)
            wiki_wiki = wikipediaapi.Wikipedia('es')
            #imageUrl = get_wikipedia_image_url(page_title)

            # Asignamos a la variable el valor del texto de la web
            page_py = wiki_wiki.page(page_title)

        if page_py.exists():
            resumen = page_py.summary
        else:
            print(f"No se encontró la página de Wikipedia para {page_title}") 

        # Retiramos las referencias del texto para que no se muestren en el resumen
        resumenSinCorchetes = re.sub(r'\[\d+\]', ' ', resumen)

        # Hacemos el resumen con el algoritmo LenRankSummarizer y con tamaño de 2 oraciones
        parser = PlaintextParser.from_string(resumenSinCorchetes, Tokenizer("spanish"))
        summarizer = LexRankSummarizer()
        resumenFinal = summarizer(parser.document, sentences_count=2) 

        # Asignamos al valor que devolvemos en el método el valor del resumen
        for oracion in resumenFinal:
            res+=str(oracion)
        res+='", '
        res+=' "lugar":"'+lugar+'" }'
        
    else:
        print('No se encontraron resultados.')

    # Devolvemos el valor
    return json.loads(res)


app.run()