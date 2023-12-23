<template>
    <h1 class="dashboard">DASHBOARD</h1>
    <div class="buttons">
        <!-- Admin Can't add Products -->
        <!-- <RouterLink to="/admin/product_management"> <button class="btn">Manage Your Products</button> </RouterLink> -->
        <RouterLink to="/admin/sales"> <button class="btn">Sales Details</button></RouterLink>
        <button class="btn" @click="state.categoryModal = true"> Add New Catgeory</button>
    </div>

    <Modal v-if="state.categoryModal" @close="state.categoryModal = false">
        <form class="form category" @submit.prevent="createCategory">
            <h2>New Category</h2>
            <input type="text" v-model="state.form.category_name" placeholder="Enter Category Name" required>
            <button type="submit" class="btn">SUBMIT</button>
            <p class="error text-red">{{ state.form.error }}</p>
        </form>
    </Modal>

    <div class="cont">
        <div class="flex">

            <div class="categories-name">
                <p>Total Categories ({{ state.categories.length }})</p>
                <div class="Categories">
                    <div class="category" v-for="(category, index) in state.categories" :key="index">
                        <p class="item-name"> {{ ++index + ') ' + category.name }}</p>
                    </div>
                </div>
            </div>
            <div class="product-name">
                <p>Total Products ({{ state.product.length }})</p>
                <div class="products" v-for="(product, index) in state.product" :key="index">
                    <p class="item-name"> {{ ++index + ') ' + product.name }}</p>
                </div>
            </div>

            <div class="sellers-name">
                <p>Total Sellers({{ state.seller.length }})</p>
                <div class="sellers-cont">
                    <div class="sellers-box" v-for="(seller, index) in state.seller" :key="index">
                        <div class="item-name withButtons">
                            <p>
                                <span>{{ ++index + ') ' }} </span>
                                <span> {{ seller.user.email }}</span>
                                <span v-if="seller.isVerified == 'Rejected'">&nbsp;(Rejected)</span>
                            </p>
                            <template v-if="seller.isVerified == 'Pending'">
                                <button class="" @click="(e) => sellerStatus(e, 'Approved', seller._id)"> <i class="fa-solid fa-check"></i> </button>
                                <button class="" @click="(e) => sellerStatus(e, 'Rejected', seller._id)"><i class="fa-solid fa-xmark"></i> </button>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex">
            <div class="categories-name">
                <p>Pending Categories ({{ state.suggestion.length }})</p>
                <div class="sellers-box" v-for="(category, index) in state.suggestion" :key="index">
                    <div class="item-name withButtons">
                        <p>
                            <span>{{ ++index + ') ' }} </span>
                            <span> {{ category.name }}</span>
                        </p>
                        <button class="" @click="(e) => updateCategoryStatus(e, 'Approved', category)"> <i class="fa-solid fa-check"></i> </button>
                        <button class="" @click="(e) => updateCategoryStatus(e, 'Rejected', category)"><i class="fa-solid fa-xmark"></i> </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { API } from "../../constant.js"
import { reactive, onMounted } from 'vue';
import Modal from "../../components/Modal.vue"

import axios from 'axios';

let headers = {
    Authorization: localStorage.getItem('token')
}

const state = reactive({
    form: { category_name: '', error: '' },
    categoryModal: false,
    product: [],
    categories: [],
    seller: [],
    suggestion: []

})


function sellerStatus(event, status, id,) {

    axios.post(API + '/seller/status', { status, id }, { headers })
        .then(res => {
            if (res.data.data.status == 'Approved') {
                //For Removing the right or wrong buttons
                event.target.parentNode.parentNode.querySelectorAll('button').forEach(btn => btn.remove())
            } else {
                //removing whole box
                event.target.parentNode.parentNode.remove()
            }

        })


}

function createCategory() {

    axios.post(API + '/category', { name: state.form.category_name }, { headers })
        .then(res => {

            state.categoryModal = false
            state.form.category_name = ''

            let newData = {
                name: res.data.data.name,
                _id: res.data.data._id,
                item: []
            }

            state.categories.push(newData)

        })
        .catch(err => state.form.error = err.response.data.message)
}


function updateCategoryStatus(event, status, data) {
    axios.post(API + '/category/status', { status, id: data._id }, { headers })
        .then(res => {
            if (status == 'Approved') {
                state.categories.push(
                    {
                        _id: data._id,
                        name: data.name,
                    })
            }

            
            event.target.parentNode.parentNode.remove()

        })
}


onMounted(() => {
    axios.get(API + '/category')
        .then(res => state.categories = res.data.data).catch(err => alert(err.response.data.message))

    axios.get(API + '/item').then(res => state.product = res.data.data).catch(err => alert(err.response.data.message))
    axios.get(API + '/seller/all', { headers }).then(res => state.seller = res.data.data).catch(err => alert(err.response.data.message))
    axios.get(API + '/category/suggestion', { headers }).then(res => state.suggestion = res.data.data).catch(err => alert(err.response.data.message))

})

</script>

<style scoped>
input {
    outline: 0;
    background: #f2f2f2;
    width: 100%;
    border: 0;
    margin: 15px 0 15px;
    padding: 15px;
    box-sizing: border-box;
    font-size: 14px;
}

.withButtons {
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.withButtons button {
    all: unset;
    font-size: 24px;
    padding-inline: 3px;
    cursor: pointer;
}

.withButtons button:hover {
    opacity: 0.4;
}

.dashboard {
    text-align: center;
    margin: 15px 0;
    font-weight: 900;
}

.product-name>p,
.categories-name>p,
.sellers-name>p {
    font-size: 18px;
    font-weight: 900;
    background: rgb(87, 87, 241);
    color: white;
    padding: 10px 20px;
}

.buttons {
    display: flex;
    gap: 10px;
    padding: 0 10px;

}

.flex {
    display: flex;
    gap: 30px;
    margin: 10px 0;
    padding: 10px;
}

.btn {
    font-size: 16px;
}

.item-name {
    font-size: 16px;
    font-weight: 300;
    background: rgb(108, 108, 245);
    color: white;
    border-top: 1px solid white;
    padding: 10px 20px;
}


.fa-check {
    color: rgb(241, 23, 23);
}

.fa-xmark {
    color: rgb(81, 212, 81);
}
</style>