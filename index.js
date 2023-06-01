const Eris = require("eris");
const GPT4 = require('./gpt.js');

let token = "MTExMzg4NTE5NTEwMDIyNTU5Nw.G-ntDt.fdCQKUiq3lFs0gSYWK96uOA-oNGsluyU_APVYo";

//let GPT = new GPT4('./gpt4all-lora-quantized-win64');
let GPT = new GPT4('./ai/gpt4all-lora-quantized-linux-x86'); //Linux

GPT.on('ready', async () => {
	new Bot(token).start();
});

class Bot {
	constructor(token){
		this.token = token;
		this.bot = new Eris(this.token, {
			intents: [
				"guildMessages"
			]
		});
	}
	async start(){
		this.bot.on("ready", () => { 
			console.log(`Logged into (${this.bot.user.id})`);
		});
		this.bot.on("messageCreate", async (msg) => { 
			try{
				if(msg.author.id != this.bot.user.id){
					this.bot.sendChannelTyping(msg.channel.id);
					
					let response = await GPT.ask(msg.content);
					
					response = response.replace(`[1m[32m[0m`,"");

					this.bot.createMessage(msg.channel.id, response);
				}
			}catch(err){
				console.log(err);
				return;
			}
		});
		this.bot.connect();
	}
}
