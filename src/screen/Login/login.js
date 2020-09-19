import { Link } from 'react-router-dom';
import React from 'react';
import styles from './style';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
// import './style.css'

const firebase = require("firebase");

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            email: null,
            password: null,
            serverError: false,
            errorMessage: ""
        };
    }

    userTyping = (whichInput, event) => {
        switch (whichInput) {
            case 'email':
                this.setState({ email: event.target.value });
                break;

            case 'password':
                this.setState({ password: event.target.value });
                break;

            default:
                break;
        }
    }

    submitLogin = async (e) => {
        e.preventDefault(); // This is to prevent the automatic refreshing of the page on submit.

        await firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.props.history.push('/blog');

            }, error => {
                this.setState({ serverError: true });
                this.setState({ errorMessage: error.message })
                console.log('Error logging in: ', error.message);
            });
    };
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.bg}>
                <div className="container">
                    <div className="row">
                        <div style={{ width: "65%" }}></div>
                        <div className="col-md-4 col-md-offset-7" >
                            {/* <div className="panel panel-default">
                                <div className="panel-heading">
                                    <span className="glyphicon glyphicon-lock" /> Login</div>
                                <div className="panel-body">
                                    <form className="form-horizontal" role="form">
                                        <div className="form-group">
                                            <label htmlFor="inputEmail3" className="col-sm-3 control-label">
                                                Email</label>
                                            <div className="col-sm-9">
                                                <input type="email" className="form-control" id="inputEmail3" placeholder="Email" required />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="inputPassword3" className="col-sm-3 control-label">
                                                Password</label>
                                            <div className="col-sm-9">
                                                <input type="password" className="form-control" id="inputPassword3" placeholder="Password" required />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-sm-offset-3 col-sm-9">
                                                <div className="checkbox">
                                                    <label>
                                                        <input type="checkbox" />
                          Remember me
                        </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group last">
                                            <div className="col-sm-offset-3 col-sm-9">
                                                <button type="submit" className="btn btn-success btn-sm">
                                                    Sign in</button>
                                                <button type="reset" className="btn btn-default btn-sm">
                                                    Reset</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="panel-footer">
                                    Not Registred? <a href="http://www.jquery2dotnet.com">Register here</a></div>
                            </div> */}

                            <main className={classes.main}>
                                <CssBaseline />
                                <Paper className={classes.paper}>
                                    <Typography component="h1" variant="h5" style={{ color: "#ff914d" }}>
                                        Log In
                                         </Typography>
                                    <form onSubmit={(e) => this.submitLogin(e)} className={classes.form}>
                                        <FormControl required fullWidth margin='normal'>
                                            <InputLabel htmlFor='login-email-input'>Enter Your Email</InputLabel>
                                            <Input autoComplete='email' autoFocus onChange={(e) => this.userTyping('email', e)} id='login-email-input'></Input>
                                        </FormControl>
                                        <FormControl required fullWidth margin='normal'>
                                            <InputLabel htmlFor='login-password-input'>Enter Your Password</InputLabel>
                                            <Input autoComplete="current-password" type="password" onChange={(e) => this.userTyping('password', e)} id='login-password-input'></Input>
                                        </FormControl>
                                        <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>Log In</Button>
                                    </form>
                                    {this.state.serverError ?
                                        <Typography className={classes.errorText} component='h5' variant='h6'>
                                            {this.state.errorMessage}
                                        </Typography> :
                                        null
                                    }

                                    <Typography component='h5' variant='h6' className={classes.noAccountHeader} style={{ color: "#ff914d" }}>
                                        Don't Have an Account?   </Typography>
                                    <Link className={classes.signUpLink} to='/signup'>Sign Up</Link>
                                </Paper>
                            </main>

                        </div>
                    </div>
                </div>
            </div >

        );
    }



}

export default withStyles(styles)(Login);