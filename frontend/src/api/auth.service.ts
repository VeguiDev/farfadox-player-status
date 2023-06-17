import axios from "axios";

export default class AuthService {

    static async getCurrentUser() {

        try {

            let resp = await axios.get("/api/auth");

            if(resp.status == 200) {
                return resp.data.user;
            }

        } catch(e) {

            console.error(e);

        }

        return null;

    }

}