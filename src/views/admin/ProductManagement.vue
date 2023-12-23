<template>
    <div class="cont">

        <h1 class="text-center">ADMIN PANEL</h1>

        <Modal v-if="modal.category" @close="modal.category = false">
            <form class="form category" @submit.prevent="createCategory">
                <h2>New Category</h2>
                <input type="text" v-model="form.category_name" placeholder="Enter Category Name" required>
                <button type="submit" class="btn">SUBMIT</button>
                <p class="error text-red">{{ form.error }}</p>
            </form>
        </Modal>

        <Modal v-if="modal.item" @close="modal.item = false; cleanUp()">
            <form class="form item-form" @submit.prevent="() => modal.item == 'new' ? createItem() : updateItem()">
                <h2>{{ modal.item == 'new' ? ' New Item' : 'Update Your Item' }}</h2>
                <div class="inputs-cont">
                    <div class="inputs-box">
                        <input type="text" v-model="form.name" placeholder="Enter Name" required>
                        <input type="number" v-model="form.price" placeholder="Enter Price" required>
                        <div class="flex">
                            <input type="number" v-model="form.quantity" placeholder="Quantity" required>
                            <input type="text" v-model="form.unit" placeholder="Enter Unit(1kg)" required>
                        </div>
                    </div>
                    <div class="inputs-img">
                        <img alt="item image" :src="form.preview">
                        <button type="button" class="btn file-button">
                            <input @change="handleFileChange" accept="image/*" :required="modal.item == 'new'" type="file">
                            <span>Upload</span>
                        </button>
                    </div>
                </div>
                <textarea class="description" placeholder="Enter Description" v-model="form.description" rows="2"></textarea>

                <div class="add-media-image">
                    <p>Add More Image (optional) max 4 images</p>
                    <div class="grid">
                        <div class="btn for-addbtn">
                            <input type="file" @change="handleOnMediaUpload" accept="image/*">
                            <p>Add Image</p>
                        </div>
                        <div v-for="img, index in form.media_preview " :key="index" class="box">
                            <img :src="img" alt="Images">
                            <i class="fa-solid fa-xmark" @click="remove_media(index, img)"></i>
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn">Save</button>
                <p class="error text-red">{{ form.error }}</p>
            </form>
        </Modal>

        <div class="btn-cont add-new-category text-center">
            <button type="submit" class="btn" @click="modal.category = true">
                <i class="fa-solid fa-circle-plus"></i>
                Add New Category
            </button>
        </div>

        <div v-if="state.data.length" class="category-cont">
            <div v-for="category in state.data" class="category-box" :key="category._id">
                <h2>{{ category.name }}</h2>
                <div class="items-cont">
                    <div class="add-item" @click="form.category = category._id; modal.item = 'new';">
                        <i class="fa-solid fa-circle-plus big-icon"></i>
                        <h2>Add New Item</h2>
                    </div>
                    <div class="item" v-for="item in category.item" :key="item._id">
                        <img class="item-img" :src="API + '/' + item.image" alt="Product Image">
                        <h4 class="item-title">{{ item.name }}</h4>
                        <p class="item-price"> <i class="fa-solid fa-indian-rupee-sign"></i> {{ item.price }}</p>
                        <p class="item-quantity">{{ item.quantity }} out of {{ item.total_quantity }}</p>
                        <div class="btn-cont">
                            <button class="btn" @click="() => handleOnEdit(item)">
                                <i class="fa-solid fa-pen-to-square"></i>Edit</button>
                            <button class="btn delete" @click="deleteItem(item._id, item.category)"> <i class="fa-solid fa-trash-can"></i>
                                Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <h2 class="text-center not-found" v-else> Not Found Any Product </h2>

    </div>
</template>

<script setup>

import Modal from '../../components/Modal.vue';
import { API } from "../../constant.js"
import { reactive, onMounted, } from 'vue';
import axios from 'axios';

let headers = {
    Authorization: localStorage.getItem('token')
}

const modal = reactive({
    category: false,
    item: false
})

const form = reactive({
    name: '',
    image: false,
    preview: '',
    price: '',
    quantity: '',
    error: '',
    item: '',
    category: '',
    unit: '',
    description: '',
    media_images: [],
    media_preview: [],
    media_remove: []
})

let state = reactive({
    data: []
})

function handleOnMediaUpload(event) {

    if (form.media_images.length == 4) return;
    const file = event.target.files[0]
    const blob = new Blob([file], { type: file.type });
    form.media_images.push(blob);
    const blobUrl = URL.createObjectURL(blob);
    form.media_preview.push(blobUrl);

}


function remove_media(index, imagename) {

    if (imagename.includes('api')) {
        form.media_remove.push(imagename.split('/').at(-1))
    }

    form.media_images.splice(index, 1);
    form.media_preview.splice(index, 1);
}

function createCategory() {

    axios.post(API + '/category', { name: form.category_name }, { headers })
        .then(res => {

            modal.category = false
            form.category = ''

            let newData = {
                name: res.data.data.name,
                _id: res.data.data._id,
                item: []
            }

            state.data.push(newData)
        })
        .catch(err => form.error = err.response.data.message)
}

function createItem() {

    const formData = new FormData();

    formData.append('image', form.image);
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('unit', form.unit);
    formData.append('quantity', form.quantity);
    formData.append('category', form.category);
    formData.append('description', form.description);

    form.media_images.forEach((currentElement, index) => {
        formData.append('media', form.media_images[index], Date.now() + index + '.' + currentElement.type.split('/')[1])
    })

    axios.post(API + '/item', formData, { headers })
        .then(res => {
            modal.item = false;
            const index = state.data.findIndex(currentElement => currentElement._id == form.category)
            state.data[index].item.push(res.data.data)

            cleanUp()
        })
        .catch(err => alert(JSON.stringify(err.message)))
}

