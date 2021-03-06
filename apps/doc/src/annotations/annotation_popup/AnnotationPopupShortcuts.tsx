import React from "react";
import {MAIN_HIGHLIGHT_COLORS} from "../../../../../web/js/ui/ColorMenu";
import {useRefWithUpdates} from "../../../../../web/js/hooks/ReactHooks";
import {GlobalKeyboardShortcuts, HandlerMap, keyMapWithGroup} from "../../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";
import {AnnotationPopupActionEnum, useAnnotationPopup} from "./AnnotationPopupContext";
import {IDocAnnotation} from "../../../../../web/js/annotation_sidebar/DocAnnotation";
import {useAnnotationMutationsContext} from "../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {ColorStr} from "../../../../../web/js/ui/colors/ColorSelectorBox";
import {usePersistentRouteContext} from "../../../../../web/js/apps/repository/PersistentRoute";

export const ANNOTATION_COLOR_SHORTCUT_KEYS = ["1", "2", "3", "4", "5", "6"];

const annotationBarColorsKeyMap = keyMapWithGroup({
    group: "Annotation Popup Bar",
    keyMap: {
        CHANGE_COLOR: {
            name: "Change Annotation Color",
            description: "Change the color of the selected annotation", 
            sequences: ANNOTATION_COLOR_SHORTCUT_KEYS,
            priority: 1,
        },
    },
});

const annotationBarKeyMap = keyMapWithGroup({
    group: "Annotation Popup Bar",
    keyMap: {
        EDIT_ANNOTATION: {
            name: "Edit Annotation",
            description: "Edit the selected annotation",
            sequences: ["e"],
            priority: 2,
        },
        CREATE_COMMENT: {
            name: "Add Comment",
            description: "Add a comment to the selected annotation",
            sequences: ["c"],
            priority: 3,
        },
        CREATE_FLASHCARD: {
            name: "Create Manual Flashcard",
            description: "Create a manual flashcard for the selected annotation",
            sequences: ["f"],
            priority: 4,
        },
        CREATE_AI_FLASHCARD: {
            name: "Create AI Flashcard",
            description: "Generate an AI flashcard for the selected annotation",
            sequences: ["g"],
            priority: 5,
        },
        EDIT_TAGS: {
            name: "Edit Tags",
            description: "Edit the tags of the selected annotation",
            sequences: ["t"],
            priority: 6,
        },
        COPY_ANNOTATION: {
            name: "Copy Annotation",
            description: "Copy the text of the selected annotation",
            sequences: ["ctrl+c", "command+c"],
            priority: 7,
        },
        DELETE: {
            name: "Delete Annotation",
            description: "Deleted the selected annotation",
            sequences: ["d"],
            priority: 8,
        },
    },
});

export const AnnotationPopupShortcuts: React.FC = () => {
    const {toggleAction} = useAnnotationPopup();
    const {active} = usePersistentRouteContext();

    const toggleActionRef = useRefWithUpdates((action: AnnotationPopupActionEnum) => {
        toggleAction(action)();
    });

    const handlers = React.useMemo<HandlerMap>(() => ({
        EDIT_ANNOTATION: () => toggleActionRef.current(AnnotationPopupActionEnum.EDIT),
        COPY_ANNOTATION: () => toggleActionRef.current(AnnotationPopupActionEnum.COPY),
        CREATE_COMMENT: () => toggleActionRef.current(AnnotationPopupActionEnum.CREATE_COMMENT),
        CREATE_FLASHCARD: () => toggleActionRef.current(AnnotationPopupActionEnum.CREATE_FLASHCARD),
        CREATE_AI_FLASHCARD: () => toggleActionRef.current(AnnotationPopupActionEnum.CREATE_AI_FLASHCARD),
        EDIT_TAGS: () => toggleActionRef.current(AnnotationPopupActionEnum.EDIT_TAGS),
        DELETE: () => toggleActionRef.current(AnnotationPopupActionEnum.DELETE),
    }), [toggleActionRef]);

    if (!active) {
        return null;
    }

    return (
        <>
            <GlobalKeyboardShortcuts keyMap={annotationBarKeyMap} handlerMap={handlers} />
            <ColorShortcuts />
        </>
    );
};

const keyToColor = (key: string): ColorStr | undefined => {
    const exists = ANNOTATION_COLOR_SHORTCUT_KEYS.indexOf(key) > -1;
    const id = +key - 1;
    if (exists && !isNaN(id)) {
        return MAIN_HIGHLIGHT_COLORS[id];
    }
    return undefined;
};

type IHighlightColorShortcuts = {
    annotation: IDocAnnotation;
};
const HighlightColorShortcuts: React.FC<IHighlightColorShortcuts> = ({ annotation }) => {
    const annotationMutations = useAnnotationMutationsContext();
    const handleColor = annotationMutations.createColorCallback({selected: [annotation]});
    const handleColorChangeRef = useRefWithUpdates(({key}: KeyboardEvent) => {
        const color = keyToColor(key);
        if (color && color !== annotation.color) {
            handleColor({ color });
        }
    });

    const handlers = React.useMemo<HandlerMap>(() => ({
        CHANGE_COLOR: e => handleColorChangeRef.current(e as KeyboardEvent),
    }), [handleColorChangeRef]);

    return <GlobalKeyboardShortcuts keyMap={annotationBarColorsKeyMap} handlerMap={handlers}/>;
};

const SelectionColorShortcuts: React.FC = () => {
    const {onCreateAnnotation} = useAnnotationPopup();

    const handleColorChangeRef = useRefWithUpdates(({key}: KeyboardEvent) => {
        const color = keyToColor(key);
        if (color) {
            onCreateAnnotation(color);
        }
    });

    const handlers = React.useMemo<HandlerMap>(() => ({
        CHANGE_COLOR: e => handleColorChangeRef.current(e as KeyboardEvent),
    }), [handleColorChangeRef]);

    return <GlobalKeyboardShortcuts keyMap={annotationBarColorsKeyMap} handlerMap={handlers}/>;
};

const ColorShortcuts: React.FC = () => {
    const {annotation} = useAnnotationPopup();

    if (annotation) {
        return <HighlightColorShortcuts annotation={annotation} />;
    }

    return <SelectionColorShortcuts />;
};
