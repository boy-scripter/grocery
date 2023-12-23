
<template>
    <template v-if="state.originalData.length">

        <div class="search-container">
            <i class="fas fa-magnifying-glass search-icon"></i>
            <input type="text" v-model="state.search" class="search-input" placeholder="Search...">
            <button @click="() => searchItem()" class="go-button">Go</button>
        </div>

        <div v-for="category in state.data" :key="category._id">
            <div v-if="category.item.length">
                <h1 class="category_name">{{ category.name }}</h1>
                <div class="cont">
                    <div class="card" v-for="item in category.item" :key="item._id">
                        <img :src="API + '/' + item.image" alt="Product Image">
                        <p class="title">{{ item.name }}</p>
                        <div class="btns">
                            <p class="price"> <i class="fa-solid fa-indian-rupee-sign"></i> {{ item.price }}</p>
                            <RouterLink :to="'/product/' + item._id">
                                <button class="addtocart">Buy</button>
                            </RouterLink>
                        </div>200px
                    </div>
                </div>
            </div>
        </div>
    </template>
    <div v-else>
        <h2 class="empty"> <i class="fa-solid fa-store-slash"></i> Oops 's the Store is Empty</h2>
    </div>
</template>


<script setup>

import { API } from '../constant';
import { onMounted, reactive } from 'vue';
import axios from 'axios';


const state = reactive({
    originalData: [],
    data: [],
    search: ''
})


function searchItem() {

    state.data = state.originalData.filter(
        category => {
            return category.item.filter(currentItem => currentItem.name.toLowerCase().includes(state.search.toLowerCase())).length
        })
}

onMounted(() => {
    axios.get(API + '/category').then((res) => {
        state.data = res.data.data;
        state.originalData = state.data
    })

})

</script>


<style scoped>
.search-container {
    display: flex;
    align-items: center;

    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    padding: 8px;
    width: 90%;
    margin: auto;
    margin-top: 10px;
}

.search-input {
    border: none;
    padding: 8px;
    outline: none;
    width: 100%;
}

.search-icon {
    color: #555;
    margin-right: 8px;
}

.go-button {
    background-color: #007BFF;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
}

.go-button:hover {
    opacity: 0.7;
}

.cont {
    display: grid;
    margin-top: 10px;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    grid-template-rows: 400px;
    column-gap: 25px;
    row-gap: 10px;
    justify-content: center;
    justify-items: center;
    padding: 0px 20px;

}

.card {
    border-radius: 0.75rem;
    background-color: #ffffff;
    transition-duration: 500ms;
    width: 100%;
    padding: 4px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.card img {
    object-fit: cover;
    height: 75%;
    width: 100%;
    aspect-ratio: 1/1;
    display: block;
    margin: auto;
}

.card .title {
    font-weight: bold;
    font-size: 16px;
    margin-top: 5px;
    padding: 0px 20px;
}

.card .btns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 15px;
    margin-top: 5px;

}

.card .price {
    font-weight: bold;
    font-size: 16px;
}

.addtocart {

    all: unset;
    border: 1px solid gray;
    border-radius: 5px;
    padding: 7px;
    cursor: pointer;
    transition: color 0.15s ease-in-out;
    padding: 5px 10px;
}

.plus-minus-cart {
    all: unset;
    display: flex;
    gap: 8px;
    font-size: 17px;
    padding: 5px 10px;
    background-color: #0075FF;
    border-radius: 2px;
    color: white;
}

.plus-minus-cart button {
    all: unset;

}

.addtocart:hover,
.addtocart.active {
    color: #FFF;
    background: #0075FF;
    border: 1px solid #0075FF;
}


i {
    font-size: 16px;
}

a {
    all: unset;
}

.empty {
    text-align: center;
    margin-top: 100px;
}

.fa-store-slash {
    font-size: 24px;
}

.category_name {
    padding: 10px 20px;
}

@media (min-width: 768px) {
    .cont {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (min-width: 1024px) {
    .cont {
        grid-template-columns: repeat(4, minmax(0, 1fr));


    }
}
</style>