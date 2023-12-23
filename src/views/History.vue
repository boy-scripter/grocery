<template>
    <div class="purchase-details">
        <h2>Order History</h2>
        <template v-if="state.data.length">
            <div v-for="(data, index) in state.data" :key="index" class="product-item">
                <p class="product-info" v-for="(product, index) in data.orderDetail" :key="index">
                    {{ product.name }} x
                    {{ product.quantity }}
                </p>
                <p class="date">{{ new Date(data.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
                <div>
                    <i @click="updateReview(orderDetail._id, 1)" class="fa-solid fa-star" :class="{ 'yellow': state.review >= 1 }"></i>
                    <i @click="updateReview(orderDetail._id, 2)" class="fa-solid fa-star" :class="{ 'yellow': state.review >= 2 }"></i>
                    <i @click="updateReview(orderDetail._id, 3)" class="fa-solid fa-star" :class="{ 'yellow': state.review >= 3 }"></i>
                    <i @click="updateReview(orderDetail._id, 4)" class="fa-solid fa-star" :class="{ 'yellow': state.review >= 4 }"></i>
                    <i @click="updateReview(orderDetail._id, 5)" class="fa-solid fa-star" :class="{ 'yellow': state.review >= 5 }"></i>
                </div>
            </div>

        </template>
        <h2 v-else>
            Nothing Ordered
        </h2>
    </div>
</template>

<script setup>

import { onMounted, reactive } from 'vue';
import { API } from '../constant';
import axios from 'axios';

let headers = {
    Authorization: localStorage.getItem('token')
}

const state = reactive({
    data: [],
    review: 0
})

function updateReview(rating) {
    axios.post( API + '/orders/review' , {headers}).
        then(() => {
            state.review = rating;
        })
}

onMounted(() => {
    axios.get(API + '/user/purchases', { headers }).then((res) => state.data = res.data.data.purchased)
})

</script>

<style scoped>
h2 {
    text-align: center;
    margin-bottom: 44px;
}

.date {
    margin-top: 10px;
    font-size: 13px;

}

.purchase-details {
    padding: 10px;
}

.product-item {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.product-info {
    font-weight: bold;
    color: #333;
}

a {
    text-decoration: underline;
    color: blue;
}

.fa-star {
    cursor: pointer;
    font-size: 22px;
}

.yellow {
    color: rgb(206, 206, 9);
}
</style>
  