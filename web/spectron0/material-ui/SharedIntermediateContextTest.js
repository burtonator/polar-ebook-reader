"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedIntermediateContextTest = void 0;
const react_1 = __importStar(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const Functions_1 = require("polar-shared/src/util/Functions");
const DeepEquals_1 = require("../../js/mui/DeepEquals");
var debugIsEqual = DeepEquals_1.DeepEquals.debugIsEqual;
const ValueContext = react_1.default.createContext({
    value: 0,
    doIncr: Functions_1.NULL_FUNCTION
});
const ChildComponent = () => {
    const context = react_1.default.useContext(ValueContext);
    console.log("ChildComponent: render");
    return (react_1.default.createElement(react_1.default.Fragment, null,
        "value is: ",
        context.value,
        react_1.default.createElement(Button_1.default, { variant: "contained", color: "primary", onClick: () => context.doIncr() }, "Update")));
};
const IntermediateComponent = react_1.default.memo(() => {
    console.log("IntermediateComponent: render");
    return (react_1.default.createElement(ChildComponent, null));
}, debugIsEqual);
exports.SharedIntermediateContextTest = () => {
    const ref = react_1.useRef(1);
    const iter = react_1.useRef(1);
    const [state, setState] = react_1.useState({ iter: 0 });
    const doIncr = react_1.useCallback(() => {
        console.log("ref: ", ref);
        console.log("iter: ", iter);
        ref.current = ref.current + 1;
        iter.current = iter.current + 1;
        setState({ iter: iter.current });
    }, []);
    console.log("SharedStateTest: render: iter: ", iter);
    return (react_1.default.createElement(ValueContext.Provider, { value: { value: ref.current, doIncr } },
        react_1.default.createElement(IntermediateComponent, null)));
};
//# sourceMappingURL=SharedIntermediateContextTest.js.map