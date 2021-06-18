import { DataInterface } from "./data-interface";
import ShowData from './show-data';

const Sidebar = (props: { data: DataInterface }) => {
    return <ShowData data= {props.data} isContent={false} />
}

export default Sidebar;