function updateItem() {

    const formData = new FormData();

    if (form.image) formData.append('image', form.image);

    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('quantity', form.quantity);
    formData.append('item', form.item);
    formData.append('unit', form.unit);
    formData.append('description', form.description);
    formData.append('media_remove', JSON.stringify(form.media_remove))

    form.media_images.forEach((currentElement, index) => {
        formData.append('media', form.media_images[index], Date.now() + index + '.' + currentElement.type.split('/')[1])
    })
 

    axios.post(API + '/item/update', formData, { headers })
        .then(res => {
            modal.item = false;
            const index = state.data.findIndex(currentElement => currentElement._id == form.category)
            const itemIndex = state.data[index].item.findIndex(currentElement => currentElement._id == form.item)
            state.data[index].item[itemIndex] = res.data.data

            cleanUp()
        })
        .catch(err => alert(JSON.stringify(err.message)))
}

function deleteItem(item, category) {
    axios.post(API + '/item/delete', { item }, { headers })
        .then(() => {
            const index = state.data.findIndex(currentElement => currentElement._id == category)
            const itemIndex = state.data[index].item.findIndex(currentElement => currentElement._id == item)
            state.data[index].item.splice(itemIndex, 1)
        }).catch(err => alert(JSON.stringify(err.message)))
}

function handleFileChange(event) {
    const imageUrlBlob = URL.createObjectURL(event.target.files[0]);
    form.preview = imageUrlBlob
    fetch(imageUrlBlob).then(res => res.blob()).then(data => form.image = data)
}

function handleOnEdit(param) {

    modal.item = true
    form.name = param.name
    form.price = param.price
    form.unit = param.unit
    form.quantity = param.quantity
    form.item = param._id
    form.category = param.category
    form.description = param.description
    form.preview = API + '/' + param.image
    form.media_preview = param.media.map(currImage => API + '/' + currImage)

}

function cleanUp() {
    form.name = ''
    form.price = ''
    form.quantity = ''
    form.category = ''
    form.item = ''
    form.image = false
    form.preview = '';
    form.unit = '';
    form.description = ''
    form.media_images = []
    form.media_preview = []
    form.media_remove = []
}

onMounted(() => {
    axios.get(API + '/category')
        .then(res => {
            state.data = res.data.data
        }).catch(err => alert(err.response.data.message))
})

</script>



<style scoped>
.grid {
    display: grid;
    grid-template-rows: 40px;
    grid-template-columns: repeat(auto-fit, 40px);
    margin-bottom: 10px;
    gap: 10px;
}

.grid .for-addbtn {
    font-size: 12px;
    padding: 1px 10px;
    grid-column-start: 1;
    grid-column-end: 3;
    text-align: center;
}

.grid .box {
    height: 40px;
    aspect-ratio: 1/1;
    position: relative;
}

.box img {
    width: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
}

.box .fa-xmark {
    font-size: 16px;
    color: white;
    background: red;
    padding: 2px 3px;
    border-radius: 999px;
    position: absolute;
    top: 0px;
    right: 0px;

}

.description {
    /* border-radius: 5px; */
    outline: none;
    border: none;
    margin-top: 10px;
    margin-bottom: 20px;
    width: 100%;
    padding: 10px;
    resize: none;

}

.flex {
    display: flex;
    gap: 10px;
}

form.category,
form.item-form {
    margin-top: 10px;
}


form.item-form .inputs-cont {
    display: flex;
    align-items: flex-start;
    gap: 20px;


}

form.item-form .inputs-cont .inputs-box,
form.item-form .inputs-cont .inputs-img {
    width: 50%;
}


form.item-form .inputs-cont .inputs-img img {
    width: 100%;
    height: 200px;
    object-fit: contain;
}

.upload-box {
    width: 100%;
    height: 200px;
    border: 5px dashed white;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 17px;
    border-radius: 15px;
    margin-bottom: 10px;
}

.file-button {
    width: 100%;
    position: relative;
    padding: 10px 0;
}

.file-button>input,
.for-addbtn>input {
    position: absolute;
    width: 100%;
    opacity: 0;
    top: 0;
    left: 0;
    margin: 0px;
}

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


.items-cont {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(4, 1fr);
}

.item,
.add-item {
    background-color: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    padding: 15px 5px;
    text-align: center;
    border: 1px solid #ddd;
}



.item-img {
    max-width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 5px;
}

.item-title {
    font-size: 20px;
    margin: 10px 0;
}

.item-price {
    color: #e74c3c;
    font-size: 1.25rem;
    margin: 10px 0;
}

.item-quantity {
    font-size: 1rem;
    color: #333;
}

.item .btn-cont {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin: 10px 0;
}

.category-box {
    margin-bottom: 20px;
}

.add-item {
    background: #b14ee4;
    color: white;
}

.big-icon {
    font-size: 120px;
    padding: 50px 10px;
}

.not-found,
.category-cont {
    margin-top: 50px;
}

.btn-cont.add-new-category {
    margin-top: 20px;
}



h2 {
    font-weight: 500;
}

.cont {
    padding: 10px;
}


@media screen and (max-width:600px) {
    .items-cont {
        grid-template-columns: 1fr;
    }


    form.item-form .inputs-cont {
        flex-direction: column;
    }

    form.item-form .inputs-cont .inputs-box,
    form.item-form .inputs-cont .inputs-img {
        width: 100%;
    }

    .file-button {
        margin-bottom: 10px;
    }

}
</style>