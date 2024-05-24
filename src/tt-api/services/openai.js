class OpenAI {
    constructor(chatGPTUrl, dalleUrl) {
        this.chatGPTUrl = chatGPTUrl;
        this.dalleUrl = dalleUrl;
    }
    async createChatCompletion(messages) {
        try {
            const response = await fetch(this.chatGPTUrl, {
                method: 'POST',
                body: JSON.stringify(messages),
            });
            return response.json();
        } catch (err) {
            console.log(err);
        }
    }
    async create360Image(prompt, engine = 'dalle') {
        try {
            const response = await fetch(this.dalleUrl, {
                method: 'POST',
                body: JSON.stringify({ prompt, engine }),
            });
            return response.json();
        } catch (err) {
            console.log(err);
        }
    }
}

// TODO - make these local to repo
export default new OpenAI(chatGPTURL, dallEUrl);
