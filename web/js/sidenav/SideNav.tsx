import * as React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { useSideNavStore, TabDescriptor, useSideNavCallbacks } from './SideNavStore';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';
import Card from '@material-ui/core/Card/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import {PolarSVGIcon} from "../ui/svg_icons/PolarSVGIcon";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: '100px;',
            backgroundColor: theme.palette.background.default
        },
        button: {
            // borderRadius: '5px',
            width: '92px',
            borderLeftWidth: '4px',
            borderLeftStyle: 'solid',
            borderLeftColor: 'transparent',
            marginBottom: '5px',
            paddingLeft: '3px',
            cursor: 'pointer',

            "& img": {
                width: '92px',
                borderRadius: '5px',
            },
            '&:hover': {
                borderLeftColor: theme.palette.secondary.main
            },

        },
        activeButton: {
            borderLeftColor: theme.palette.secondary.main
        },
        logo: {
            display: 'flex',
            "& *": {
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        divider: {
            marginBottom: '5px',
        }
    }),
);

    export const SideNav = React.memo(() => {

    const classes = useStyles();

    const {tabs, activeTab} = useSideNavStore(['tabs', 'activeTab']);
    const {setActiveTab} = useSideNavCallbacks();

    const toNavButton = React.useCallback((tab: TabDescriptor) => {

        const active = tab.id === activeTab;

        console.log("FIXME: active: ", active);
        console.log("FIXME: activeTab: ", activeTab);

        const Title = () => {
            return (
                // <div>
                //     {tab.title}
                // </div>

                <Card>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            alt={tab.title}
                            height="200"
                            style={{
                                objectPosition: "0% 0%"
                            }}
                            image={tab.image.url}
                            title={tab.title}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {tab.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                                across all continents except Antarctica
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            );
        }

        return (
            <div key={`${tab.id}`}>
                <Tooltip placement="right"
                         enterDelay={0}
                         leaveDelay={0}
                         arrow={true}
                         PopperProps={{
                             style: {
                                 display: active ? 'none' : undefined
                             }
                         }}
                         title={<Title/>}>

                    <div onClick={() => setActiveTab(tab.id)}
                         className={clsx(classes.button, active && classes.activeButton)}>
                        {tab.icon}
                    </div>
                </Tooltip>
            </div>
        );

    }, [activeTab, classes.activeButton, classes.button, setActiveTab]);

    return (
        <div className={classes.root}>

            <div className={classes.logo}>
                <PolarSVGIcon width={85} height={85}/>
            </div>

            <div className={classes.divider}>
                <Divider/>
            </div>

            {tabs.map(toNavButton)}
        </div>
    );

});