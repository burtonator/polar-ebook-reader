import React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {createObservableStore, SetStore} from "../react/store/ObservableStore";
import {Arrays} from "polar-shared/src/util/Arrays";

export interface IKeyboardShortcutEvent {
    preventDefault: () => void;
    stopPropagation: () => void;
}

export type KeyboardShortcutEventHandler = (event: IKeyboardShortcutEvent) => void;

export type KeyboardEventHandlerUsingPredicate = (event: KeyboardEvent) => boolean;

export type KeyBindingArray2 = readonly [string, string];
export type KeyBindingArray1 = readonly [string];

export type KeyBinding = string;

export interface IBaseKeyboardShortcut {
    readonly name: string;
    readonly icon?: React.ReactNode,
    readonly description?: string;
    readonly sequences: ReadonlyArray<KeyBinding>;
    readonly priority?: number;
}

export interface IKeyboardShortcut extends IBaseKeyboardShortcut {
    readonly group?: string;
    readonly groupPriority?: number;
}

export interface IKeyboardShortcutWithHandler extends IKeyboardShortcut {
    readonly handler: KeyboardShortcutEventHandler;
}

export type ShortcutEntry = {
    registered: IKeyboardShortcutWithHandler[],
    active: IKeyboardShortcutWithHandler,
};

interface IKeyboardShortcutsStore {

    /**
     * The current keyboard bindings.
     */
    readonly shortcuts: {
        [binding: string]: ShortcutEntry;
    };

    /**
     * True when the keyboard bindings are active so we could disable them
     * temporarily.
     */
    readonly active: boolean;

}

interface IKeyboardShortcutsCallbacks {
    readonly addKeyboardShortcut: (shortcut: IKeyboardShortcutWithHandler) => void;
    readonly removeKeyboardShortcut: (shortcut: IKeyboardShortcutWithHandler) => void;
    readonly setActive: (active: boolean) => void;
}

const initialStore: IKeyboardShortcutsStore = {
    shortcuts: {},
    active: true
}

interface Mutator {
}

function mutatorFactory(storeProvider: Provider<IKeyboardShortcutsStore>,
                        setStore: SetStore<IKeyboardShortcutsStore>): Mutator {
    return {};
}

function callbacksFactory(storeProvider: Provider<IKeyboardShortcutsStore>,
                          setStore: (store: IKeyboardShortcutsStore) => void,
                          mutator: Mutator): IKeyboardShortcutsCallbacks {

    function addKeyboardShortcut(shortcut: IKeyboardShortcutWithHandler) {
        const store = storeProvider();
        const shortcuts = {...store.shortcuts};
        const sequence = Arrays.first(shortcut.sequences)!;
        let storedShortcut = shortcuts[sequence];
        if (!storedShortcut) {
            storedShortcut = { registered: [shortcut], active: shortcut };
        } else {
            storedShortcut.registered.unshift(shortcut);
            storedShortcut.active = shortcut;
        }
        shortcuts[sequence] = storedShortcut;
        setStore({...store, shortcuts});
    }

    function removeKeyboardShortcut(shortcut: IKeyboardShortcutWithHandler) {
        const store = storeProvider();
        const shortcuts = {...store.shortcuts};
        const sequence = Arrays.first(shortcut.sequences)!;
        const storedShortcut = shortcuts[sequence];
        if (storedShortcut) {
            storedShortcut.registered = storedShortcut.registered.filter(x => shortcut !== x);
            storedShortcut.active = storedShortcut.registered[0];
            if (storedShortcut.registered.length === 0) {
                delete shortcuts[sequence];
            }
            setStore({...store, shortcuts});
        }
    }

    function setActive(active: boolean) {
        const store = storeProvider();
        setStore({...store, active});
    }

    return {addKeyboardShortcut, removeKeyboardShortcut, setActive};

}

export const [KeyboardShortcutsStoreProvider, useKeyboardShortcutsStore, useKeyboardShortcutsCallbacks, useKeyboardShortcutsMutator]
    = createObservableStore<IKeyboardShortcutsStore, Mutator, IKeyboardShortcutsCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });

