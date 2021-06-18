/*
* author: adam wong
* email:  2mr.long@gmail.com
*/

import './App.css';
import { AppBar, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import Sidebar from './comp/sidebar';
import { DataInterface } from './comp/data-interface';
import Content from './comp/content';
import {  useState } from 'react';
import Login from './comp/login';
import { sayhi } from './util';


function App() {
  let noRealData: DataInterface = {};
  const [realData, setRealData] = useState(noRealData);
  const [isLoaded, setIsLoaded] = useState(false);

  const classes = useStyles();
  const title = ''

  let sidebarcontainerID: HTMLElement | null;

  const sidebarSlide = () => {
    if (sidebarcontainerID == null) {
      sidebarcontainerID = document.getElementById('id-sidebarcontainer');
      sidebarcontainerID?.addEventListener("animationend", animationEnd, false);
    }

    if (sidebarcontainerID?.classList.contains('sidebar-disappear-final')) {
      sidebarcontainerID?.classList.remove('sidebar-disappear-final');
      sidebarcontainerID?.classList.add('sidebar-appear');
    } else if (sidebarcontainerID?.classList.contains('sidebar-appear')) {
      sidebarcontainerID?.classList.remove('sidebar-appear');
      sidebarcontainerID?.classList.add('sidebar-disappear');
    }
  }

  const animationEnd = (e: AnimationEvent) => {
    if (sidebarcontainerID?.classList.contains('sidebar-disappear')) {
      sidebarcontainerID?.classList.remove('sidebar-disappear');
      sidebarcontainerID?.classList.add('sidebar-disappear-final');
    }
  }

  const _getData = (d: DataInterface): void => {
    setRealData(d);
    setIsLoaded(true);
  }

  return (
    <div className="App">

        <div className="sidebar-disappear-final" id="id-sidebarcontainer">
          <div id='catalog-container'>
            <div id="catalog-title" onClick={sidebarSlide}>
              <div className="center">Catalog</div>
            </div>
            <div id='sidebar-with-space-holder'>
              <div id="sidebar">
              { isLoaded ? <Sidebar data={realData} /> : <Login getData={_getData} />}
              </div>
              <div id='sidebar-space-holder'></div>
            </div>
          </div>
          <div id='mask-full' onClick={sidebarSlide}></div>
        </div>
   
      <AppBar position="fixed">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={sidebarSlide}>
            <MenuIcon />
          </IconButton>
          <Typography variant="inherit" color="inherit" className={classes.title}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      <div className="App-header">
        
        {isLoaded ?
          <div style={{ backgroundColor: '#282c34' }}>
            <div id='top-space-holder'></div>
            <Content data={realData} />
          </div>
          :  <h1>{sayhi()}</h1>
        }
      </div>

    </div>
  );
}

export default App;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textAlign: "center",
  },
}));
