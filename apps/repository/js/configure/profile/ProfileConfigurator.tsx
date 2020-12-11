import {
    OccupationSelect
} from "./selectors/OccupationSelect";
import {DomainNameStr, University} from "polar-shared/src/util/Universities";
import {default as React, useState} from "react";
import {nullToUndefined} from "polar-shared/src/util/Nullable";
import {AcademicProfileConfigurator} from "./AcademicProfileConfigurator";
import {
    AcademicOccupation,
    BusinessOccupation,
    Occupation
} from "polar-shared/src/util/Occupations";
import {FieldOfStudy} from "polar-shared/src/util/FieldOfStudies";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

export interface AcademicOccupationProfile {
    readonly occupation: AcademicOccupation;
    readonly fieldOfStudy: FieldOfStudy;
    readonly university: University;
}

export interface BusinessOccupationProfile {
    readonly occupation: BusinessOccupation;
    // readonly domainOrURL: URLStr | DomainNameStr;
    // readonly domain: DomainNameStr;
}

export type OccupationProfile = AcademicOccupationProfile | BusinessOccupationProfile;

interface IProps {
    readonly onProfile: (occupationProfile: OccupationProfile) => void;
}

export interface FormData<T> {
    readonly profile: Partial<T>;
    readonly progress: number;
}

interface IState {
    readonly occupation?: Occupation;
    readonly form: FormData<AcademicOccupationProfile> | FormData<BusinessOccupationProfile>;
}

export const ProfileConfigurator = (props: IProps) => {

    const [state, setState] = useState<IState>({
        form: {
            profile: {},
            progress: 0
        }
    });

    const onOccupation = React.useCallback((occupation: Occupation | undefined) => {

        const computeProgress = () => {
            switch (occupation?.type) {

                case "academic":
                    return 25;
                case "business":
                    return 100;
                default:
                    return 0;
            }
        };

        const progress = computeProgress();

        const newState = {
            ...state,
            form: {
                ...state.form,
                progress
            },
            occupation
        };

        setState(newState);

    }, [state]);

    const onForm = React.useCallback((form: FormData<AcademicOccupationProfile> | FormData<BusinessOccupationProfile>) => {
        setState({...state, form});

        if (form.progress === 100) {

            switch (state.occupation?.type) {

                case "academic":
                    props.onProfile(form.profile as AcademicOccupationProfile);
                    break;
                case "business":
                    props.onProfile(form.profile as BusinessOccupationProfile);
                    break;

            }

        }

    }, [props, state]);

    const handleCompleted = React.useCallback(() => {

        function stateToProfile(): OccupationProfile | undefined {

            if (state.form.profile) {
                return state.form.profile as OccupationProfile;
            }

            return undefined;

        }

        const profile = stateToProfile();

        if (profile) {
            props.onProfile(profile);
        }

    }, [props, state.form.profile]);

    return (
        <div style={{
                 minHeight: '30em',
                 display: 'flex',
                 flexDirection: 'column'
             }}
             className="">

            <Box style={{flexGrow: 1}}>

                <div className="mb-1">
                    <LinearProgress variant="determinate"
                                    value={state.form.progress}/>
                </div>

                <div style={{textAlign: 'center'}}>

                    <h2>Tell us about yourself!</h2>

                    <Box color="text.secondary">
                        We use this information to improve Polar specifically
                        for your use case when incorporating your feedback and
                        prioritizing new features.
                    </Box>

                </div>

                <Box mt={3}
                     style={{
                         display: 'flex',
                         flexDirection: 'column',
                         justifyContent: 'flex-center'
                     }}>

                    <Box m={2}>

                        <OccupationSelect
                            placeholder="Pick one from the list or create one if necessary."
                            onSelect={selected => onOccupation(nullToUndefined(selected?.value))}/>

                    </Box>

                    {state.occupation && state.occupation.type === 'academic' &&
                        <AcademicProfileConfigurator occupation={state.occupation}
                                                     form={state.form as FormData<AcademicOccupationProfile>}
                                                     onForm={form => onForm(form)}/>}

                    {/*{state.occupation && state.occupation.type === 'business' &&*/}
                    {/*    <BusinessProfileConfigurator occupation={state.occupation}*/}
                    {/*                                 form={state.form as FormData<BusinessOccupationProfile>}*/}
                    {/*                                 onForm={form => onForm(form)}/>}*/}

                </Box>
            </Box>

            <Box style={{
                     display: 'flex',
                     justifyContent: 'center'
                 }}>

                {/*<Button disabled={state.form.progress === 100}*/}
                {/*        variant="contained"*/}
                {/*        size="large">*/}

                {/*    Skip*/}

                {/*</Button>*/}

                <Button disabled={state.form.progress !== 100}
                        variant="contained"
                        size="large"
                        onClick={handleCompleted}
                        color="primary">

                    Let's Get Started

                </Button>

            </Box>

        </div>
    );

};
