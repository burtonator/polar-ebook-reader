import {Firestore} from '../../../firebase/Firestore';
import {SnapshotUnsubscriber} from '../../../firebase/Firebase';
import WhereFilterOp = firebase.firestore.WhereFilterOp;
import DocumentChangeType = firebase.firestore.DocumentChangeType;
import {Logger} from "../../../logger/Logger";

const log = Logger.create();

export class Collections {


    public static async deleteByID(collection: string,
                                   provider: () => Promise<ReadonlyArray<IDRecord>>) {

        const firestore = await Firestore.getInstance();

        const records = await provider();

        for (const record of records) {
            const doc = firestore.collection(collection).doc(record.id);
            await doc.delete();
        }

    }

    public static async list<T>(collection: string, clauses: ReadonlyArray<Clause>): Promise<ReadonlyArray<T>> {

        const query = await this.createQuery(collection, clauses);

        const snapshot = await query.get();

        return snapshot.docs.map(current => <T> current.data());

    }

    /**
     * Query snapshot but only for changed documents.
     */
    public static async onQuerySnapshotChanges<T>(collection: string,
                                                  clauses: ReadonlyArray<Clause>,
                                                  delegate: (records: ReadonlyArray<DocumentChange<T>>) => void,
                                                  errHandler: QuerySnapshotErrorHandler = DefaultQuerySnapshotErrorHandler): Promise<SnapshotUnsubscriber> {

        const query = await this.createQuery(collection, clauses);

        return query.onSnapshot(snapshot => {

            const changes = snapshot.docChanges().map(current => {

                const type = current.type;
                const value = <T> current.doc.data();
                return {
                    type,
                    value
                };

            });

            delegate(changes);

        }, err => {
            errHandler(err, collection, clauses);
        });

    }

    /**
     * Query snapshot but only for changed documents.
     */
    public static async onQuerySnapshot<T>(collection: string,
                                           clauses: ReadonlyArray<Clause>,
                                           delegate: (records: ReadonlyArray<T>) => void,
                                           errHandler: QuerySnapshotErrorHandler = DefaultQuerySnapshotErrorHandler): Promise<SnapshotUnsubscriber> {

        const query = await this.createQuery(collection, clauses);

        return query.onSnapshot(snapshot => {
            delegate(snapshot.docs.map(current => <T> current.data()));
        }, err => {
            errHandler(err, collection, clauses);
        });

    }

    public static async onDocumentSnapshot<T>(collection: string,
                                              id: string,
                                              delegate: (record: T | undefined) => void,
                                              errHandler: SnapshotErrorHandler = DefaultSnapshotErrorHandler): Promise<SnapshotUnsubscriber> {

        const firestore = await Firestore.getInstance();

        const ref = firestore.collection(collection).doc(id);

        return ref.onSnapshot(snapshot => {

            const toValue = () => {

                if (snapshot.exists) {
                    return <T> snapshot.data();
                }

                return undefined;

            };

            delegate(toValue());

        }, err => {
            errHandler(err, collection);
        });

    }

    private static async createQuery(collection: string,
                                     clauses: ReadonlyArray<Clause>) {

        const firestore = await Firestore.getInstance();

        const clause = clauses[0];
        const [field, op, value] = clause;

        let query = firestore
            .collection(collection)
            .where(field, op, value);

        for (const clause of clauses.slice(1)) {
            const [field, op, value] = clause;
            query = query.where(field, op, value);
        }

        return query;

    }


}

export interface IDRecord {
    readonly id: string;
}

export type Clause = [string, WhereFilterOp, any];

export type SnapshotListener<T> = (record: ReadonlyArray<T>) => void;

export interface DocumentChange<T> {
    readonly type: DocumentChangeType;
    readonly value: T;
}

export type QuerySnapshotErrorHandler = (err: Error, collection: string, clauses: ReadonlyArray<Clause>) => void;

const DefaultQuerySnapshotErrorHandler = (err: Error, collection: string, clauses: ReadonlyArray<Clause>) => {

    log.error(`Unable to handle snapshot for collection ${collection}: `, clauses, err);

};

export type SnapshotErrorHandler = (err: Error, collection: string) => void;

const DefaultSnapshotErrorHandler = (err: Error, collection: string) => {

    log.error(`Unable to handle snapshot for collection ${collection}: `, err);

};
