import {TestResultsReader} from '../TestResultsReader';
import {Result} from '../../../util/Result';

declare var window: any;

export class WebDriverTestResultReader extends TestResultsReader {

    private readonly app: any;

    constructor(app: any) {
        super();
        this.app = app;
    }

    async read(): Promise<Result<any>> {

        let result = await this.app.client.executeAsync((done) => {

            function poll() {

                if (window.TEST_RESULT) {
                    done(window.TEST_RESULT);
                    return;
                }

                setTimeout(poll, 250);
            }

            setTimeout(poll, 0);

        });

        return result.value;


    }

}
