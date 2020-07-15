import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './component/post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import ImageUpload from './component/imageUpload';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  }
}));
function App() {
  const [posts, setPosts] = useState([]);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(function (authUser) {
      authUser ? setUser(authUser) : setUser(null);
    });
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').onSnapshot(snap => {
      setPosts(snap.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })
      ))
    })
  }, []);

  const logout = (event) => {
    auth.signOut();
  }

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        });
      })
      .catch(function (error) {
        alert(error.message);
      });
    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch(function (error) {
      alert(error.message);
    });
    setOpenSignIn(false);
  }

  return (
    <div className="app">
      {user ? <ImageUpload username={user.displayName} /> : <h5>Login to upload</h5>}
      <div>
        <Modal
          className={classes.modal}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              InstaBay
          <form className={classes.root} noValidate autoComplete="off">
                <TextField label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} />
                <TextField label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" color="primary" onClick={signUp}>Sign Up</Button>
              </form>
            </div>
          </Fade>
        </Modal>

        <Modal
          className={classes.modal}
          open={openSignIn}
          onClose={() => {
            setOpenSignIn(false);
          }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openSignIn}>
            <div className={classes.paper}>
              InstaBay
          <form className={classes.root} noValidate autoComplete="off">
                <TextField label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" color="primary" onClick={signIn}>Sign In</Button>

              </form>
            </div>
          </Fade>
        </Modal>
      </div>
      <div className="app__header">InstaBay
      {user ? (<Button variant="contained" color="primary" onClick={logout}>Logout</Button>) : (

          <div>
            <Button variant="contained" color="primary" onClick={() => {
              setOpen(true)
            }}>Sign Up</Button>
            <Button variant="contained" color="primary" onClick={() => {
              setOpenSignIn(true)
            }}>Sign In</Button>
          </div>

        )}

      </div>

      {
        posts.map(({ id, post }) => (
          <Post userName={post.userName} key={id} postId={id}
            imageUrl={post.imageUrl} logoUrl={post.logoUrl}
            caption={post.caption} ></Post>
        ))
      }

    </div >
  );
}

export default App;
