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
exports.AnnotationRepoTableMenu = void 0;
const AnnotationRepoStore_1 = require("./AnnotationRepoStore");
const MUIMenuItem_1 = require("../../../../web/js/mui/menu/MUIMenuItem");
const LocalOffer_1 = __importDefault(require("@material-ui/icons/LocalOffer"));
const Divider_1 = __importDefault(require("@material-ui/core/Divider"));
const DeleteForever_1 = __importDefault(require("@material-ui/icons/DeleteForever"));
const React = __importStar(require("react"));
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
exports.AnnotationRepoTableMenu = ReactUtils_1.deepMemo(() => {
    const callbacks = AnnotationRepoStore_1.useAnnotationRepoCallbacks();
    return (React.createElement(React.Fragment, null,
        React.createElement(MUIMenuItem_1.MUIMenuItem, { text: "Tag", icon: React.createElement(LocalOffer_1.default, null), onClick: callbacks.onTagged }),
        React.createElement(Divider_1.default, null),
        React.createElement(MUIMenuItem_1.MUIMenuItem, { text: "Delete", icon: React.createElement(DeleteForever_1.default, null), onClick: callbacks.onDeleted })));
});
//# sourceMappingURL=AnnotationRepoTableMenu.js.map