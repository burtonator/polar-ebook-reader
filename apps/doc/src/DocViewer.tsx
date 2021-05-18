import {DocActions, DocViewerToolbar} from "./toolbar/DocViewerToolbar";
import ReactDOM from "react-dom";
import * as React from "react";
import {DocViewerAppURLs} from "./DocViewerAppURLs";
import {LoadingProgress} from "../../../web/js/ui/LoadingProgress";
import {TextHighlightsView} from "./annotations/TextHighlightsView";
import {AnnotationSidebar2} from "../../../web/js/annotation_sidebar/AnnotationSidebar2";
import {PagemarkProgressBar} from "./PagemarkProgressBar";
import {AreaHighlightsView} from "./annotations/AreaHighlightsView";
import {PagemarksView} from "./annotations/PagemarksView";
import {useDocViewerCallbacks, useDocViewerStore} from "./DocViewerStore";
import isEqual from "react-fast-compare";
import {DocFindBar} from "./DocFindBar";
import {DocViewerGlobalHotKeys} from "./DocViewerGlobalHotKeys";
import {
    computeDocViewerContextMenuOrigin,
    DocViewerMenu,
    IDocViewerContextMenuOrigin
} from "./DocViewerMenu";
import {createContextMenu} from "../../repository/js/doc_repo/MUIContextMenu";
import {Helmet} from "react-helmet";
import {DeviceRouter} from "../../../web/js/ui/DeviceRouter";
import {DocFindButton} from "./DocFindButton";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import {DocRenderer, DocViewerContext} from "./renderers/DocRenderer";
import {ViewerContainerProvider} from "./ViewerContainerStore";
import {FileTypes} from "../../../web/js/apps/main/file_loaders/FileTypes";
import {deepMemo} from "../../../web/js/react/ReactUtils";
import {useStateRef, useRefValue} from "../../../web/js/hooks/ReactHooks";
import {NoDocument} from "./NoDocument";
import {DockLayout2} from "../../../web/js/ui/doc_layout/DockLayout2";
import {Outliner} from "./outline/Outliner";
import {useZenModeResizer} from "./ZenModeResizer";
import {useDocumentViewerVisible} from "./renderers/UseSidenavDocumentChangeCallbackHook";
import {Box, createStyles, Divider, makeStyles, SwipeableDrawer} from "@material-ui/core";
import {MUIIconButton} from "../../../web/js/mui/icon_buttons/MUIIconButton";
import {DocViewerToolbarOverflowButton} from "./DocViewerToolbarOverflowButton";
import {ZenModeButton} from "./toolbar/ZenModeButton";
import {FullScreenButton} from "./toolbar/FullScreenButton";
import {MUIPaperToolbar} from "../../../web/js/mui/MUIPaperToolbar";
import {useDocViewerSnapshot} from "./UseDocViewerSnapshot";
import {DockPanel} from "../../../web/js/ui/doc_layout/DockLayout";
import {ZenModeActiveContainer} from "../../../web/js/mui/ZenModeActiveContainer";
import {useZenModeStore} from "../../../web/js/mui/ZenModeStore";
import {useDocRepoCallbacks, useDocRepoStore} from "../../repository/js/doc_repo/DocRepoStore2";
import {usePersistentRouteContext} from "../../../web/js/apps/repository/PersistentRoute";
import clsx from "clsx";

const useStyles = makeStyles((theme) =>
    createStyles({
        flex: {
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minHeight: 0,
        },
        docMain: {
            background: theme.palette.background.default,
        },
        phoneDrawerPaper: {
            width: "100vw",
        },
    }),
);


const Main = React.memo(function Main() {
    const classes = useStyles();

    return (

    <div className={clsx("DocViewer.Main", classes.flex)}>

            <PagemarkProgressBar/>
            <DocViewerGlobalHotKeys/>
            <DocFindBar/>

            <div
                className={clsx("DocViewer.Main.Body", classes.flex, classes.docMain)}
                style={{ position: "relative" }}
            >

                <DocViewerContextMenu>
                    <DocMain/>
                </DocViewerContextMenu>
            </div>

        </div>
    )
})

const DocMain = React.memo(function DocMain() {

    const {docURL, docMeta} = useDocViewerStore(['docURL', 'docMeta']);
    const isVisible = useDocumentViewerVisible(docMeta?.docInfo.fingerprint || '');

    if (! docURL) {
        return null;
    }

    return (
        <>
            {isVisible && 
                <Helmet>
                    <title>Polar: { docMeta?.docInfo.title }</title>
                </Helmet>
            }
            <DocRenderer>
                <>
                    <TextHighlightsView />

                    <AreaHighlightsView/>

                    <PagemarksView/>
                </>
            </DocRenderer>

        </>
    )
}, isEqual);

