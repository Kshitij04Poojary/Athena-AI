from flask import Blueprint, request, jsonify, current_app
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from bson.objectid import ObjectId
mentor_mentee = Blueprint("mentor_mentee", __name__)
model = SentenceTransformer('all-MiniLM-L6-v2')

@mentor_mentee.route("/", methods=["POST"])
def get_score():
    collection_mentor = current_app.db['mentors']  # Replace with your collection name
    users = current_app.db['users']
    # Step 2: Fetch mentor data using mentor ObjectId
    mentee_id = ObjectId('67c5d27a30e8c2a262bb9b20')  # Replace with the actual mentor's ObjectId


    # Query to find the mentor
    mentors = collection_mentor.find({})
    mentee = users.find_one({'_id': mentee_id})

    # Step 3: Print mentor data
    if mentee:
        print("Mentee: ", mentee)
        print("Mentors are: ")
        for mentor in mentors:
            print(mentor)
        # print("mentor: ", mentors)
    else:
        print("Mentee not found!")
    data = request.get_json()
    mentees = data["mentee"]
    mentors = data["mentors"]
    # Convert interests/expertise into embeddings
    mentee_texts = [mentee['interests'] for mentee in mentees]
    mentor_texts = [mentor['expertise'] for mentor in mentors]

    mentee_embeddings = model.encode(mentee_texts)
    mentor_embeddings = model.encode(mentor_texts)

    # Compute similarity scores
    similarity_matrix = cosine_similarity(mentee_embeddings, mentor_embeddings)

    # Add similarity scores to the mentor objects
    for i, mentor in enumerate(mentors):
        mentor["similarity_score"] = float(similarity_matrix[0][i]) 

    sorted_mentors = sorted(mentors, key=lambda x: x['similarity_score'], reverse=True)
    return jsonify(sorted_mentors)