const express = require('express');
const usersRouter = require('./routes/users.router.js');
const evalsRouter = require('./routes/evals.router.js');
const speechesRouter = require('./routes/speeches.router.js');
const { sessionValidator } = require('./modules/sessionValidator.js')

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.static('build'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionValidator);

app.use('/api/users', usersRouter);
app.use('/api/evals', evalsRouter);
app.use('/api/speeches', speechesRouter);

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
