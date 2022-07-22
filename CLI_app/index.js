import inquirer from 'inquirer';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import fs, { existsSync } from 'fs';
import path from 'path';
import express from 'express';
import axios from 'axios';
let choose = 0;

// console.log(b)
//console.log(fs.existsSync(`${process.cwd()}/cahce/market-charts/01c`))

let sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
    const rainbowTitle = chalkAnimation.rainbow('Welcome to "Cryptocurrency" app \n');
    await sleep();
    rainbowTitle.stop();
    console.log(`${chalk.bgBlue('How to use?')}
I am process on your computer
Lets earn some currecies
    `)
}
async function question() {
    let promt = await inquirer.prompt({
        name: "inp",
        type: "list",
        message: "Select whatever you want ",
        choices: ['1. Show coin list',
            '2. Start the server'
        ]
    })
    choose = promt.inp;
    console.log(choose);
}
await welcome();
await question();


if (choose.startsWith('1')) {
    if (!fs.existsSync(`${process.cwd()}/cahce/coins.json`)) {
        await axios.get('http://api.coingecko.com/api/v3/coins/list').then((res) => {
            fs.appendFileSync(`${process.cwd()}/cahce/coins.json`, JSON.stringify(res.data.slice(0, 30)))
        })
    }
    let coins = JSON.parse(fs.readFileSync(`${path.resolve('cahce')}/coins.json`));
    let promt = await inquirer.prompt({
        name: "inp",
        type: "list",
        pageSize: 30,
        message: "Select your coin ",
        choices: coins
    })
    let id;
    for (let elem of coins) {
        if (elem.name == promt.inp) {
            id = elem.id;
            break;
        }
    }
    let datam;
    await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=max`)
        .then((res) => {
            datam = res.data;

        });
    if (!fs.existsSync(`${process.cwd()}/cahce/market-charts/${id}`)) {
        fs.mkdirSync(`${process.cwd()}/cahce/market-charts/${id}`, (err) => {
            if (err) { console.log(err) }
            else { console.log(12) }
        })
    }
    let date = new Date();
    let a = date.toISOString().replaceAll(':', '-');
    let mypath = `${process.cwd()}/market-charts/${id}/${a}.json`;
    fs.appendFileSync(`${process.cwd()}/cahce/market-charts/${id}/${a}.json`, JSON.stringify(datam));
}
else {
    let app = express();
    app.get('/coins/all', (req, res) => {

        async function getcoins() {
            if (!fs.existsSync(`${process.cwd()}/cahce/coins.json`)) {
                let data1 = await axios.get('http://api.coingecko.com/api/v3/coins/list')
                fs.appendFileSync(`${process.cwd()}/cahce/coins.json`, JSON.stringify(data1.data.slice(0, 30)))
            }
            res.set('Content-Type', 'application/json');
            res.sendFile(`${process.cwd()}/cahce/coins.json`);
        }
        getcoins();
    })
    app.get('/market-chart/:coinId', (req, res) => {
        let id = req.params.coinId;
        async function getcoin() {
            if (!fs.existsSync(`${process.cwd()}/cahce/market-charts/${id}`)) {
                let data2 = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=max`).then()
                fs.mkdirSync(`${process.cwd()}/cahce/market-charts/${id}`, (err) => {
                    if (err) { console.log(err) }
                    else { console.log(12) }
                })
                let date = new Date();
                let a = date.toISOString().replaceAll(':', '-');
                let mypath = `${process.cwd()}/market-charts/${id}/${a}.json`;
                fs.appendFileSync(`${process.cwd()}/cahce/market-charts/${id}/${a}.json`, JSON.stringify(data2.data));
            }
            let b;
            b = fs.readdirSync(`${process.cwd()}/cahce/market-charts/${id}`, (err, files) => {
            })
            res.set('Content-Type', 'application/json');
            res.sendFile(`${process.cwd()}/cahce/market-charts/${id}/${b[b.length-1]}`);
        }
        getcoin();
    })
    app.listen('8080', () => { console.log('server is running') })
}