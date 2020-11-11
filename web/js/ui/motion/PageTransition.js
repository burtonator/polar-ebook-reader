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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageTransition = void 0;
const React = __importStar(require("react"));
const framer_motion_1 = require("framer-motion");
exports.PageTransition = (props) => {
    const style = props.style || {};
    return (React.createElement(framer_motion_1.motion.div, { initial: {
            scale: 0.8,
            opacity: 0.7
        }, animate: {
            scale: 1.0,
            opacity: 1.0
        }, exit: {}, style: style }, props.children));
};
//# sourceMappingURL=PageTransition.js.map