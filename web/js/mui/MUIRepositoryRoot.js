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
exports.MUIRepositoryRoot = void 0;
const React = __importStar(require("react"));
const FirestoreProvider_1 = require("../../../apps/repository/js/FirestoreProvider");
const ActiveKeyboardShortcuts_1 = require("../hotkeys/ActiveKeyboardShortcuts");
const UserInfoProvider_1 = require("../apps/repository/auth_handler/UserInfoProvider");
const BrowserTabsStore_1 = require("../browser_tabs/BrowserTabsStore");
const MUIAppRoot_1 = require("./MUIAppRoot");
exports.MUIRepositoryRoot = (props) => {
    return (React.createElement(MUIAppRoot_1.MUIAppRoot, null,
        React.createElement(BrowserTabsStore_1.BrowserTabsStoreProvider, null,
            React.createElement(React.Fragment, null,
                React.createElement(ActiveKeyboardShortcuts_1.ActiveKeyboardShortcuts, null),
                React.createElement(FirestoreProvider_1.FirestoreProvider, null,
                    React.createElement(UserInfoProvider_1.UserInfoProvider, null, props.children))))));
};
//# sourceMappingURL=MUIRepositoryRoot.js.map