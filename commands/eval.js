const config = require('../config.json');
const Discord = require('discord.js');
const Twitch = require('tmi.js');
const mysql = require('mysql');
const logs = require('../functions/logging');

/**
 * Handles a Discord command
 * @param {Discord.Client} client connection to discord
 * @param {Discord.Message} message the message the command is processed from
 * @param {String[]} args the arguments of the command
 * @param {Connection} database the connection to the database
 */
exports.discord = async (client, message, args, database) => {
    if (message.author.id !== config.discord.ownerID) {
        return message.channel.send(
            'You do not have permission to execute this command.')
            .then(msg => {
                logs.logAction('Sent Message', {
                    content: msg.content, guild: msg.guild
                })
                console.log(`Sent message: ${message.content}`)
            })
            .catch(console.error);
    }

    let output;
    let response;
    const input = args.join(' ')
    try {
        console.log(`Evaluating ${input}...`);
        output = eval(input);
        console.log(`${input} evaluates to ${output}`);
        response = JSON.stringify(output, null," ").substring(0, 1024);
    } catch (e) {
        response = `Sorry ${message.author.username}, I can't do that :/`
    }

    message.channel.send(response)
        .then(msg => {
            logs.logAction('Sent Message', {
                content: msg.content, guild: msg.guild
            })
            console.log(`Sent message: ${msg.content}`)
        })
        .catch(console.error);
};

/**
 * Handles a Twitch command
 * @param {Discord.Client} client connection to discord
 * @param channel the twitch Channel of origin
 * @param userstate the userstate of origin
 * @param args the arguments of the command
 * @param database the connection to the database
 */
exports.twitch = async (client, channel, userstate, args, database) => {
    if (userstate.username !== 'newox') {
        return client.say(channel,
            'You do not have permission to execute this command.')
            .then(message => console.log(`Sent Twitch chat message: ${message}`))
            .catch(console.error);
    }

    var msg;
    var x;
    var input = args.join(' ')
    try {
        console.log(`Evaluating ${input}...`);
        x = eval(input);
        console.log(`'${input}' evaluates to: ${x}`);
        msg = x.toString();
    } catch (e) {
        console.log(e);
        msg = `Sorry ${userstate.username}, I can't do that :/`
    }

    client.say(channel, msg)
        .then(message => console.log(`Sent Twitch chat message: ${message}`))
        .catch(console.error);
};

exports.help = {
    description: 'super powerful command',
    usage: `${config.discord.prefix}eval (Newo only)`
};