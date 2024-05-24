class BlockadeLabs {
    constructor(url, apiKey) {
        this.url = url;
        this.apiKey = apiKey;
    }
    async create360Image(prompt) {
        try {
            const response = await fetch(this.url, {
                method: 'POST',
                body: {
                    api_key: this.apiKey,
                    prompt,
                    skybox_style_id: 10,
                },
            });
            return response.json();
        } catch (err) {
            console.log(err);
        }
    }
}

const blockadeLabsUrl = 'Blockade_Labs_URL';
const blockadeLabsApiKey = 'Blockade_Labs_URL';

export default new BlockadeLabs(blockadeLabsUrl, blockadeLabsApiKey);
