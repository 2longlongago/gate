import './login.css';
import HttpService from "../service/httpService";

import { BaseSyntheticEvent, MouseEvent, useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Input from "@material-ui/core/Input";
import { DataInterface } from "./data-interface";
// import { sayhi } from '../util';

interface Password {
    password: string,
    showPassword: boolean,
}

// const dataServerURL = 'http://localhost:12126/data';
const dataServerURL = 'https://it-was.df.r.appspot.com/data';

const Login = (props: { getData: (d: DataInterface) => void }) => {
    const httpService = HttpService.start();
    const psw: Password = {
        password: "",
        showPassword: false,
    };

    const [values, setValues] = useState(psw);

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'text/html' },
        body: JSON.stringify({ password: values.password })
    };

    const fetchData = async (): Promise<DataInterface> => {
        let resultStr = await httpService.asyncFetch(dataServerURL, requestOptions)

        let rawdata = httpService.decode(resultStr);
        let data404 = rawdata as number;

        if (data404 === 404) {
            let d: DataInterface = { data: ['404'] }
            return d;
        }

        let data = rawdata as DataInterface;

        return data;
    }

    // const sayhi = (): string => {
    //     let hour = (new Date()).getHours();

    //     if (hour > 18) return 'good evening';
    //     if (hour > 12) return 'good afternoon';
    //     return 'good morning'
    // }

    const onSubmit = () => {
        if (values.password.length > 3){
            fetchData().then((d: DataInterface) => {
                if (d.data) {
                    let dd = d.data as string[];

                    if (dd.length > 0 && dd[0] === '404') {
                        alert('ooh')
                        return;
                    }
                }
                props.getData(d)
            });
        }
    }

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event: MouseEvent) => {
        // const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handlePasswordChange = (prop: string) => (event: BaseSyntheticEvent) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    return (
        <div id='login-container'>
        
            <Input style={{ backgroundColor: "white" }}
                type={values.showPassword ? "text" : "password"}
                onChange={handlePasswordChange("password")}
                value={values.password}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                        >
                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                }
            />
            <button onClick={onSubmit}>submit</button>
        </div>
    );
};

export default Login;