const DocViewerContextMenu = createContextMenu<IDocViewerContextMenuOrigin>(DocViewerMenu, {computeOrigin: computeDocViewerContextMenuOrigin});

const LEFT_DOCK_WIDTH = 400;
const RIGHT_DOCK_WIDTH = 400;

const useTabletLayoutStyles = makeStyles(() =>
    createStyles({
        drawer: {
            position: "absolute",
            top: 0,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            "& > *": { flexGrow: 1 },
        },
        drawerLeft: {
            width: LEFT_DOCK_WIDTH,
            position: "static",
        },
        drawerRight: {
            width: RIGHT_DOCK_WIDTH,
            right: 0,
        },
        root: {
            transition: "left 225ms cubic-bezier(0, 0, 0.2, 1)",
            zIndex: 10,
            position: "relative",
            left: 0,
            top: 0,
            bottom: 0,
        },
        rightOpen: {
            "& .docviewer-inner": {
                left: -RIGHT_DOCK_WIDTH,
            },
        },
    }),
);

namespace Device {
    export interface HandheldToolbarProps {
        readonly toggleRightDrawer: () => void;
    }

    const HandheldToolbar = React.memo(function HandheldToolbar(props: HandheldToolbarProps) {

        return (
            <MUIPaperToolbar borderBottom>
            <div style={{
                     display: 'flex',
                     alignItems: 'center'
                 }}
                 className="p-1">

                <div style={{
                         display: 'flex',
                         flexGrow: 1,
                         flexBasis: 0,
                         alignItems: 'center'
                     }}>

                    <DocFindButton className="mr-1"/>
                </div>

                <div style={{alignItems: 'center'}}>
                    <IconButton onClick={props.toggleRightDrawer}>
                        <MenuIcon/>
                    </IconButton>
                </div>

            </div>
            </MUIPaperToolbar>
        )
    });

    export const Tablet = React.memo(function Tablet() {
        const {docMeta} = useDocViewerStore(["docMeta"]);
        const {zenMode} = useZenModeStore(['zenMode']);
        const classes = useStyles();
        const tabletClasses = useTabletLayoutStyles();
        const [annotationSidebarOpen, setAnnotationSidebarOpen] = React.useState(false);
        const sidecarElem = React.useMemo(() => document.querySelector<HTMLDivElement>("#sidenav-sidecar"), []);
        const {active} = usePersistentRouteContext();
        const {setLeftDockOpen} = useDocRepoCallbacks();
        const {isLeftDockOpen} = useDocRepoStore(['isLeftDockOpen']);

        // TODO: disable interacting with the docks until the document is fully loaded.
        //

        const toggleOutliner = () => {
            setLeftDockOpen(!isLeftDockOpen);
            setAnnotationSidebarOpen(false);
        };

        const toggleAnnotationSidebar = () => {
            setAnnotationSidebarOpen(!annotationSidebarOpen);
            setLeftDockOpen(false);
        };

        React.useEffect(() => {
            if (zenMode) {
                setLeftDockOpen(false);
                setAnnotationSidebarOpen(false);
            }
        }, [zenMode]);

        if (!sidecarElem) {
            return null;
        }

        return (
            <>
                <div
                    className={clsx(
                        classes.flex,
                        {
                            [tabletClasses.rightOpen]: annotationSidebarOpen,
                        },
                    )}
                    style={{ position: "relative" }}
                >
                    {active && ReactDOM.createPortal(
                        <div
                            className={clsx(
                                tabletClasses.drawer,
                                tabletClasses.drawerLeft,
                            )}>
                            <Outliner />
                        </div>,
                        sidecarElem!,
                    )}
                    <div
                        className={clsx(
                            tabletClasses.drawer,
                            tabletClasses.drawerRight,
                        )}>
                        <AnnotationSidebar2 />
                    </div>
                    <div className={clsx("DocViewer.Tablet", "docviewer-inner", classes.flex, tabletClasses.root)}>
                        <ZenModeActiveContainer>
                            <MUIPaperToolbar borderBottom>
                                <Box justifyContent="space-between"
                                    alignItems="center"
                                    display="flex"
                                    className="p-1">
                                    <div>
                                        <MUIIconButton onClick={toggleOutliner}>
                                            <MenuIcon/>
                                        </MUIIconButton>
                                        <DocFindButton className="mr-1"/>
                                    </div>

                                    <Box display="flex" alignItems="center" className="gap-box">
                                        <DocActions />
                                        <Divider orientation="vertical" flexItem={true} />
                                        <ZenModeButton/>
                                        <FullScreenButton/>
                                        <DocViewerToolbarOverflowButton docInfo={docMeta?.docInfo}/>
                                        <MUIIconButton onClick={toggleAnnotationSidebar}>
                                            <MenuIcon/>
                                        </MUIIconButton>
                                    </Box>
                                </Box>
                            </MUIPaperToolbar>
                        </ZenModeActiveContainer>

                        <div className={clsx("DocViewer.Tablet.Body", classes.flex)}>
                            <Main/>
                        </div>

                    </div>
                </div>
            </>
        );
    }, isEqual);

