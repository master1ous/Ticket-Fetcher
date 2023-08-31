const Cluster = require('discord-hybrid-sharding');
const { Manager } = require("discord-hybrid-sharding");
const colors = require("colors");
const config = require(`./config.json`)

const clusterAmount = 3;
const shardsPerCluster = 1; 
const totalShards = clusterAmount * shardsPerCluster;


const manager = new Cluster.Manager(`./index.js`, {
    totalShards: totalShards,
    shardsPerClusters: shardsPerCluster, 
    mode: 'process' , 
    token: process.env.token || config.token,
    respawn: true, 
    usev13: true,
});


manager.on("clusterCreate", cluster => {
    console.log(`[SHARDING-MANAGER]: `.magenta + `Launched Cluster #${cluster.id} | ${cluster.id+1}/${cluster.manager.totalClusters} [${cluster.manager.shardsPerClusters}/${cluster.manager.totalShards} Shards]`.green)

    cluster.on("death", function () {
        console.log(`${colors.red.bold(`Cluster ${cluster.id} died..`)}`);
    });

    cluster.on("message", async (msg) => {
        if(!msg._sCustom) return
        if (msg.dm) {
            const { interaction, message, dm, packet } = msg
            await manager.broadcast({ interaction, message, dm, packet })
        }
    })
    cluster.on("error", e => {
        console.log(`${colors.red.bold(`Cluster ${cluster.id} errored ..`)}`);
        console.error(e);
    })
    
    cluster.on("disconnect", function () {
        console.log(`${colors.red.bold(`Cluster ${cluster.id} disconnected..`)}`);
    });

    cluster.on("reconnecting", function () {
        console.log(`${colors.yellow.bold(`Cluster ${cluster.id} reconnecting..`)}`);
    });

    cluster.on("close", function (code) {
        console.log(`${colors.red.bold(`Cluster ${cluster.id} close with code ${code}`)}`);
    });

    cluster.on("exit", function (code) {
        console.log(`${colors.red.bold(`Cluster ${cluster.id} exited with code ${code}`)}`);
    });
});
manager.on("debug", (d) => d.includes("[CM => Manager] [Spawning Clusters]") ? console.log(d) : "")
manager.spawn({timeout: -1});