import json
import spacy
from spacy.matcher import Matcher
from spacy.tokens import Span

nlp = spacy.load("es_core_news_md")

TRAINING_DATA = [
    ("Como pre-ordenar los adidas ZX", {"entities": [(21, 30, "ROPA")]})
]

for i in range(10):
    random.shuffle(TRAINING_DATA)
    for batch in spacy.util.minibatch(TRAINING_DATA):
        texts = [text for text, annotation in batch]
        annotations = [annotation for text, annotation in batch]
        nlp.update(texts, annotations)
nlp.to_disk(path_to_model)
