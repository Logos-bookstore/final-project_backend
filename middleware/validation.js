import { body, validationResult } from 'express-validator';

export const validation = [
  body('email')
    .exists()
    .withMessage('Please make sure to include your email.')
    .trim()
    .isEmail()
    .withMessage('Please make sure your email is correct.'),
  body('password')
    .exists()
    .trim()
    .isStrongPassword({
      minLength: 9,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
      returnScore: false,
    })
    .withMessage('Please make sure you use a strong password.'),
  body('firstName')
    .exists()
    .withMessage('Please make sure to include your first name.')
    .trim()
    .escape()
    .isAlpha()
    .withMessage('Please make sure your only use letters.'),
  body('lastName')
    .exists()
    .withMessage('Please make sure to include your last name.')
    .trim()
    .escape()
    .isAlpha()
    .withMessage('Please make sure you only use letters.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
    } else {
      res.status(400).json({ success: false, message: errors });
    }
  },
];
