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
const firebase = require("firebase");

class SignUp extends React.Component {

    constructor() {
        super();
        this.state = {
            name: null,
            email: null,
            password: null,
            passwordConfirmation: null,
            proff: null,
            signupError: ""
        };
    }

    validation = () => this.state.password === this.state.passwordConfirmation;

    submitSignUp = async event => {
        event.preventDefault();

        if (!this.validation()) {
            this.setState({ signupError: "Password donot match" });
            return;
        }
        firebase.auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(authRes => {
                const userObj = {
                    email: authRes.user.email,
                    bio: "Add your Bio",
                    image: "../assets/images/account.png",
                    proff: this.state.proff === null ? "Student" : this.state.proff
                };
                firebase.firestore()
                    .collection('users')
                    .doc(this.state.email)
                    .set(userObj)
                    .then(() => {
                        this.props.history.push('/blog')
                        if (firebase.auth().currentUser != null) {
                            firebase.auth().currentUser.updateProfile({
                                displayName: this.state.name,

                            }).then(function () {
                                console.log("Updated");
                            }, function (error) {
                                console.log("Error happened");
                            });
                        }
                    },
                        dbError => {
                            console.log(dbError);
                            this.setState({ signupError: "Failed to add user" })
                        }
                    )
            }, authError => {
                console.log(authError);
                this.setState({ signupError: 'Failed to add user' })
            })

    };


    userTyping = (type, e) => {
        switch (type) {
            case 'name':
                this.setState({ name: e.target.value });
                break;
            case 'email':
                this.setState({ email: e.target.value });
                break;
            case 'password':
                this.setState({ password: e.target.value });
                break;
            case 'passwordConfirmation':
                this.setState({ passwordConfirmation: e.target.value });
                break;
            case 'prof':
                console.log(e.target.value)
                this.setState({ proff: e.target.value });
                break;

            default:
                break;
        };
    };

    render() {

        const { classes } = this.props;

        return (
            <div className={classes.bg}>
                <div className="container">
                    <div className="row">
                        <div style={{ width: "65%" }}></div>
                        <div className="col-md-4 col-md-offset-7" >
                            <main className={classes.main}>
                                <CssBaseline></CssBaseline>
                                <Paper className={classes.paper}>
                                    <Typography component='h1' variant='h5' style={{ color: "#ff914d" }}>
                                        Sign Up!
                    </Typography>
                                    <form onSubmit={(e) => this.submitSignUp(e)} className={classes.form}>
                                        <FormControl required fullWidth margin='normal'>
                                            <InputLabel htmlFor='sign-email-input'>Name</InputLabel>
                                            <Input autoComplete='name' autoFocus id='sign-email-input' onChange={(e) => this.userTyping('name', e)}></Input>
                                        </FormControl>
                                        <FormControl required fullWidth margin='normal'>
                                            <InputLabel htmlFor='sign-email-input'>Email</InputLabel>
                                            <Input autoComplete='email' autoFocus id='sign-email-input' onChange={(e) => this.userTyping('email', e)}></Input>
                                        </FormControl>
                                        <FormControl required fullWidth margin='normal'>
                                            <InputLabel htmlFor='sign-password-input'>Password</InputLabel>
                                            <Input type='password' autoFocus id='sign-password-input' onChange={(e) => this.userTyping('password', e)}></Input>
                                        </FormControl>
                                        <FormControl required fullWidth margin='normal'>
                                            <InputLabel htmlFor='sign-password-confirmation-input'>Confirm Password</InputLabel>
                                            <Input type='password' autoFocus id='sign-password-confirmation-input' onChange={(e) => this.userTyping('passwordConfirmation', e)}></Input>
                                        </FormControl>
                                        <label >Profession:</label>
                                        <select name="profession" onChange={(e) => this.userTyping('prof', e)}>
                                            <option value="Student">Student</option>
                                            <option value="Teacher">Teacher</option>

                                        </select>
                                        <Button  type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>Submit</Button>
                                    </form>
                                    {
                                        this.state.signupError ? <Typography className={classes.errorText} component='h5' variant='h6' >{this.state.signupError}</Typography> : null
                                    }
                                    <Typography component='h5' variant='h6' className={classes.hasAccountHeader}>
                                        Already Have an Account?
                    </Typography>
                                    <Link className={classes.signUpLink} to='/'>Log In</Link>
                                </Paper>
                            </main>
                        </div>
                    </div>
                </div>
            </div>

            // <div className={classes.bg}>

            // </div >
        );
    }

}
export default withStyles(styles)(SignUp);