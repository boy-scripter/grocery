<template>
    <section>

        <Modal v-if="modal.order" @close="modal.order = false">
            <div class="order-successful">
                <span>Order Successfull</span>
                <p> orderid : {{ '#' + state.orderid }}</p>
            </div>
        </Modal>

        <template v-if="state.cart.length">
            <div className="grid">
                <div className="alignment options">
                    <span>ITEM</span>
                    <span>PRICE</span>
                    <span>QUANTITY</span>
                    <span>SUBTOTAL</span>
                    <span>REMOVE</span>
                </div>

                <div v-for="cart, index in state.cart" className="alignment options" :key=index>
                    <div className="image_name item">
                        <img :src="API + '/' + cart.item.image" alt="productimage" class="image" />
                        <span>
                            <p className="small-text">{{ cart.item.name }}</p>
                        </span>
                    </div>
                    <p className="price">{{ cart.item.price.toFixed(2) }}</p>
                    <p className="quan">{{ cart.quantity }}</p>
                    <button className="outofstock" v-if="cart.outOfstock">Out Of Stock</button>
                    <button className="outofstock" v-else-if="cart.subtotal">{{ cart.subtotal }}</button>
                    <p className="subtotal" v-else>{{ (cart.item.price * cart.quantity) + "rs" }}</p>
                    <i className="fa-solid fa-trash" @click="deleteCart(cart.item._id)"></i>
                </div>

            </div>
            <div className="alignment btns">
                <RouterLink to="/home">
                    <button class="addtocart">CONTINUE SHOPPING</button>
                </RouterLink>
            </div>

            <div class="final_price">
                <div class="receipt">

                    <div class="order-details">
                        <h3>Order Total:</h3>
                        <p> {{ state.cartTotal }}</p>
                        <h3>Delivery Charges:</h3>
                        <p style="color: green;">FREE</p>
                    </div>
                    <div class="total">
                        <p><strong>Total:</strong> {{ state.cartTotal }}</p>
                    </div>
                    <button type="button" @click="Checkout" :disabled="state.error">Checkout</button>
                </div>
            </div>
        </template>
        <div v-else>
            <h2 class="empty">
                <i class="fa-solid fa-cart-shopping"></i> Cart is Empty
            </h2>
        </div>
    </section>
</template>


<script setup>

import { API } from '../constant';
import { onMounted, reactive } from 'vue';
import axios from 'axios';
import Modal from '../components/Modal.vue';

let headers = { Authorization: localStorage.getItem('token') }


const state = reactive({
    cart: [],
    cartTotal: 0,
    error: false,
    orderid: false
})

const modal = reactive({
    order: false
})

function deleteCart(itemId) {

    axios.post(API + '/user/update_cart', {
        item: itemId,
        quantity: 0,
    }, { headers })
        .then(() => {
            const itemIndex = state.cart.findIndex(currentElement => {
                state.error = currentElement.subtotal !== undefined && currentElement.outOfstock !== undefined;
                return currentElement.item._id === itemId
            });

            if (itemIndex !== -1) {
                state.cart.splice(itemIndex, 1);
                state.cartTotal = state.cart.reduce((total, cartItem) => total + (cartItem.item.price * cartItem.quantity), 0);
            }
        })
        .catch((error) => (state.error = error.message));

}

function Checkout() {
    axios.get(API + '/user/checkout', { headers })
        .then(res => {
            state.cart = [],
                state.cartTotal = 0
            state.orderid = res.data.id
            modal.order = true
        })
        .catch(error => state.error = error.message)
}

onMounted(() => {
    axios.get(API + '/user/cart', { headers })
        .then(res => {
            state.cart = res.data.cart.map(myItem => {
                const differnce = myItem.item.quantity - myItem.quantity

                if (!myItem.item.quantity) {
                    myItem.outOfstock = true;
                    state.error = true;
                    return myItem
                }

                if (differnce < 0) {
                    myItem.subtotal = 'only ' + -(-differnce - myItem.quantity) + ' left';
                    state.error = true;
                    return myItem
                }

                return myItem
            })

            state.cartTotal = res.data.cart.reduce((total, cartItem) => total + (cartItem.item.price * cartItem.quantity), 0);
        })
        .catch(error => state.error = error.message)
})

</script>


<style scoped>
.order-successful {
    text-align: center;
    padding: 20px 0;
}

.modal {
    background  : white !important;
 
}

.modal i {
    color: rgb(255, 255, 255);

}

.modal .btn {
    background: transparent   ;
    box-shadow: none;
    position: static;

}

.order-successful span {
    color: rgb(3, 117, 3);
    font-weight: 900;
    font-size: 24px;
}

.outofstock {
    all: unset;
    padding: 3px 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    background: red;
    color: white;
    border-radius: 5px;
    font-size: 12px;
    margin: 15px 0px 5px 0;
    font-weight: 500;
    display: inline-block;

}


.receipt button {
    all: unset;
    background-color: royalblue;
    padding: 10px 20px;
    color: white;
    border: 1px solid royalblue;
    cursor: pointer;
    border-radius: 5px;
    transition: 0.2s;
}

.receipt button:disabled {
    opacity: 0.5;
}

.receipt {
    padding: 10px 20px;
    border: 1px solid #333;
    border-radius: 5px;
}

.header {
    text-align: center;
}

.order-details {
    margin: 10px 0;
}

.order-details h3 {
    font-size: 16px;
}

.order-details p {
    margin: 5px 0;
}

.total {
    text-align: right;
}

.total p {
    font-size: 1.2em;
    margin: 5px 0;
}

section {
    width: 100%;
    padding: 10px 40px;
}

section .small-text {
    font-size: 8px;
}

section .grid {
    display: grid;
    grid-template-columns: 100%;
    grid-auto-rows: 60px;
    font-weight: 700;
}

section .grid .options {
    padding-inline: 20px;
}

section .grid .options * {
    flex-basis: 100px;
}

section .grid .options,
section .grid div:last-child {
    border-bottom: 1px solid black;
}

section .btns {
    margin-top: 10px;
}

section .color {
    font-size: 11px;
}

section .color .color-option {
    border-radius: 3px;
    width: 8px;
    height: 10px;
}

section .item {
    gap: 5px;
}

section .item img {
    object-fit: contain;
    aspect-ratio: 1/1;
}

section .fa-trash {
    cursor: pointer;
}

.alignment {
    display: flex;
    justify-content: space-between;
    text-align: center;
    align-items: center;
}

.image_name {
    display: flex;
    align-items: center;
}

.image {
    width: 30px;
}

.fa-trash {
    color: rgb(199, 96, 96);
}

.addtocart {

    all: unset;
    border: 0px solid gray;
    border-radius: 5px;
    padding: 7px;
    cursor: pointer;
    transition: color 0.15s ease-in-out;
    color: white;
    padding: 8px 15px;
    background: #0075FF;

}

.final_price {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;

}

a {
    all: unset;
}

.empty {
    text-align: center;
    margin-top: 100px;
}

@media screen and (max-width: 578px) {
    section {
        font-size: 13px;
        padding: 5px;
    }

    .receipt {
        width: 100%;
    }

    section .grid .options {
        padding-inline: 0px;
    }

    section .grid .options * {
        flex-basis: 90px;
    }

    section .btns .btn {
        font-size: 13px;
    }
}
</style>