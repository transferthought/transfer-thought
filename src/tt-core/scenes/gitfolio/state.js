import axios from 'axios';
import * as AFRAME from 'aframe';

const initialState = {
    user: 'kkarich',
    repositoryList: [],
};

const handlers = {
    fetchRepos() {
        console.log('Fetching repos');

        axios.get('https://api.github.com/users/kkarich/repos').then((res) => {
            const { data } = res;
            AFRAME.scenes[0].emit('updateRepos', data);
        });
    },
    updateRepos(state, action) {
        state.repositoryList.push(...action);
    },
};

export {
    initialState,
    handlers,
};
