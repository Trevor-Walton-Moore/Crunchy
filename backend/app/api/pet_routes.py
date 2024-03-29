from flask import Blueprint, redirect, render_template, url_for, session, request, jsonify
from flask_login import login_required, current_user
import json

from flask_sqlalchemy import SQLAlchemy

from app.models import db, Pet, User
from app.forms import PetForm
import sys

pet_routes = Blueprint("pet", __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{error}')
    return errorMessages

# Get one Pet
@pet_routes.route("/<int:id>")
@login_required
def pet_index(id):
    # pet = Pet.query.get(id)
    pet = Pet.query.filter_by(owner_id=id).first()
    return pet.to_dict(), 200

# Create Pet
@pet_routes.route("", methods=["POST"])
@login_required
def create_pet():
    form = PetForm()
    owner = current_user.to_dict()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_pet = Pet(
            owner_id=owner['id'],
            type=form.data['type'],
            name=form.data['name'],
            breed=form.data['breed'],
            profile_icon=form.data['profileIcon'],
            weight=form.data['weight'],
            gender=form.data['gender'],
            celebration_day=form.data['celebrationDay'],
            birthday=form.data['birthday'],
            adoption_day=form.data['adoptionDay'],
            cover_image=form.data['coverImage']
        )
        db.session.add(new_pet)
        db.session.commit()

        return {"pet": new_pet.to_dict()}, 201

    return {'errors': validation_errors_to_error_messages(form.errors)}


# Update Pet
@pet_routes.route("/<int:id>", methods=['PUT'])
@login_required
def update_pet(id):
    form = PetForm()

    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        updated_pet = Pet.query.get(id)

        setattr(updated_pet, 'type', form.type.data)
        updated_pet.name = form.name.data
        setattr(updated_pet, 'breed', form.breed.data)
        setattr(updated_pet, 'weight', form.weight.data)
        setattr(updated_pet, 'gender', form.gender.data)
        setattr(updated_pet, 'profile_icon', form.profileIcon.data)
        setattr(updated_pet, 'celebration_day', form.celebrationDay.data)
        setattr(updated_pet, 'birthday', form.birthday.data)
        setattr(updated_pet, 'adoption_day', form.adoptionDay.data)
        setattr(updated_pet, 'cover_image', form.coverImage.data)

        db.session.add(updated_pet)
        db.session.commit()
        return {'pet': updated_pet.to_dict()}, 201
    return {'errors': validation_errors_to_error_messages(form.errors)}

# Delete Pet
@pet_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def destroy_pet(id):
    owner = current_user.to_dict()

    pet = Pet.query.get(id)
    if owner['id'] == pet.owner_id:
        db.session.delete(pet)
        db.session.commit()
        return {"message": "Successfully Deleted", "pet": pet.to_dict()}, 200
    return 'BAD REQUEST', 404
