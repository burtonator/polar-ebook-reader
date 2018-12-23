/**
 * Just like a DocDetail or DocInfo but designed to be used for in the UI so we
 * replace missing titles with Untitled and define other default values.
 */
import {IDocInfo} from '../../../web/js/metadata/DocInfo';
import {ISODateTimeString} from '../../../web/js/metadata/ISODateTimeStrings';
import {Tag} from '../../../web/js/tags/Tag';
import {Hashcode} from '../../../web/js/metadata/Hashcode';
import {AnnotationType} from '../../../web/js/metadata/AnnotationType';
import {HighlightColor} from '../../../web/js/metadata/BaseHighlight';

export interface RepoAnnotationInfo {

    fingerprint: string;

    text: string;

    type: AnnotationType;

    created: ISODateTimeString;

    tags?: Readonly<{[id: string]: Tag}>;

    /**
     * Extended metadata specific to each annotation type.
     */
    meta?: RepoHighlightInfo;

    /**
     * The original DocInfo used to construct this RepoDocInfo.
     */
    docInfo: IDocInfo;

}

/**
 * Additional metadata on a highlight.
 */
export interface RepoHighlightInfo {
    color?: HighlightColor;
}