    export const Desktop: React.FC = React.memo(function Desktop() {
        const classes = useStyles();
        const {resizer, docMeta} = useDocViewerStore(['resizer', 'docMeta']);

        const resizerRef = useRefValue(resizer);

        const onDockLayoutResize = React.useCallback(() => {

            if (resizerRef.current) {
                resizerRef.current();
            } else {
                console.warn("No resizer");
            }

        }, [resizerRef]);

        const layout: Partial<DockPanel> = {
            width: 410,
            style: {
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                flexGrow: 1,
            },
        };

        return (
            <DockLayout2.Root
                onResize={onDockLayoutResize}
                dockPanels={[
                    {
                        ...layout,
                        component: <Outliner/>,
                        collapsed: true,
                        id: "doc-panel-outline",
                        type: "fixed",
                        side: "left",
                    },
                    {
                        id: "dock-panel-viewer",
                        type: "grow",
                        style: { display: "flex" },
                        component: <Main/>
                    },
                    {
                        ...layout,
                        component: <AnnotationSidebar2 />,
                        collapsed: false,
                        id: "doc-panel-sidebar",
                        type: "fixed",
                        side: "right",
                    }
                ]}>
                <div className={clsx("DocViewer.Desktop", classes.flex)}>

                    <DocViewerToolbar />

                    <div className={clsx("DocViewer.Desktop.Body", classes.flex)}>

                        <DockLayout2.Main/>
                    </div>

                </div>
            </DockLayout2.Root>
        );
    });
}

const DocViewerMain = deepMemo(function DocViewerMain() {

    useZenModeResizer();

    return (
        <DeviceRouter desktop={<Device.Desktop />}
                    handheld={<Device.Tablet />} />
    );

});

interface DocViewerParentProps {
    readonly docID: string;
    readonly children: React.ReactNode;
}

const DocViewerParent = deepMemo((props: DocViewerParentProps) => (
    <div data-doc-viewer-id={props.docID}
         style={{
             display: "flex",
             minHeight: 0,
             overflow: "hidden",
             flexGrow: 1,
         }}>
        {props.children}
    </div>
));

export const DocViewer = deepMemo(function DocViewer() {

    const {docURL} = useDocViewerStore(['docURL']);
    const {setDocMeta} = useDocViewerCallbacks();
    const parsedURL = React.useMemo(() => DocViewerAppURLs.parse(document.location.href), []);
    const [exists, setExists, existsRef] = useStateRef<boolean | undefined>(undefined);

    const snapshot = useDocViewerSnapshot(parsedURL?.id);

    React.useEffect(() => {

        if (snapshot) {

            if (existsRef.current !== snapshot.exists) {
                setExists(snapshot.exists)
            }

            if (snapshot.docMeta) {

                function computeType() {
                    return snapshot?.hasPendingWrites ? 'snapshot-local' : 'snapshot-server';
                }

                const type = computeType();

                setDocMeta(snapshot.docMeta, snapshot.hasPendingWrites, type);

            }

        }


    }, [existsRef, setDocMeta, setExists, snapshot]);

    if (exists === false) {
        return <NoDocument/>;
    }

    if (parsedURL === undefined) {
        return <NoDocument/>;
    }

    const docID = parsedURL.id;

    if (docURL === undefined) {
        return (
            <>
                <LoadingProgress/>
            </>
        )
    }

    const fileType = FileTypes.create(docURL);

    return (
        <DocViewerParent docID={docID}>
            <DocViewerContext.Provider value={{fileType, docID}}>
                <ViewerContainerProvider>
                    <DocViewerMain/>
                </ViewerContainerProvider>
            </DocViewerContext.Provider>
        </DocViewerParent>
    );

});



