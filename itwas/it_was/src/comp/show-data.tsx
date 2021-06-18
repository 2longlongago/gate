import { makeStyles } from "@material-ui/core";
import DataService from "../service/data-service";
import { DataInterface } from "./data-interface";

const ShowData = (dataWithLeaf: { data: DataInterface, isContent: boolean }) => {
    const classes = useStyles();
    const dataService = DataService.start();

    let dom: JSX.Element;

    if (dataWithLeaf.isContent) {
        dom =dataService.Content(dataWithLeaf.data);
     
    } else {
        dom = dataService.Catalog(dataWithLeaf.data, classes.liNoBullets);
    }

    return dom;
}

export default ShowData;

const useStyles = makeStyles((theme) => ({
    liNoBullets: {
        marginTop: 5,
        marginRight: 30,
        listStyleType: "none",
        textAlign: "left"
    }
}));
