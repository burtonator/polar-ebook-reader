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
exports.AddContentFab = void 0;
const Fab_1 = __importDefault(require("@material-ui/core/Fab"));
const Add_1 = __importDefault(require("@material-ui/icons/Add"));
const React = __importStar(require("react"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const createStyles_1 = __importDefault(require("@material-ui/core/styles/createStyles"));
const useStyles = makeStyles_1.default((theme) => createStyles_1.default({
    fab: {
        position: 'absolute',
        bottom: theme.spacing(8),
        right: theme.spacing(2),
    },
}));
exports.AddContentFab = (props) => {
    const classes = useStyles();
    return (React.createElement(Fab_1.default, { color: "primary", className: classes.fab, onClick: props.onClick },
        React.createElement(Add_1.default, null)));
};
//# sourceMappingURL=AddContentFab.js.map