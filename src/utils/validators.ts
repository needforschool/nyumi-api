import moment from "moment";

export const validateRegisterInput = (
  email: string,
  tel: string,
  password: string
) => {
  const errors: any = {};
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }
  if (!tel) {
    errors.tel = "Telephone number must not be empty";
  } else {
    const regEx = /[0-9]{0,14}$/;
    if (!tel.match(regEx)) {
      errors.tel = "Phone must be valid";
    }
  }
  if (password === "") {
    errors.password = "Password must not empty";
  } /* else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  } */

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateLoginInput = (email: string, password: string) => {
  const errors: any = {};
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateChangePasswordInput = (
  email: string,
  token: string,
  password: string,
  confirmPassword: string
) => {
  const errors: any = {};
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }
  if (!token) errors.token = "Token must not be empty";
  if (password === "") {
    errors.password = "Password must not empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validatePromoCodeInput = (discount: number, dates: string[]) => {
  const errors: any = {};

  if (discount < 0 || discount > 100) {
    errors.discount = "Discount must be a percentage";
  }

  dates.forEach((date: string) => {
    if (!date || date.trim() === "") errors.date = "Date must not be empty";

    if (!date.match(/^\d{4}-\d{2}-\d{2}$/))
      errors.date = "Date must be in the format YYYY-MM-DD";

    if (!moment(date, "YYYY-MM-DD").isValid())
      errors.date = "Date must be a valid date";

    if (moment(date).isBefore(moment()))
      errors.date = "Date must be in the future";
  });

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateDateInput = (
  { startDate, endDate }: { startDate: string; endDate: string },
  future = true
) => {
  const errors: any = {};
  const checkValidDate = (date: string, propName: string) => {
    if (!date || date.trim() === "")
      errors[propName] = "Date must not be empty";

    if (!date.match(/^\d{4}-\d{2}-\d{2}$/))
      errors[propName] = "Date must be in the format YYYY-MM-DD";

    if (!moment(date, "YYYY-MM-DD").isValid())
      errors[propName] = "Date must be a valid date";

    if (future && moment(date, "YYYY-MM-DD").isBefore(moment()))
      errors[propName] = "Date must be in the future";
  };
  checkValidDate(startDate, "startDate");
  checkValidDate(endDate, "endDate");

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateIso2Input = (iso2: string) => {
  const errors: any = {};
  if (!iso2) errors.iso2 = "ISO2 must not be empty";
  if (!iso2.match(/^[A-Z]{2}$/)) errors.iso2 = "ISO2 must be 2 letters";

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateIso3Input = (iso3: string) => {
  const errors: any = {};
  if (!iso3) errors.iso3 = "ISO3 must not be empty";
  if (!iso3.match(/^[A-Z]{3}$/)) errors.iso3 = "ISO3 must be 3 letters";

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
