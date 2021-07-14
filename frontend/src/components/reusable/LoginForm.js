/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * JarUserLogin.js
 * This
 * Inherited Props:
 *      o
 *
 */

import { useState, useEffect } from "react";
import { useFormik, Formik, Form } from "formik";
import { Button } from "@material-ui/core";
import * as Yup from "yup";
import MyInputField from "./MyInputField";
import fStyle from "./reusableStyles/Form.module.css";

const validationSchema = Yup.object({
  userid: Yup.string()
    .min(3, "Email not long enough")
    .email("Invalid Email Address")
    .required("Required"),
  password: Yup.string().min(6, "Too Weak. 6 or longer").required("Required"),
});

function LoginForm(props) {
  const { handleSubmit, testVal } = props;

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        // setTimeout(() => {
        //   alert(JSON.stringify(values, null, 2));
        //   setSubmitting(false);
        // }, 400);
        console.log("values: ", values);
        handleSubmit(values);
      }}
    >
      <Form className={fStyle.formContainer}>
        <MyInputField placeholder="Email Address" name="userid" type="email" />
        <MyInputField placeholder="Password" name="password" type="password" />

        <Button className={fStyle.button}>login</Button>
      </Form>
    </Formik>
  );
}

export default LoginForm;
