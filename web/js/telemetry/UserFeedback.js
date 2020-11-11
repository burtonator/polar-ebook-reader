"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFeedbacks = void 0;
const Firestore_1 = require("../firebase/Firestore");
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
class UserFeedbacks {
    static write(userFeedback) {
        return __awaiter(this, void 0, void 0, function* () {
            const firestore = yield Firestore_1.Firestore.getInstance();
            const id = Hashcodes_1.Hashcodes.createRandomID();
            const ref = firestore.collection("user_feedback").doc(id);
            yield ref.set(userFeedback);
        });
    }
}
exports.UserFeedbacks = UserFeedbacks;
//# sourceMappingURL=UserFeedback.js.map