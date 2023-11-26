import axios from 'axios';

const fetchData = async (url:string, domain:string, name:string) => {

    try {
        const response = await axios.get(url);
        return console.log(`Test ${name} ${domain} result: ✅`);
    } catch (error) {
        return console.error(`Test ${name} ${domain} result: ❌`);
    }
};

//name test
fetchData('https://bilishare.tensormik.com/bili-api/api?biliLink=That%20Time%20I%20Got%20Reincarnated%20as%20a%20Slime', 'tensormik.com', 'name');
fetchData('http://g49node0.ddns.net:3000/bili-api/api?biliLink=That%20Time%20I%20Got%20Reincarnated%20as%20a%20Slime', 'ddns.net', 'name');

// //link test
fetchData('https://bilishare.tensormik.com/bili-api/api?biliLink=https://www.bilibili.tv/th/play/1018282', 'tensormik.com', 'link');
fetchData('http://g49node0.ddns.net:3000/bili-api/api?biliLink=https://www.bilibili.tv/th/play/1018282', 'ddns.net', 'link');