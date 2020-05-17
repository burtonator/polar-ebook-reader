import {DocToolbar} from "./DocToolbar";
import {DockLayout} from "../../../web/js/ui/doc_layout/DockLayout";
import {OnFinderCallback, PDFDocument, ScaleLeveler} from "./PDFDocument";
import * as React from "react";
import {ViewerContainer} from "./ViewerContainer";
import {Finder} from "./Finders";
import {Callback1} from "polar-shared/src/util/Functions";
import {Logger} from "polar-shared/src/logger/Logger";
import {PDFScaleLevelTuple} from "./PDFScaleLevels";
import {PDFAppURLs} from "./PDFAppURLs";
import {LoadingProgress} from "../../../web/js/ui/LoadingProgress";
import {TextHighlightsView} from "./annotations/TextHighlightsView";
import {AnnotationSidebar2} from "../../../web/js/annotation_sidebar/AnnotationSidebar2";
import {PagemarkProgressBar} from "./PagemarkProgressBar";
import {AreaHighlightsView} from "./annotations/AreaHighlightsView";
import {PagemarksView} from "./annotations/PagemarksView";
import {useComponentDidMount} from "../../../web/js/hooks/lifecycle";
import {
    IDocViewerStore,
    useDocViewerCallbacks,
    useDocViewerStore
} from "./DocViewerStore";
import isEqual from "react-fast-compare";
import {usePersistenceLayerContext} from "../../repository/js/persistence_layer/PersistenceLayerApp";
import {SimpleReactor} from "../../../web/js/reactor/SimpleReactor";
import {PopupStateEvent} from "../../../web/js/ui/popup/PopupStateEvent";
import {TriggerPopupEvent} from "../../../web/js/ui/popup/TriggerPopupEvent";
import {ControlledPopupProps} from "../../../web/js/ui/popup/ControlledPopup";
import {
    AnnotationBarCallbacks,
    OnHighlightedCallback
} from "../../../web/js/ui/annotationbar/ControlledAnnotationBar";
import {HighlightCreatedEvent} from "../../../web/js/comments/react/HighlightCreatedEvent";
import {ControlledAnnotationBars} from "../../../web/js/ui/annotationbar/ControlledAnnotationBars";
import {TextHighlighter} from "./TextHighlighter";
import {
    ITextHighlightCreate,
    useAnnotationMutationsContext
} from "../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {DocFindBar} from "./DocFindBar";
import {DocRepoKeyBindings} from "./DocFindKeyBindings";
import {useDocFindCallbacks} from "./DocFindStore";
import {
    computeDocViewerContextMenuOrigin,
    DocViewerMenu,
    IDocViewerContextMenuOrigin
} from "./DocViewerMenu";
import {createContextMenu} from "../../../web/spectron0/material-ui/doc_repo_table/MUIContextMenu";
import ICreateTextHighlightOpts = TextHighlighter.ICreateTextHighlightOpts;

const log = Logger.create();

interface MainProps {
    readonly onFinder: OnFinderCallback;
    readonly onScaleLeveler: Callback1<ScaleLeveler>;
}

const Main = React.memo((props: MainProps) => {

    const {docURL, docMeta, docDescriptor} = useDocViewerStore();

    if (! docURL) {
        return null;
    }

    return (
        <>
            <ViewerContainer/>

            <PDFDocument
                onFinder={props.onFinder}
                target="viewerContainer"
                onScaleLeveler={props.onScaleLeveler}
                url={docURL}/>

            <TextHighlightsView docMeta={docMeta}
                                scaleValue={docDescriptor?.scaleValue}/>

            <AreaHighlightsView docMeta={docMeta}
                                scaleValue={docDescriptor?.scaleValue}/>

            <PagemarksView docMeta={docMeta}
                           scaleValue={docDescriptor?.scaleValue}/>

        </>
    )
}, isEqual);

interface IState {
    readonly finder?: Finder;
    readonly scaleLeveler?: ScaleLeveler;
}

const DocViewerContextMenu = createContextMenu<IDocViewerContextMenuOrigin>(DocViewerMenu, {computeOrigin: computeDocViewerContextMenuOrigin});

