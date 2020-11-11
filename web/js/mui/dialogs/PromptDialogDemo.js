"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptDialogDemo = exports.PromptDialog = void 0;
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const TextField_1 = __importDefault(require("@material-ui/core/TextField"));
const Dialog_1 = __importDefault(require("@material-ui/core/Dialog"));
const DialogActions_1 = __importDefault(require("@material-ui/core/DialogActions"));
const DialogContent_1 = __importDefault(require("@material-ui/core/DialogContent"));
const DialogContentText_1 = __importDefault(require("@material-ui/core/DialogContentText"));
const DialogTitle_1 = __importDefault(require("@material-ui/core/DialogTitle"));
const styles_1 = require("@material-ui/core/styles");
const InputValidationErrorSnackbar_1 = require("./InputValidationErrorSnackbar");
const InputCompleteListener_1 = require("../complete_listeners/InputCompleteListener");
const useStyles = styles_1.makeStyles((theme) => styles_1.createStyles({
    cancelButton: {
        color: theme.palette.text.secondary,
    },
    textField: {
        minWidth: '350px'
    },
    description: {
        fontSize: '1.25rem'
    }
}));
exports.PromptDialog = (props) => {
    const classes = useStyles();
    let value = props.defaultValue || "";
    const [state, setState] = react_1.default.useState({
        open: true
    });
    const closeDialog = () => {
        setState({ open: false });
    };
    const handleClose = () => {
        props.onCancel();
        closeDialog();
    };
    const handleCancel = () => {
        props.onCancel();
        closeDialog();
    };
    const handleDone = () => {
        if (props.inputValidator) {
            const validationError = props.inputValidator(value);
            if (validationError) {
                setState(Object.assign(Object.assign({}, state), { validationError: validationError.message }));
                return;
            }
        }
        props.onDone(value);
        closeDialog();
    };
    const handleInput = (text) => {
        if (state.validationError) {
            setState(Object.assign(Object.assign({}, state), { validationError: undefined }));
        }
        value = text;
    };
    return (react_1.default.createElement(Dialog_1.default, { open: state.open, onClose: handleClose, "aria-labelledby": "form-dialog-title" },
        react_1.default.createElement(InputCompleteListener_1.InputCompleteListener, { onComplete: handleDone, type: 'enter', noHint: true },
            react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(DialogTitle_1.default, { id: "form-dialog-title" }, props.title),
                react_1.default.createElement(DialogContent_1.default, null,
                    state.validationError &&
                        react_1.default.createElement(InputValidationErrorSnackbar_1.InputValidationErrorSnackbar, { message: state.validationError }),
                    props.description &&
                        react_1.default.createElement(DialogContentText_1.default, { className: classes.description }, props.description),
                    react_1.default.createElement(TextField_1.default, { className: classes.textField, autoFocus: props.autoFocus, onChange: event => handleInput(event.currentTarget.value), margin: "dense", id: "name", defaultValue: props.defaultValue, placeholder: props.placeholder, label: props.label, type: props.type })),
                react_1.default.createElement(DialogActions_1.default, null,
                    react_1.default.createElement(Button_1.default, { onClick: handleCancel }, "Cancel"),
                    react_1.default.createElement(Button_1.default, { onClick: handleDone, size: "large", variant: "contained", color: "primary" }, "Subscribe"))))));
};
exports.PromptDialogDemo = () => {
    const [open, setOpen] = react_1.default.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    return react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Button_1.default, { variant: "outlined", color: "primary", onClick: handleClickOpen }, "Open prompt dialog"),
        open && react_1.default.createElement(exports.PromptDialog, { title: "Enter a title", placeholder: "Enter a title for this document: ", label: "Title", autoFocus: true, onCancel: () => console.log('cancel'), onDone: (value) => console.log('done: ', value) }));
};
//# sourceMappingURL=PromptDialogDemo.js.map