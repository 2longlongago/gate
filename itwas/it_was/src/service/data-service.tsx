import './data-service.css';
import React, {  SyntheticEvent } from 'react';
import { DataInterface } from "../comp/data-interface";

const ele = React.createElement;
const rootString = 'root';

class DataService {
    private static _dataService: DataService = new DataService();

    private constructor() { }

    static start() {
        return DataService._dataService;
    }

    private catalogUl = 'catalog-ul';
    // private indentStep = 1;
    // private indent = 0.3 - this.indentStep;
    private indentLeafFix = '2em';
    private catalogLevel = 0;
    private titleLevel = 0;

    private currentCatalogNames: string[] = [rootString];

    private display = ['block', 'none'];
    private displaying = this.display[0];

    private contents: React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>[] = [];

    private clearCatalog = () => {
        this.currentCatalogNames = [];
    }

    Catalog = (datas: DataInterface, noBullets: string):
        React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> => {
        this.clearCatalog();

        let bu = this.buildCatalog(datas, noBullets);

        return bu;
    }

    private _onClickCatalog = (e: SyntheticEvent, id: string) => {
        let anchor = e.target as HTMLAnchorElement;
        let siblingUl = anchor.nextSibling;

        if (siblingUl !== null) {
            let ul = siblingUl as HTMLUListElement;
            let lists = ul.children;

            // if (lists.length > 1) {
            let disp = 0;
            let list = lists[0] as HTMLUListElement;

            if (list.style.display === this.display[disp]) {
                disp = 1
            }

            // show or hide children
            for (let i = 0; i < lists.length; i++) {
                list = lists[i] as HTMLUListElement;
                list.style.display = this.display[disp];

                let ahref = list.children[0] as HTMLAnchorElement;

                ahref.style.display = this.display[disp];
            }
        }
    }

    private buildCatalog = (datas: DataInterface, noBullets: string):
        React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement> => {
        this.catalogLevel++;

        let lis = [];
        for (let k in datas) {
            if (datas.hasOwnProperty(k)) {

                let chi = datas[k] as DataInterface;

                this.currentCatalogNames.push(k);

                let children = this.catalogChildren(k, chi, noBullets);
                lis.push(ele('li', { className: noBullets }, children));

                this.currentCatalogNames.pop();
            }
        }

        let ul = ele('ul', { className: this.catalogUl }, lis);

        this.catalogLevel--;

        return ul;
    }

    private moreThanOneItem = (datas: DataInterface): boolean=>{
        let count = 0;

        for (let k in datas) {
            if (datas.hasOwnProperty(k))
                count++;
            if (count > 1) {
                return true;
                // break;
            }
        }

        return false;
    }

    private buildSubCatalog = (datas: DataInterface, noBullets: string):
        React.ReactHTMLElement<HTMLElement> => {
        let reactElement: React.ReactHTMLElement<HTMLElement> = ele('li', null, null);

        let moreThanOne = this.moreThanOneItem(datas);
        // let count = 0;
        // let moreThanOne = false;
        // for (let k in datas) {
        //     if (datas.hasOwnProperty(k))
        //         count++;
        //     if (count > 1) {
        //         moreThanOne = true;
        //         break;
        //     }
        // }

        // anchor multi
        let anchorAll: string[] = [];
        let multiAnchorList = [];

        for (let k in datas) {
            if (datas.hasOwnProperty(k)) {
                this.currentCatalogNames.push(k);

                anchorAll.push(k);
                let children = [];
                children.push(this.anchor(k));

                if (!Array.isArray(datas[k])) {
                    let chi = datas[k] as DataInterface;

                    children.push(this.buildCatalog(chi, noBullets));
                }

                reactElement = ele('li', { className: noBullets }, children);

                // when more than one item
                multiAnchorList.push(reactElement);
               
                this.currentCatalogNames.pop();
            }
        }

        if (moreThanOne) {
            let elements = [];
            let anchor = this.anchor(anchorAll.join('-'));

            elements.push(anchor);
            reactElement = ele('ul', { className: this.catalogUl }, multiAnchorList);
            elements.push(reactElement);
            reactElement = ele('li', { className: noBullets }, elements);

        }

        return reactElement;
    }

