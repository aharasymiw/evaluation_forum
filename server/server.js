const express = require('express');

const { sessionValidator } = require('./modules/sessionValidator.js')

const authRouter = require('./routes/auth.router.js');
const evalsRouter = require('./routes/evals.router.js');
const speechesRouter = require('./routes/speeches.router.js');
const usersRouter = require('./routes/users.router.js');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.static('build'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionValidator);

app.use('/api/auth', authRouter);
app.use('/api/evals', evalsRouter);
app.use('/api/speeches', speechesRouter);
app.use('/api/users', usersRouter);

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
