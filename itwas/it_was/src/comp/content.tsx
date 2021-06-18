import { DataInterface } from "./data-interface";
import ShowData from './show-data';
import './Content.css';

const Content = (props: { data: DataInterface }) => {

    return (
        <div id='content-border'>
            <ShowData data={props.data} isContent={true} />
        </div>
    );
}

export default Content;