export const DocViewer = React.memo(() => {

    const [state, setState] = React.useState<IState>({});

    const {setPageNavigator, setDocMeta} = useDocViewerCallbacks();
    const {resizer, docURL, docMeta} = useDocViewerStore();
    const persistenceLayerContext = usePersistenceLayerContext()

    const {setFinder} = useDocFindCallbacks();

    useAnnotationBar();

    // FIXME: I think I can have hard wired types for state transition functions
    // like an uninitialized store, with missing values, then an initialized
    // one with a different 'type' value.

    useComponentDidMount(() => {

        const handleLoad = async () => {

            const parsedURL = PDFAppURLs.parse(document.location.href);

            if (! parsedURL) {
                console.log("No parsed URL")
                return;
            }

            // FIXME useSnapshotSubscriber for this so that we don't have to worry
            // about component unmount.
            // FIXME use a Progress control so the page shows itself loading state

            const persistenceLayer
                = persistenceLayerContext.persistenceLayerProvider();

            // FIXME: load the file too

            // FIXME: unsubscribe on component unmount
            // FIXME not getting intial snapshot
            const snapshotResult = await persistenceLayer.getDocMetaSnapshot({
                fingerprint: parsedURL.id,
                onSnapshot: (snapshot => {
                    // TODO/FIXME: we need a better way to flag that the
                    // document was deleted vs not initialized.
                    setDocMeta(snapshot.data!);
                }),
                onError: (err) => {
                    log.error("Could not handle snapshot: ", err);
                }

            });

        };

        handleLoad()
            .catch(err => log.error(err));

    });

    function onDockLayoutResize() {
        console.log("FIXME: dock resized");

        if (resizer) {
            resizer();
        }
    }

    function onScaleLeveler(scaleLeveler: ScaleLeveler) {
        setState({
                          ...state,
                          scaleLeveler
                      })
    }

    function onScale(scale: PDFScaleLevelTuple) {
        state.scaleLeveler!(scale);
    }


    // const globalKeyHandlers = {
    //     FIND: () => onFind()
    // };

    if (! docURL) {
        return <LoadingProgress/>
    }

    return (

        <div style={{
                 display: 'flex',
                 flexDirection: 'column',
                 flexGrow: 1,
                 minHeight: 0
             }}>

            <DocToolbar onScale={scale => onScale(scale)}/>

            <div style={{
                     display: 'flex',
                     flexDirection: 'column',
                     flexGrow: 1,
                     minHeight: 0
                 }}>

                <DockLayout
                    onResize={() => onDockLayoutResize()}
                    dockPanels={[
                    {
                        id: "dock-panel-viewer",
                        type: 'grow',
                        style: {
                            display: 'flex'
                        },
                        component:
                            <div style={{
                                    flexGrow: 1,
                                    minHeight: 0,
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>

                                <PagemarkProgressBar/>
                                <DocRepoKeyBindings/>
                                <DocFindBar/>

                                <div style={{
                                        minHeight: 0,
                                        overflow: 'auto',
                                        flexGrow: 1,
                                        position: 'relative'
                                     }}>

                                    <DocViewerContextMenu>
                                        <Main onFinder={setFinder}
                                              onScaleLeveler={scaleLeveler => onScaleLeveler(scaleLeveler)}
                                              />
                                    </DocViewerContextMenu>
                                </div>

                            </div>
                    },
                    {
                        id: "doc-panel-sidebar",
                        type: 'fixed',
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: 0,
                            flexGrow: 1
                        },
                        component:
                            <>
                            {docMeta &&
                                <AnnotationSidebar2 />}
                            </>,
                        width: 300,
                    }
                ]}/>
            </div>

        </div>

    );
}, isEqual);


type CreateTextHighlightCallback = (opts: ICreateTextHighlightOpts) => void;

function useCreateTextHighlightCallback(): CreateTextHighlightCallback {

    const annotationMutations = useAnnotationMutationsContext();

    return (opts: ICreateTextHighlightOpts) => {
        const {docMeta, pageMeta, textHighlight}
            = TextHighlighter.createTextHighlight(opts);

        const mutation: ITextHighlightCreate = {
            type: 'create',
            docMeta, pageMeta, textHighlight
        }

        annotationMutations.onTextHighlight(mutation);

    };

}

function useAnnotationBar() {

    const store = React.useRef<IDocViewerStore | undefined>(undefined)
    const textHighlightCallback = React.useRef<CreateTextHighlightCallback | undefined>(undefined)

    store.current = useDocViewerStore();
    textHighlightCallback.current = useCreateTextHighlightCallback();

    React.useMemo(() => {

        const popupStateEventDispatcher = new SimpleReactor<PopupStateEvent>();
        const triggerPopupEventDispatcher = new SimpleReactor<TriggerPopupEvent>();

        const annotationBarControlledPopupProps: ControlledPopupProps = {
            id: 'annotationbar',
            placement: 'top',
            popupStateEventDispatcher,
            triggerPopupEventDispatcher
        };

        const onHighlighted: OnHighlightedCallback = (highlightCreatedEvent: HighlightCreatedEvent) => {
            console.log("onHighlighted: ", highlightCreatedEvent);

            const callback = textHighlightCallback.current!;
            const docMeta = store.current!.docMeta!;

            callback({
                docMeta,
                pageNum: highlightCreatedEvent.pageNum,
                highlightColor: highlightCreatedEvent.highlightColor,
                selection: highlightCreatedEvent.activeSelection.selection
            })

            // TextHighlighter.computeTextSelections();
        };

        const annotationBarCallbacks: AnnotationBarCallbacks = {
            onHighlighted,
            // onComment
        };

        ControlledAnnotationBars.create(annotationBarControlledPopupProps, annotationBarCallbacks);

    }, []);

}