    // private pushCatalog = (name: string)=>{
    //     let s = this.buildCatalog(name, noBullets);

    //     children.push(s);
    // }

    private anchor = (itemName: string) => {
        let eid = this.currentCatalogNames.join('-');

        let pr = {
            className: 'catalogItemAnchor',
            href: '#' + eid,
            style: { display: this.displaying, textDecoration: 'none' },
            onClick: (e: SyntheticEvent) => this._onClickCatalog(e, eid)
        };

        return ele('a', pr, itemName)
    }

    private catalogChildren = (itemName: string, itemValue: DataInterface, noBullets: string): React.ReactElement[] => {

        if (this.catalogLevel === 1) {
            this.displaying = this.display[0];
        } else {
            this.displaying = this.display[1];
        }

        let children = [];
        children.push(this.anchor(itemName))

        // origin BEGIN
        // if (itemValue !== null && !Array.isArray(itemValue)) {
        //     let s = this.buildCatalog(itemValue, noBullets);

        //     children.push(s);
        // }
        // origin END
        if (itemValue !== null) {
            if (Array.isArray(itemValue)) {
                if (itemValue.length > 0) {
                    // let list: React.DetailedReactHTMLElement<HTMLAttributes<HTMLElement>, HTMLElement>[] = [];
                    let list: React.ReactHTMLElement<HTMLElement>[] = [];
                    for (let i = 0; i < itemValue.length; i++) {
                        if (typeof itemValue[i] != 'string') {
                            list.push(this.buildSubCatalog(itemValue[i], noBullets));
                        }
                    }

                    if (list.length > 0) {
                        let ul = ele('ul', { className: this.catalogUl }, list);
                        children.push(ul);
                    }
                }
            } else {
                let s = this.buildCatalog(itemValue, noBullets);
                children.push(s);
            }
        }

        return children;
    }

    private clearContents = () => {
        this.contents = [];
    }

    Content = (datas: DataInterface) => {
        // Content = (datas: DataInterface, leafCallback: (text: string, textIndent: number) => React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>) => {
        this.clearContents();
        // let bu = this.buildContent(datas, leafCallback);
        let bu = this.buildContent(datas);
        return (
            <>
                {bu}
            </>
        );
    }

    private pushTitle = (title: string) => {
        let eid = this.currentCatalogNames.join('-');

        console.log('catalog level: ', this.titleLevel)

        this.contents.push(ele('p', {
            className: 'level-'+ this.titleLevel,
            id: eid,
            style: {
                // paddingLeft: this.indent + 'em',
                // fontSize: '1.18em',
                marginBlock: '0.1em',
            }
        }, title));
    }

    private pushLeaf = (child: string) => {
        this.contents.push(ele('p', {
            // id: eid,
            className: 'detailText',
            style: {
                textIndent: this.indentLeafFix,
                marginBlock: '0.95em',
            }
        }, child));
    }

    private pushTrunk = (trunk: DataInterface) => {
        // let son = datas[k] as DataInterface;
        this.buildContent(trunk);
    }

    private buildContent = (datas: DataInterface):
        React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>[] => {
            this.titleLevel++;

        // this.indent += this.indentStep;
        for (let k in datas) {
            if (datas.hasOwnProperty(k)) {

                this.currentCatalogNames.push(k)
                this.pushTitle(k);

                if (Array.isArray(datas[k])) {
                    let children = datas[k] as (string | DataInterface)[]

                    for (let i = 0; i < children.length; i++) {
                        if (typeof children[i] === 'string') {
                            this.pushLeaf(children[i] as string);
                        } else {
                            this.pushTrunk(children[i] as DataInterface);
                        }
                    }
                } else {
                    this.pushTrunk(datas[k] as DataInterface);
                }

                this.currentCatalogNames.pop();
            }
        }

        // this.indent -= this.indentStep;

        this.titleLevel--;

        return this.contents;
    }
}

export default DataService;
