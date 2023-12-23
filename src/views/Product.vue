<template>
    <div class="cont">
        <div class="cont-child">
            <div class="main-img">
                <img ref="ima" :src="API + '/' + state.item.image" alt="">
            </div>
            <div class="other-img">
                <img :src="API + '/' + state.item.image" alt="">
                <img  :src="API + '/' + image" class="item" v-for="image, index in state.item.media" :key="index" />
            </div>
        </div>
        <div class="cont-child">
            <p class="path">
                <RouterLink to="/home"> Home </RouterLink> /
                <RouterLink :to="'/category/' + state.item.category?._id"> {{ state.item.category?.name }} </RouterLink> /
                <span>{{ state.item.name }}</span>
            </p>
            <h3 class="title">{{ state.item.name }}</h3>
            <div class="description">
                {{ state.item.description }}
                <br>
            </div>
            <RouterLink :to="'/category/' + state.item.category?._id">
                <div class="category-badge">
                    {{ state.item.category?.name }}
                </div>
            </RouterLink>
            <div class="price-and-btn">
                <div class="price">
                    <p> {{ state.item.unit }}</p>
                    <p>MRP &ensp;<i class="fa-solid fa-indian-rupee-sign"></i>&nbsp;{{ state.item.price }}</p>
                </div>
                <div class="flex">
                    <div class="btns" v-if="!state.isOutofStock">
                        <button v-if="!state.quantity" @click="state.quantity++; update_cart()" class="addtocart">Add</button>
                        <div v-if="state.quantity" class="plus-minus-btn">
                            <button @click="state.quantity--; update_cart()">-</button>
                            <span>{{ state.quantity }}</span>
                            <button @click="state.quantity++; update_cart()" :disabled="state.quantity >= state.item.quantity">+</button>
                        </div>

                    </div>
                    <div class="category-badge bg-red" v-else>Out of Stock</div>
                    <div>
                        <RouterLink to="/checkout" class="gotocart"> Go To Cart </RouterLink>
                    </div>
                </div>

            </div>


        </div>
    </div>
</template>

<script setup>

import axios from 'axios';
import { API } from '../constant';
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';

const state = reactive({
    item: [],
    quantity: 0,
    isOutofStock: false,
    error: ''
})

const route = useRoute()

let headers = { Authorization: localStorage.getItem('token') }

let debounceTimeout;

function update_cart() {

    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(() => {
        axios
            .post(API + '/user/update_cart', {
                item: route.params.id,
                quantity: state.quantity,
            }, { headers })
            .catch((error) => (state.error = error.message));
    }, 500);
}


onMounted(() => {
    axios.get(API + '/item/' + route.params.id)
        .then(res => {
            state.item = res.data.data
            state.isOutofStock = res.data.data.quantity ? false : true;
        })
        .catch(error => state.error = error.message)

    axios.get(API + '/user/cart', { headers })
        .then(res => {
            const myItem = res.data.cart.find(currentElement => currentElement.item._id == route.params.id)
            state.quantity = myItem?.quantity || 0

        })
        .catch(error => state.error = error.message)

})
</script>

<style scoped>
.other-img {
    display: flex;
    gap: 10px;

}

.other-img > img{
    flex-basis: 20%;
    flex-grow: 0;
    width: 20%;
    aspect-ratio: 1/1;
    object-fit: contain;
}
.gotocart {
    letter-spacing: 1px;
    background-color: rgb(111, 111, 233);
    padding: 7px 20px;
    color: white;
    border-radius: 5px;
}

.gotocart:hover {
    color: white;
}


.cont {
    display: flex;
    padding: 10px;
    justify-content: space-between;
    align-items: flex-start;
}

.cont-child:nth-child(2) {
    flex-basis: 55%;
    padding: 10px;
}

.cont-child:nth-child(1) {
    flex-basis: 45%;
    border-right: 2px solid gray;
}

.cont-child .main-img {
    height: 400px;
    display: flex;
    align-items: center;
}

.cont-child .main-img img {
    height: 60%;
    flex-shrink: 0;
    aspect-ratio: 1;
    margin: auto;
    object-fit: cover;
    display: block;
}

.title {
    font-weight: 500;
    margin-top: 10px;
}

.description {
    margin-top: 10px;
    font-size: 13px;
    height: 100px;
}

.category-badge {
    padding: 3px 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    background-color: rgb(111, 111, 233);
    color: white;
    border-radius: 5px;
    font-size: 12px;
    margin: 15px 0px 5px 0;
    font-weight: 500;
    display: inline-block;
}


.flex {
    display: inline-flex;
    gap: 5px;
    align-items: center;
}

.path {
    font-size: 13px;
}

.price-and-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    width: 100%;
}

.price-and-btn .price {
    font-size: 14px;
    font-weight: 500;
}

.price-and-btn .btns {
    font-size: 14px;
    font-weight: 500;
    margin-right: 20px;
}

.plus-minus-btn {
    background-color: rgb(111, 111, 233);
    color: white;
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: space-between;
    padding: 0px 10px;
    border-radius: 5px;
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
    background-color: rgb(111, 111, 233);

}

.plus-minus-btn button {
    all: unset;
    font-size: 16px;
    padding: 5px;
    cursor: pointer;
    user-select: none;
}

.plus-minus-btn button:disabled {
    opacity: 0.5;
}



i {
    font-size: 14px;
}

.bg-red {
    background: red;
}

a {
    all: unset;
    cursor: pointer;
}

a:hover {
    color: rgb(131, 131, 252)
}

@media screen and (max-width : 600px) {
    .cont {
        flex-direction: column;
    }

    .cont-child {
        width: 100%;
        border: none;
    }


    .flex {
        flex-direction: column;
    }

}
</style>