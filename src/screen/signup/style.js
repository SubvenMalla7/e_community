const styles = theme => ({
  bg: {
    backgroundImage: 'url("assets/images/login.png")',
    height: '100vh',
    width: '100vw',
    webkitBackgroundSize: 'cover',
    mozBackgroundSize: 'cover',
    oBackgroundSize: 'cover',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no - repeat',

  },
  main: {
    position: "relative",
    top: "20%",

  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '32px',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
  },
  heading: {

  },
  form: {
    width: '100%',
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    marginLeft: theme.spacing(10),
    width: '50%',
    borderRadius: '35px',
    color: 'white'
  },
  noAccountHeader: {
    width: '100%',
    marginLeft: theme.spacing(16),
  },
  signUpLink: {
    width: '100%',
    textAlign: 'center',
    fontSize: '22px',
    textDecoration: 'none',
    color: '#ff914d',
    fontWeight: 'bolder'
  },
  errorText: {
    color: 'red',
    textAlign: 'center'
  }
});

export default styles;