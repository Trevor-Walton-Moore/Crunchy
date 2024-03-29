from flask import Blueprint, redirect, render_template, url_for, session, request, jsonify
from flask_login import login_required, current_user
import json

from flask_sqlalchemy import SQLAlchemy

from app.models import db, Order, Product, User, OrdersProducts
from app.forms import OrderForm, OrdersProductsForm
import sys

order_routes = Blueprint("cart", __name__)

# Get one Order
@order_routes.route("/<int:user_id>")
@login_required
def order_index(user_id):
    order = Order.query.filter(Order.user_id == user_id).order_by(Order.id.desc()).first()
    order_products = OrdersProducts.query.filter(OrdersProducts.order_id == order.to_dict()['id']).all()
    order_products_to_dict = [order_product.to_dict() for order_product in order_products]
    return {"order": order.to_dict(), "orderProducts": order_products_to_dict}, 200

# Create Order
@order_routes.route("", methods=["POST"])
@login_required
def create_order():
    order_form = OrderForm()
    user = current_user.to_dict()
    order_form['csrf_token'].data = request.cookies['csrf_token']

    if order_form.validate_on_submit():

        product = Product.query.get(order_form.data['productId'])



        created_order = Order(
            user_id=user['id'],
            # product_id=form.data['productId']
        )
        db.session.add(created_order)
        db.session.commit()

        new_order = Order.query.filter(Order.user_id==user['id']).order_by(Order.id.desc()).first()

        new_orders_product = OrdersProducts(
            order_id = new_order.id,
            product_id = order_form.data['productId'],
            quantity = 1,
        )

        db.session.add(new_orders_product)
        db.session.commit()

        order_products = OrdersProducts.query.filter(OrdersProducts.order_id == new_order.id).all()

        order_products_to_dict = [order_product.to_dict() for order_product in order_products]

        return {"order": new_order.to_dict(), "orderProducts": order_products_to_dict}, 201

    return {"errors": "VALIDATION: Could not complete Your request"}


# Update Order
@order_routes.route("", methods=['PUT'])
@login_required
def update_order():

    user = current_user.to_dict()
    form = OrdersProductsForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():

        filters = [OrdersProducts.order_id == form.data['orderId'], OrdersProducts.product_id == form.data['productId']]

        updated_order_product = OrdersProducts.query.filter(*filters).first()

        if not updated_order_product:

            new_orders_product = OrdersProducts(
                order_id = form.data['orderId'],
                product_id = form.data['productId'],
                quantity = 1,
            )
            db.session.add(new_orders_product)
            db.session.commit()

        elif form.data['quantity'] == 0:
            db.session.delete(updated_order_product)
            db.session.commit()

        else:
            setattr(updated_order_product, 'order_id', form.data['orderId'])
            setattr(updated_order_product, 'product_id', form.data['productId'])
            setattr(updated_order_product, 'quantity', form.data['quantity'])

            db.session.add(updated_order_product)
            db.session.commit()

        order_products = OrdersProducts.query.filter(OrdersProducts.order_id == form.data['orderId']).all()

        order_products_to_dict = [order_product.to_dict() for order_product in order_products]

        order = Order.query.filter(Order.user_id==user['id']).order_by(Order.id.desc()).first()

        return {'order': order.to_dict(), 'orderProducts': order_products_to_dict}, 201

    return {"errors": ["UNAUTHORIZED: Can't Edit this cart!"]}, 400

# Delete Order
@order_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def destroy_order(id):
    user = current_user.to_dict()

    order = Order.query.filter(Order.id == id).order_by(Order.id.desc()).first()

    order_products = OrdersProducts.query.filter(OrdersProducts.order_id == id).all()

    if order_products:
        for order_product in order_products:
            db.session.delete(order_product)

    # db.session.delete(order)

    db.session.commit()
    return {"message": "Successfully Deleted", "order": order.to_dict()}, 200
