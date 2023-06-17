import axios from 'axios';

export default class UsersService {

    static async getCurrentPlayerStatus() {

        try {

            let resp = await axios.get("/api/status");

            if(resp.status == 200) {
                return resp.data;
            }

            

        } catch(e) {

            console.error(e);

        }
        return "not_available";
    }

}