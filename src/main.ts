import { add, complete, list } from "./todo";

const [_1, _2, subcommand, arg] = process.argv;

switch (subcommand) {
    case "add":
        if (arg) {
            add(arg);
        } else {
            console.log("追加したい Todo の内容を指定してやで");
        }
        break;
    case "complete":
        if (arg) {
            complete(arg);
        } else {
            console.log("削除したい Todo の ID を指定してやで");
        }
        break;
    default:
        list();
        break;
}
