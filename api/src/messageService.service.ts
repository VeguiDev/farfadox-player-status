import { Injectable } from "@nestjs/common";

@Injectable()
export default class MessageService {

    sendMessageToOBS(message:any) {
        return "[[MSG_LINE]]:" + JSON.stringify(message)
    }

}