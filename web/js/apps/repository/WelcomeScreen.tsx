import * as React from 'react';
import {
    isAcademicOccupationProfile,
    OccupationProfile,
    ProfileConfigurator
} from "../../../../apps/repository/js/configure/profile/ProfileConfigurator";
import {useAnalytics} from "../../analytics/Analytics";
import {Slugs} from "polar-shared/src/util/Slugs";
import {MUIDialog} from "../../ui/dialogs/MUIDialog";
import { useHistory } from 'react-router-dom';

export const WelcomeScreen = React.memo(() => {

    const analytics = useAnalytics();
    const history = useHistory();

    const handleProfile = React.useCallback((profile: OccupationProfile) => {

        analytics.traits({
            user_occupation: profile.occupation.id
        })

        if (isAcademicOccupationProfile(profile)) {
            analytics.traits({
                user_field_of_study: profile.fieldOfStudy.id,
                user_university_id: profile.university.id,
                user_university_name_slug: Slugs.calculate(profile.university.name),
                user_university_domain: Slugs.calculate(profile.university.domain)
            })
        }

        analytics.event2('welcome-profile-completed');

        history.replace('/');

    }, [analytics, history]);

    const handleClose = React.useCallback(() => {
        history.replace('/');
    }, [history]);

    return (
        <MUIDialog open={true} onClose={handleClose}>
            <ProfileConfigurator onProfile={handleProfile}/>
        </MUIDialog>
    );

})