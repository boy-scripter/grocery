<template>
    <div class="container">

        <div class="navbar flex">
            <div class="child">
                <h1>
                    TOTAL SALE &nbsp; <sup><span class="small">₹</span></sup>{{ state.total_sales }}
                </h1>
            </div>
            <div class="btns-group">
                <button @click="fetch_sales_data('daily')">Last 24 hours</button> &nbsp;
                <button @click="fetch_sales_data('weekly')">Weekly</button>
            </div>
        </div>

        <canvas id="chart"></canvas>

        <h1 class="mt-2">Order Detail</h1>
        <table>
            <tr>
                <th>UserName</th>
                <th>UserEmail</th>
                <th colspan="2">Items</th>
                <th>Total</th>
            </tr>

            <tr v-for="order, index of state.orderDetail" :key="index">
                <td>{{ order.userid.name }}</td>
                <td>{{ order.userid.email }}</td>
                <td colspan="2">
                    <p v-for="items of order.orderDetail" :key="items.item">
                        {{ items.name + 'X' + items.quantity + '&emsp;₹' + items.price}}
                    </p>
                </td>
                <td>₹{{ order.total }}</td>
            </tr>
        </table>

        <h1 class="mt-2"> Product Detail</h1>
        <table>
            <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Total</th>
            </tr>

            <tr v-for="item, index of state.productDetail" :key="index">
                <td>{{ item.name }}</td>
                <td>{{ item.total_qty }}</td>
                <td>₹{{ item.total_value }}</td>
            </tr>

        </table>
        <div>


        </div>
    </div>
</template>

<script setup>

import { API } from "../../constant.js"
import { reactive, onMounted, } from 'vue';
import axios from 'axios';
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables);

let headers = {
    Authorization: localStorage.getItem('token')
}

const state = reactive({
    productDetail: [],
    orderDetail: [],
    chart: [],
    total_sales: 0
})

let chart = false;

function fetch_sales_data(time) {
    axios.get(API + '/item/sales?time=' + time, { headers })
        .then(res => {
            state.chart = res.data.data.chart
            state.productDetail = res.data.data.sales
            state.orderDetail = res.data.data.order
            state.total_sales = state.productDetail.reduce((prev, curr) => prev + curr.total_value, 0)
            printChart(state.chart.map(data => data.date), state.chart.map(curr => curr.total_sales))
        }).catch(err => alert(err))
}

onMounted(() => {
    fetch_sales_data('daily')
})



function printChart(labels, data) {

    const canvas = document.getElementById("chart");
    var ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 50, 0, 300);
    gradient.addColorStop(0, "rgba(0, 68, 255, 0.5)");
    gradient.addColorStop(0.35, "rgba(0, 68, 255, 0.25)");
    gradient.addColorStop(1, "rgba(0, 68, 255, 0)")

    if (chart) chart.destroy();

    chart = new Chart(canvas, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    data: data,
                    borderColor: "blue",
                    backgroundColor: gradient,
                    fill: true,
                },
            ],
        },
        options: {
            elements: {
                line: {
                    tension: 0
                }
            },
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                },
                y: {
                    ticks: {
                        maxTicksLimit: 8,
                    },
                    border: {
                        color: "white",
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
        },
    });
}

</script>

<style scoped> .flex {
     display: flex;
     gap: 10px;
     align-items: center;
     justify-content: space-between;
 }

 .mt-2 {
     margin-top: 10px;
 }

 #chart {
     height: 300px;
     margin: 10px 0;
     margin-bottom: 20px;
     max-height: 300px;
 }

 .small {
     font-size: 16px;
 }

 .btns-group button {
     all: unset;
     background: rgb(63, 63, 238);
     color: white;
     font-weight: 900;
     padding: 10px 20px;
     cursor: pointer;
     border-radius: 16px;
 }

 .child h1 {
     font-size: 40px;
     padding: 10px;
 }

 .container {
     padding: 10px 20px;
     display: flex;
     flex-direction: column;
     justify-content: center;
 }

 table {
     border-collapse: collapse;
     background: #7b86d3;
     border-radius: 10px;
     width: 100%;

 }

 
 th {
     text-align: left;
     color: #fff;
     font-weight: 400;
     font-size: 13px;
     text-transform: uppercase;
     border-bottom: 1px solid rgba(255, 255, 255, 0.1);
     padding: 14px 10px;
     font-weight: 900;
     font-size: 17px;
 }

 td {
     height: 40px;
     line-height: 40px;
     font-weight: 300;
     color: rgb(255, 255, 255);
     padding: 0 10px;
 }

 tr:not(:first-child):hover {
     background: rgba(255, 255, 255, 0.1);
 }
</style>